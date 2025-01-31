"use client";

import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Globe,
  Star,
  Edit,
  Save,
  Plus,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function MenteeProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    title: 'Software Developer',
    company: 'TechStart Inc.',
    location: 'San Francisco, CA',
    bio: 'Passionate developer looking to grow in full-stack development and system design. Currently working on enterprise applications and cloud infrastructure.',
    experience: '2 years',
    education: [
      {
        degree: 'B.S. Computer Science',
        school: 'University of California, Berkeley',
        year: '2022'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
    interests: ['System Design', 'Cloud Architecture', 'Frontend Development'],
    goals: [
      'Master system design principles',
      'Improve leadership skills',
      'Learn cloud-native development'
    ],
    profileCompletion: 85,
    website: 'https://alexjohnson.dev',
    github: 'github.com/alexj',
    linkedin: 'linkedin.com/in/alexj'
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
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your profile and preferences
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
          {/* Main Profile Info */}
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

            {/* Goals & Interests */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Goals</h3>
              <div className="space-y-4">
                {editMode ? (
                  profile.goals.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={tempProfile.goals[index]}
                        onChange={(e) => {
                          const newGoals = [...tempProfile.goals];
                          newGoals[index] = e.target.value;
                          setTempProfile({...tempProfile, goals: newGoals});
                        }}
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => {
                          const newGoals = tempProfile.goals.filter((_, i) => i !== index);
                          setTempProfile({...tempProfile, goals: newGoals});
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <ul className="space-y-2">
                    {profile.goals.map((goal, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                )}
                {editMode && (
                  <button
                    onClick={() => setTempProfile({
                      ...tempProfile,
                      goals: [...tempProfile.goals, '']
                    })}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Goal
                  </button>
                )}
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                    {editMode && (
                      <button
                        onClick={() => {
                          const newSkills = tempProfile.skills.filter((_, i) => i !== index);
                          setTempProfile({...tempProfile, skills: newSkills});
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
                      skills: [...tempProfile.skills, '']
                    })}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 border-dashed border-gray-300 text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skill
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-1 space-y-6">
            {/* Profile Completion */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900">Profile Completion</h3>
              <div className="mt-2">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                    <div
                      style={{ width: `${profile.profileCompletion}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">{profile.profileCompletion}% Complete</p>
              </div>
            </div>

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
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.75c1.615 0 3.176.288 4.318.846 1.91-1.295 2.75-1.026 2.75-1.026.544 1.377.2 2.394.098 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
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

            {/* Interests */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Areas of Interest</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {interest}
                    {editMode && (
                      <button
                        onClick={() => {
                          const newInterests = tempProfile.interests.filter((_, i) => i !== index);
                          setTempProfile({...tempProfile, interests: newInterests});
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
                      interests: [...tempProfile.interests, '']
                    })}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 border-dashed border-gray-300 text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Interest
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}