import React from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  error,
  helperText,
  required = false,
  icon = null,
  rightElement = null,
  disabled = false,
  ...rest
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-300 ml-0.5 flex items-center gap-1">
          {label}
          {required && <span className="text-primary text-xs">*</span>}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors duration-200 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={[
            'w-full rounded-2xl bg-white/5 text-white placeholder:text-gray-600',
            'border transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            icon ? 'pl-12 pr-4 py-3.5' : 'px-4 py-3.5',
            rightElement ? 'pr-12' : '',
            error
              ? 'border-red-500/50 ring-1 ring-red-500/30 bg-red-500/5'
              : 'border-white/8 hover:border-white/15',
          ].join(' ')}
          {...rest}
        />

        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-400 ml-0.5 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="text-xs text-gray-500 ml-0.5">{helperText}</span>
      )}
    </div>
  );
};

export default Input;
