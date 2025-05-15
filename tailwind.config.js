/** @type {import('tailwindcss').Config} */
export default {
  screens: {
    xs: '475px', // Extra-small devices (small mobiles)
  },
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [],
};
