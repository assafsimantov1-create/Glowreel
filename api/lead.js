// Saves a lead from the site forms into MailerLite ("Glowreel Leads" group), then shows /thanks.
const GROUP_ID = "203494741384365638";

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.statusCode = 302; res.setHeader("Location", "/"); return res.end(); }
  const b = req.body || {};
  if (b._honey) { res.statusCode = 303; res.setHeader("Location", "/thanks"); return res.end(); } // bot trap
  const email = String(b.email || "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { res.statusCode = 303; res.setHeader("Location", "/thanks?e=email"); return res.end(); }
  const company = String(b.brand || b.store || "").slice(0, 200);
  try {
    const r = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json",
                 "Authorization": "Bearer " + process.env.MAILERLITE_API_KEY },
      body: JSON.stringify({ email, fields: { name: String(b.name || "").slice(0, 100), company }, groups: [GROUP_ID] })
    });
    if (!r.ok) console.error("MailerLite error", r.status, await r.text());
  } catch (e) { console.error("MailerLite request failed", e); }
  res.statusCode = 303; res.setHeader("Location", "/thanks"); res.end();
};
