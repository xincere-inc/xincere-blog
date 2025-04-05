'use client'

import { useState } from 'react'
import { FieldError, FieldErrorsImpl, Merge, UseFormRegister } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

interface PasswordFieldProps {
  id: string
  label: string
  placeholder: string
  register: ReturnType<UseFormRegister<any>>
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  value: string
  isPassword?: boolean
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  placeholder,
  register,
  error,
  value,
  isPassword = false
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = () => setShowPassword((prev) => !prev)

  const hasUpperCase = /[A-Z]/.test(value)
  const hasLowerCase = /[a-z]/.test(value)
  const hasNumber = /\d/.test(value)
  const hasSpecialChar = /[@$!%*?&#]/.test(value)
  const isMinLength = value.length >= 8

  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className={`input relative flex items-center ${error ? 'input-error' : 'input-success'} `}>
        <input
          onPaste={(e) => {
            e.preventDefault()
            return
          }}
          id={id}
          type={showPassword ? 'text' : 'password'}
          {...register}
          placeholder={placeholder}
          className="w-full placeholder:text-gray-500 focus:outline-none"
        />
        <button type="button" className="absolute right-3 cursor-pointer" onClick={togglePassword}>
          {showPassword ? <FaEyeSlash className='w-4' /> : <FaEye className='w-4' />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{String(error.message)}</p>}

      {/* Validation Messages (Only for the primary password field) */}
      {isPassword && value && (
        <div className="mt-2 text-sm">
          <p className={`${hasUpperCase ? 'text-green-500' : 'text-red-500'}`}>✔ At least 1 uppercase letter</p>
          <p className={`${hasLowerCase ? 'text-green-500' : 'text-red-500'}`}>✔ At least 1 lowercase letter</p>
          <p className={`${hasNumber ? 'text-green-500' : 'text-red-500'}`}>✔ At least 1 number</p>
          <p className={`${hasSpecialChar ? 'text-green-500' : 'text-red-500'}`}>✔ At least 1 special character</p>
          <p className={`${isMinLength ? 'text-green-500' : 'text-red-500'}`}>✔ Minimum 8 characters</p>
        </div>
      )}
    </div>
  )
}

export default PasswordField
