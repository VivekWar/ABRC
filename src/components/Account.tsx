'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Hash, BookOpen, Camera, Save, Edit } from 'lucide-react';

interface AccountProps {
  user: any;
  setUser: (user: any) => void;
}

export default function Account({ user, setUser }: AccountProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    rollNumber: user?.rollNumber || '',
    branch: user?.branch || '',
    photo: user?.photo || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        localStorage.setItem('user', JSON.stringify(updatedUser.user));
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({...formData, photo: e.target?.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold mb-1">My Account</h1>
              <p className="opacity-90">Manage your profile information</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{formData.name}</h2>
              <p className="text-gray-600">{formData.email}</p>
              {formData.branch && (
                <p className="text-sm text-purple-600 font-medium">{formData.branch}</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  disabled={true} // Email should not be editable
                  value={formData.email}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Enter your mobile number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-2" />
                  Roll Number
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Enter your roll number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Branch/Department
                </label>
                <select
                  disabled={!isEditing}
                  value={formData.branch}
                  onChange={(e) => setFormData({...formData, branch: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                >
                  <option value="">Select your branch</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Material Science and Engineering">Material Science and Engineering</option>
                  <option value="BSBE">BSBE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {isEditing && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </motion.button>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
