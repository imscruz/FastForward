import BypassDefinition from './BypassDefinition.js'

(async () => {
  // Find "DOGRULAMAYI BASLAT" button
  const btn = Array.from(document.querySelectorAll('a.btn-primary'))
    .find(el => el.textContent.includes("Doğrulamayı Başlat"));
  if (!btn) {
    return;
  }

  // From the URL get domain only
  function extractDomainFromUrl(urlStr) {
    try {
      const url = new URL(urlStr);
      const q = url.searchParams.get('q');
      if (!q) return null;

      let parts = q.replace(/(\+|%20|%%)/g, ' ').split(/\s+/).map(w => w.replace(/^site:/i, ''));

      for (const part of parts) {
        const dParts = part.split('.');
        if (dParts.length >= 2) {
          return dParts.slice(-2).join('.');
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  const domain = extractDomainFromUrl(btn.href);
  if (!domain) {
    return;
  }

  console.log("Found:", domain);

  // Sending Fetch on content mode cuz we dont want CORS
  async function doFetch(domain) {
    try {
      const res = await fetch(`https://${domain}/Backend/Process.php?type=Add`, {
        method: 'POST',
        headers: {
          "accept": "application/json, text/javascript, */*; q=0.01",
          "accept-language": "tr,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Microsoft Edge\";v=\"138\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest"
        },
        referrer: `https://${domain}/`,
        body: null,
        credentials: "include"
      });
      const text = await res.text();
    } catch (e) {
      console.error(`Fetch err (${domain}):`, e);
    }
  }

  // with WWW version
  await doFetch(domain);
  setTimeout(() => doFetch(`www.${domain}`), 31);

})();
