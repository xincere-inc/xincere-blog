'use client';
import InputField from '@/components/inputs/InputField';
import '@ant-design/v5-patch-for-react-19';
import { Alert, Col, Modal, Row } from 'antd';
import Image from 'next/image';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import countries from 'world-countries';
import PasswordField from '../inputs/PasswordField';
interface UserCreateForm {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  address: string;
  role: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

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

interface UserCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: UserCreateForm) => void;
  loading: boolean;
  serverError?: string | null;
}

export function UserCreateModal({
  visible,
  onCancel,
  onCreate,
  loading,
  serverError,
}: UserCreateModalProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserCreateForm>({
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

  const roleOptions: GenderOption[] = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
  ];

  const onSubmit: SubmitHandler<UserCreateForm> = (formData) => {
    onCreate(formData);
  };

  return (
    <Modal
      title="Create User"
      open={visible}
      onCancel={() => {
        onCancel();
        reset();
      }}
      footer={null}
      destroyOnHidden
      centered
      style={{ margin: '20px 0px' }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div className="mb-4">
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
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="mb-4">
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
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div className="mb-4">
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
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </Col>
          <Col xs={24} sm={12}>
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
                    option.label
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  }
                />
              )}
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div className="mb-4">
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
                      option.value
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                    }
                  />
                )}
              />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="mb-4">
              <label htmlFor="role" className="block mb-1">
                Role
              </label>
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Please select a role' }}
                render={({ field }) => (
                  <Select
                    className="text-xs"
                    instanceId="role"
                    {...field}
                    options={roleOptions}
                    placeholder="Select Role"
                    value={roleOptions.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(selectedOption) =>
                      field.onChange(selectedOption?.value)
                    }
                    filterOption={(option, searchText) =>
                      option.label
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                    }
                  />
                )}
              />
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div className="mb-4">
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="mb-4">
              <InputField
                id="address"
                label="Address"
                placeholder="Enter address"
                register={register('address')}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </Col>
        </Row>

        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 hover:shadow-lg"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create User'}
        </button>

        {serverError && (
          <Row>
            <Col span={24}>
              <Alert
                message={serverError}
                type="error"
                style={{ marginTop: '10px' }}
              />
            </Col>
          </Row>
        )}
      </form>
    </Modal>
  );
}
