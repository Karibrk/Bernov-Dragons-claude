// DENÍK — generátor obrázků přes Vercel AI Gateway, výsledek do Vercel Blob.
// Proměnné prostředí (Vercel → Settings → Environment Variables):
//   AI_GATEWAY_API_KEY  – klíč z AI Gateway
//   BLOB_READ_WRITE_TOKEN – doplní Vercel sám po připojení Blob storage k projektu
//   DENIK_KEY           – vlastní heslo, bez něj endpoint nic neudělá
//   IMAGE_MODEL         – volitelné, výchozí openai/gpt-image-2
const { put } = require('@vercel/blob');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      gateway: !!process.env.AI_GATEWAY_API_KEY,
      blob: !!process.env.BLOB_READ_WRITE_TOKEN,
      key: !!process.env.DENIK_KEY,
      model: process.env.IMAGE_MODEL || 'openai/gpt-image-2'
    });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Jen POST.' });

  if (!process.env.DENIK_KEY || req.headers['x-denik-key'] !== process.env.DENIK_KEY)
    return res.status(401).json({ error: 'Špatné nebo chybějící heslo deníku.' });
  if (!process.env.AI_GATEWAY_API_KEY) return res.status(500).json({ error: 'Chybí AI_GATEWAY_API_KEY.' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(500).json({ error: 'Chybí Blob storage (BLOB_READ_WRITE_TOKEN).' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body || '{}'); } catch (e) { body = {}; } }
  body = body || {};
  const prompt = String(body.prompt || '').slice(0, 4000).trim();
  const name = String(body.name || '').trim();
  if (!prompt) return res.status(400).json({ error: 'Chybí prompt.' });
  if (!/^(portraits|other|items|locations|npcs)\/[a-z0-9-]{1,80}$/.test(name))
    return res.status(400).json({ error: 'Neplatný název souboru.' });

  const model = process.env.IMAGE_MODEL || 'openai/gpt-image-2';
  const payload = { model, prompt, n: 1 };
  if (model.indexOf('openai/') === 0) payload.size = /^\d+x\d+$/.test(body.size || '') ? body.size : '1024x1024';

  let j, r;
  try {
    r = await fetch('https://ai-gateway.vercel.sh/v1/images/generations', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.AI_GATEWAY_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    j = await r.json();
  } catch (e) {
    return res.status(502).json({ error: 'AI Gateway neodpověděla: ' + e.message });
  }
  if (!r.ok) return res.status(502).json({ error: (j && j.error && (j.error.message || j.error)) || 'Chyba AI Gateway.' });

  const d = j && j.data && j.data[0];
  if (!d) return res.status(502).json({ error: 'Gateway nevrátila obrázek.' });
  let buf, ct = 'image/png';
  if (d.b64_json) buf = Buffer.from(d.b64_json, 'base64');
  else if (d.url) {
    const ir = await fetch(d.url);
    buf = Buffer.from(await ir.arrayBuffer());
    ct = ir.headers.get('content-type') || ct;
  } else return res.status(502).json({ error: 'Neznámý formát odpovědi.' });

  const ext = ct.indexOf('webp') >= 0 ? 'webp' : ct.indexOf('jpeg') >= 0 ? 'jpg' : 'png';
  const blob = await put('denik/' + name + '-' + Date.now() + '.' + ext, buf, {
    access: 'public', contentType: ct, addRandomSuffix: false
  });
  return res.status(200).json({ url: blob.url, model });
};
