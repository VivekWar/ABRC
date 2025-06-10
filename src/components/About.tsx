'use client';
import { motion } from 'framer-motion';
import { Users, MapPin, Shield, Clock, Car, Heart } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Users,
      title: 'Find Travel Partners',
      description: 'Connect with fellow students and share your journey with trusted companions.'
    },
    {
      icon: MapPin,
      title: 'Easy Destination Sharing',
      description: 'Post your travel plans and let others join you for cost-effective trips.'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'All users are verified college students, ensuring a safe travel experience.'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get instant notifications when someone wants to join your ride.'
    }
  ];

  const steps = [
    {
      step: '1',
      title: 'Create Account',
      description: 'Sign up with your college email and complete your profile.'
    },
    {
      step: '2',
      title: 'Post Travel Plans',
      description: 'Share where you\'re going, when, and your preferred transport mode.'
    },
    {
      step: '3',
      title: 'Find Partners',
      description: 'Browse available trips or wait for others to join your journey.'
    },
    {
      step: '4',
      title: 'Share & Save',
      description: 'Split the fare and enjoy your journey with new friends!'
    }
  ];

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-xl mb-8">
          <Car className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">About CNB Taxi Share</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Your trusted platform for sharing taxi fares and finding travel companions within your college community.
          </p>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Why Choose CNB Taxi Share?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-xl"
      >
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Benefits of Sharing</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">50%</div>
            <p className="text-gray-700">Average savings on taxi fares</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
            <p className="text-gray-700">Active college students</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <p className="text-gray-700">Available support</p>
          </div>
        </div>
      </motion.section>

      {/* Safety Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="text-center">
          <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Safety First</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We prioritize your safety by verifying all users through college email addresses and maintaining 
            a trusted community environment. Always share your travel details with friends and family.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
