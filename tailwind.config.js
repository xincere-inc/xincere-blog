/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#427C2E',
        'primary-light': '#E8F0E6',
        'primary-dark': '#356423',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
        },
      },
    },
  },
  plugins: [
    import('@tailwindcss/typography'),
    import('@tailwindcss/forms'),
  ],
};
