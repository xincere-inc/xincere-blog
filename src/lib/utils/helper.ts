type PasswordErrors = {
  minLength: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  specialChar: boolean;
};

export const validatePassword = (password: string): PasswordErrors => {
  return {
    minLength: password.length < 8,
    lowercase: !/[a-z]/.test(password),
    uppercase: !/[A-Z]/.test(password),
    number: !/\d/.test(password),
    specialChar: !/[@$!%*?&]/.test(password),
  };
};
