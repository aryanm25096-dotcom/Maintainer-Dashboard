import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Shield, Zap, Database, Cloud } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Full-Stack Web App
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          A modern full-stack application built with React, TypeScript, Node.js, 
          PostgreSQL, Prisma, and Supabase. Featuring GitHub OAuth authentication 
          and dark theme support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link
              to="/dashboard"
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Secure Authentication
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            GitHub OAuth integration with Supabase for secure user authentication.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Modern Tech Stack
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            React 18, TypeScript, Tailwind CSS, and modern development practices.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Database className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Database Integration
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            PostgreSQL with Prisma ORM for type-safe database operations.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Cloud className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Backend as a Service
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Supabase integration for real-time features and API management.
          </p>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Built With Modern Technologies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            'React 18',
            'TypeScript',
            'Tailwind CSS',
            'Node.js',
            'Express',
            'PostgreSQL',
            'Prisma',
            'Supabase'
          ].map((tech) => (
            <div
              key={tech}
              className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center font-medium text-gray-900 dark:text-white"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
