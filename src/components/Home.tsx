'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Car, Clock, Plus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface HomeProps {
  user: User | null;
}

interface TravelWithUser {
  id: string;
  destination: string;
  departureTime: string;
  maxPassengers: number;
  currentPassengers: number;
  preferredMode: string[];
  isActive: boolean;
  user: {
    id: string;
    name: string;
    photo: string | null;
    mobile: string | null;
  };
}

function Home({ user }: HomeProps) {
  const [travels, setTravels] = useState<TravelWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTravels = async () => {
    try {
      console.log('Fetching travels from API...'); // Debug log
      
      const response = await fetch('/api/travels', {
        cache: 'no-store', // Prevent caching
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      const data = await response.json();
      
      console.log('API Response:', data); // Debug log
      
      if (data.success) {
        setTravels(data.travels);
        console.log('Travels updated in state:', data.travels.length); // Debug log
      } else {
        console.error('Failed to fetch travels:', data.error);
      }
    } catch (error) {
      console.error('Error fetching travels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Home component mounted, fetching initial travels'); // Debug log
    fetchTravels();
    
    // Listen for storage events (when new travel is created)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lastTravelUpdate') {
        console.log('Storage event received, refreshing travels'); // Debug log
        fetchTravels();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also poll every 5 seconds for new travels
    const interval = setInterval(() => {
      console.log('Polling for new travels...'); // Debug log
      fetchTravels();
    }, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="opacity-90">Find your perfect travel companion and share the journey.</p>
      </motion.div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Available Travels ({travels.length})
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            console.log('Manual refresh clicked'); // Debug log
            fetchTravels();
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Refresh</span>
        </motion.button>
      </div>

      {travels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No active travels</h3>
          <p className="text-gray-500">Be the first to create a travel plan!</p>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {travels.map((travel, index) => (
            <motion.div
              key={travel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold">
                    {travel.user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{travel.user.name}</h3>
                    <p className="text-sm text-gray-500">{travel.user.mobile}</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">{travel.destination}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">
                    {new Date(travel.departureTime).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">
                    {travel.currentPassengers}/{travel.maxPassengers} passengers
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-purple-600" />
                  <div className="flex space-x-1">
                    {travel.preferredMode.map((mode, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all"
              >
                Join Travel
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
