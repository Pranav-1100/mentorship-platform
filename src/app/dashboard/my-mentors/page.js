"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  MessageSquare,
  Calendar,
  Clock,
  User,
  Star,
  Video,
  Search,
  AlertCircle,
  Loader2,
  TrendingUp,
  Award
} from 'lucide-react';
import { getConnections } from '@/lib/api/connections';
import { getSessions } from '@/lib/api/sessions';

export default function MyMentorsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch connections and filter for mentors only
  const { data: allConnections = [], isLoading: connectionsLoading, error: connectionsError } = useQuery({
    queryKey: ['connections'],
    queryFn: getConnections,
    staleTime: 30 * 1000,
  });

  // Fetch sessions for stats
  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
    staleTime: 30 * 1000,
  });

  // Filter for mentor connections only
  const mentors = allConnections.filter(conn =>
    conn.type === 'mentor' && conn.status === 'accepted'
  );

  // Filter mentors based on search term
  const filteredMentors = mentors.filter(mentor => {
    const mentorData = mentor.mentor || {};
    const searchLower = searchTerm.toLowerCase();

    return (
      mentorData.name?.toLowerCase().includes(searchLower) ||
      mentorData.title?.toLowerCase().includes(searchLower) ||
      mentorData.position?.toLowerCase().includes(searchLower) ||
      mentorData.company?.toLowerCase().includes(searchLower) ||
      mentorData.skills?.some(skill => skill.toLowerCase().includes(searchLower))
    );
  });

  // Calculate stats
  const totalSessions = sessions.filter(s => s.status === 'completed').length;
  const upcomingSessions = sessions.filter(s => {
    const sessionDate = new Date(s.scheduled_at);
    return sessionDate > new Date() && s.status === 'scheduled';
  }).length;
  const totalHours = sessions
    .filter(s => s.status === 'completed')
    .reduce((acc, s) => acc + (s.duration || 60), 0) / 60;

  const avgRating = mentors.reduce((acc, m) => {
    const mentor = m.mentor || {};
    return acc + (mentor.rating || 0);
  }, 0) / (mentors.length || 1);

  if (connectionsLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  if (connectionsError) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-700 text-center">{connectionsError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Mentors</h1>
              <p className="mt-1 text-sm text-gray-500">
                Your active mentorship connections ({mentors.length})
              </p>
            </div>
            <Link
              href="/mentors"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium inline-flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Find New Mentors
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search by name, position, or skills..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Mentors</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{mentors.length}</p>
              </div>
              <User className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Sessions</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{totalSessions}</p>
              </div>
              <Video className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{totalHours.toFixed(1)}</p>
              </div>
              <Clock className="h-12 w-12 text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Avg. Rating</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
              </div>
              <Star className="h-12 w-12 text-yellow-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        {filteredMentors.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No mentors match your search' : 'No mentors found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? 'Try adjusting your search terms'
                : "You haven't connected with any mentors yet."}
            </p>
            {!searchTerm && (
              <Link
                href="/mentors"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Find Mentors
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((connection) => {
              const mentor = connection.mentor || {};
              const nextSession = sessions.find(s =>
                s.connection_id === connection.id &&
                new Date(s.scheduled_at) > new Date() &&
                s.status === 'scheduled'
              );

              const completedSessions = sessions.filter(s =>
                s.connection_id === connection.id &&
                s.status === 'completed'
              ).length;

              return (
                <div key={connection.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Mentor Info */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                          {mentor.name?.charAt(0).toUpperCase() || 'M'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {mentor.name || 'Unknown Mentor'}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {mentor.title || mentor.position || 'No title'}
                        </p>
                        {mentor.company && (
                          <p className="text-xs text-gray-400 truncate">{mentor.company}</p>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    {mentor.rating && (
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(mentor.rating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {mentor.rating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {/* Expertise */}
                    {mentor.skills && mentor.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {mentor.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {mentor.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{mentor.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-t border-b border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Sessions</p>
                        <p className="text-lg font-semibold text-gray-900">{completedSessions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Since</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(connection.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Next Session */}
                    {nextSession && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-md">
                        <div className="flex items-center text-sm text-blue-700">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="font-medium">Next session:</span>
                        </div>
                        <p className="text-sm text-blue-600 mt-1">
                          {new Date(nextSession.scheduled_at).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
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
                      <Link
                        href={`/mentors/${mentor.id}`}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upcoming Sessions Section */}
        {upcomingSessions > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
              <Link
                href="/dashboard/schedule"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <p className="text-gray-600">
              You have {upcomingSessions} upcoming session{upcomingSessions !== 1 ? 's' : ''} scheduled with your mentors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
