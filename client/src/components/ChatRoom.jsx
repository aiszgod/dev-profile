import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Loader2, Users, CheckCircle } from 'lucide-react';
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
        // ✅ FIXED: Use getApiUrl helper
        const apiUrl = getApiUrl();
        const url = `${apiUrl}/verification/room/${roomId}`;
        
        console.log('📥 Fetching room data from:', url);
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setRoomData(data.data);
          console.log('✅ Room data loaded:', data.data);
        } else {
          throw new Error(data.error || 'Failed to load room');
        }
      } catch (err) {
        console.error('❌ Fetch room error:', err);
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
      console.log('🔌 Joining room:', roomId, 'as', user.name);
      
      socket.emit('join-room', { roomId, user });

      // Listen for messages
      socket.on('receive-message', (message) => {
        console.log('💬 Received message:', message);
        setMessages(prev => [...prev, message]);
      });

      // Listen for user joined
      socket.on('user-joined', (data) => {
        console.log('👤 User joined:', data);
        const systemMessage = {
          sender: { name: 'System', role: 'system' },
          message: `${data.user} (${data.role}) joined the chat`,
          timestamp: data.timestamp,
          isSystem: true
        };
        setMessages(prev => [...prev, systemMessage]);
      });

      // Listen for typing indicators
      socket.on('user-typing', (data) => {
        setTypingUser(data.user);
        setIsTyping(true);
      });

      socket.on('user-stop-typing', () => {
        setIsTyping(false);
        setTypingUser('');
      });

      // Load existing messages
      socket.on('load-messages', (existingMessages) => {
        console.log('📜 Loaded messages:', existingMessages.length);
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
    console.log('👤 User set:', userData);
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

    console.log('📤 Sending message:', messageData);
    socket.emit('send-message', messageData);
    setNewMessage('');

    // Stop typing
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Users className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Join Verification Chat
            </h2>
            <p className="text-gray-600">
              Candidate: {roomData?.candidateId?.name}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleJoinChat('recruiter', 'Recruiter', roomData?.participants?.recruiter?.email)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Join as Recruiter
            </button>

            <button
              onClick={() => handleJoinChat('candidate', roomData?.candidateId?.name, roomData?.candidateId?.email)}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Join as Candidate
            </button>

            <button
              onClick={() => handleJoinChat('employer', 'Employer', roomData?.participants?.employer?.email)}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Join as Employer
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Room ID:</strong> <span className="font-mono">{roomId}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Background Verification Chat
            </h1>
            <p className="text-sm text-gray-600">
              {roomData?.candidateId?.name} - {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-200px)] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender?.email === user.email ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.isSystem
                        ? 'bg-gray-100 text-gray-600 text-sm italic'
                        : msg.sender?.email === user.email
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {!msg.isSystem && (
                      <p className="text-xs opacity-75 mb-1">
                        {msg.sender?.name} ({msg.sender?.role})
                      </p>
                    )}
                    <p>{msg.message}</p>
                    <p className="text-xs opacity-75 mt-1">
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
            <div className="px-4 py-2 text-sm text-gray-500 italic">
              {typingUser} is typing...
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type your message..."
                disabled={!connected}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!connected || !newMessage.trim()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;