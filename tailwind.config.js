// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Averta: ["AvertaStd", "sans-serif"],
      },
      colors: {
        "primary-light": "#D9D9D9",
        "primary-black": "#262626",
        "danger-red": "#DD4848",
        "success-green": "#5CB85C",
      },
    },
  },
  plugins: [],
};
