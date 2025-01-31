"use client";

import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video,
  User,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

const mockSessions = [
  {
    id: 1,
    mentor: {
      name: 'John Doe',
      position: 'Senior Software Engineer',
      avatar: null
    },
    date: '2024-03-22',
    time: '14:00',
    duration: 60,
    type: 'video',
    status: 'upcoming',
    topic: 'System Design Discussion'
  },
  {
    id: 2,
    mentor: {
      name: 'Sarah Smith',
      position: 'Product Manager',
      avatar: null
    },
    date: '2024-03-23',
    time: '10:00',
    duration: 45,
    type: 'video',
    status: 'confirmed',
    topic: 'Product Strategy Planning'
  }
];

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Schedule & Sessions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your upcoming mentorship sessions and schedule new ones
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Sessions</h2>
              </div>

              {mockSessions.map((session) => (
                <div key={session.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {session.mentor.avatar ? (
                          <img
                            src={session.mentor.avatar}
                            alt={session.mentor.name}
                            className="h-12 w-12 rounded-full"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {session.topic}
                        </h3>
                        <p className="text-sm text-gray-500">
                          with {session.mentor.name} • {session.mentor.position}
                        </p>
                      </div>
                    </div>
                    {session.status === 'upcoming' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-4 w-4 mr-1" />
                        Upcoming
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirmed
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      {new Date(session.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      {session.time} ({session.duration} minutes)
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end space-x-4">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}

              {mockSessions.length === 0 && (
                <div className="p-6 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No upcoming sessions
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Schedule a session with your mentor to get started
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Calendar</h2>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Schedule Session
              </button>
            </div>

            {/* Calendar Component would go here */}
            <div className="border rounded-lg p-4 text-center text-sm text-gray-500">
              Calendar component would be integrated here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
