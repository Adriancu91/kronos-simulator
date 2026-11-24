// Testele din istoric: setările simulatorului + ce s-a măsurat (doar citit din hub, rezultate/ și integrare/kronos/).
// masura: 'simb' = simboluri/s pe pasul întreg; 'ms' = ms pe pas (pasul întreg); 'vram' = MiB pe placă.
const W = {}; // = standard (Windows #513)
const OS513 = { sistem: 'os', mmOs: 'train', lot: 2, adunare: 1 };
const MINI = { sistem: 'os', mmOs: 'train', straturi: 2, latime: 64, context: 32, lot: 2, adunare: 1 };
module.exports = [
  { id: 'win-513', sursa: 'FISA_ANTRENARE.md: #513, 23.007 loturi în 3.600 s', s: W, masura: 'simb', real: 39265 },
  { id: 'win-513-vram', sursa: 'FISA_ANTRENARE.md: max_memory_allocated 5.187 MB (fără ecranul Windows)', s: W, masura: 'vramFaraSistem', real: 5187 * 1e6 / 1048576 },
  { id: 'win-651', sursa: 'FISA_ANTRENARE.md: #651, 18.176 loturi în 3.600 s, recalcul', s: { straturi: 24, lot: 6, adunare: 16, recalcul: true }, masura: 'simb', real: 15509 },
  { id: 'win-651-vram', sursa: 'FISA_ANTRENARE.md: max_memory_allocated 5.186 MB', s: { straturi: 24, lot: 6, adunare: 16, recalcul: true }, masura: 'vramFaraSistem', real: 5186 * 1e6 / 1048576 },
  { id: 'os-403', sursa: 'rezultate os-403: #513, atenția de bază, 1.123 ms pe pas', s: { ...OS513, atentie: 'baza' }, masura: 'ms', real: 1123 },
  { id: 'os-403-atentie', sursa: 'rezultate os-403: attn_fwd 212 + attn_back 159 ms', s: { ...OS513, atentie: 'baza' }, masura: 'parte:at', real: 371 },
  { id: 'os-403-mm', sursa: 'rezultate os-403: mm_train 718 ms', s: { ...OS513, atentie: 'baza' }, masura: 'parte:mm', real: 718 },
  { id: 'os-407', sursa: 'rezultate os-407: #513, atenția gen 3, 778 ms pe pas', s: { ...OS513, atentie: 'placi3' }, masura: 'ms', real: 778 },
  { id: 'os-407-atentie', sursa: 'rezultate os-407: atenția 20,5 ms', s: { ...OS513, atentie: 'placi3' }, masura: 'parte:at', real: 20.5 },
  { id: 'os-395-arena', sursa: 'rezultate os-395: arena #513 2×512 = 2.560 MiB în VRAM', s: { ...OS513, atentie: 'baza' }, masura: 'vramTot', real: 2560 },
  { id: 'os-390-mini', sursa: 'rezultate os-390: modelul mic, pasul întreg 4.150 µs', s: MINI, masura: 'ms', real: 4.15 },
  { id: 'os-392-mini-lipit', sursa: 'rezultate os-392: modelul mic lipit, 4.141 µs', s: { ...MINI, lipit: true }, masura: 'ms', real: 4.141 }
];
