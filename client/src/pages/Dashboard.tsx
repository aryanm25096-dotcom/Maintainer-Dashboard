import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Settings, Activity, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Total Projects',
      value: '12',
      change: '+2.5%',
      changeType: 'positive' as const,
      icon: Activity,
    },
    {
      name: 'Active Users',
      value: '1,234',
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
    {
      name: 'API Calls',
      value: '45.2K',
      change: '-3.1%',
      changeType: 'negative' as const,
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-primary-100">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* User Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profile Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Display Name
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.email}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email Address
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Member since today
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Account Created
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left flex items-center space-x-3">
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </button>
            <button className="w-full btn-secondary text-left flex items-center space-x-3">
              <Activity className="w-4 h-4" />
              <span>View Activity</span>
            </button>
            <button className="w-full btn-secondary text-left flex items-center space-x-3">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            {
              action: 'Signed in to your account',
              time: '2 minutes ago',
              icon: User,
            },
            {
              action: 'Updated profile information',
              time: '1 hour ago',
              icon: Settings,
            },
            {
              action: 'Viewed dashboard',
              time: '3 hours ago',
              icon: Activity,
            },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <activity.icon className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
