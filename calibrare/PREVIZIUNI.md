# Previziuni scrise înainte de teste

Regula: previziunea se scrie **înainte** de test și nu se mai schimbă. După test se trece cifra reală și eroarea.
Simulatorul e bun de dat agenților când greșește sub ~15 % pe teste pe care **nu** le-a văzut înainte.

Versiunea modelului: v1.1 (24 nov 2026, 18:35).

| Test | Ce | Prezis ms/pas | Prezis simb/s | Memorie placă prezisă | Real | Eroare |
|---|---|---:|---:|---|---|---|
| banc-win-v1 | Windows #513, 2×512, F32, AdamW la fiecare lot | 85 | 12.000 | ~4.000 MiB (nvidia-smi) | | |
| banc-win-v2 | Windows #513, 2×512, bf16, AdamW la fiecare lot | 52 | 19.600 | ~3.700 MiB | | |
| banc-win-v3 | Windows #513, 12×512, bf16, AdamW la fiecare lot | 169 | 36.300 | ~5.900 MiB | | |
| banc-win-v4 | Windows #513, 12×512, F32 | — | **nu încape** (~7.850 MiB > paza de 7.000) | ~7.850 MiB | | |
| os-mm-tile | OS #513, `mm_train_tile`, atenția gen 3 | 225 | 4.550 | 2.560 MiB | | |
| os-mm-tile-colsum | OS #513, `mm_train_tile` + colsum împărțit | 204 | 5.000 | 2.560 MiB | | |
| os-colsum | OS #513, doar colsum împărțit | 763 | 1.340 | 2.560 MiB | | |

Notă: la os-mm-tile, Cyber-GPU a prezis singur 175–295 ms. Simulatorul dă 225, adică la mijloc.
Cea mai îndrăzneață previziune: banc-win-v4 se oprește singur cu „nu încape în 7 GB”.
