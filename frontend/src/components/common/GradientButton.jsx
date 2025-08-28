import React from 'react';

const GradientButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  className = '',
  size = 'md',
  ...props 
}) => {
  const baseClasses = "font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white focus:ring-green-500",
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white focus:ring-purple-500",
    secondary: "bg-white bg-opacity-20 hover:bg-opacity-30 text-white backdrop-blur-sm focus:ring-white",
    outline: "border-2 border-white text-white hover:bg-white hover:text-gray-900 focus:ring-white"
  };

  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-4 px-8 text-base",
    lg: "py-5 px-10 text-lg"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;