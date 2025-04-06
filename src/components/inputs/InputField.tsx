'use client'

import React from 'react'
import { UseFormRegister, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form'

interface InputFieldProps {
  id: string
  type?: string
  label: string
  placeholder: string
  register: ReturnType<UseFormRegister<any>>
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  // value?: string
}

const InputField: React.FC<InputFieldProps> = ({ id, type = 'text', label, placeholder, register, error }) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        id={id}
        type={type}
        {...register}
        className={`input ${error ? 'input-error' : 'input-success'}`}
        placeholder={placeholder}
      />
      {error && 'message' in error && <p className="error-message">{String(error.message)}</p>}
    </div>
  )
}

export default InputField
