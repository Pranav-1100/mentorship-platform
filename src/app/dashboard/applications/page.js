"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getApplications } from '@/lib/api/connections';
import { updateApplicationStatus, cancelApplication } from '@/lib/api/applications';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  // Fetch applications
  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['applications', user?.role],
    queryFn: () => getApplications(user?.role),
    staleTime: 30 * 1000, // 30 seconds
  });

  // Update application status mutation (for mentors)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
      toast.success('Application status updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update application status');
    },
  });

  // Cancel application mutation (for mentees)
  const cancelMutation = useMutation({
    mutationFn: cancelApplication,
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
      toast.success('Application cancelled successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to cancel application');
    },
  });

  const handleAccept = (id) => {
    if (confirm('Accept this application?')) {
      updateStatusMutation.mutate({ id, status: 'accepted' });
    }
  };

  const handleReject = (id) => {
    if (confirm('Reject this application?')) {
      updateStatusMutation.mutate({ id, status: 'rejected' });
    }
  };

  const handleCancel = (id) => {
    if (confirm('Are you sure you want to cancel this application?')) {
      cancelMutation.mutate(id);
    }
  };

  const filteredApplications = applications.filter(app =>
    filter === 'all' ? true : app.status === filter
  );

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading applications...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Mentorship Applications</h1>
          <p className="mt-1 text-sm text-gray-500">
            {user?.role === 'mentor'
              ? 'Manage mentorship applications from mentees'
              : 'Track and manage your mentorship applications'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-blue-400" />
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

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
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

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Accepted</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.accepted}</dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Rejected</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.rejected}</dd>
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
              {['all', 'pending', 'accepted', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`
                    py-4 px-6 text-sm font-medium border-b-2 capitalize
                    ${filter === status
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {status}
                  {status !== 'all' && (
                    <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">
                      {stats[status]}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">
              {filter === 'all'
                ? "You don't have any applications yet."
                : `No ${filter} applications.`}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredApplications.map((application) => {
                const StatusIcon = STATUS_ICONS[application.status];
                const isMentor = user?.role === 'mentor' || user?.role === 'both';
                const displayUser = isMentor ? application.mentee : application.mentor;

                return (
                  <li key={application.id}>
                    <div className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                              {displayUser?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                  {displayUser?.name || 'Unknown User'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {displayUser?.title || displayUser?.position || 'No title'}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <StatusIcon className="h-5 w-5" />
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[application.status]}`}>
                                  {application.status}
                                </span>
                              </div>
                            </div>

                            {/* Message */}
                            {application.message && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600 italic">
                                  "{application.message}"
                                </p>
                              </div>
                            )}

                            {/* Meta info */}
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                              <span>Applied: {new Date(application.created_at || application.appliedDate).toLocaleDateString()}</span>
                              {application.updated_at && application.updated_at !== application.created_at && (
                                <span>Updated: {new Date(application.updated_at).toLocaleDateString()}</span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex items-center space-x-3">
                              {isMentor && application.status === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => handleAccept(application.id)}
                                    disabled={updateStatusMutation.isPending}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                  >
                                    {updateStatusMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleReject(application.id)}
                                    disabled={updateStatusMutation.isPending}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                  >
                                    {updateStatusMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                      <XCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Reject
                                  </button>
                                </>
                              ) : !isMentor && application.status === 'pending' ? (
                                <button
                                  onClick={() => handleCancel(application.id)}
                                  disabled={cancelMutation.isPending}
                                  className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                  {cancelMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : (
                                    <XCircle className="h-4 w-4 mr-2" />
                                  )}
                                  Cancel Application
                                </button>
                              ) : application.status === 'accepted' ? (
                                <span className="text-sm text-green-600 font-medium">
                                  ✓ Application accepted - Check your connections to schedule a session
                                </span>
                              ) : application.status === 'rejected' ? (
                                <span className="text-sm text-red-600 font-medium">
                                  Application was rejected
                                </span>
                              ) : null}
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
