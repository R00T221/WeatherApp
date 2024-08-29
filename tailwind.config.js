/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*"],
  theme: {

    //Defining custom media queries
    screens:{
      'xsm':'350px',
      
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    /* in extend we here used the self-defined/external color and fonts */
    extend: {
       colors:{
        'colorDark1': '#112D4E',
        'colorDark2': '#3F72AF',
        'colorLight1': '#DBE2EF',
        'colorLight2': '#F9F7F7',
        
       },
     
       borderWidth: {
        '0.35': '0.25rem',
       },
      fontFamily: {
      Merri: ['Merriweather Sans' , 'sans-serif'],
      customo: [
        
      ],
    },
    transitionProperty:{
      'scale':'transform,scale',
    },

    backgroundImage:{
      gradiento:'linear-gradient(160deg,#112d4e 0% ,#3f72af 100%)',
//Since we cant use var colors of css in tailwind,so we use actual values here.Thus instaed of writing linear-gradient('vb-violet,vb-violet),we write their values here which are defined above in 'colors'.
      'slider-gradient':'linear-gradient(hsl(285, 91%, 52%),hsl(285, 91%, 52%))',
    },

  
  }, //extend ends
  },
  corePlugins: {},
  plugins: [],
}
