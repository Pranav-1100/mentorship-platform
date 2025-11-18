"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { getApplications } from '@/lib/api/connections';
import { cancelApplication } from '@/lib/api/applications';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function WaitlistPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch applications (waitlist items are pending applications)
  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['applications', user?.role],
    queryFn: () => getApplications(user?.role),
    staleTime: 30 * 1000,
  });

  // Cancel application mutation
  const cancelMutation = useMutation({
    mutationFn: cancelApplication,
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
      toast.success('Application withdrawn successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to withdraw application');
    },
  });

  const handleWithdraw = (id) => {
    if (confirm('Are you sure you want to withdraw this application?')) {
      cancelMutation.mutate(id);
    }
  };

  // Filter for pending applications only (waitlist)
  const waitlistItems = applications.filter(app => app.status === 'pending');
  const approvedItems = applications.filter(app => app.status === 'accepted');
  const rejectedItems = applications.filter(app => app.status === 'rejected');

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading waitlist...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Application Waitlist</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your pending mentorship applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{waitlistItems.length}</p>
                <p className="mt-1 text-xs text-gray-500">Awaiting response</p>
              </div>
              <Clock className="h-12 w-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Approved</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{approvedItems.length}</p>
                <p className="mt-1 text-xs text-gray-500">Ready to connect</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{applications.length}</p>
                <p className="mt-1 text-xs text-gray-500">All time</p>
              </div>
              <User className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Waitlist Items */}
        {waitlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending applications</h3>
            <p className="text-gray-500 mb-4">
              You don't have any applications waiting for a response.
            </p>
            <Link
              href="/mentors"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Find Mentors
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Applications ({waitlistItems.length})
              </h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {waitlistItems.map((item) => {
                const mentor = item.mentor || {};
                const appliedDate = new Date(item.created_at || item.appliedDate);
                const daysSinceApplied = Math.floor((new Date() - appliedDate) / (1000 * 60 * 60 * 24));

                return (
                  <li key={item.id}>
                    <div className="px-6 py-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                              {mentor.name?.charAt(0).toUpperCase() || 'M'}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {mentor.name || 'Unknown Mentor'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {mentor.title || mentor.position || 'No title'}
                                </p>
                                {mentor.company && (
                                  <p className="text-xs text-gray-400">{mentor.company}</p>
                                )}
                              </div>

                              {/* Status Badge */}
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                <Clock className="h-4 w-4 mr-1" />
                                Pending
                              </span>
                            </div>

                            {/* Expertise Tags */}
                            {mentor.skills && mentor.skills.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {mentor.skills.slice(0, 4).map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {mentor.skills.length > 4 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{mentor.skills.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Application Message */}
                            {item.message && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm text-gray-700 italic">
                                  "{item.message}"
                                </p>
                              </div>
                            )}

                            {/* Timeline Info */}
                            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  Applied {daysSinceApplied === 0 ? 'today' : `${daysSinceApplied} day${daysSinceApplied > 1 ? 's' : ''} ago`}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <AlertCircle className="h-4 w-4" />
                                <span>Awaiting mentor's response</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex items-center space-x-3">
                              <Link
                                href={`/mentors/${mentor.id}`}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <User className="h-4 w-4 mr-2" />
                                View Profile
                              </Link>
                              <button
                                onClick={() => handleWithdraw(item.id)}
                                disabled={cancelMutation.isPending}
                                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                              >
                                {cancelMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <XCircle className="h-4 w-4 mr-2" />
                                )}
                                Withdraw
                              </button>
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

        {/* Approved Applications Section */}
        {approvedItems.length > 0 && (
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-6 py-4 bg-green-50 border-b border-green-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-green-900">
                    Approved Applications ({approvedItems.length})
                  </h2>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <p className="mt-1 text-sm text-green-700">
                  These mentors have accepted your application. You can now connect with them!
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {approvedItems.slice(0, 3).map((item) => {
                  const mentor = item.mentor || {};
                  return (
                    <li key={item.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
                            {mentor.name?.charAt(0).toUpperCase() || 'M'}
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-gray-900">
                              {mentor.name || 'Unknown Mentor'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {mentor.title || mentor.position || 'No title'}
                            </p>
                          </div>
                        </div>
                        <Link
                          href="/dashboard/connections"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Go to Connections
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {approvedItems.length > 3 && (
                <div className="px-6 py-4 bg-gray-50 text-center">
                  <Link
                    href="/dashboard/connections"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all approved applications →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
