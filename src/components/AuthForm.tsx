'use client';
import { useState } from 'react';

interface AuthFormProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string) => void;
  isLoading: boolean;
}

export default function AuthForm({ onLogin, onSignup, isLoading }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData); // Debug log
    
    if (isSignUp) {
      onSignup(formData.name, formData.email, formData.password);
    } else {
      onLogin(formData.email, formData.password);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Input changed: ${field} = ${value}`); // Debug log
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex">
        {/* Left Side */}
        <div className="flex-1 bg-gradient-to-br from-purple-600 to-indigo-700 p-12 text-white flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-6">CNB Taxi Share</h1>
          <h2 className="text-4xl font-bold mb-4">
            {isSignUp ? 'Join Us!' : 'Welcome Back!'}
          </h2>
          <p className="text-lg opacity-90">
            Share rides, save money, and connect with fellow travelers.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              onClick={() => {
                console.log('Button clicked!'); // Debug log - FIXED: removed unused 'e' parameter
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                console.log('Switch button clicked!'); // Debug log
                setIsSignUp(!isSignUp);
              }}
              className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
