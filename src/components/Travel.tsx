'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Car, Plus, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface TravelProps {
  user: User | null;
}

function Travel({ user }: TravelProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    departureTime: '',
    maxPassengers: 4,
    preferredMode: [] as string[]
  });

  const transportModes = ['Cab', 'Auto', 'Bus', 'Bike'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting travel form...'); // Debug log
      
      const response = await fetch('/api/travels', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status); // Debug log
      
      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (response.ok) {
        alert(data.message || 'Travel posted successfully!');
        setShowForm(false);
        setFormData({
          destination: '',
          departureTime: '',
          maxPassengers: 4,
          preferredMode: []
        });
        
        // Use localStorage to trigger refresh in other components
        localStorage.setItem('lastTravelUpdate', Date.now().toString());
        
        // Also dispatch a storage event
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'lastTravelUpdate',
          newValue: Date.now().toString()
        }));
        
        console.log('Travel created successfully, events dispatched'); // Debug log
      } else {
        alert(data.error || 'Failed to post travel');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network error - please check your connection');
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
        className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-xl"
      >
        <h1 className="text-2xl font-bold mb-2">Plan Your Journey</h1>
        <p className="opacity-90">Create a travel plan and find companions to share the ride.</p>
      </motion.div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Create New Travel</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showForm ? 'Cancel' : 'New Travel'}</span>
        </motion.button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Destination
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter destination"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Departure Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.departureTime}
                onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Maximum Passengers
              </label>
              <select
                value={formData.maxPassengers}
                onChange={(e) => setFormData({...formData, maxPassengers: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num} passenger{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Car className="w-4 h-4 inline mr-1" />
                Preferred Transport Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                {transportModes.map(mode => (
                  <motion.button
                    key={mode}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeToggle(mode)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.preferredMode.includes(mode)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    {mode}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || formData.preferredMode.length === 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Travel...' : 'Create Travel Plan'}
            </motion.button>
          </form>
        </motion.div>
      )}
    </div>
  );
}

export default Travel;
