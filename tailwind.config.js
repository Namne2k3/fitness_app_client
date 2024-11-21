/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pthin: ["Roboto-Thin"],
        plight: ["Roboto-Light"],
        pregular: ["Roboto-Regular"],
        pmedium: ["Roboto-Medium"],
        psemibold: ["Roboto-Bold"],
        pbold: ["Roboto-Bold"],
        pextrabold: ["Roboto-Bold"],
        pblack: ["Roboto-Black"],
      },
    },
  },
  plugins: [],
}

