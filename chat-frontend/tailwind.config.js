/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        head: "'Space Mono'"
      },
      colors: {
        danger: '#cf3f3f',
        primary: "#2751ac",
        "primary-300": "#2751ac"
      }
    },
  },
  plugins: [],
}

