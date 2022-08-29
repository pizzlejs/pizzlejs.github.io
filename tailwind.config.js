module.exports = {
  content: ['./src/**/*.{js,html}', './index.html'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography')
  ],
}
