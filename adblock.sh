#!/bin/bash

if ! command -v curl &> /dev/null; then
    echo "curl command not found. Exit."
    exit 1
fi

if ! command -v crontab &> /dev/null; then
    echo "crontab command not found. Exit."
    exit 1
fi

FILE_URL="https://adbpage.com/adblock?v=3&format=js"
FILE_NAME=aclib.js

show_help() {
    echo "Usage: $0 [options] <path_to_directory> <frequency_in_minutes>"
    echo ""
    echo "Options:"
    echo "  --install      Install the cron job and download the library file."
    echo "  --uninstall    Remove the file and the cron job if they exist."
    echo "  --list         Lists all cron jobs that download the library file."
    echo "  --help         Display this help message and exit."
    echo ""
    echo "Arguments:"
    echo "  path_to_directory    Path to the directory where the library file will be downloaded."
    echo "  frequency_in_minutes Frequency of the cron job in minutes."
    echo ""
    echo "Examples:"
    echo "  --install"
    echo "  To install and setup a cron job: $0 --install /path/to/directory/ 60"
    echo "  This will download '${FILE_NAME}' file to '/path/to/directory/' and set up a cron job to re-download it every 60 minutes (recommended time)."
    echo "  If a cron job already exists for the selected directory, this will re-download the '${FILE_NAME}' file and overwrite the cron job with the selected time frequency."
    echo ""
    echo "  --list"
    echo "  To list currently installed cron jobs: $0 --list"
    echo "  This will list all the cron jobs associated with '${FILE_NAME}', including their path and time frequency."
    echo ""
    echo "  --uninstall"
    echo "  To uninstall a cron job and remove '${FILE_NAME}' file: $0 --uninstall /path/to/directory/"
    echo "  This will remove the existing cron job associated with '${FILE_NAME}' in '/path/to/directory/' and delete the downloaded '${FILE_NAME}' file."
}


remove_existing() {
    local CRON_PATTERN="$DIRECTORY_PATH$FILE_NAME"

    if crontab -l 2>/dev/null | grep -q "$CRON_PATTERN"; then
        crontab -l | grep -v "$CRON_PATTERN" | crontab -
        echo "Cron job removed."
    else
        echo "No cron job found for $DIRECTORY_PATH$FILE_NAME."
    fi

    # check if the file exists and delete it
    if [ -f "$DIRECTORY_PATH$FILE_NAME" ]; then
        rm -f "$DIRECTORY_PATH$FILE_NAME"
        echo "File removed."
    else
        echo "No file found at $DIRECTORY_PATH$FILE_NAME."
    fi
}

update_aclib() {
    local aclib_content=$(curl -s --location --request GET "$FILE_URL")

    if [[ $? -eq 0 && "$aclib_content" == *"aclib"* ]]; then
        local file_path="$DIRECTORY_PATH$FILE_NAME"

        # check if the file exists and is writable
        if [[ -w "$file_path" || (! -e "$file_path" && -w "$(dirname "$file_path")") ]]; then
            echo "$aclib_content" > "$file_path"
            return 0
        else
            echo "Error: No write permission for $file_path"
            return 1
        fi
    else
        return 1
    fi
}

setup_cron_job() {
    local CRON_PATTERN="$DIRECTORY_PATH$FILE_NAME"

    # check if the cron job exists
    if crontab -l 2>/dev/null | grep -q "$CRON_PATTERN"; then
        echo "An existing cron job for $DIRECTORY_PATH$FILE_NAME was found. It will be overwritten."
    else
        echo "Setting up a new cron job for $DIRECTORY_PATH$FILE_NAME."
    fi

    # remove any existing cron job that matches the pattern
    crontab -l | grep -v "$CRON_PATTERN" | crontab -

    local CRON_COMMAND="/bin/bash -c 'aclib_content=\"\$(curl -s --location --request GET \"$FILE_URL\")\"; \
        ret=\$?; \
        if [[ \$ret -eq 0 && \"\$aclib_content\" == *\"aclib\"* ]]; then \
            echo \"\$aclib_content\" > \"$DIRECTORY_PATH$FILE_NAME\"; \
        fi'"

    local CRON_JOB="*/$FREQUENCY_MINUTES * * * * $CRON_COMMAND > /dev/null 2>&1"

    (crontab -l; echo "$CRON_JOB") | crontab -

    echo "Cron job set to download $FILE_NAME to $DIRECTORY_PATH every $FREQUENCY_MINUTES minute(s)."
}

list_cron_jobs() {
    local CRON_PATTERN="$FILE_NAME"
    local count=1

    local cron_jobs=$(crontab -l 2>/dev/null | grep "$CRON_PATTERN")

    if [[ -z "$cron_jobs" ]]; then
        echo "No active '$FILE_NAME' jobs found"
        return
    fi

    echo "$cron_jobs" | while read -r line; do
        local path=$(echo "$line" | grep -oP ">\s*\"\K[^\"]*/(?=$FILE_NAME)")
        local frequency=$(echo "$line" | grep -oP '^\s*\*/\K\d+')

	echo "($count) Path: $path Frequency: Every $frequency minute(s)"
        ((count++))
    done
}

if [ "$#" -eq 0 ]; then
    echo "No arguments provided."
    show_help
    exit 1
fi

UNINSTALL_OPTION=0
INSTALL_OPTION=0

case "$1" in
    --help)
        show_help
        exit 0
        ;;
    --list)
        list_cron_jobs
        exit 0
        ;;
    --uninstall)
        if [ "$#" -ne 2 ]; then
            echo "Error: The uninstall option requires one argument."
            show_help
            exit 1
        fi
        UNINSTALL_OPTION=1
        DIRECTORY_PATH=$2
        shift
        ;;
    --install)
        if [ "$#" -ne 3 ]; then
            echo "Error: The install option requires two arguments."
            show_help
            exit 1
        fi
        INSTALL_OPTION=1
        DIRECTORY_PATH=$2
        FREQUENCY_MINUTES=$3
        shift
        ;;
    *)
        echo "Error: Invalid option."
        show_help
        exit 1
        ;;
esac


if [ "$UNINSTALL_OPTION" -eq 1 ]; then
    remove_existing
    echo "Uninstall completed."
    exit 0
fi

if [ ! -d "$DIRECTORY_PATH" ]; then
    echo "The directory $DIRECTORY_PATH does not exist."
    exit 1
fi

# install: download the file and set up the cron job
if [ "$INSTALL_OPTION" -eq 1 ]; then
    update_aclib
    DOWNLOAD_STATUS=$?
    if [ $DOWNLOAD_STATUS -ne 0 ]; then
        echo "Download failed during installation. Exiting."
        exit 1
    fi
    echo "File downloaded to $DIRECTORY_PATH$FILE_NAME"
    setup_cron_job
    echo "Install completed."
    exit 0
fi

echo "No action was taken. Use --help for usage information."
exit 1
