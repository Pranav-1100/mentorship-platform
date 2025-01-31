"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Calendar, 
  Clock, 
  User,
  Star,
  Video,
  Search
} from 'lucide-react';

const mockMentors = [
  {
    id: 1,
    name: "John Doe",
    position: "Senior Software Engineer at Google",
    avatar: null,
    rating: 4.9,
    lastMessage: "Let's schedule our next session",
    lastMessageTime: "2 hours ago",
    nextSession: "2024-03-25T10:00:00",
    expertise: ["System Design", "React", "Node.js"],
    totalSessions: 12,
    connectionDuration: "3 months"
  },
  // Add more mock mentors as needed
];

export default function MyMentorsPage() {
  const [mentors, setMentors] = useState(mockMentors);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Mentors</h1>
              <p className="mt-1 text-sm text-gray-500">
                Your active mentorship connections
              </p>
            </div>
            <Link
              href="/dashboard/find-mentors"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Sessions</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {mentors.reduce((total, mentor) => total + mentor.totalSessions, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Active Mentors</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{mentors.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {mentors.filter(mentor => mentor.nextSession).length}
            </p>
          </div>
        </div>

        {/* Mentor Cards */}
        <div className="space-y-6">
          {loading ? (
            // Loading skeletons
            [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredMentors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No mentors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "You haven't connected with any mentors yet"}
              </p>
              {!searchTerm && (
                <Link
                  href="/dashboard/find-mentors"
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Find Mentors
                </Link>
              )}
            </div>
          ) : (
            filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      {mentor.avatar ? (
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {mentor.name}
                      </h3>
                      <p className="text-sm text-gray-500">{mentor.position}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium text-gray-700">
                          {mentor.rating}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {mentor.connectionDuration} of mentorship
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expertise */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {mentor.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Last Message */}
                <div className="mt-4 bg-gray-50 rounded-md p-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>{mentor.lastMessage}</span>
                    <span className="ml-auto text-gray-400">{mentor.lastMessageTime}</span>
                  </div>
                </div>

                {/* Next Session */}
                {mentor.nextSession && (
                  <div className="mt-4 bg-blue-50 rounded-md p-4">
                    <div className="flex items-center text-sm text-blue-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Next Session:</span>
                      <span className="ml-2">
                        {new Date(mentor.nextSession).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Link
                      href={`/dashboard/chats/${mentor.id}`}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Link>
                    <Link
                      href={`/dashboard/schedule/${mentor.id}`}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule Session
                    </Link>
                  </div>
                  {mentor.nextSession && (
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      <Video className="h-4 w-4 mr-2" />
                      Join Session
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}