# Simulatorul Kronos

Planșa simplificată a workstation-ului, ca un joc de simulare: schimbi rețeta de calcul (sistem și motor, model, tokenizare, lot și matrice, distribuirea între disc, RAM, procesor și placă) și vezi pe loc viteza, memoria și locul unde se pierde timpul.

- Scor 100 = rețeta de azi. Scor 200 = aceeași învățare în jumătate din timp.
- „Resetare la standard” aduce totul înapoi.
- „Descarcă setările” dă un fișier `.json` cu setările și cifrele simulării, bun de trimis la analizat.

Cifrele sunt de simulare, nu măsurători. Fiecare reglaj spune de unde vine cifra lui: MĂSURAT, DEDUS, ESTIMARE sau IPOTEZĂ.

Totul stă într-un singur fișier: `index.html`.

## Pentru agenți
- `model.js` = calculul; `ui.html` = interfața; `node build.js` le pune împreună în `index.html`.
- `node calibrare/verifica.js` = simulatorul față de toate testele măsurate (`calibrare/cazuri.js`).
- `node calibrare/prezice.js` = previziunile pentru testele care vin; `calibrare/PREVIZIUNI.md` le ține scrise dinainte.
- `calibrare/JURNAL.md` = ce s-a reglat și de ce.
