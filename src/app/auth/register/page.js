"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, Mail, Lock, Briefcase, MapPin, Globe, 
  ChevronRight, ChevronLeft, Eye, EyeOff 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Registration steps
const STEPS = {
  ACCOUNT: 0,
  ROLE: 1,
  BASIC_INFO: 2,
  SKILLS: 3,
  ADDITIONAL: 4
};

// Progress indicator component
const RegisterProgress = ({ currentStep, totalSteps }) => {
    return (
      <div className="flex justify-between mb-8">
        {[...Array(totalSteps)].map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2
                ${index <= currentStep 
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-300'}`}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-xs text-gray-600">
              {['Account', 'Role', 'Info', 'Skills', 'Extra'][index]}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  // Form error component
  const FormError = ({ message }) => {
    if (!message) return null;
    return (
      <p className="mt-1 text-sm text-red-600 font-medium">
        {message}
      </p>
    );
  };

  // Validation hook
const useFormValidation = (step, formData) => {
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);
  
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };
  
    const validateLocation = async (city, country) => {
      try {
        // Here you could integrate with a location API like Google Places
        // For now, we'll do basic validation
        return {
          isValid: city.length >= 2 && country.length >= 2,
          message: 'Please enter valid city and country names'
        };
      } catch (error) {
        return { isValid: false, message: 'Location validation failed' };
      }
    };
  
    useEffect(() => {
      const validate = async () => {
        let newErrors = {};
        switch (step) {
          case 0: // Account
            if (!validateEmail(formData.email)) {
              newErrors.email = 'Please enter a valid email address';
            }
            if (!formData.password || formData.password.length < 6) {
              newErrors.password = 'Password must be at least 6 characters';
            }
            break;
  
          case 1: // Role
            if (!formData.role) {
              newErrors.role = 'Please select a role';
            }
            break;
  
          case 2: // Basic Info
            if (!formData.full_name?.trim()) {
              newErrors.full_name = 'Full name is required';
            }
            if (!formData.current_position?.trim()) {
              newErrors.current_position = 'Current position is required';
            }
            if (formData.location_city || formData.location_country) {
              const locationValidation = await validateLocation(
                formData.location_city,
                formData.location_country
              );
              if (!locationValidation.isValid) {
                newErrors.location = locationValidation.message;
              }
            }
            if (!formData.bio?.trim()) {
              newErrors.bio = 'Bio is required';
            }
            break;
  
          case 3: // Skills
            if (!formData.skills?.length) {
              newErrors.skills = 'Please add at least one skill';
            }
            break;
        }
  
        setErrors(newErrors);
        setIsValid(Object.keys(newErrors).length === 0);
      };
  
      validate();
    }, [step, formData]);
  
    return { isValid, errors };
  };

export default function RegisterPage() {
  const { register } = useAuth();
  const [step, setStep] = useState(STEPS.ACCOUNT);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    full_name: '',
    location_city: '',
    location_country: '',
    current_position: '',
    current_company: '',
    bio: '',
    skills: [],
    languages: [],
    photo_url: '',
    linkedin_url: '',
    github_url: '',
    website_url: '',
    education: [],
    work_experience: [],
    timezone: '',
    availability: {},
    hourly_rate: '',
    preferred_learning_style: '',
  });

  const baseInputStyles = `
  appearance-none 
  block 
  w-full 
  px-3 
  py-2 
  pl-10 
  border 
  border-gray-300 
  rounded-md 
  shadow-sm 
  text-black 
  placeholder:text-gray-400 
  focus:outline-none 
  focus:ring-blue-500 
  focus:border-blue-500
`;

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (step) {
      case STEPS.ACCOUNT:
        if (!formData.email || !formData.password) {
          toast.error('Please fill in all required fields');
          return false;
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return false;
        }
        break;
      case STEPS.ROLE:
        if (!formData.role) {
          toast.error('Please select a role');
          return false;
        }
        break;
      // Add validation for other steps
    }
    return true;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    if (step !== STEPS.ADDITIONAL) {
      handleNext();
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  // Render different steps
  const renderStep = () => {
    switch (step) {
      case STEPS.ACCOUNT:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
              <input
                  id="email"
                  type="email"
                  required
                  style={{ color: '#000000' }}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                />

                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  style={{ color: '#000000' }}
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case STEPS.ROLE:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Choose your role</h3>
            <div className="grid grid-cols-1 gap-4">
              {['mentor', 'mentee', 'both'].map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`p-4 border rounded-lg text-left ${
                    formData.role === role
                      ? 'border-blue-500 ring-2 ring-blue-500'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                  onClick={() => updateFormData('role', role)}
                >
                  <div className="font-medium capitalize text-black">{role}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {role === 'mentor'
                      ? 'Share your expertise and guide others'
                      : role === 'mentee'
                      ? 'Learn from experienced professionals'
                      : 'Both give and receive mentorship'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
        case STEPS.BASIC_INFO:
        return (
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <div className="mt-1 relative">
                <input
                  id="full_name"
                  type="text"
                  required
                  style={{ color: '#000000' }}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.full_name}
                  onChange={(e) => updateFormData('full_name', e.target.value)}
                />
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Current Position */}
            <div>
              <label htmlFor="current_position" className="block text-sm font-medium text-gray-700">
                Current Position *
              </label>
              <div className="mt-1 relative">
                <input
                  id="current_position"
                  type="text"
                  required
                  style={{ color: '#000000' }}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.current_position}
                  onChange={(e) => updateFormData('current_position', e.target.value)}
                />
                <Briefcase className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Current Company */}
            <div>
              <label htmlFor="current_company" className="block text-sm font-medium text-gray-700">
                Current Company
              </label>
              <div className="mt-1 relative">
                <input
                  id="current_company"
                  type="text"
                  style={{ color: '#000000' }}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.current_company}
                  onChange={(e) => updateFormData('current_company', e.target.value)}
                />
                <Briefcase className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="location_city" className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="location_city"
                    type="text"
                    required
                    style={{ color: '#000000' }}
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.location_city}
                    onChange={(e) => updateFormData('location_city', e.target.value)}
                  />
                  <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
              <div>
                <label htmlFor="location_country" className="block text-sm font-medium text-gray-700">
                  Country *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="location_country"
                    type="text"
                    required
                    style={{ color: '#000000' }}
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.location_country}
                    onChange={(e) => updateFormData('location_country', e.target.value)}
                  />
                  <Globe className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio (Tell us about yourself) *
              </label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  rows={4}
                  style={{ color: '#000000' }}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bio}
                  onChange={(e) => updateFormData('bio', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case STEPS.SKILLS:
        return (
          <div className="space-y-6">
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skills & Expertise *
              </label>
              <div className="mt-2 space-y-2">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={skill}
                      style={{ color: '#000000' }}
                      onChange={(e) => {
                        const newSkills = [...formData.skills];
                        newSkills[index] = e.target.value;
                        updateFormData('skills', newSkills);
                      }}
                    />
                    <button
                      type="button"
                      className="p-2 text-red-500 hover:text-red-700"
                      onClick={() => {
                        const newSkills = formData.skills.filter((_, i) => i !== index);
                        updateFormData('skills', newSkills);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  onClick={() => updateFormData('skills', [...formData.skills, ''])}
                >
                  + Add Skill
                </button>
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Languages
              </label>
              <div className="mt-2 space-y-2">
                {formData.languages.map((language, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={language}
                      style={{ color: '#000000' }}
                      onChange={(e) => {
                        const newLanguages = [...formData.languages];
                        newLanguages[index] = e.target.value;
                        updateFormData('languages', newLanguages);
                      }}
                    />
                    <button
                      type="button"
                      className="p-2 text-red-500 hover:text-red-700"
                      onClick={() => {
                        const newLanguages = formData.languages.filter((_, i) => i !== index);
                        updateFormData('languages', newLanguages);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  onClick={() => updateFormData('languages', [...formData.languages, ''])}
                >
                  + Add Language
                </button>
              </div>
            </div>
          </div>
        );

      case STEPS.ADDITIONAL:
        return (
          <div className="space-y-6">
            {/* Social Links */}
            <div className="space-y-4">
              <div>
                <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  style={{ color: '#000000' }}
                  id="linkedin_url"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.linkedin_url}
                  onChange={(e) => updateFormData('linkedin_url', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="github_url" className="block text-sm font-medium text-gray-700">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  style={{ color: '#000000' }}
                  id="github_url"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.github_url}
                  onChange={(e) => updateFormData('github_url', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">
                  Personal Website
                </label>
                <input
                  type="url"
                  id="website_url"
                  style={{ color: '#000000' }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.website_url}
                  onChange={(e) => updateFormData('website_url', e.target.value)}
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Availability
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {['weekdays', 'weekends', 'mornings', 'afternoons', 'evenings'].map((time) => (
                  <label key={time} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      style={{ color: '#000000' }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.availability[time] || false}
                      onChange={(e) => {
                        updateFormData('availability', {
                          ...formData.availability,
                          [time]: e.target.checked
                        });
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-600 capitalize">{time}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hourly Rate (Only for mentors) */}
            {(formData.role === 'mentor' || formData.role === 'both') && (
              <div>
                <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700">
                  Hourly Rate (USD)
                </label>
                <input
                  type="number"
                  style={{ color: '#000000' }}
                  id="hourly_rate"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.hourly_rate}
                  onChange={(e) => updateFormData('hourly_rate', e.target.value)}
                />
              </div>
            )}
          </div>
        );

      // Add more steps here...
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case STEPS.ACCOUNT:
        return 'Create your account';
      case STEPS.ROLE:
        return 'Choose your role';
      case STEPS.BASIC_INFO:
        return 'Basic information';
      case STEPS.SKILLS:
        return 'Skills & Expertise';
      case STEPS.ADDITIONAL:
        return 'Additional information';
        case STEPS.SKILLS:
        return 'Skills & Expertise';
      default:
        return '';
    }

    const { isValid, errors } = useFormValidation(step, formData);

    useEffect(() => {
        const handleKeyPress = (e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            handleNext();
          }
        };
    
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
      }, [step, formData]);
    
      const handleNext = () => {
        if (!isValid) {
          Object.values(errors).forEach(error => {
            if (error) toast.error(error);
          });
          return;
        }
        setStep(prev => prev + 1);
      };
    
      // Example of email input with validation
      const renderEmailInput = () => (
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1 relative">
            <input
              id="email"
              type="email"
              style={{ color: '#000000' }}
              required
              className={`appearance-none block w-full px-3 py-2 pl-10 border 
                ${errors.email ? 'border-red-300' : 'border-gray-300'} 
                rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <div role="alert" aria-live="polite">
            <FormError message={errors.email} />
          </div>
        </div>
      );
    
      // Example of location inputs with validation
      const renderLocationInputs = () => (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="location_city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <div className="mt-1 relative">
              <input
                id="location_city"
                style={{ color: '#000000' }}
                type="text"
                required
                className={`appearance-none block w-full px-3 py-2 pl-10 border 
                  ${errors.location ? 'border-red-300' : 'border-gray-300'} 
                  rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                value={formData.location_city}
                onChange={(e) => updateFormData('location_city', e.target.value)}
                aria-invalid={errors.location ? 'true' : 'false'}
              />
              <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div>
            <label htmlFor="location_country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <div className="mt-1 relative">
              <input
                id="location_country"
                type="text"
                required
                className={`appearance-none block w-full px-3 py-2 pl-10 border 
                  ${errors.location ? 'border-red-300' : 'border-gray-300'} 
                  rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                value={formData.location_country}
                onChange={(e) => updateFormData('location_country', e.target.value)}
                aria-invalid={errors.location ? 'true' : 'false'}
              />
              <Globe className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div className="col-span-2" role="alert" aria-live="polite">
            <FormError message={errors.location} />
          </div>
        </div>
      );    
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    {/* <RegisterProgress currentStep={step} totalSteps={5} /> */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-blue-600">MentorMatch</h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {getStepTitle()}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}

            <div className="flex justify-between">
              {step > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Back
                </button>
              )}
              <button
                type="submit"
                className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {step === STEPS.ADDITIONAL ? (
                  loading ? 'Creating account...' : 'Create account'
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-between px-4">
          {Object.values(STEPS).map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-1/5 h-1 rounded-full ${
                stepNumber <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
/>
          ))}
        </div>
        <div className="flex justify-between px-4 mt-2">
          <span className="text-xs text-gray-500">Account</span>
          <span className="text-xs text-gray-500">Role</span>
          <span className="text-xs text-gray-500">Basic Info</span>
          <span className="text-xs text-gray-500">Skills</span>
          <span className="text-xs text-gray-500">Additional</span>
        </div>
      </div>
    </div>
  );
}

