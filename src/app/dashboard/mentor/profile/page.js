"use client"

import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Globe,
  Star,
  Clock,
  Edit,
  Save,
  Plus,
  X,
  Calendar,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export default function MentorProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Miller',
    title: 'Senior Software Architect',
    company: 'Tech Giants Inc.',
    location: 'Seattle, WA',
    bio: 'Experienced software architect with 15+ years in the industry. Passionate about helping others grow in their tech careers. Specialized in distributed systems and cloud architecture.',
    experience: '15 years',
    education: [
      {
        degree: 'Ph.D. Computer Science',
        school: 'Stanford University',
        year: '2010'
      },
      {
        degree: 'M.S. Software Engineering',
        school: 'MIT',
        year: '2005'
      }
    ],
    expertise: [
      'System Design',
      'Cloud Architecture',
      'Distributed Systems',
      'Leadership',
      'Tech Strategy'
    ],
    mentorshipAreas: [
      'Career Development',
      'Technical Leadership',
      'System Architecture',
      'Cloud Migration'
    ],
    availability: {
      schedule: [
        { day: 'Monday', slots: ['9:00 AM - 11:00 AM', '2:00 PM - 4:00 PM'] },
        { day: 'Wednesday', slots: ['10:00 AM - 12:00 PM'] },
        { day: 'Friday', slots: ['3:00 PM - 5:00 PM'] }
      ],
      timezone: 'PST',
      sessionsPerWeek: 4
    },
    rates: {
      hourlyRate: 150,
      packageRates: [
        { sessions: 4, price: 500, duration: '1 month' },
        { sessions: 12, price: 1400, duration: '3 months' }
      ]
    },
    stats: {
      totalSessions: 245,
      averageRating: 4.9,
      totalMentees: 42,
      successfulPlacements: 18
    },
    languages: ['English', 'Spanish'],
    certifications: [
      'AWS Solutions Architect',
      'Google Cloud Professional Architect',
      'Azure Solutions Architect'
    ],
    website: 'https://sarahmiller.dev',
    linkedin: 'linkedin.com/in/sarahmiller',
    github: 'github.com/sarahmiller'
  });

  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    setProfile(tempProfile);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mentor Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your mentor profile and availability
            </p>
          </div>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Profile Content */}
          <div className="col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  {editMode ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={tempProfile.name}
                        onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={tempProfile.title}
                        onChange={(e) => setTempProfile({...tempProfile, title: e.target.value})}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                      <p className="text-lg text-gray-600">{profile.title}</p>
                    </>
                  )}
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {editMode ? (
                        <input
                          type="text"
                          value={tempProfile.company}
                          onChange={(e) => setTempProfile({...tempProfile, company: e.target.value})}
                          className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        profile.company
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {editMode ? (
                        <input
                          type="text"
                          value={tempProfile.location}
                          onChange={(e) => setTempProfile({...tempProfile, location: e.target.value})}
                          className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        profile.location
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">About</h3>
                {editMode ? (
                  <textarea
                    value={tempProfile.bio}
                    onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})}
                    rows={4}
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="mt-2 text-sm text-gray-600">{profile.bio}</p>
                )}
              </div>
            </div>

            {/* Mentorship Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Total Sessions</h3>
                    <p className="text-2xl font-semibold text-gray-900">{profile.stats.totalSessions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Star className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Avg. Rating</h3>
                    <p className="text-2xl font-semibold text-gray-900">{profile.stats.averageRating}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Total Mentees</h3>
                    <p className="text-2xl font-semibold text-gray-900">{profile.stats.totalMentees}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Placements</h3>
                    <p className="text-2xl font-semibold text-gray-900">{profile.stats.successfulPlacements}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expertise & Areas of Mentorship */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                    {editMode && (
                      <button
                        onClick={() => {
                          const newExpertise = tempProfile.expertise.filter((_, i) => i !== index);
                          setTempProfile({...tempProfile, expertise: newExpertise});
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </span>
                ))}
                {editMode && (
                  <button
                    onClick={() => setTempProfile({
                      ...tempProfile,
                      expertise: [...tempProfile.expertise, '']
                    })}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 border-dashed border-gray-300 text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Expertise
                  </button>
                )}
              </div>
            </div>

            {/* Availability Schedule */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Availability</h3>
                <span className="text-sm text-gray-500">{profile.availability.timezone}</span>
              </div>
              <div className="space-y-4">
                {profile.availability.schedule.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{day.day}</span>
                    <div className="flex flex-wrap gap-2">
                      {day.slots.map((slot, slotIndex) => (
                        <span
                          key={slotIndex}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rates */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mentorship Rates</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Hourly Rate</span>
                  <span className="text-lg font-semibold text-gray-900">${profile.rates.hourlyRate}/hour</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Package Rates</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {profile.rates.packageRates.map((package_, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-900">
                          {package_.sessions} Sessions ({package_.duration})
                        </h5>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          ${package_.price}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          ${(package_.price / package_.sessions).toFixed(2)} per session
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-1 space-y-6">
            {/* Education */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Education</h3>
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center">
                      <GraduationCap className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                        <p className="text-sm text-gray-500">{edu.school}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {editMode && (
                  <button
                    onClick={() => setTempProfile({
                      ...tempProfile,
                      education: [...tempProfile.education, { degree: '', school: '', year: '' }]
                    })}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Education
                  </button>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Certifications</h3>
              <div className="space-y-3">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">{cert}</span>
                    {editMode && (
                      <button
                        onClick={() => {
                          const newCerts = tempProfile.certifications.filter((_, i) => i !== index);
                          setTempProfile({...tempProfile, certifications: newCerts});
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {editMode && (
                  <button
                    onClick={() => setTempProfile({
                      ...tempProfile,
                      certifications: [...tempProfile.certifications, '']
                    })}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Certification
                  </button>
                )}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((language, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {language}
                    {editMode && (
                      <button
                        onClick={() => {
                          const newLanguages = tempProfile.languages.filter((_, i) => i !== index);
                          setTempProfile({...tempProfile, languages: newLanguages});
                        }}
                        className="ml-2 text-purple-600 hover:text-purple-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </span>
                ))}
                {editMode && (
                  <button
                    onClick={() => setTempProfile({
                      ...tempProfile,
                      languages: [...tempProfile.languages, '']
                    })}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 border-dashed border-gray-300 text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Language
                  </button>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Social Links</h3>
              <div className="space-y-3">
                {profile.website && (
                  <a href={profile.website} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Globe className="h-4 w-4 mr-2" />
                    Personal Website
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
                {editMode && (
                  <div className="space-y-3 pt-3 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Website</label>
                      <input
                        type="url"
                        value={tempProfile.website}
                        onChange={(e) => setTempProfile({...tempProfile, website: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">GitHub</label>
                      <input
                        type="text"
                        value={tempProfile.github}
                        onChange={(e) => setTempProfile({...tempProfile, github: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                      <input
                        type="text"
                        value={tempProfile.linkedin}
                        onChange={(e) => setTempProfile({...tempProfile, linkedin: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="linkedin.com/in/username"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}