"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Globe,
  Github,
  Linkedin,
  Edit2,
  Save,
  X,
  Camera,
  Plus,
  Trash2,
  Calendar,
  Award,
  Star
} from 'lucide-react';
import { getProfile, updateProfile, updateSkills } from '@/lib/api/profile';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  // Fetch profile data
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  // Update skills mutation
  const updateSkillsMutation = useMutation({
    mutationFn: updateSkills,
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      toast.success('Skills updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update skills');
    },
  });

  const handleSaveProfile = async () => {
    if (!formData) return;

    const updateData = {
      name: formData.name,
      bio: formData.bio,
      title: formData.title,
      company: formData.company,
      location: formData.location,
      website: formData.website,
      linkedIn: formData.linkedIn,
      github: formData.github,
      hourlyRate: formData.hourlyRate,
      availability: formData.availability,
    };

    updateProfileMutation.mutate(updateData);
  };

  const handleCancelEdit = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    const updatedSkills = [...(formData.skills || []), newSkill.trim()];
    setFormData({ ...formData, skills: updatedSkills });
    updateSkillsMutation.mutate(updatedSkills);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = formData.skills.filter(skill => skill !== skillToRemove);
    setFormData({ ...formData, skills: updatedSkills });
    updateSkillsMutation.mutate(updatedSkills);
  };

  const handleAddLanguage = () => {
    if (!newLanguage.trim()) return;

    const updatedLanguages = [...(formData.languages || []), newLanguage.trim()];
    setFormData({ ...formData, languages: updatedLanguages });
    setNewLanguage('');
  };

  const handleRemoveLanguage = (langToRemove) => {
    const updatedLanguages = formData.languages.filter(lang => lang !== langToRemove);
    setFormData({ ...formData, languages: updatedLanguages });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: Implement actual image upload to server
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
      toast.info('Image upload will be implemented with backend integration');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p>Error loading profile: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Edit2 size={18} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSaveProfile}
              disabled={updateProfileMutation.isPending}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <Save size={18} />
              <span>{updateProfileMutation.isPending ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-start space-x-6 mb-6 pb-6 border-b">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                formData.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                <Camera size={16} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{formData.name}</h2>
                <p className="text-lg text-gray-600 mb-2">{formData.title}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {formData.company && (
                    <div className="flex items-center space-x-1">
                      <Briefcase size={16} />
                      <span>{formData.company}</span>
                    </div>
                  )}
                  {formData.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{formData.location}</span>
                    </div>
                  )}
                  {user?.email && (
                    <div className="flex items-center space-x-1">
                      <Mail size={16} />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Role Badge */}
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.role === 'mentor'
                ? 'bg-blue-100 text-blue-700'
                : formData.role === 'mentee'
                ? 'bg-green-100 text-green-700'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {formData.role === 'both' ? 'Mentor & Mentee' : formData.role?.charAt(0).toUpperCase() + formData.role?.slice(1)}
            </span>
            {formData.rating && (
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{formData.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
          {isEditing ? (
            <textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell others about yourself..."
            />
          ) : (
            <p className="text-gray-600">
              {formData.bio || 'No bio added yet.'}
            </p>
          )}
        </div>

        {/* Professional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Details</h3>
            <div className="space-y-3">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={formData.company || ''}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {formData.role !== 'mentee' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                      <input
                        type="number"
                        value={formData.hourlyRate || ''}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  {formData.company && (
                    <div className="flex items-center space-x-2">
                      <Briefcase size={18} className="text-gray-400" />
                      <span className="text-gray-700">{formData.company}</span>
                    </div>
                  )}
                  {formData.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin size={18} className="text-gray-400" />
                      <span className="text-gray-700">{formData.location}</span>
                    </div>
                  )}
                  {formData.hourlyRate && formData.role !== 'mentee' && (
                    <div className="flex items-center space-x-2">
                      <Award size={18} className="text-gray-400" />
                      <span className="text-gray-700">${formData.hourlyRate}/hour</span>
                    </div>
                  )}
                  {formData.createdAt && (
                    <div className="flex items-center space-x-2">
                      <Calendar size={18} className="text-gray-400" />
                      <span className="text-gray-700">Joined {new Date(formData.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Links</h3>
            <div className="space-y-3">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.linkedIn || ''}
                      onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                    <input
                      type="url"
                      value={formData.github || ''}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </>
              ) : (
                <>
                  {formData.website && (
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:underline"
                    >
                      <Globe size={18} />
                      <span>Website</span>
                    </a>
                  )}
                  {formData.linkedIn && (
                    <a
                      href={formData.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:underline"
                    >
                      <Linkedin size={18} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {formData.github && (
                    <a
                      href={formData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:underline"
                    >
                      <Github size={18} />
                      <span>GitHub</span>
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.skills && formData.skills.length > 0 ? (
              formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center space-x-1"
                >
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No skills added yet.</p>
            )}
          </div>
          {isEditing && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a skill..."
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-1"
              >
                <Plus size={18} />
                <span>Add</span>
              </button>
            </div>
          )}
        </div>

        {/* Languages */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.languages && formData.languages.length > 0 ? (
              formData.languages.map((language, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center space-x-1"
                >
                  <span>{language}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveLanguage(language)}
                      className="ml-1 hover:text-green-900"
                    >
                      <X size={14} />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No languages added yet.</p>
            )}
          </div>
          {isEditing && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a language..."
              />
              <button
                onClick={handleAddLanguage}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-1"
              >
                <Plus size={18} />
                <span>Add</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Availability Section (for mentors) */}
      {(formData.role === 'mentor' || formData.role === 'both') && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability Status
                </label>
                <select
                  value={formData.availability || 'available'}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="limited">Limited Availability</option>
                  <option value="unavailable">Not Available</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                formData.availability === 'available'
                  ? 'bg-green-500'
                  : formData.availability === 'limited'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}></div>
              <span className="text-gray-700 capitalize">
                {formData.availability || 'Not specified'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
