import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { hasRole } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['admin', 'analyst', 'viewer'] },
    { name: 'Transactions', href: '/transactions', icon: CurrencyDollarIcon, roles: ['admin', 'analyst'] },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, roles: ['admin', 'analyst'] },
    { name: 'Users', href: '/users', icon: UsersIcon, roles: ['admin'] },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    hasRole(item.roles)
  );

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-indigo-600">FinanceApp</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    ({ isActive }) =>
                      isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;