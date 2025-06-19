'use client';
import ApiAuth from '@/api/ApiAuth';
import { RegisterRequest } from '@/api/client';
import ApiAuth from '@/api/ApiAuth';
import InputField from '@/components/inputs/InputField';
import PasswordField from '@/components/inputs/PasswordField';
import Image from 'next/image';

import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
import countries from 'world-countries';

interface CountryOption {
  value: string;
  label: string;
  code: string;
  countryName: string;
}

interface GenderOption {
  value: string;
  label: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    control,
    formState: { errors },
  } = useForm<RegisterRequest>({
    mode: 'onChange',
  });

  const countryOptions: CountryOption[] = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
    code: country.cca2,
    countryName: country.name.common,
  }));

  const genderOptions: GenderOption[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'others', label: 'Others' },
  ];

  const onSubmit: SubmitHandler<RegisterRequest> = async (formData) => {
    try {
      setLoading(true);
      // Call your API to register the user here
      const response = await ApiAuth.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        gender: formData.gender,
        confirmPassword: formData.confirmPassword,
      });

      if (response.status === 201) {
        toast.success(response.data.message, {
          position: 'bottom-right',
          autoClose: 3000, // Auto-close after 3 seconds
        });
        // redirect to the root page after 3 seconds
        setTimeout(() => {
          router.push('/signin');
        }, 3000);
      } else {
        toast.error('Error during register', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      }

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          err.response?.data.errors.forEach((error: any) => {
            if (error.path === 'email') {
              setError(error.path, {
                type: 'manual',
                message: error.message,
              });
            }
          });
        } else {
          toast.error(err.response?.data.message, {
            position: 'bottom-right',
            autoClose: 3000,
          });
        }
      } else {
        toast.error('Error during register', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Name Fields */}
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <div className="w-full sm:w-1/2">
          <InputField
            id="firstName"
            label="First Name"
            placeholder="John"
            register={register('firstName', {
              required: 'First name is required',
              pattern: {
                value: /^[a-zA-Z ]*$/i,
                message: 'First name must contain only letters and spaces',
              },
              maxLength: {
                value: 50,
                message: 'First name must be at most 50 characters long',
              },
            })}
            error={errors.firstName}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <InputField
            id="lastName"
            label="Last Name"
            placeholder="Doe"
            register={register('lastName', {
              required: 'Last name is required',
              pattern: {
                value: /^[a-zA-Z ]*$/i,
                message: 'Last name must contain only letters and spaces',
              },
              maxLength: {
                value: 50,
                message: 'Last name must be at most 50 characters long',
              },
            })}
            error={errors.lastName}
          />
        </div>
      </div>

      {/* Email Field */}
      <InputField
        id="email"
        label="Email"
        type="email"
        placeholder="email@example.com"
        register={register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
            message: 'Invalid email address',
          },
        })}
        error={errors.email}
      />

      {/* gender | country */}
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <div className="mb-2 w-full sm:mb-3 sm:w-1/2">
          <label htmlFor="gender" className="label">
            Gender
          </label>
          <Controller
            key="gender"
            name="gender"
            control={control}
            rules={{ required: 'Please select a gender' }}
            render={({ field }) => (
              <Select
                className="text-xs placeholder:text-gray-400"
                instanceId={'gender'}
                {...field}
                options={genderOptions}
                placeholder="Select Gender"
                value={genderOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(selectedOption) =>
                  field.onChange(selectedOption?.value)
                }
                filterOption={(option, searchText) =>
                  option.value.toLowerCase().includes(searchText.toLowerCase())
                }
              />
            )}
          />
          {errors.gender && (
            <p className="error-message">{String(errors.gender?.message)}</p>
          )}
        </div>

        {/* Country Field */}
        <div className="mb-2 w-full sm:mb-3 sm:w-1/2">
          <label htmlFor="country" className="label">
            Country
          </label>
          <Controller
            key="country"
            name="country"
            control={control}
            rules={{ required: 'Please select a country' }}
            render={({ field }) => (
              <Select
                className="text-xs placeholder:text-gray-400"
                {...field}
                instanceId={'country'}
                options={countryOptions}
                placeholder="Select a country"
                formatOptionLabel={(option: CountryOption) => (
                  <div className="flex items-center gap-2">
                    <Image
                      width={40}
                      height={40}
                      src={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png`}
                      alt={`${option.countryName} Flag`}
                      className="h-5 w-8"
                    />
                    {option.countryName}
                  </div>
                )}
                onChange={(selectedOption) =>
                  field.onChange(selectedOption?.countryName)
                }
                value={countryOptions.find(
                  (option) => option.countryName === field.value
                )}
                filterOption={(option, searchText) =>
                  option.label.toLowerCase().includes(searchText.toLowerCase())
                }
              />
            )}
          />
          {errors.country && (
            <p className="error-message">{String(errors.country?.message)}</p>
          )}
        </div>
      </div>

      {/* Password Fields */}
      <PasswordField
        id="password"
        label="Password"
        placeholder="Enter password"
        register={register('password', {
          required: 'Password is required',
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message: '',
          },
        })}
        isPassword={true}
        error={errors.password}
        value={watch('password', '')}
      />
      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Re-enter password"
        register={register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (value) =>
            value == getValues('password') || 'Passwords do not match',
        })}
        error={errors.confirmPassword}
        value={watch('confirmPassword', '')}
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 hover:shadow-lg"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
