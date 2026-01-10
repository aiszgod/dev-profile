// ChatRoom.jsx - IMPROVED UI/UX
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Loader2, Users, MessageCircle, Wifi, WifiOff, UserCircle } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { getApiUrl } from '../utils/apiUrl';

const ChatRoom = () => {
  const { roomId } = useParams();
  const { socket, connected } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch room data
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const apiUrl = getApiUrl();
        const url = `${apiUrl}/verification/room/${roomId}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setRoomData(data.data);
        } else {
          throw new Error(data.error || 'Failed to load room');
        }
      } catch (err) {
        setError(err.message || 'Failed to load chat room');
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);

  // Join room when user is set
  useEffect(() => {
    if (socket && connected && user && roomId) {
      socket.emit('join-room', { roomId, user });

      socket.on('receive-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on('user-joined', (data) => {
        const systemMessage = {
          sender: { name: 'System', role: 'system' },
          message: `${data.user} (${data.role}) joined the chat`,
          timestamp: data.timestamp,
          isSystem: true
        };
        setMessages(prev => [...prev, systemMessage]);
      });

      socket.on('user-typing', (data) => {
        setTypingUser(data.user);
        setIsTyping(true);
      });

      socket.on('user-stop-typing', () => {
        setIsTyping(false);
        setTypingUser('');
      });

      socket.on('load-messages', (existingMessages) => {
        setMessages(existingMessages);
      });

      return () => {
        socket.off('receive-message');
        socket.off('user-joined');
        socket.off('user-typing');
        socket.off('user-stop-typing');
        socket.off('load-messages');
      };
    }
  }, [socket, connected, user, roomId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle user role selection
  const handleJoinChat = (role, name, email) => {
    const userData = {
      name: name || role.charAt(0).toUpperCase() + role.slice(1),
      email: email || `${role}@example.com`,
      role
    };
    setUser(userData);
  };

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket || !connected) return;

    const messageData = {
      roomId,
      message: newMessage.trim(),
      sender: user
    };

    socket.emit('send-message', messageData);
    setNewMessage('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('stop-typing', { roomId });
  };

  // Handle typing
  const handleTyping = () => {
    if (!socket || !connected) return;

    socket.emit('typing', { roomId, user });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { roomId });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-400 mx-auto" />
          <p className="text-slate-300 text-lg">Loading chat room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center backdrop-blur-xl">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-900/90 to-indigo-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl opacity-50 animate-pulse"></div>
              <Users className="relative w-16 h-16 text-indigo-400 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Join Verification Chat
            </h2>
            <p className="text-slate-400">
              Candidate: <span className="text-indigo-400 font-semibold">{roomData?.candidateId?.name}</span>
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleJoinChat('recruiter', 'Recruiter', roomData?.participants?.recruiter?.email)}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <UserCircle className="w-5 h-5" />
              Join as Recruiter
            </button>

            <button
              onClick={() => handleJoinChat('candidate', roomData?.candidateId?.name, roomData?.candidateId?.email)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <UserCircle className="w-5 h-5" />
              Join as Candidate
            </button>

            <button
              onClick={() => handleJoinChat('employer', 'Employer', roomData?.participants?.employer?.email)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <UserCircle className="w-5 h-5" />
              Join as Employer
            </button>
          </div>

          <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <p className="text-sm text-slate-400 text-center">
              <strong>Room ID:</strong> <span className="font-mono text-indigo-400">{roomId}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getRoleColor = (role) => {
    switch(role) {
      case 'recruiter': return 'from-indigo-600 to-blue-600';
      case 'candidate': return 'from-green-600 to-emerald-600';
      case 'employer': return 'from-purple-600 to-pink-600';
      default: return 'from-gray-600 to-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/90 via-slate-900/90 to-gray-900/90 border-b border-white/10 backdrop-blur-xl sticky top-0 z-10 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-gradient-to-r ${getRoleColor(user.role)} rounded-xl`}>
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  Background Verification Chat
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  {roomData?.candidateId?.name} • You're the <span className="text-indigo-400 font-semibold capitalize">{user.role}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-xs sm:text-sm text-green-400 font-medium hidden sm:inline">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-400" />
                  <span className="text-xs sm:text-sm text-red-400 font-medium hidden sm:inline">Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-gradient-to-br from-slate-900/50 to-gray-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl h-[calc(100vh-200px)] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No messages yet</p>
                <p className="text-slate-600 text-sm mt-2">Start the conversation below</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender?.email === user.email ? 'justify-end' : 'justify-start'} animate-slide-up`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                      msg.isSystem
                        ? 'bg-slate-800/50 text-slate-400 text-sm italic border border-slate-700/50'
                        : msg.sender?.email === user.email
                        ? `bg-gradient-to-r ${getRoleColor(user.role)} text-white`
                        : 'bg-slate-800 text-slate-100 border border-slate-700/50'
                    }`}
                  >
                    {!msg.isSystem && (
                      <p className="text-xs opacity-75 mb-1.5 flex items-center gap-1.5">
                        <UserCircle className="w-3 h-3" />
                        <span className="font-semibold">{msg.sender?.name}</span>
                        <span className="opacity-60">• {msg.sender?.role}</span>
                      </p>
                    )}
                    <p className="leading-relaxed">{msg.message}</p>
                    <p className="text-xs opacity-60 mt-2">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="px-6 py-3 bg-slate-800/30 border-t border-slate-700/30">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="italic">{typingUser} is typing...</span>
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-slate-700/50 p-4 bg-slate-900/30">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type your message..."
                disabled={!connected}
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 disabled:opacity-50 transition-all"
              />
              <button
                type="submit"
                disabled={!connected || !newMessage.trim()}
                className={`bg-gradient-to-r ${getRoleColor(user.role)} rounded-xl px-6 py-3 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium`}
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;