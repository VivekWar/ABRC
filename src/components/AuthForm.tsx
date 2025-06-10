'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Users, MapPin, ArrowRight } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      onSignup(formData.name, formData.email, formData.password);
    } else {
      onLogin(formData.email, formData.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-10 w-32 h-32 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex"
      >
        {/* Left Side - Welcome */}
        <div className="flex-1 bg-gradient-to-br from-purple-600 to-indigo-700 p-12 text-white flex flex-col justify-center relative">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <Car className="w-8 h-8 mr-3" />
              <h1 className="text-2xl font-bold">CNB Taxi Share</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-4">
              {isSignUp ? 'Join Us!' : 'Welcome Back!'}
            </h2>
            
            <p className="text-lg mb-8 opacity-90">
              Share rides, save money, and connect with fellow travelers from your college.
            </p>

            <div className="space-y-4">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center"
              >
                <Users className="w-5 h-5 mr-3" />
                <span>Find travel partners</span>
              </motion.div>
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center"
              >
                <MapPin className="w-5 h-5 mr-3" />
                <span>Share taxi fares</span>
              </motion.div>
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center"
              >
                <Car className="w-5 h-5 mr-3" />
                <span>Safe & secure rides</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating Cars Animation */}
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 right-10 opacity-20"
          >
            <Car className="w-16 h-16" />
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-12">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h3>
              <p className="text-gray-600">
                {isSignUp ? 'Enter your details to get started' : 'Enter your credentials to continue'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50"
              >
                <span>{isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
