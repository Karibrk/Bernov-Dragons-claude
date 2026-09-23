# Bernov & Dragons — DENÍK

Deník kampaně Karibrka de Villa. Běží na Vercelu: **https://bernov-dragons-cl.vercel.app**

## Struktura
- `index.html` — celý deník (jeden soubor)
- `denik-media/` — obrázky (portraits, locations, other, items, npcs…); nový obrázek = soubor do správné složky
- `api/generate.js` — generátor obrázků: AI Gateway → Vercel Blob
- `vercel.json`, `package.json`

## Generátor obrázků — nastavení (jednou)
Vercel → projekt → **Settings → Environment Variables**:

| Proměnná | Hodnota |
|---|---|
| `AI_GATEWAY_API_KEY` | klíč z Vercel → AI Gateway → API Keys |
| `DENIK_KEY` | vlastní heslo; deník se na něj zeptá při prvním generování |
| `IMAGE_MODEL` | volitelné, výchozí `openai/gpt-image-2` |

Vercel → projekt → **Storage → Create → Blob** → připojit k projektu (doplní `BLOB_READ_WRITE_TOKEN`).

Potom **Redeploy**. Kontrola: `https://bernov-dragons-cl.vercel.app/api/generate` musí ukázat `gateway`, `blob`, `key` = `true`.
