export default async function handler(req, res) {
  const API_KEY = process.env.TRAFFICSO1_API_KEY || "cf5e995ca4e04a2e9980c49b1683593b";
  const CREATE_API_BASE = "https://manager.trafficso1.com/api/cong-khai/tao-lien-ket";

  const targetUrl = (req.query.url || "").toString().trim();
  if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
    return res.status(400).json({ ok: false, error: "Thiếu hoặc sai tham số url đích." });
  }

  const endpoint = `${CREATE_API_BASE}?apikey=${encodeURIComponent(API_KEY)}&url=${encodeURIComponent(targetUrl)}`;

  try {
    const upstream = await fetch(endpoint, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json, text/plain, */*"
      }
    });

    const rawText = await upstream.text();
    let parsed = null;
    try {
      parsed = JSON.parse(rawText);
    } catch (_) {
      parsed = rawText;
    }

    return res.status(200).json({
      ok: true,
      status: upstream.status,
      raw: rawText,
      data: parsed
    });
  } catch (err) {
    return res.status(502).json({
      ok: false,
      error: err && err.message ? err.message : "Lỗi kết nối tới API Traffic so1."
    });
  }
}
