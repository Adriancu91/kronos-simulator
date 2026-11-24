// Previziunile pentru testele care vin, scrise ÎNAINTE de test. node calibrare/prezice.js
const { calc, STANDARD } = require('../model.js');
const OS = { sistem: 'os', mmOs: 'train', atentie: 'placi3', lot: 2, adunare: 1 };
const teste = [
  ['banc-win-v1', 'Windows banc #513, 2×512, F32, AdamW la fiecare lot', { mmWin: 'f32', lot: 2, adunare: 1 }],
  ['banc-win-v2', 'Windows banc #513, 2×512, bf16, AdamW la fiecare lot', { lot: 2, adunare: 1 }],
  ['banc-win-v3', 'Windows banc #513, 12×512, bf16, AdamW la fiecare lot', { lot: 12, adunare: 1 }],
  ['banc-win-v4', 'Windows banc #513, 12×512, F32, AdamW la fiecare lot', { mmWin: 'f32', lot: 12, adunare: 1 }],
  ['os-mm-tile', 'OS #513, mm_train_tile (--mm-placi), atenția gen 3', { ...OS, mmOs: 'tile' }],
  ['os-mm-tile-colsum', 'OS #513, mm_train_tile + colsum împărțit', { ...OS, mmOs: 'tile', colsum: true }],
  ['os-colsum', 'OS #513, doar colsum împărțit', { ...OS, colsum: true }]
];
const out = teste.map(([id, ce, s]) => { const r = calc({ ...STANDARD, ...s });
  return { id, ce, ms_pe_pas: +(r.tLot * 1000).toFixed(1), simb_s: Math.round(r.simb), mm_ms: +(r.parti[0].t * 1000).toFixed(1), vram_alocat_mib: Math.round(r.nevoie - r.v.sistem), vram_smi_mib: Math.round(r.nevoie), porneste: r.porneste }; });
console.table(out.map(({ ce, ...x }) => x));
module.exports = out;
