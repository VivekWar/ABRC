'use client';
import { useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import Layout from '@/components/Layout';
import Home from '@/components/Home';
import Travel from '@/components/Travel';
import About from '@/components/About';
import Report from '@/components/Report';
import Account from '@/components/Account';

// Define proper User interface
interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  rollNumber?: string;
  branch?: string;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function App() {
  // FIXED: Replace any with proper User type
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error: unknown) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      alert('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('home');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home user={user} />;
      case 'travel':
        return <Travel user={user} />;
      case 'about':
        return <About />;
      case 'report':
        return <Report user={user} />;
      case 'account':
        return <Account user={user} setUser={setUser} />;
      default:
        return <Home user={user} />;
    }
  };

  if (!user) {
    return (
      <AuthForm
        onLogin={handleLogin}
        onSignup={handleSignup}
        isLoading={loading}
      />
    );
  }

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      user={user}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
}
