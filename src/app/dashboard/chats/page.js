"use client";

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { getConnections } from '@/lib/api/connections';
import { Search, Send, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChatsPage() {
  const [activeConnection, setActiveConnection] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const {
    messages,
    loading: chatLoading,
    error: chatError,
    sendMessage
  } = useChat(activeConnection?.id);

  useEffect(() => {
    const loadConnections = async () => {
      try {
        setLoading(true);
        const data = await getConnections();
        setConnections(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadConnections();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      sendMessage(message.trim());
      setMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const filteredConnections = connections.filter(conn =>
    conn.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-12 min-h-[calc(100vh-8rem)]">
            {/* Chat List */}
            <div className="col-span-4 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100vh-16rem)]">
                {filteredConnections.map((conn) => (
                  <div
                    key={conn.id}
                    onClick={() => setActiveConnection(conn)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      activeConnection?.id === conn.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {conn.user.avatar ? (
                          <img
                            src={conn.user.avatar}
                            alt={conn.user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {conn.user.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {conn.user.title || conn.user.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="col-span-8">
              {activeConnection ? (
                <div className="h-full flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {activeConnection.user.avatar ? (
                          <img
                            src={activeConnection.user.avatar}
                            alt={activeConnection.user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          {activeConnection.user.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {activeConnection.user.title || activeConnection.user.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender === 'me' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                              msg.sender === 'me'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <span className="text-xs opacity-75">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex space-x-4">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        disabled={!message.trim()}
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Select a conversation
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose someone from the list to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}