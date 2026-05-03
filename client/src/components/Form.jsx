import React from 'react';

export function FormGroup({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function Label({ htmlFor, children, required = false }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  error,
  ...props
}) {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </>
  );
}

export function Select({
  value,
  onChange,
  onBlur,
  disabled = false,
  error,
  children,
  ...props
}) {
  return (
    <>
      <select
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </>
  );
}

export function Textarea({
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  error,
  rows = 4,
  ...props
}) {
  return (
    <>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        rows={rows}
        className={`input resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''} ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </>
  );
}

export function FormError({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
      {message}
    </div>
  );
}

export function FormSuccess({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
      {message}
    </div>
  );
}
