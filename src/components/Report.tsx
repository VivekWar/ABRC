'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Send, CheckCircle } from 'lucide-react';

interface ReportProps {
  user: any;
}

export default function Report({ user }: ReportProps) {
  const [formData, setFormData] = useState({
    type: '',
    subject: '',
    description: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportTypes = [
    'Technical Issue',
    'User Behavior',
    'Safety Concern',
    'Payment Issue',
    'Feature Request',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          type: '',
          subject: '',
          description: '',
          priority: 'medium'
        });
      } else {
        alert('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Report Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your report. We'll review it and get back to you if needed.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSubmitted(false)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Submit Another Report
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-xl"
      >
        <div className="flex items-center">
          <AlertTriangle className="w-8 h-8 mr-3" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Report an Issue</h1>
            <p className="opacity-90">Help us improve by reporting any problems or concerns.</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select report type</option>
              {reportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Brief description of the issue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['low', 'medium', 'high'].map(priority => (
                <motion.button
                  key={priority}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({...formData, priority})}
                  className={`p-3 rounded-lg border-2 transition-all capitalize ${
                    formData.priority === priority
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                >
                  {priority}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Please provide detailed information about the issue..."
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Submitting...' : 'Submit Report'}</span>
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 p-4 rounded-lg"
      >
        <h3 className="font-semibold text-blue-800 mb-2">Need Immediate Help?</h3>
        <p className="text-blue-700 text-sm">
          For urgent safety concerns, please contact campus security directly or call emergency services.
        </p>
      </motion.div>
    </div>
  );
}
