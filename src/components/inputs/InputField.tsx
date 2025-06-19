'use client';

import React from 'react';
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegister,
} from 'react-hook-form';

interface Option {
  label: string;
  value: string;
}

interface InputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  inputType?: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  type?: string; // Used for <input type="...">
  register: ReturnType<UseFormRegister<any>>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  options?: Option[]; // For select and radio inputs
  multiple?: boolean; // For file inputs
  value?: string;
  defaultChecked?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  placeholder = '',
  inputType = 'input',
  type = 'text',
  register,
  error,
  options = [],
  multiple = false,
  value,
  defaultChecked,
}) => {
  const inputClass = `input ${error ? 'input-error' : 'input-success'}`;

  return (
    <div className="mb-3">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-900"
      >
        {label}
      </label>

      {/* Input field variations */}
      {inputType === 'input' && (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...register}
          className={inputClass}
        />
      )}

      {inputType === 'textarea' && (
        <textarea
          id={id}
          rows={4}
          placeholder={placeholder}
          {...register}
          className={inputClass}
        />
      )}

      {inputType === 'select' && (
        <select id={id} {...register} className={inputClass}>
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {inputType === 'checkbox' && (
        <input
          id={id}
          type="checkbox"
          {...register}
          className="checkbox"
          value={value}
          defaultChecked={defaultChecked}
        />
      )}

      {inputType === 'radio' && options.length > 0 && (
        <div className="space-y-1">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-center space-x-2"
            >
              <input
                type="radio"
                value={opt.value}
                {...register}
                className="radio"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {inputType === 'file' && (
        <input
          id={id}
          type="file"
          {...register}
          multiple={multiple}
          className="file-input"
        />
      )}

      {/* Error message */}
      {error && 'message' in error && (
        <p className="text-red-500 text-sm mt-1">{String(error.message)}</p>
      )}
    </div>
  );
};

export default InputField;
