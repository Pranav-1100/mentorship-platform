"use client";

import { useState } from 'react';
import { 
  Search, Filter, Briefcase, MapPin, GraduationCap, 
  Clock, User, BookOpen, MessageSquare
} from 'lucide-react';

const mockMentees = [
  {
    id: 1,
    name: "Sarah Smith",
    current_role: "Junior Developer",
    current_company: "Tech Startup",
    photo_url: null,
    bio: "Looking to grow my skills in frontend development and system design",
    location_city: "New York",
    location_country: "USA",
    interests: ["React", "Frontend Development", "UX Design"],
    experience_level: "1-3 years",
    preferred_topics: ["Web Development", "Career Growth"],
    availability: "Weekends",
    languages: ["English"]
  },
  // Add more mock mentees
];

export default function FindMenteesPage() {
  const [mentees, setMentees] = useState(mockMentees);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    experienceLevel: '',
    interests: '',
    availability: ''
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Find Mentees</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect with mentees looking for guidance in your area of expertise
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search mentees..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Experience Level */}
            <div className="relative">
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={filters.experienceLevel}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
              >
                <option value="">Any Experience Level</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
              </select>
              <GraduationCap className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Interests */}
            <div className="relative">
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={filters.interests}
                onChange={(e) => handleFilterChange('interests', e.target.value)}
              >
                <option value="">Any Interest</option>
                <option value="frontend">Frontend Development</option>
                <option value="backend">Backend Development</option>
                <option value="career">Career Growth</option>
              </select>
              <BookOpen className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Availability */}
            <div className="relative">
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
              >
                <option value="">Any Availability</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="flexible">Flexible</option>
              </select>
              <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Mentee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            [...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                  </div>
                </div>
              </div>
            ))
          ) : mentees.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No mentees found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters to find more mentees
              </p>
            </div>
          ) : (
            mentees.map((mentee) => (
              <div key={mentee.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    {mentee.photo_url ? (
                      <img
                        src={mentee.photo_url}
                        alt={mentee.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{mentee.name}</h3>
                    <p className="text-sm text-gray-500">
                      {mentee.current_role} at {mentee.current_company}
                    </p>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">
                        {mentee.location_city}, {mentee.location_country}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-600 line-clamp-2">{mentee.bio}</p>

                {/* Experience and Availability */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <GraduationCap className="h-4 w-4 mr-1 text-gray-400" />
                    {mentee.experience_level} experience
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    Available {mentee.availability}
                  </div>
                </div>

                {/* Interests/Topics */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Interested in:</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentee.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                    Offer Mentorship
                  </button>
                  <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}