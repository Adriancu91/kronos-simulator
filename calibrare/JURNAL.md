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
