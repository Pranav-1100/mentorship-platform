"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  Calendar,
  Star,
  Loader
} from 'lucide-react';
import { getProfile } from '@/lib/api/profile';
import { getNotifications } from '@/lib/api/notifications';
import { getConnections } from '@/lib/api/connections';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const QuickActionCard = ({ href, icon: Icon, title, description }) => (
  <Link 
    href={href}
    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
  >
    <div className="flex-shrink-0">
      <Icon className="h-6 w-6 text-gray-400" />
    </div>
    <div className="flex-1 min-w-0">
      <span className="absolute inset-0" aria-hidden="true" />
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </Link>
);

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-gray-400" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-center text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardHome() {
  const { user } = useAuth();
  
  // Fetch profile data
  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Fetch notifications
  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Fetch connections
  const connectionsQuery = useQuery({
    queryKey: ['connections'],
    queryFn: getConnections,
    onError: (error) => {
      toast.error(error.message);
    }
  });

  if (profileQuery.isLoading || notificationsQuery.isLoading || connectionsQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Filter notifications and transform data
  const pendingMessages = (notificationsQuery.data?.filter(
    notif => notif.type === 'message_received' && !notif.is_read
  ) || []).map(message => ({
    id: message.id,
    sender: {
      name: message.sender_name,
      avatar: message.sender_avatar,
    },
    content: message.content,
    createdAt: message.created_at
  }));

  // Filter connections for pending requests
  const connectionRequests = (connectionsQuery.data?.filter(
    conn => conn.status === 'pending'
  ) || []).map(request => ({
    id: request.id,
    requestor: {
      name: request.mentor_name || request.mentee_name,
      title: request.mentor_position || request.mentee_position,
      avatar: request.mentor_avatar || request.mentee_avatar
    }
  }));

  const upcomingSessions = connectionsQuery.data?.filter(
    conn => conn.nextSession && new Date(conn.nextSession) > new Date()
  ) || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profileQuery.data?.full_name || 'User'}!
        </h1>
        <p className="mt-1 text-gray-500">
          Here's what's happening with your mentorship journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          icon={Users} 
          title="Total Connections"
          value={connectionsQuery.data?.length || 0}
        />
        <StatCard 
          icon={MessageSquare} 
          title="Pending Messages"
          value={pendingMessages.length}
        />
        <StatCard 
          icon={Star} 
          title="Average Rating"
          value={profileQuery.data?.averageRating?.toFixed(1) || "N/A"}
        />
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {/* Pending Messages Section */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Pending Messages</h3>
              <Link href="/dashboard/chats" className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-4">
              {pendingMessages.length === 0 ? (
                <p className="text-sm text-gray-500">No pending messages</p>
              ) : (
                pendingMessages.slice(0, 3).map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200">
                        {message.sender.avatar && (
                          <img 
                            src={message.sender.avatar}
                            alt={message.sender.name}
                            className="h-10 w-10 rounded-full"
                          />
                        )}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{message.sender.name}</p>
                      <p className="text-sm text-gray-500">{message.content}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Connection Requests Section */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Connection Requests</h3>
              <Link href="/dashboard/connections" className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-4">
              {connectionRequests.length === 0 ? (
                <p className="text-sm text-gray-500">No pending connection requests</p>
              ) : (
                connectionRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200">
                          {request.requestor.avatar && (
                            <img 
                              src={request.requestor.avatar}
                              alt={request.requestor.name}
                              className="h-10 w-10 rounded-full"
                            />
                          )}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{request.requestor.name}</p>
                        <p className="text-sm text-gray-500">{request.requestor.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleConnectionRequest(request.id, 'accepted')}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleConnectionRequest(request.id, 'rejected')}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Sessions Section */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Upcoming Sessions</h3>
              <Link href="/dashboard/schedule" className="text-sm text-blue-600 hover:text-blue-700">
                View calendar
              </Link>
            </div>
            <div className="mt-4 space-y-4">
              {upcomingSessions.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming sessions</p>
              ) : (
                upcomingSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex-shrink-0 h-12 w-12 flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200">
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(session.nextSession).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {new Date(session.nextSession).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Session with {session.mentor.name}
                      </p>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {new Date(session.nextSession).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <button className="flex-shrink-0 bg-white px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Join Call
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard
            href="/mentors"
            icon={Users}
            title="Find Mentors"
            description="Browse available mentors"
          />
          <QuickActionCard
            href="/dashboard/chats"
            icon={MessageSquare}
            title="Messages"
            description="Chat with your connections"
          />
          <QuickActionCard
            href="/dashboard/schedule"
            icon={Calendar}
            title="Schedule Session"
            description="Book a new session"
          />
          <QuickActionCard
            href="/dashboard/progress"
            icon={TrendingUp}
            title="Track Progress"
            description="View your journey"
          />
        </div>
      </div>
    </div>
  );
}