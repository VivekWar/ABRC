'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Car, Plus, Calendar } from 'lucide-react';

interface TravelProps {
  user: any;
}

export default function Travel({ user }: TravelProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    departureTime: '',
    maxPassengers: 4,
    preferredMode: [] as string[]
  });

  const transportModes = ['Auto', 'Cab', 'Bus', 'Bike', 'Any'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/travels', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Travel posted successfully!');
        setShowForm(false);
        setFormData({
          destination: '',
          departureTime: '',
          maxPassengers: 4,
          preferredMode: []
        });
      } else {
        alert('Failed to post travel');
      }
    } catch (error) {
      console.error('Error posting travel:', error);
      alert('Error posting travel');
    } finally {
      setLoading(false);
    }
  };

  const handleModeToggle = (mode: string) => {
    setFormData(prev => ({
      ...prev,
      preferredMode: prev.preferredMode.includes(mode)
        ? prev.preferredMode.filter(m => m !== mode)
        : [...prev.preferredMode, mode]
    }));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl"
      >
        <h1 className="text-2xl font-bold mb-2">Plan Your Journey</h1>
        <p className="opacity-90">Share your travel plans and find companions for your next trip.</p>
      </motion.div>

      {!showForm ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <Car className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ready to travel?</h3>
          <p className="text-gray-600 mb-6">Create a new travel plan and find your perfect travel companions.</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Travel Plan</span>
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Create Travel Plan</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Destination
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Where are you going?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Departure Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.departureTime}
                onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Maximum Passengers
              </label>
              <select
                value={formData.maxPassengers}
                onChange={(e) => setFormData({...formData, maxPassengers: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} passenger{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Car className="w-4 h-4 inline mr-2" />
                Preferred Transport Mode
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {transportModes.map(mode => (
                  <motion.button
                    key={mode}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeToggle(mode)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.preferredMode.includes(mode)
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 hover:border-indigo-300'
                    }`}
                  >
                    {mode}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || formData.preferredMode.length === 0}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Travel Plan'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
