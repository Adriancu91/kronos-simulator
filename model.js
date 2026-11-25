/* === MODEL START === */
const HW = { vramMiB: 8192, ramGB: 128, nuclee: 18, link: { x16: 12.4e9, x8: 6.0e9 }, wati: 290, textOcteti: 4885859040 };
const TOK = {
  oct:   { V: 256,    bps: 1.0,   mbs: 200, idB: 1, nume: 'Litere (octeți)' },
  bpe8:  { V: 8192,   bps: 3.2,   mbs: 1.5, idB: 2, nume: 'BPE 8.192' },
  bpe16: { V: 16384,  bps: 3.643, mbs: 1.5, idB: 2, nume: 'BPE 16.384' },
  bpe32: { V: 32768,  bps: 4.0,   mbs: 1.5, idB: 2, nume: 'BPE 32.768' },
  cuv:   { V: 200000, bps: 5.4,   mbs: 8,   idB: 4, nume: 'Cuvinte întregi cu ID' }
};
const E_WIN = { bf16: 28.1, f32: 12.5 };
// tile: MĂSURAT os-410 (24 nov): 428,7 ms pe pasul #513 2×512. tc/umbra/int8: estimările vechi × 0,38 (cât a ieșit tile față de estimarea lui) — ESTIMARE.
// t128: MĂSURAT os-418 (25 nov): mm_tv_128x128 294,9 ms pe pasul #513 2×512.
const E_OS = { train: 1.245, tile: 2.1, t128: 3.05, tc: 4.6, umbra: 10.3, int8: 18.2 };
const ATT_OS = { baza: 29.8e-6, placi3: 1.67e-6, tc: 0.5e-6 };
const STANDARD = {
  sistem: 'win', mmWin: 'bf16', mmOs: 'train', atentie: 'baza', colsum: false, lipit: false, masura: false, arena: '6g',
  putere: 100, straturi: 12, latime: 768, context: 512, croit: false, tok: 'bpe16',
  lot: 12, adunare: 8, recalcul: false, mvRam: false, unica: false, paralel: true, slot: 'x16',
  date: 'ram', tokLive: false, fire: 4, caiet: 0, esantion: false, bucati: 1
};
function calc(S) {
  const t = TOK[S.tok], d = S.latime, L = S.straturi, T = S.context, B = S.lot, V = t.V;
  const os = S.sistem === 'os', mm = os ? S.mmOs : S.mmWin;
  const N = B * T, capete = d / 64, link = HW.link[S.slot];
  const Pm = L * 12 * d * d, P = L * (12 * d * d + 13 * d) + V * d + T * d + 2 * d;
  const es = S.esantion ? 0.125 : 1, p = S.putere / 100, pf = Math.pow(p, 0.35);
  const fStr = N * L * 24 * d * d, fCap = N * 2 * V * d * es, fAtt = N * L * 4 * T * d;
  const rc = S.recalcul ? 1 : 0;
  const fMat = 3 * (fStr + fCap) + rc * fStr, fAt = (3 + rc) * fAtt;
  const bAct = !os ? (mm === 'bf16' ? 2 : 4) : (mm === 'umbra' || mm === 'int8' ? 2 : 4);
  let tMM, tAT, tAlte, tOpt, tMut = 0;
  if (!os) {
    const E = E_WIN[mm] * 1e12 * (N / (N + 128)) * pf * (S.croit ? 1.05 : 1);
    tMM = fMat / E; tAT = fAt / E;
    tAlte = (L * 0.6 + 3) / 1000;
    tOpt = P * 4 * 12 / 300e9 / S.adunare;
  } else {
    const E = E_OS[mm] * 1e12 * (N / (N + 512)) * pf * (S.masura ? 1.2 : 1) * (S.croit ? 1.15 : 1);
    tMM = fMat / E;
    const sc = (d / 768) / pf, tl = N * L * (1 + rc / 3);
    tAT = tl * ATT_OS[S.atentie] * (T / 512) * sc * (S.masura ? 0.85 : 1);
    const usor = (S.masura ? 0.7 : 1) * (bAct === 2 ? 0.6 : 1) * (S.croit ? 0.75 : 1);
    tAlte = tl * ((S.colsum ? 0.3e-6 : 1.98e-6) + 0.5e-6 * (S.lipit ? 0.7 : 1)) * sc * usor + L * 0.0003 * (S.lipit ? 0.97 : 1) + 0.00028;
    if (S.mvRam) {
      const x = 2 * P * 4 / link + P * 4 * 5 / 40e9;
      tOpt = 0; tMut += x * (S.paralel ? 0.1 : 1) / S.adunare;
    } else tOpt = P * 4 * 5 / 300e9 / S.adunare;
  }
  const tGpu = tMM + tAT + tAlte + tOpt;
  // date
  const tCit = B * { hdd: 9e-3, ssd: 0.15e-3, ram: 3e-6, vram: 0 }[S.date];
  const tTok = S.tokLive ? N * t.bps / (t.mbs * 1e6 * S.fire) : 0;
  const tUrc = S.date === 'vram' ? 0 : N * t.idB / link + 5e-5;
  const oCaiet = S.caiet > 0 ? 2 * N * d * 2 : 0;
  const tCaietCpu = oCaiet * 4 / 40e9, tCaietLink = 2 * oCaiet / link;
  const cpuMunca = tCit + tTok + tUrc + tCaietCpu;
  const tDate = S.paralel ? Math.max(0, cpuMunca - tGpu) : cpuMunca;
  tMut += tCaietLink * (S.paralel ? 0.3 : 1);
  // VRAM (MiB)
  const MiB = 1048576;
  const kOpt = !os ? 2 : (S.mvRam ? 0 : 2);
  const kLucru = !os ? 3 : 1 + (mm === 'umbra' ? 0.5 : mm === 'int8' ? 0.25 : 0);
  const a = 8 * d * bAct + capete * T * bAct;
  const v = {
    greutati: P * 4 / MiB,
    lucru: kLucru * P * 4 / MiB,
    optim: kOpt * P * 4 / MiB,
    activari: (S.recalcul ? N * a + L * N * d * 4 : N * L * a) / MiB,
    iesire: N * V * es * (bAct + 8) / MiB,
    date: S.date === 'vram' ? HW.textOcteti / t.bps * t.idB / MiB : 0,
    sistem: os ? 296 : 990
  };
  const nevoie = v.greutati + v.lucru + v.optim + v.activari + v.iesire + v.date + v.sistem;
  const buget = !os ? 7000 : (S.arena === 'tot' ? 7900 : 6144);
  let incape = nevoie <= buget, varsat = 0;
  if (!incape && os && S.unica) { varsat = nevoie - buget; incape = true; tMut += 2 * varsat * MiB / link; }
  // RAM (GB)
  const GB = 1e9;
  const r = {
    sistem: os ? 1 : 8,
    date: S.date === 'ram' ? HW.textOcteti / t.bps * t.idB / GB : (S.date === 'vram' ? 0 : 0.5),
    caiet: S.caiet,
    optim: os && S.mvRam ? 2 * P * 4 / GB : 0,
    varsat: varsat * MiB / GB
  };
  const ram = r.sistem + r.date + r.caiet + r.optim + r.varsat;
  const ramOk = ram <= HW.ramGB - 4;
  const tLot = tGpu + tDate + tMut;
  const bucF = { 1: 1, 2: 1.43, 4: 1.9 }[S.bucati];
  const incarcare = Math.min(0.98, tGpu / tLot);
  const temp = 36 + 27.5 * incarcare * p, wati = 25 + 265 * incarcare * p;
  const porneste = incape && ramOk && temp < 83;
  const simb = porneste ? N / tLot * bucF : 0;
  const invata = 1 + 0.2 * S.caiet / (S.caiet + 8);
  const parti = [
    { k: 'mm', n: 'Înmulțiri de matrice', t: tMM }, { k: 'at', n: 'Atenție', t: tAT },
    { k: 'alte', n: 'Alte programe', t: tAlte }, { k: 'opt', n: 'Optimizator', t: tOpt },
    { k: 'date', n: 'Așteptat după date', t: tDate }, { k: 'mut', n: 'Mutări RAM ↔ placă', t: tMut }
  ];
  let gat = parti[0]; parti.forEach(x => { if (x.t > gat.t) gat = x; });
  return {
    N, P, Pm, capete, V, bps: t.bps, tLot, parti, gat: gat.k, simb, textKB: simb * t.bps / 1000,
    oreText: simb ? HW.textOcteti / (simb * t.bps) / 3600 : Infinity,
    tflop: porneste ? (3 * (fStr + fCap + fAtt)) / tLot / 1e12 * bucF : 0,
    v, nevoie, buget, incape, varsat, r, ram, ramOk, incarcare, temp, wati, porneste, invata,
    simbPas: N * S.adunare, vedeLitere: T * t.bps, tCit, tTok,
    trafic: (porneste ? ((S.date === 'vram' ? 0 : N * t.idB) + 2 * oCaiet + 2 * varsat * MiB + (os && S.mvRam ? 2 * P * 4 / S.adunare : 0)) / tLot : 0),
    munca: simb * t.bps * Pm * invata,
    simbPeParam: HW.textOcteti / t.bps / P
  };
}
function scor(S) { const a = calc(S), b = calc(STANDARD); return Math.round(100 * a.munca / b.munca); }
/* === MODEL END === */
if (typeof module !== 'undefined') module.exports = { calc, scor, STANDARD, TOK, HW };
