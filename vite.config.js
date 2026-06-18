import { defineConfig } from 'vite'

// Configuración mínima para un proyecto vanilla (HTML + CSS + JS).
// `base: './'` genera rutas relativas en el build, por lo que el sitio
// funciona tanto servido en la raíz como en una subcarpeta (ej. GitHub Pages).
export default defineConfig({
  base: './',
})
