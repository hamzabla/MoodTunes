import React from 'react';

const PageLayout = ({ 
  children, 
  background = "from-purple-900 via-blue-900 to-indigo-900",
  className = ""
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${background} ${className}`}>
      {children}
    </div>
  );
};

export default PageLayout;
