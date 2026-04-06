import React from 'react';

const RoleBadge = ({ role }) => {
  const getRoleConfig = (role) => {
    const config = {
      admin: { color: 'bg-purple-100 text-purple-800', label: 'Administrator' },
      analyst: { color: 'bg-blue-100 text-blue-800', label: 'Analyst' },
      viewer: { color: 'bg-gray-100 text-gray-800', label: 'Viewer' }
    };
    return config[role] || config.viewer;
  };

  const config = getRoleConfig(role);

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

export default RoleBadge;