# Bernov & Dragons — DENÍK_CORE

Deník kampaně Karibrka de Vill. Jedna statická HTML stránka, žádný build, žádné závislosti.

## Nasazení na Vercel
1. Nahraj tenhle repozitář na GitHub.
2. Ve Vercelu: **Add New → Project → Import** tenhle repozitář.
3. Framework Preset: **Other**. Build Command: nechat prázdné. Output Directory: nechat prázdné (root).
4. Deploy.

## Obrázky
`denik-media/` drží grafiku ve formátu `.webp`:

| složka | co tam patří |
|---|---|
| `portraits/` | portréty družiny (`karibrk.webp`, `elie.webp`, …) |
| `avatars/` | malé ikonky postav |
| `npcs/` | NPC |
| `locations/` | místa a mapy (`u-tri-vran.webp`) |
| `items/` | předměty |
| `icons/` | ikony kouzel a značek |
| `other/` | scény do Střípků (`kari-elie-runy.webp`, …) |
| `data/` | zálohy a exporty |

Deník hledá obrázek nejdřív v zapečeném balíku uvnitř HTML a pak v téhle složce.
Nový obrázek = nahrát soubor se správným názvem do správné složky. Nic víc.

## Stav
Ukládá se do `localStorage` prohlížeče. Záloha: **Přenos → Stáhnout deník .html**.
