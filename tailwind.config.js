module.exports = {
  content: [
    "./src/**/*.{html,ts,css}", // Asegúrate de incluir todos los archivos relevantes
  ],
  theme: {
    extend: {
      colors: {
        "blue_main": "#006D77", // Definiendo el color azul principal
      },
    },
  },
  plugins: [
    // Plugin para crear clases con !important
    function({ addUtilities }) {
      addUtilities({
        '.bg-blue_main-important': {
          backgroundColor: '#006D77 !important', // Aplicando !important
        }
      }, ['responsive', 'hover']);
    }
  ],
}
