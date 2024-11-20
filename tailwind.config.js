/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EAC2CF",
        secondary: {
          DEFAULT: "#5C6898",
          100: "#FF9001",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
        tregular: ["PPTelegraf-Regular", "sans-serif"],
        tultrabold: ["PPTelegraf-UltraBold", "sans-serif"],
        tultralight: ["PPTelegraf-UltraLight", "sans-serif"],
        bblack: ["BarlowSemiCondensed-Black", "sans-serif"],
        bblackitalic: ["BarlowSemiCondensed-BlackItalic", "sans-serif"],
        bbold: ["BarlowSemiCondensed-Bold", "sans-serif"],
        bbolditalic: ["BarlowSemiCondensed-BoldItalic", "sans-serif"],
        bextrabold: ["BarlowSemiCondensed-ExtraBold", "sans-serif"],
        bextrabolditalic: ["BarlowSemiCondensed-ExtraBoldItalic", "sans-serif"],
        bextralight: ["BarlowSemiCondensed-ExtraLight", "sans-serif"],
        bextralightitalic: ["BarlowSemiCondensed-ExtraLightItalic", "sans-serif"],
        bitalic: ["BarlowSemiCondensed-Italic", "sans-serif"],
        blight: ["BarlowSemiCondensed-Light", "sans-serif"],
        blightitalic: ["BarlowSemiCondensed-LightItalic", "sans-serif"],
        bmedium: ["BarlowSemiCondensed-Medium", "sans-serif"],
        bmediumitalic: ["BarlowSemiCondensed-MediumItalic", "sans-serif"],
        bregular: ["BarlowSemiCondensed-Regular", "sans-serif"],
        bsemibold: ["BarlowSemiCondensed-SemiBold", "sans-serif"],
        bsemibolditalic: ["BarlowSemiCondensed-SemiBoldItalic", "sans-serif"],
        bthin: ["BarlowSemiCondensed-Thin", "sans-serif"],
        bthinitalic: ["BarlowSemiCondensed-ThinItalic", "sans-serif"],
        qbold: ["Quicksand-Bold", "sans-serif"],
        qlight: ["Quicksand-Light", "sans-serif"],
        qmedium: ["Quicksand-Medium", "sans-serif"],
        qregular: ["Quicksand-Regular", "sans-serif"],
        qsemibold: ["Quicksand-SemiBold", "sans-serif"],
      },
    },
  },
  plugins: [],
}
