'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useWatchTogether } from '../hooks/useWatchTogether';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ClipboardDocumentIcon,
  UserIcon,
  CrownIcon
} from '@heroicons/react/24/outline';

interface WatchTogetherProps {
  contentId: string;
  contentType: 'movie' | 'tv' | 'anime';
  contentTitle: string;
  onVideoCallbacks?: {
    onPlay?: (time: number) => void;
    onPause?: (time: number) => void;
    onSeek?: (time: number) => void;
  };
}

export default function WatchTogether({ 
  contentId, 
  contentType, 
  contentTitle,
  onVideoCallbacks 
}: WatchTogetherProps) {
  const [userName, setUserName] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showRoomSetup, setShowRoomSetup] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const {
    isConnected,
    isInRoom,
    room,
    users,
    messages,
    isHost,
    syncState,
    createRoom,
    joinRoom,
    leaveRoom,
    createRandomRoom,
    sendMessage,
    playVideo,
    pauseVideo,
    seekVideo,
    registerVideoCallbacks
  } = useWatchTogether({ contentId, contentType, userName });

  // Register video callbacks
  useEffect(() => {
    if (onVideoCallbacks) {
      registerVideoCallbacks(onVideoCallbacks);
    }
  }, [onVideoCallbacks, registerVideoCallbacks]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle room creation
  const handleCreateRoom = () => {
    if (!userName.trim()) return;
    const newRoomId = createRoom();
    joinRoom(newRoomId);
    setShowRoomSetup(false);
  };

  // Handle room joining
  const handleJoinRoom = () => {
    if (!userName.trim() || !roomIdInput.trim()) return;
    joinRoom(roomIdInput.toUpperCase());
    setShowRoomSetup(false);
  };

  // Handle message sending
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  // Copy room ID to clipboard
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(room?.id || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room ID:', err);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-800/90 rounded-lg p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-gray-300 text-sm">Connecting to watch together service...</p>
      </div>
    );
  }

  if (!isInRoom) {
    return (
      <div className="bg-gray-800/90 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <UserGroupIcon className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Watch Together</h3>
        </div>
        
        {!showRoomSetup ? (
          <div className="space-y-3">
            <p className="text-gray-300 text-sm mb-4">
              Watch {contentTitle} with friends and family in real-time!
            </p>
            <button
              onClick={() => setShowRoomSetup(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Start Watch Party
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                maxLength={20}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <button
                 onClick={() => {
                   const roomId = createRoom();
                   setShowRoomSetup(false);
                 }}
                 disabled={!userName.trim()}
                 className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                 </svg>
                 Create New Room
               </button>
              
              <button
                onClick={() => setShowJoinRoom(true)}
                disabled={!userName.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Join with Code
              </button>

              <button
                 onClick={() => {
                   createRandomRoom();
                   setShowRoomSetup(false);
                 }}
                 disabled={!userName.trim()}
                 className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
                 Quick Random
               </button>
            </div>
            
            <button
              onClick={() => setShowRoomSetup(false)}
              className="w-full text-gray-400 hover:text-white py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Join Room Modal */}
        {showJoinRoom && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-white mb-4">Join Room</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room Code
                  </label>
                  <input
                    type="text"
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                    placeholder="Enter room code"
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-center font-mono"
                    maxLength={8}
                  />
                  <p className="text-xs text-gray-400 mt-1">Ask your friend for the room code</p>
                </div>
                <div className="flex gap-3">
                  <button
                     onClick={() => {
                       if (roomIdInput.trim()) {
                         joinRoom(roomIdInput.toUpperCase());
                         setShowJoinRoom(false);
                         setShowRoomSetup(false);
                         setRoomIdInput('');
                       }
                     }}
                     disabled={!roomIdInput.trim()}
                     className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
                   >
                     Join Room
                   </button>
                  <button
                    onClick={() => {
                      setShowJoinRoom(false);
                      setRoomIdInput('');
                    }}
                    className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800/90 rounded-lg overflow-hidden">
      {/* Room Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold flex items-center gap-2">
              Room 
              <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm">{room?.id}</span>
              {isHost && (
                <span className="bg-yellow-600 text-xs px-2 py-1 rounded-full">HOST</span>
              )}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyRoomId}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-700"
              title="Copy Room ID"
            >
              <ClipboardDocumentIcon className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">{copied ? 'Copied!' : 'Share Code'}</span>
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className="text-gray-400 hover:text-white transition-colors relative px-2 py-1 rounded hover:bg-gray-700"
              title="Toggle Chat"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              {messages.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                  {messages.length > 9 ? '9+' : messages.length}
                </span>
              )}
            </button>
            <button
              onClick={leaveRoom}
              className="text-gray-400 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-gray-700"
              title="Leave Room"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {copied && (
          <div className="text-green-400 text-xs mb-2">Room ID copied to clipboard!</div>
        )}
        
        {/* Users */}
        <div className="flex items-center gap-2 text-sm">
          <UserIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{users.length} viewer{users.length !== 1 ? 's' : ''}</span>
          <div className="flex gap-1 ml-2">
            {users.slice(0, 3).map((user) => (
              <span
                key={user.id}
                className={`px-2 py-1 rounded text-xs ${
                  user.isHost ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-gray-200'
                }`}
                title={user.isHost ? `${user.name} (Host)` : user.name}
              >
                {user.name}
              </span>
            ))}
            {users.length > 3 && (
              <span className="px-2 py-1 rounded text-xs bg-gray-600 text-gray-200">
                +{users.length - 3}
              </span>
            )}
          </div>
        </div>
        
        {isHost && (
          <div className="mt-2 text-xs text-yellow-400">
            💡 You control the video for everyone in the room
          </div>
        )}
      </div>

      {/* Chat */}
      {showChat && (
        <div className="h-64 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-blue-400">{message.userName}</span>
                    <span className="text-gray-500 text-xs">{formatTime(message.timestamp)}</span>
                  </div>
                  <div className="text-gray-200 ml-2">{message.message}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                ref={chatInputRef}
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}