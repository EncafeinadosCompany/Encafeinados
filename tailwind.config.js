/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"], // Habilita el modo oscuro basado en clases
	content: [
	  "./index.html",
	  "./src/**/*.{js,ts,jsx,tsx}", // Aplica Tailwind a todos los archivos dentro de src
	],
	theme: {
	  extend: {
		colors: {
		  // Colores personalizados
		  brown: {
			600: "#8B5E3B",
			800: "#5C3D31",
			900: "#4B2E2E",
		  },
		  amber: {
			100: "#FAE3B0",
			200: "#F8D9A2",
		  },
		  yellow: {
			400: "#F5C45A",
			500: "#E8B923",
			600: "#D4A017",
		  },
		  orange: {
			600: "#D27B49",
			700: "#C26A37",
		  },
		},
		borderRadius: {
		  lg: "var(--radius)", // Corregido: sin backticks (`)
		  md: "calc(var(--radius) - 2px)", // Corregido: sin backticks (`)
		  sm: "calc(var(--radius) - 4px)",
		},
		keyframes: {
		  "accordion-down": {
			from: { height: "0" },
			to: { height: "var(--radix-accordion-content-height)" },
		  },
		  "accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: "0" },
		  },
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		},
	  },
	},
	important: true, // Fuerza a que las clases de Tailwind tengan prioridad
	plugins: [require("tailwindcss-animate")], // Plugin para animaciones
  };