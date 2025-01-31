import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  MessageSquare,
  Users,
  Settings,
  Menu,
  User,
  FileText,
  Calendar,
  Bell,
  X,
  ChevronDown,
  BookOpen,
  Clock,
  Search,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export default function DashboardHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Home', href: '/dashboard', icon: Home },
      { name: 'Messages', href: '/dashboard/chats', icon: MessageSquare },
      { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
    ];

    if (user?.role === 'mentee' || user?.role === 'both') {
      baseItems.push(
        { name: 'Find Mentors', href: '/mentors', icon: Search },
        { name: 'Applications', href: '/dashboard/applications', icon: FileText },
        { name: 'My Mentors', href: '/dashboard/my-mentors', icon: GraduationCap }
      );
    }

    if (user?.role === 'mentor' || user?.role === 'both') {
      baseItems.push(
        { name: 'Find Mentees', href: '/mentees', icon: Search },
        { name: 'Mentor Apps', href: '/dashboard/mentor/applications', icon: Briefcase },
        { name: 'My Mentees', href: '/dashboard/mentor/mentees', icon: BookOpen }
      );
    }

    baseItems.push(
      { name: 'Network', href: '/dashboard/connections', icon: Users },
      { name: 'Waitlist', href: '/dashboard/waitlist', icon: Clock }
    );

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center flex-shrink-0">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/dashboard" className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600 ml-2">MentorMatch</h1>
            </Link>
          </div>

          {/* Desktop Navigation - Icon-based with hover effect */}
          <nav className="hidden md:flex md:items-center overflow-x-auto flex-grow mx-4 scrollbar-hide">
            <div className="flex space-x-1 px-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex-shrink-0 inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
                    ${pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="absolute left-12 min-w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded px-2 py-1">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Settings */}
            <Link
              href="/dashboard/settings"
              className="p-2 text-gray-400 hover:text-gray-600 relative group"
            >
              <Settings className="h-5 w-5" />
              <span className="absolute right-0 min-w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded px-2 py-1 -bottom-8">
                Settings
              </span>
            </Link>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 relative group">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              <span className="absolute right-0 min-w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded px-2 py-1 -bottom-8">
                Notifications
              </span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-sm focus:outline-none group"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user?.photo_url ? (
                    <img
                      src={user.photo_url}
                      alt={user.name}
                      className="h-8 w-8 object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  isProfileOpen ? 'transform rotate-180' : ''
                }`} />
              </button>

              {/* Profile dropdown panel */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Your Profile
                    </Link>
                    {(user?.role === 'mentor' || user?.role === 'both') && (
                      <Link
                        href="/dashboard/mentor/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Mentor Profile
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center py-2 px-3 text-base font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}