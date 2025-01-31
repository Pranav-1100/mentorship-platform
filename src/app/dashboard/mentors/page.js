"use client";

import { useState } from 'react';
import { 
  Search,
  Briefcase, 
  MapPin, 
  GraduationCap, 
  Clock, 
  User,
  Star,
  MessageSquare,
  Filter,
  ChevronDown,
  X
} from 'lucide-react';

const mockMentors = [
  {
    id: 1,
    name: "John Doe",
    position: "Senior Software Engineer",
    company: "Google",
    photo_url: null,
    bio: "10+ years of experience in software development. Passionate about helping others grow in their tech careers.",
    location: {
      city: "San Francisco",
      country: "USA"
    },
    expertise: ["System Design", "React", "Node.js", "Cloud Architecture"],
    hourly_rate: 120,
    rating: 4.9,
    total_sessions: 150,
    languages: ["English", "Spanish"],
    availability: "Weekdays",
    education: "MS Computer Science, Stanford",
    industry: "Technology"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "Product Manager",
    company: "Microsoft",
    photo_url: null,
    bio: "Product leader with expertise in B2B SaaS. Helping aspiring PMs navigate their career journey.",
    location: {
      city: "Seattle",
      country: "USA"
    },
    expertise: ["Product Strategy", "User Research", "Agile", "Go-to-Market"],
    hourly_rate: 150,
    rating: 4.8,
    total_sessions: 89,
    languages: ["English"],
    availability: "Flexible",
    education: "MBA, Harvard Business School",
    industry: "Technology"
  }
];

export default function FindMentorsPage() {
  const [mentors, setMentors] = useState(mockMentors);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    industry: '',
    expertise: '',
    availability: '',
    priceRange: '',
    rating: ''
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      industry: '',
      expertise: '',
      availability: '',
      priceRange: '',
      rating: ''
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Find Mentors</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect with experienced mentors who can help you grow in your career
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {/* Basic Search */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by name, expertise, or company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              {(filters.industry || filters.expertise || filters.availability || filters.priceRange || filters.rating) && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="relative">
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={filters.industry}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                >
                  <option value="">Any Industry</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                </select>
                <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={filters.expertise}
                  onChange={(e) => handleFilterChange('expertise', e.target.value)}
                >
                  <option value="">Any Expertise</option>
                  <option value="software">Software Development</option>
                  <option value="product">Product Management</option>
                  <option value="data">Data Science</option>
                  <option value="design">UX Design</option>
                </select>
                <GraduationCap className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

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

              <div className="relative">
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                >
                  <option value="">Any Price Range</option>
                  <option value="0-50">$0 - $50 /hour</option>
                  <option value="51-100">$51 - $100 /hour</option>
                  <option value="101-200">$101 - $200 /hour</option>
                  <option value="201+">$201+ /hour</option>
                </select>
                <span className="absolute left-3 top-2.5 text-gray-400 font-medium">$</span>
              </div>

              <div className="relative">
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
                <Star className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Mentor Grid */}
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
          ) : mentors.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No mentors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters to find more mentors
              </p>
            </div>
          ) : (
            mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all">
                {/* Mentor Header */}
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    {mentor.photo_url ? (
                      <img
                        src={mentor.photo_url}
                        alt={mentor.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{mentor.name}</h3>
                    <p className="text-sm text-gray-600">{mentor.position}</p>
                    <p className="text-sm text-gray-600">{mentor.company}</p>
                  </div>
                </div>

                {/* Rating and Location */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium text-gray-700">{mentor.rating}</span>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{mentor.total_sessions} sessions</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {mentor.location.city}, {mentor.location.country}
                  </div>
                </div>

                {/* Bio */}
                <p className="mt-4 text-sm text-gray-600 line-clamp-2">{mentor.bio}</p>

                {/* Expertise */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing and Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-semibold text-gray-900">${mentor.hourly_rate}</span>
                    <span className="text-sm text-gray-500">/hour</span>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </button>
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                      Request Mentorship
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}