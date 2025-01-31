"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MessageSquare, 
  Calendar, 
  Clock, 
  User,
  Star,
  ChevronDown,
  X 
} from 'lucide-react';
import Link from 'next/link';

const mockConnections = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      position: 'Senior Software Engineer',
      company: 'Google',
      avatar: null,
      rating: 4.9
    },
    lastMessage: "Let's schedule our next session",
    lastMessageTime: '2 hours ago',
    nextSession: '2024-03-25T10:00:00',
    type: 'mentor' // or 'mentee'
  },
  // Add more mock connections
];

export default function ConnectionsPage() {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'mentors', 'mentees'

  useEffect(() => {
    // Replace with actual API call
    setConnections(mockConnections);
    setLoading(false);
  }, []);

  const filteredConnections = connections.filter(conn => {
    if (filter === 'all') return true;
    return conn.type === filter;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Connections</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your mentorship connections
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setFilter('all')}
          >
            All Connections
          </button>
          {(user?.role === 'mentee' || user?.role === 'both') && (
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'mentors'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setFilter('mentors')}
            >
              My Mentors
            </button>
          )}
          {(user?.role === 'mentor' || user?.role === 'both') && (
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'mentees'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setFilter('mentees')}
            >
              My Mentees
            </button>
          )}
        </div>

        {/* Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            [...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))
          ) : filteredConnections.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No connections found
              </h3>
              <p className="text-gray-500">
                {filter === 'all'
                  ? "You don't have any connections yet"
                  : `No ${filter} found`}
              </p>
              <div className="mt-6">
                <Link
                  href={filter === 'mentors' ? '/mentors' : '/mentees'}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  {filter === 'mentors' ? 'Find Mentors' : 'Find Mentees'}
                </Link>
              </div>
            </div>
          ) : (
            // Connection cards
            filteredConnections.map((connection) => (
              <div
                key={connection.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      {connection.user.avatar ? (
                        <img
                          src={connection.user.avatar}
                          alt={connection.user.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {connection.user.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {connection.user.position} at {connection.user.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700 ml-1">
                      {connection.user.rating}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>{connection.lastMessage}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    {connection.lastMessageTime}
                  </div>
                </div>

                {connection.nextSession && (
                  <div className="mt-4 bg-blue-50 rounded-md p-3">
                    <div className="flex items-center text-sm text-blue-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Next Session:</span>
                    </div>
                    <div className="mt-1 text-sm text-blue-600">
                      {new Date(connection.nextSession).toLocaleString()}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-end space-x-4">
                  <Link
                    href={`/dashboard/chats/${connection.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Send Message
                  </Link>
                  <Link
                    href={`/dashboard/schedule/${connection.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Schedule Session
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
