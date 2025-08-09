// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // <- tämä korvaa 'tailwindcss': {}
    autoprefixer: {},
  },
};