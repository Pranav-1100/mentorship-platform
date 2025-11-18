"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Video, XCircle, AlertCircle, Loader2, Check } from 'lucide-react';
import { getSessions, cancelSession, rescheduleSession, completeSession } from '@/lib/api/sessions';
import toast from 'react-hot-toast';
import Link from 'next/link';

const STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function SchedulePage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('upcoming');

  // Fetch sessions
  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Cancel session mutation
  const cancelMutation = useMutation({
    mutationFn: cancelSession,
    onSuccess: () => {
      queryClient.invalidateQueries(['sessions']);
      toast.success('Session cancelled successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to cancel session');
    },
  });

  // Complete session mutation
  const completeMutation = useMutation({
    mutationFn: ({ id, notes }) => completeSession(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries(['sessions']);
      toast.success('Session marked as completed!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to complete session');
    },
  });

  const handleCancelSession = (id) => {
    if (confirm('Are you sure you want to cancel this session?')) {
      cancelMutation.mutate(id);
    }
  };

  const handleCompleteSession = (id) => {
    const notes = prompt('Enter session notes (optional):');
    if (notes !== null) {
      completeMutation.mutate({ id, notes: notes || '' });
    }
  };

  // Filter sessions
  const now = new Date();
  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.scheduled_at);

    if (filter === 'upcoming') {
      return sessionDate > now && session.status === 'scheduled';
    } else if (filter === 'past') {
      return sessionDate < now || session.status === 'completed';
    } else if (filter === 'cancelled') {
      return session.status === 'cancelled';
    }
    return true;
  });

  // Sort by date
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const dateA = new Date(a.scheduled_at);
    const dateB = new Date(b.scheduled_at);
    return filter === 'upcoming' ? dateA - dateB : dateB - dateA;
  });

  const stats = {
    total: sessions.length,
    upcoming: sessions.filter(s => new Date(s.scheduled_at) > now && s.status === 'scheduled').length,
    past: sessions.filter(s => new Date(s.scheduled_at) < now || s.status === 'completed').length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEndTime = (dateString, duration) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + (duration || 60));
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isSessionSoon = (dateString) => {
    const sessionDate = new Date(dateString);
    const diffInMinutes = (sessionDate - now) / 1000 / 60;
    return diffInMinutes > 0 && diffInMinutes <= 15;
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading sessions...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your mentorship sessions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sessions</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Upcoming</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.upcoming}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.past}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Cancelled</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.cancelled}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['upcoming', 'past', 'cancelled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`
                    py-4 px-6 text-sm font-medium border-b-2 capitalize
                    ${filter === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab}
                  <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">
                    {stats[tab]}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Sessions List */}
        {sortedSessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-500 mb-4">
              {filter === 'upcoming'
                ? "You don't have any upcoming sessions."
                : filter === 'past'
                ? "You don't have any past sessions."
                : "You don't have any cancelled sessions."}
            </p>
            {filter === 'upcoming' && (
              <Link
                href="/dashboard/connections"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                View Connections
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {sortedSessions.map((session) => {
                const isSoon = isSessionSoon(session.scheduled_at);
                const isPast = new Date(session.scheduled_at) < now;

                return (
                  <li key={session.id}>
                    <div className={`px-6 py-4 hover:bg-gray-50 ${isSoon ? 'bg-yellow-50' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Calendar Icon */}
                          <div className="flex-shrink-0">
                            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
                              <span className="text-xs font-medium">
                                {new Date(session.scheduled_at).toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                              <span className="text-2xl font-bold">
                                {new Date(session.scheduled_at).getDate()}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900">
                                  {session.agenda || session.title || 'Mentorship Session'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  with {session.mentor?.name || session.mentee?.name || 'Unknown'}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[session.status]}`}>
                                {session.status}
                              </span>
                            </div>

                            {/* Time and Duration */}
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock size={16} />
                                <span>
                                  {formatTime(session.scheduled_at)} - {getEndTime(session.scheduled_at, session.duration)}
                                </span>
                              </div>
                              <span>•</span>
                              <span>{session.duration || 60} minutes</span>
                            </div>

                            {/* Date */}
                            <div className="mt-1 text-sm text-gray-500">
                              {formatDate(session.scheduled_at)}
                            </div>

                            {/* Notes (if completed) */}
                            {session.notes && (
                              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm text-gray-700">
                                  <strong>Notes:</strong> {session.notes}
                                </p>
                              </div>
                            )}

                            {/* Warning for upcoming session */}
                            {isSoon && (
                              <div className="mt-2 flex items-center space-x-2 text-sm text-yellow-700 bg-yellow-100 px-3 py-2 rounded-md">
                                <AlertCircle size={16} />
                                <span>Session starting soon!</span>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="mt-4 flex items-center space-x-3">
                              {session.status === 'scheduled' && !isPast && (
                                <>
                                  {session.meeting_link && (
                                    <a
                                      href={session.meeting_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Video className="h-4 w-4 mr-2" />
                                      Join Meeting
                                    </a>
                                  )}
                                  <button
                                    onClick={() => handleCancelSession(session.id)}
                                    disabled={cancelMutation.isPending}
                                    className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                                  >
                                    {cancelMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                      <XCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Cancel Session
                                  </button>
                                </>
                              )}
                              {session.status === 'scheduled' && isPast && (
                                <button
                                  onClick={() => handleCompleteSession(session.id)}
                                  disabled={completeMutation.isPending}
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                >
                                  {completeMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                  )}
                                  Mark as Completed
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
