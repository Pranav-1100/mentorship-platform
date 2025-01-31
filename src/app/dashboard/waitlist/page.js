"use client"

import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  ArrowRight,
  Calendar,
  MessageSquare
} from 'lucide-react';

const mockWaitlistItems = [
  {
    id: 1,
    mentor: {
      name: "Dr. Sarah Johnson",
      position: "Senior Research Scientist",
      company: "BioTech Inc",
      avatar: null,
      rating: 4.9,
      expertise: ["Machine Learning", "Data Science", "Research Methods"]
    },
    status: "pending",
    appliedDate: "2024-03-15",
    estimatedWait: "2-3 weeks",
    position: 3,
    message: "Interested in guidance for my ML research project and career development in AI.",
    lastUpdate: "2 days ago"
  },
  {
    id: 2,
    mentor: {
      name: "James Wilson",
      position: "Engineering Manager",
      company: "Tech Giants Co",
      avatar: null,
      rating: 4.8,
      expertise: ["Engineering Leadership", "System Architecture", "Team Building"]
    },
    status: "approved",
    appliedDate: "2024-03-10",
    schedulingRequired: true,
    message: "Looking for mentorship in engineering leadership and team management.",
    lastUpdate: "1 day ago"
  }
];

const STATUS_STYLES = {
  pending: {
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100',
    icon: Clock
  },
  approved: {
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    icon: CheckCircle
  },
  rejected: {
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    icon: XCircle
  }
};

export default function WaitlistPage() {
  const [waitlistItems, setWaitlistItems] = useState(mockWaitlistItems);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

  const filteredItems = waitlistItems.filter(item => 
    filter === 'all' ? true : item.status === filter
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mentorship Waitlist</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your position on mentors' waitlists and pending applications
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Applications
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {waitlistItems.filter(item => item.status === 'pending').length}
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
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Approved Applications
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {waitlistItems.filter(item => item.status === 'approved').length}
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
                  <ArrowRight className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Ready to Schedule
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {waitlistItems.filter(item => item.status === 'approved' && item.schedulingRequired).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setFilter('all')}
            >
              All Applications
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setFilter('approved')}
            >
              Approved
            </button>
          </div>
        </div>

        {/* Waitlist Items */}
        <div className="space-y-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all'
                  ? "You haven't applied to any mentorship programs yet"
                  : `No ${filter} applications`}
              </p>
              <button className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Browse Mentors
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const StatusComponent = STATUS_STYLES[item.status].icon;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {item.mentor.avatar ? (
                          <img
                            src={item.mentor.avatar}
                            alt={item.mentor.name}
                            className="h-12 w-12 rounded-full"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.mentor.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.mentor.position} at {item.mentor.company}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        STATUS_STYLES[item.status].bgColor
                      } ${STATUS_STYLES[item.status].color}`}
                    >
                      <StatusComponent className="h-4 w-4 mr-1" />
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>

                  {/* Expertise Tags */}
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {item.mentor.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="mt-4 text-sm text-gray-600">
                    <p>{item.message}</p>
                  </div>

                  {/* Status Info */}
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>Applied: {new Date(item.appliedDate).toLocaleDateString()}</div>
                    <div>Last updated: {item.lastUpdate}</div>
                  </div>

                  {/* Waitlist Position or Action Required */}
                  {item.status === 'pending' && item.position && (
                    <div className="mt-4 bg-yellow-50 rounded-md p-3">
                      <div className="flex items-center text-sm text-yellow-800">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          Position #{item.position} in waitlist • Estimated wait: {item.estimatedWait}
                        </span>
                      </div>
                    </div>
                  )}

                  {item.status === 'approved' && item.schedulingRequired && (
                    <div className="mt-4 bg-green-50 rounded-md p-3">
                      <div className="flex items-center text-sm text-green-800">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Ready to schedule your first session!</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex justify-end space-x-4">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </button>
                    {item.status === 'approved' && item.schedulingRequired && (
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Session
                      </button>
                    )}
                    {item.status === 'pending' && (
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-gray-50">
                        Withdraw Application
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}