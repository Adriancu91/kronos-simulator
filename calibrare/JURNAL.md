# Jurnalul calibrării

Ce se măsoară pe placă se citește din hub (doar citit). Datele proiectelor Kronos, OS și GPU nu se schimbă de aici.

## 24 nov 2026
- **Verificarea pe istoric (12 cifre):** eroare medie 0,6 %, niciuna peste 10 %. Atenție: e pe aceleași date pe care am reglat modelul, deci arată doar că modelul le poate reproduce, nu că prevede.
- **Reglaje:** +0,28 ms timp al procesorului pe pas în OS (pasul întreg față de placă, os-390/397); efectul lipirii coborât (os-392: −0,7 %, nu −10 %); memoria Windows despărțită în alocat (5.187 MB măsurat) + ~990 MiB ecran și rezervă (nvidia-smi 5.936); zona de lucru a motorului 296 MiB (arena os-395 = 2.560 MiB).
- **Previziuni scrise** pentru 7 teste care vin: `PREVIZIUNI.md`.
