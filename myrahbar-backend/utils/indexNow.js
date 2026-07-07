/**
 * indexNow.js
 * Submits new/updated URLs to IndexNow (Bing, Yandex, and other participating
 * search engines). Free, instant, no quota. Much faster than waiting for
 * Google's sitemap crawl schedule.
 *
 * SETUP (one-time):
 * 1. Generate a key at https://www.bing.com/indexnow/getstarted
 * 2. Add INDEXNOW_KEY=your_key to .env
 * 3. Create a file at /public/<your_key>.txt containing just the key string
 *    so that Bing can verify domain ownership.
 */

const https = require("https");

const KEY = process.env.INDEXNOW_KEY || "";
const HOST = "www.rahbars.com";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

/**
 * Submit one or more URLs to IndexNow.
 * @param {string[]} urls - Fully-qualified URLs (must start with https://)
 */
async function submitToIndexNow(urls) {
  if (!KEY) {
    console.warn("[IndexNow] INDEXNOW_KEY not set — skipping submission.");
    return;
  }
  if (!urls || urls.length === 0) return;

  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: "api.indexnow.org",
      path: "/indexnow",
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`[IndexNow] ✅ Submitted ${urls.length} URL(s) — status ${res.statusCode}`);
        } else {
          console.warn(`[IndexNow] ⚠️  status ${res.statusCode}: ${data}`);
        }
        resolve();
      });
    });

    req.on("error", (err) => {
      console.error("[IndexNow] ❌ Error:", err.message);
      resolve(); // don't crash the publish pipeline
    });

    req.write(body);
    req.end();
  });
}

module.exports = { submitToIndexNow };
