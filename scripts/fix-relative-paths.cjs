// Script para reemplazar paths absolutos por relativos en el HTML generado por SvelteKit/Vite
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../.vite/renderer/main_window/index.html');

if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  // Reemplaza href="/_app por href="./_app
  html = html.replace(/href="\/_app/g, 'href="./_app');
  // Reemplaza import("/_app por import("./_app
  html = html.replace(/import\("\/_app/g, 'import("./_app');
  // Reemplaza src="/_app por src="./_app
  html = html.replace(/src="\/_app/g, 'src="./_app');
  // Reemplaza favicon y otros assets en la raíz
  html = html.replace(/href="\/(favicon|static)/g, 'href="./$1');
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Paths relativos corregidos en index.html');
} else {
  console.error('No se encontró index.html en la ruta esperada:', htmlPath);
  process.exit(1);
}
