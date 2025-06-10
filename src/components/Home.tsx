'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Phone, Car, Clock, User } from 'lucide-react';

interface Travel {
  id: string;
  destination: string;
  preferredMode: string[];
  departureTime: string;
  maxPassengers: number;
  currentPassengers: number;
  user: {
    id: string;
    name: string;
    photo?: string;
    mobile?: string;
  };
}

interface HomeProps {
  user: any;
}

export default function Home({ user }: HomeProps) {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTravel, setSelectedTravel] = useState<Travel | null>(null);

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    try {
      const response = await fetch('/api/travels');
      const data = await response.json();
      setTravels(data.travels || []);
    } catch (error) {
      console.error('Error fetching travels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRide = async (travelId: string) => {
    try {
      const response = await fetch('/api/ride-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ travelId }),
      });

      if (response.ok) {
        alert('Ride request sent successfully!');
        fetchTravels(); // Refresh the list
      } else {
        alert('Failed to send ride request');
      }
    } catch (error) {
      console.error('Error joining ride:', error);
      alert('Error joining ride');
    }
  };

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {travels.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No active travels</h3>
            <p className="text-gray-500">Be the first to create a travel plan!</p>
          </motion.div>
        ) : (
          travels.map((travel, index) => (
            <motion.div
              key={travel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200"
            >
              <div className="p-6">
                {/* User Info */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-semibold">
                    {travel.user.photo ? (
                      <img
                        src={travel.user.photo}
                        alt={travel.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-800">{travel.user.name}</h3>
                    <p className="text-sm text-gray-500">Traveler</p>
                  </div>
                </div>

                {/* Travel Details */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-medium">{travel.destination}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-purple-600" />
                    <span>{new Date(travel.departureTime).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-purple-600" />
                    <span>{travel.currentPassengers}/{travel.maxPassengers} passengers</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Car className="w-4 h-4 mr-2 text-purple-600" />
                    <span>{travel.preferredMode.join(', ')}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6 flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTravel(travel)}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    View Details
                  </motion.button>
                  {travel.user.id !== user?.id && travel.currentPassengers < travel.maxPassengers && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleJoinRide(travel.id)}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Join
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Travel Details Modal */}
      {selectedTravel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTravel(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Travel Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-purple-600" />
                <span>{selectedTravel.user.name}</span>
              </div>
              
              {selectedTravel.user.mobile && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-purple-600" />
                  <span>{selectedTravel.user.mobile}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-purple-600" />
                <span>{selectedTravel.destination}</span>
              </div>
              
              <div className="flex items-center">
                <Car className="w-5 h-5 mr-3 text-purple-600" />
                <span>{selectedTravel.preferredMode.join(', ')}</span>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setSelectedTravel(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              {selectedTravel.user.id !== user?.id && (
                <button
                  onClick={() => {
                    handleJoinRide(selectedTravel.id);
                    setSelectedTravel(null);
                  }}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Join Ride
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
