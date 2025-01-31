import { useState, useEffect, useCallback, useRef } from 'react';
import { getMessages, markMessagesAsRead } from '@/lib/api/chat';

export const useChat = (connectionId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  // Load chat history
  useEffect(() => {
    const loadMessages = async () => {
      if (!connectionId) return;
      
      try {
        setLoading(true);
        const data = await getMessages(connectionId);
        setMessages(data);
        await markMessagesAsRead(connectionId);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [connectionId]);

  // WebSocket connection
  useEffect(() => {
    if (!connectionId) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Create WebSocket connection
    const ws = new WebSocket(`ws://localhost:3000?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.connectionId === connectionId) {
        setMessages(prev => [...prev, data]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setError('Connection error occurred');
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    // Cleanup
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [connectionId]);

  // Send message function
  const sendMessage = useCallback((content) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError('Connection not available');
      return;
    }

    const messageData = {
      connectionId,
      content,
      timestamp: new Date().toISOString()
    };

    wsRef.current.send(JSON.stringify(messageData));

    // Optimistically add message to state
    setMessages(prev => [...prev, {
      ...messageData,
      id: Date.now(),
      status: 'sending',
      sender: 'me'
    }]);
  }, [connectionId]);

  return {
    messages,
    loading,
    error,
    sendMessage
  };
};