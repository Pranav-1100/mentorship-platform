"use client"
import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Star, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  Clock,
  Filter
} from 'lucide-react';
import Link from 'next/link';

const mockMentees = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Junior Developer",
    company: "Tech Startup",
    avatar: null,
    progress: 75,
    lastSession: "2024-03-20",
    nextSession: "2024-03-27",
    focusAreas: ["React", "System Design", "Career Growth"],
    joinedDate: "2024-01-15",
    totalSessions: 8,
    rating: 4.8
  },
  {
    id: 2,
    name: "Emily Chen",
    role: "Product Associate",
    company: "E-commerce Corp",
    avatar: null,
    progress: 60,
    lastSession: "2024-03-18",
    nextSession: "2024-03-25",
    focusAreas: ["Product Strategy", "User Research", "Leadership"],
    joinedDate: "2024-02-01",
    totalSessions: 6,
    rating: 4.9
  }
];

export default function MentorMenteesPage() {
  const [mentees, setMentees] = useState(mockMentees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  const filteredMentees = mentees.filter(mentee => 
    mentee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentee.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Mentees</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your mentees' progress
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
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Mentees
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {mentees.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Sessions This Week
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      4
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Hours
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      24
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Average Rating
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      4.85
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search mentees..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-4">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setFilter('all')}
              >
                All Mentees
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'completed'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Mentees List */}
        <div className="space-y-6">
          {filteredMentees.map((mentee) => (
            <div
              key={mentee.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    {mentee.avatar ? (
                      <img
                        src={mentee.avatar}
                        alt={mentee.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {mentee.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {mentee.role} at {mentee.company}
                    </p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {mentee.rating}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {mentee.totalSessions} sessions completed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Link
                    href={`/dashboard/chats/${mentee.id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/dashboard/schedule/${mentee.id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Calendar className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Progress and Focus Areas */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Progress</h4>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {mentee.progress}% Complete
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                      <div
                        style={{ width: `${mentee.progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Focus Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentee.focusAreas.map((area, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Session Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Last session: {new Date(mentee.lastSession).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Next session: {new Date(mentee.nextSession).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  View Progress Report
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  Schedule Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}