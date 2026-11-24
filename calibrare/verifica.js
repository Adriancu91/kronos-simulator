// Rulează: node calibrare/verifica.js  → tabelul simulat vs real pentru tot istoricul.
const { calc } = require('../model.js');
const STD = require('../model.js').STANDARD;
const cazuri = require('./cazuri.js');
function valoare(r, m) {
  if (m === 'simb') return r.simb;
  if (m === 'ms') return r.tLot * 1000;
  if (m === 'vramTot') return r.nevoie;
  if (m === 'vramFaraSistem') return r.nevoie - r.v.sistem;
  if (m.startsWith('parte:')) return r.parti.find(p => p.k === m.slice(6)).t * 1000;
}
let rau = 0; const rez = [];
for (const c of cazuri) {
  const r = calc({ ...STD, ...c.s }), sim = valoare(r, c.masura), err = (sim - c.real) / c.real * 100;
  if (Math.abs(err) > 10) rau++;
  rez.push({ id: c.id, masura: c.masura, real: +c.real.toFixed(2), simulat: +sim.toFixed(2), eroare_pct: +err.toFixed(1) });
}
console.table(rez);
const med = rez.reduce((a, x) => a + Math.abs(x.eroare_pct), 0) / rez.length;
console.log('eroare medie', med.toFixed(1), '% · peste 10 %:', rau);
if (require.main === module && process.argv.includes('--json')) console.log(JSON.stringify(rez));
module.exports = { rez };
