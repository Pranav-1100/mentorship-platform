import Link from 'next/link';
import { ArrowRight, Users, Brain, Clock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">MentorMatch</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/mentors" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Browse Mentors
              </Link>
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

      <main>
        {/* Hero Section */}
        <div className="relative pt-16 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                <div>
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Find Your Perfect</span>
                    <span className="block text-blue-600">Mentor Match</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Connect with experienced mentors in your field. Get personalized guidance to accelerate your career growth.
                  </p>
                  <div className="mt-10 sm:mt-12">
                    <div className="sm:flex sm:justify-center lg:justify-start gap-4">
                      <Link
                        href="/mentors"
                        className="flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all"
                      >
                        Browse Mentors
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                      <Link
                        href="/auth/register"
                        className="flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition-all"
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 lg:m-0">
                <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                  <div className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none">
                    <div className="h-64 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl lg:h-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Why Choose MentorMatch?
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Find the perfect mentor to guide you on your journey
              </p>
            </div>

            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <Users className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Expert Mentors</h3>
                <p className="mt-2 text-gray-600">
                  Connect with experienced professionals from leading companies worldwide.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <Brain className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Smart Matching</h3>
                <p className="mt-2 text-gray-600">
                  Our AI-powered algorithm finds the perfect mentor based on your goals and interests.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <Clock className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Flexible Learning</h3>
                <p className="mt-2 text-gray-600">
                  Schedule sessions that fit your availability and learning pace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
