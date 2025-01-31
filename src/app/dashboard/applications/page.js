"use client";

import { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const mockApplications = [
  {
    id: 1,
    mentor: {
      name: 'John Doe',
      position: 'Senior Software Engineer at Google',
      avatar: null
    },
    status: 'pending',
    appliedDate: '2024-03-15',
    message: 'I would love to learn more about system design and architecture.',
    lastUpdate: '2 days ago'
  },
  {
    id: 2,
    mentor: {
      name: 'Sarah Smith',
      position: 'Product Manager at Microsoft',
      avatar: null
    },
    status: 'accepted',
    appliedDate: '2024-03-10',
    message: 'Looking for guidance in product management and strategy.',
    lastUpdate: '1 day ago'
  },
  {
    id: 3,
    mentor: {
      name: 'Mike Johnson',
      position: 'UX Designer at Apple',
      avatar: null
    },
    status: 'rejected',
    appliedDate: '2024-03-05',
    message: 'Interested in learning about design systems and user research.',
    lastUpdate: '5 days ago'
  }
];

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const STATUS_ICONS = {
  pending: Clock,
  accepted: CheckCircle,
  rejected: XCircle
};

export default function ApplicationsPage() {
  const [filter, setFilter] = useState('all');

  const filteredApplications = mockApplications.filter(app => 
    filter === 'all' ? true : app.status === filter
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mentorship Applications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your mentorship applications
          </p>
        </div>

        {/* Stats */}
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
                    <dd className="flex items-center text-lg font-medium text-gray-900">
                      {mockApplications.filter(a => a.status === 'pending').length}
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
                      Accepted Applications
                    </dt>
                    <dd className="flex items-center text-lg font-medium text-gray-900">
                      {mockApplications.filter(a => a.status === 'accepted').length}
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
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Rejected Applications
                    </dt>
                    <dd className="flex items-center text-lg font-medium text-gray-900">
                      {mockApplications.filter(a => a.status === 'rejected').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center space-x-4 mb-6">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setFilter('all')}
              >
                All
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
                    filter === 'accepted'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setFilter('accepted')}
              >
                Accepted
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setFilter('rejected')}
              >
                Rejected
              </button>
            </div>

            {/* Applications List */}
            <div className="space-y-6">
              {filteredApplications.map((application) => {
                const StatusIcon = STATUS_ICONS[application.status];
                return (
                  <div
                    key={application.id}
                    className="bg-white border rounded-lg p-6 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          {application.mentor.avatar ? (
                            <img
                              src={application.mentor.avatar}
                              alt={application.mentor.name}
                              className="h-12 w-12 rounded-full"
                            />
                          ) : (
                            <span className="text-lg font-medium text-gray-600">
                              {application.mentor.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {application.mentor.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {application.mentor.position}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          STATUS_COLORS[application.status]
                        }`}
                      >
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600">{application.message}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="text-gray-500">
                        Applied on {new Date(application.appliedDate).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500">
                        Last updated {application.lastUpdate}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end space-x-4">
                      {application.status === 'accepted' && (
                        <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                          Schedule Meeting
                        </button>
                      )}
                      {application.status === 'pending' && (
                        <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                          Cancel Application
                        </button>
                      )}
                      <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredApplications.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filter === 'all'
                      ? "You haven't submitted any applications yet"
                      : `No ${filter} applications`}
                  </p>
                  {filter === 'all' && (
                    <div className="mt-6">
                      <a
                        href="/mentors"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Browse Mentors
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}