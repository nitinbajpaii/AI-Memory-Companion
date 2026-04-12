import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, className = '', error, required = false }) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-300 ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          px-4 py-3 rounded-2xl bg-white/5 border border-white/10 
          text-white placeholder:text-gray-500 
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 
          transition-all duration-300 backdrop-blur-md
          ${error ? 'border-red-500 ring-red-500/50' : ''}
        `}
      />
      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  );
};

export default Input;
