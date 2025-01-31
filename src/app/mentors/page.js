"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { 
  Search, Filter, Briefcase, MapPin, GraduationCap, 
  Clock, DollarSign, Globe, X, ChevronDown, Star 
} from 'lucide-react';

export default function MentorsPage() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    industry: '',
    experience: '',
    location: '',
    skills: '',
    availability: '',
    priceRange: '',
    rating: '',
    languages: '',
    timezone: '',
    sortBy: 'rating'
  });

  useEffect(() => {
    fetchMentors();
  }, [filters]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/mentors', { params: filters });
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      industry: '',
      experience: '',
      location: '',
      skills: '',
      availability: '',
      priceRange: '',
      rating: '',
      languages: '',
      timezone: '',
      sortBy: 'rating'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">MentorMatch</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Login Prompt */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
          <div className="flex justify-between items-center">
            <p className="text-blue-800">
              Sign in to see mentors matched to your profile and preferences
            </p>
            <Link
              href="/auth/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Find Mentors</h2>
            <button
              onClick={resetFilters}
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </button>
          </div>

          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search mentors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="relative">
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              >
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
              <Star className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="relative">
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              >
                <option value="">All Industries</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
              </select>
              <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* More Filters Toggle */}
          <button 
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-700"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showMoreFilters ? 'Show Less Filters' : 'Show More Filters'}
            <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${showMoreFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Advanced Filters */}
          {showMoreFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                >
                  <option value="">Any Experience</option>
                  <option value="1-3">1-3 years</option>
                  <option value="4-6">4-6 years</option>
                  <option value="7-10">7-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
                <GraduationCap className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                >
                  <option value="">Any Price Range</option>
                  <option value="0-50">$0 - $50 /hour</option>
                  <option value="51-100">$51 - $100 /hour</option>
                  <option value="101-200">$101 - $200 /hour</option>
                  <option value="200+">$200+ /hour</option>
                </select>
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                >
                  <option value="">Any Availability</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="evenings">Evenings</option>
                  <option value="mornings">Mornings</option>
                </select>
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={filters.languages}
                  onChange={(e) => setFilters({ ...filters, languages: e.target.value })}
                >
                  <option value="">Any Language</option>
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="mandarin">Mandarin</option>
                  <option value="hindi">Hindi</option>
                  <option value="french">French</option>
                </select>
                <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Skills (e.g., React, Python)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={filters.skills}
                  onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                />
                <GraduationCap className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Mentor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
            // Loading skeletons with full implementation
            [...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                {/* Header with avatar and name */}
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                  </div>
                </div>

                {/* Bio skeleton */}
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>

                {/* Location and rating skeleton */}
                <div className="mt-4 flex justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>

                {/* Skills skeleton */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-6 bg-gray-200 rounded w-16"></div>
                  ))}
                </div>

                {/* Footer skeleton */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))
          ) : mentors.length === 0 ? (
            // No results found
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            // Actual mentor cards
            mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    {mentor.photo_url ? (
                      <img src={mentor.photo_url} alt={mentor.name} className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                      <span className="text-2xl font-medium text-gray-600">
                        {mentor.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{mentor.name}</h3>
                    <p className="text-gray-500">{mentor.current_position}</p>
                    <p className="text-gray-500 text-sm">{mentor.current_company}</p>
                  </div>
                </div>

                <p className="mt-4 text-gray-600 line-clamp-2">{mentor.bio}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {mentor.location_city}, {mentor.location_country}
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{mentor.rating || '5.0'}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {mentor.skills?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                      {skill}
                    </span>
                  ))}
                  {mentor.skills?.length > 3 && (
                    <span className="text-gray-500 text-sm">
                      +{mentor.skills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">${mentor.hourly_rate}</span>
                    <span className="text-gray-500">/hour</span>
                  </div>
                  <Link
                    href={`/mentors/${mentor.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}