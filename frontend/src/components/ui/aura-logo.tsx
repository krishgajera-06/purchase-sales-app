import React from 'react';

export const AuraLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    className={className}
    fill="none"
  >
    {/* Stylized Red Bulb outline */}
    <path 
      d="M 50 85 C 30 85 15 65 20 40 C 25 15 45 10 65 20 C 80 30 85 50 75 70 C 70 80 60 85 50 85 Z" 
      stroke="hsl(351, 90%, 40%)" 
      strokeWidth="8" 
      fill="transparent"
    />
    <path
      d="M 25 60 C 20 50 20 40 25 30"
      stroke="hsl(351, 90%, 40%)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Black Checkmark inside */}
    <path 
      d="M 35 45 L 45 55 L 65 30" 
      stroke="currentColor" 
      strokeWidth="10" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);
