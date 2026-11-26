# Jurnalul calibrării

Ce se măsoară pe placă se citește din hub (doar citit). Datele proiectelor Kronos, OS și GPU nu se schimbă de aici.

## 24 nov 2026
- **Verificarea pe istoric (12 cifre):** eroare medie 0,6 %, niciuna peste 10 %. Atenție: e pe aceleași date pe care am reglat modelul, deci arată doar că modelul le poate reproduce, nu că prevede.
- **Reglaje:** +0,28 ms timp al procesorului pe pas în OS (pasul întreg față de placă, os-390/397); efectul lipirii coborât (os-392: −0,7 %, nu −10 %); memoria Windows despărțită în alocat (5.187 MB măsurat) + ~990 MiB ecran și rezervă (nvidia-smi 5.936); zona de lucru a motorului 296 MiB (arena os-395 = 2.560 MiB).
- **Previziuni scrise** pentru 7 teste care vin: `PREVIZIUNI.md`.

## 24 nov 2026, 20:20 (centrul de comandă; Adrian: „mai bine faci tu modificările, tu ești mereu la zi”)
- **Primul test nevăzut (os-410):** prezis 225 ms/pas, real 475,7 ms → eroare −53 %. Cauza: viteza lui `mm_train_tile` era estimarea Cyber-GPU (5,5 TFLOP/s eficient), pe placă ~2,1 (în unitățile modelului).
- **Reglaj:** `E_OS.tile` 5,5 → **2,1** (MĂSURAT). `tc`, `umbra`, `int8` erau estimări făcute la fel → înmulțite cu 0,38 (12 → 4,6; 27 → 10,3; 48 → 18,2), notate ESTIMARE. Se înlocuiesc cu cifre măsurate când programele trec pe placă.
- **Cazuri noi în istoric:** `os-410`, `os-410-mm`. Verificarea: eroare medie 0,7 %, niciuna peste 10 % (14 cifre).
- **Avertisment nou în pagină:** când textul are sub ~10 simboluri pe parametru (modelul e prea mare pentru datele noastre). Scorul nu e schimbat — crește în continuare cu mărimea modelului, de știut când te joci.
- Fișierul lui Adrian cu scorul 375 (lățime 1 536, 8 biți, bucăți de 4, caiet 42 GB): verificat după reglaj, vezi mai jos.
  - același fișier, model v1.2: **scor 375 → 178**, 13 754 simb/s (8 biți, bucăți și caietul rămân ESTIMĂRI); textul ar da doar 3,1 simboluri pe parametru.
  - aceeași rețetă cu lățimea 768 (mărimea lui #513): scor 153, ~47 000 simb/s (tot pe estimări).
  - doar ce e măsurat azi pe placă (`mm_train_tile`, fără 8 biți / bucăți / caiet / eșantion), restul setărilor lui: scor 8, ~2 950 simb/s.

## 24 nov 2026, 21:30 (centrul de comandă)
- **os-412, al doilea test nevăzut:** `colsum` împărțit — prezis (v1.2) 469 ms, real **473,5 ms → −1,0 %**. Fără reglaj.
- Reperul os-412 (același pas ca os-410, cu ceasul procesorului reparat): 494,9 ms în loc de 475,7 — diferența e ceasul vechi greșit cu ~3,5 %, nu placa. Cazul `os-410` (pasul întreg) înlocuit cu `os-412-reper`; `os-410-mm` rămâne (ceasul plăcii era corect).
- Verificarea: 15 cifre, eroare medie 0,6 %, niciuna peste 10 %.

## 24 nov 2026, 23:00 (centrul de comandă) — măsurătoare, fără reglaj
- os-413 (cursa de noapte), forma qkv 1024×2304×768: `mm_train_tile` 1,27 TFLOP/s, `mm_tv_128x128` **1,91 TFLOP/s** (×1,50, aceiași biți). `mm_tv_64x64k8` blocată. `E_OS.tile` rămâne 2,1 până când varianta e legată în pas și măsurată pe tot pasul.

## 25 nov 2026, 02:10 (centrul de comandă) — măsurătoare, fără reglaj
- os-416, cursa completă: `mm_tv_128x128` cea mai rapidă pe toate cele 15 forme (~1,9–2,1 TFLOP/s; martorul ~1,3). Câștig estimat pe pas −141 ms (474 → ~333). Previziune pentru legarea în pas (model v1.2 cu `E_OS.tile` × 1,5 doar ca socoteală): ~333 ms; `E_OS.tile` rămâne 2,1 până la măsurătoarea pe pas.

## 25 nov 2026, 05:05 (centrul de comandă) — v1.3
- **os-418:** `mm_tv_128x128` legată în pasul #513: pasul întreg **338,4 ms = 3 026 simb/s**, înmulțirile 294,9 ms (90 %). Prezis din cursă (DEDUS): ~333 ms → eroare −1,6 %.
- Model v1.3: opțiune nouă `t128` (Plăci mari 128×128), `E_OS.t128 = 3,05` MĂSURAT din os-418. Cazuri noi `os-418`, `os-418-mm`.

## 25 nov 2026, 11:10 (centrul de comandă) — v1.3.1
- **os-423 `--mm-tc` (proba os-352):** `mm_tc` pe placă = biți exacți (6/6), dar qkv-513 **1,02 TFLOP/s** (Cyber-GPU prezicea 8–17; simulatorul presupunea ×1,5 peste `t128`).
- Reglaj: `E_OS.tc` 4,6 → **1,56** (= 3,05 × 1,02 / 1,96, MĂSURAT izolat pe qkv, raportat la `128x128` din același fel de măsurătoare). `umbra` și `int8` rămân estimări (nemăsurate) — de privit cu grijă: aceeași frână a ocupării le-ar lovi și pe ele.
- Cauza probabilă (DEDUS): ocuparea — 128 de fire + 24 KiB partajați → 4 grupuri de fire din 48 pe unitate. Proba ocupării rulează acum (os-423).

## 25 nov 2026, 11:45 (centrul de comandă) — os-423 proba ocupării
- MĂSURAT pe qkv: `mm_train_tile` 1,27 → 3,48 TFLOP/s (64 KiB), `64x64k8` 2,04 → 3,61 (32 KiB), `128x128` 1,91 → 2,84 (16 KiB). Ocuparea era frâna (H1).
- Modelul nu se schimbă încă (opțiunile lui descriu programele de azi). PREVIZIUNE scrisă înainte de testul cu treapta legată în pas: înmulțirile ~155–165 ms, **pasul #513 ~200 ms ≈ 5 000 simb/s** (DEDUS, din 294,9 ms × 1,91/3,6 + restul de 43,5 ms).

## 25 nov 2026, 14:35 (centrul de comandă) — v1.4
- **os-431:** pasul #513 cu `128x128` + treapta 64 KiB pe tot pasul: **266,8 ms = 3 837 simb/s** (din 338,4). Previziunea scrisă înainte: 200–250 ms → **prea optimistă** (am presupus cea mai bună variantă pe formă; pasul a folosit încă alegerea veche, `128x128` peste tot, limitată de registre).
- Opțiune nouă `t128tr` (Plăci mari + mai multe echipe pe unitate), `E_OS.t128tr = 4,03` (înmulțirile deduse 223,3 ms din pasul întreg; restul de 43,5 ms din os-418). Caz nou `os-431`.

## 25 nov 2026, 20:40 (centrul de comandă) — circuitele speciale măsurate
- os-437: `mm_tc_pf` qkv-513 2,76 TFLOP/s; os-438: **`mm_tc_v4` 4,59 TFLOP/s** (×4,46 față de `mm_tc` 1,02). `E_OS.tc` rămâne 1,56 (descrie `mm_tc` vechi); opțiunea pentru pasul mixt rapid se adaugă după primul pas măsurat (P6-214).
- os-437 lotul 6: pasul întreg 656,4 ms = 4 680 simb/s (lotul 2: 3 837).

- 25 nov 21:25: os-443 — treapta 64 KiB pe `mm_tc*`: `mm_tc_v4@64k` **8,28 TFLOP/s** (×1,81 față de 4,58), `mm_tc_pf@64k` 4,85. Opțiunea „pasul mixt rapid” se adaugă după primul pas măsurat.

- 25 nov 22:15: os-445 — **pasul mixt rapid #513: 116,9 ms = 8 758 simb/s** (lot 2, 147/147 `mm_tc_v4` la 64 KiB). Previziunea etapei 1 (10 000–15 000 cu lot mare): pe drum. Opțiune nouă în model: de adăugat (pas mixt rapid) la următoarea calibrare.

## 26 nov 2026, 07:55 (centrul de comandă) — os-456
- Pas mixt rapid #513: lot 2 117,5 ms (8 713), prin RAM 112,9 ms (9 073), **lot 6 293,1 ms = 10 480 simb/s**. Profil MĂSURAT: `mm_tc_v4` 73,6 ms / 147 lansări, atenția 20,5 ms, optimizatorul 4,8 ms. Opțiunile „pas mixt rapid” și „lot 6” de adăugat în model la următoarea calibrare.
