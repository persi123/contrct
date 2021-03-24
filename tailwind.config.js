module.exports = {
    purge: ['./src/**/*.js', './public/index.html'],
     darkMode: false, // or 'media' or 'class'
     theme: {
       extend: {},
       fontFamily: {
        'sans': ['DM Sans', 'sans-serif'],
        'body': ['DM Sans']
       },
       backgroundColor: theme => ({
        ...theme('colors'),
        'heading': '#2c3b4a',

       })
     },
     variants: {},
     plugins: []
   }