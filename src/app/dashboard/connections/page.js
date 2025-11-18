"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import {
  MessageSquare,
  Calendar,
  Clock,
  User,
  Star,
  AlertCircle,
  Loader2,
  UserX,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { getConnections, handleConnectionRequest } from '@/lib/api/connections';
import toast from 'react-hot-toast';

export default function ConnectionsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // 'all', 'mentor', 'mentee'

  // Fetch connections
  const { data: connections = [], isLoading, error } = useQuery({
    queryKey: ['connections'],
    queryFn: getConnections,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Handle connection request mutation
  const updateConnectionMutation = useMutation({
    mutationFn: ({ connectionId, status }) => handleConnectionRequest(connectionId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['connections']);
      toast.success('Connection updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update connection');
    },
  });

  const handleAcceptConnection = (connectionId) => {
    if (confirm('Accept this connection request?')) {
      updateConnectionMutation.mutate({ connectionId, status: 'accepted' });
    }
  };

  const handleRejectConnection = (connectionId) => {
    if (confirm('Reject this connection request?')) {
      updateConnectionMutation.mutate({ connectionId, status: 'rejected' });
    }
  };

  const filteredConnections = connections.filter(conn => {
    if (filter === 'all') return true;
    if (filter === 'mentor') return conn.type === 'mentor';
    if (filter === 'mentee') return conn.type === 'mentee';
    return true;
  });

  const stats = {
    total: connections.length,
    mentors: connections.filter(c => c.type === 'mentor').length,
    mentees: connections.filter(c => c.type === 'mentee').length,
    pending: connections.filter(c => c.status === 'pending').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading connections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-700 text-center">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Connections</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your mentorship connections
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {(user?.role === 'mentee' || user?.role === 'both') && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Star className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Mentors</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.mentors}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(user?.role === 'mentor' || user?.role === 'both') && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <User className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Mentees</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.mentees}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-orange-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.pending}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white text-gray-500 hover:text-gray-700 shadow'
            }`}
            onClick={() => setFilter('all')}
          >
            All Connections ({stats.total})
          </button>
          {(user?.role === 'mentee' || user?.role === 'both') && (
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === 'mentor'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-500 hover:text-gray-700 shadow'
              }`}
              onClick={() => setFilter('mentor')}
            >
              My Mentors ({stats.mentors})
            </button>
          )}
          {(user?.role === 'mentor' || user?.role === 'both') && (
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === 'mentee'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-500 hover:text-gray-700 shadow'
              }`}
              onClick={() => setFilter('mentee')}
            >
              My Mentees ({stats.mentees})
            </button>
          )}
        </div>

        {/* Connections Grid */}
        {filteredConnections.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No connections found</h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all'
                ? "You don't have any connections yet."
                : `No ${filter} connections found.`}
            </p>
            <Link
              href="/mentors"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Find Mentors
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map((connection) => {
              const otherUser = connection.mentor || connection.mentee || connection.user || {};
              const isPending = connection.status === 'pending';
              const canManage = connection.status === 'pending' &&
                               ((connection.type === 'mentee' && user?.role === 'mentor') ||
                                (connection.type === 'mentor' && user?.role === 'mentee'));

              return (
                <div key={connection.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* User Info */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                          {otherUser.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {otherUser.name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {otherUser.title || otherUser.position || 'No title'}
                        </p>
                        {otherUser.company && (
                          <p className="text-xs text-gray-400 truncate">{otherUser.company}</p>
                        )}
                        {otherUser.rating && (
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm font-medium text-gray-700">
                              {otherUser.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Connection Type Badge */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        connection.type === 'mentor'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {connection.type === 'mentor' ? 'Mentor' : 'Mentee'}
                      </span>
                      {isPending && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </div>

                    {/* Last Message */}
                    {connection.last_message && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {connection.last_message}
                        </p>
                        {connection.last_message_time && (
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(connection.last_message_time).toRelativeTimeString?.() || connection.last_message_time}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Next Session */}
                    {connection.next_session && (
                      <div className="mb-4 flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span>
                          Next session: {new Date(connection.next_session).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      {canManage ? (
                        <>
                          <button
                            onClick={() => handleAcceptConnection(connection.id)}
                            disabled={updateConnectionMutation.isPending}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                          >
                            {updateConnectionMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectConnection(connection.id)}
                            disabled={updateConnectionMutation.isPending}
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                          >
                            {updateConnectionMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <UserX className="h-4 w-4 mr-2" />
                            )}
                            Reject
                          </button>
                        </>
                      ) : !isPending ? (
                        <>
                          <Link
                            href={`/dashboard/chats/${connection.id}`}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </Link>
                          <Link
                            href={`/dashboard/schedule?connection=${connection.id}`}
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Session
                          </Link>
                        </>
                      ) : (
                        <div className="text-center text-sm text-gray-500 py-2">
                          Waiting for response...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
