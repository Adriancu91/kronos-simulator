// node build.js → index.html din ui.html + model.js (pagina rămâne un singur fișier)
const fs = require('fs');
const m = fs.readFileSync(__dirname + '/model.js', 'utf8').split('/* === MODEL START === */')[1].split('/* === MODEL END === */')[0].trim();
fs.writeFileSync(__dirname + '/index.html', fs.readFileSync(__dirname + '/ui.html', 'utf8').replace('/*MODEL*/', m));
console.log('index.html refăcut');
