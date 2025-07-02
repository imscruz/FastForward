(async () => {
  // Doğrulama başlat butonunu bul
  const btn = Array.from(document.querySelectorAll('a.btn-primary'))
    .find(el => el.textContent.includes("Doğrulamayı Başlat"));
  if (!btn) {
    console.log("Doğrulamayı Başlat butonu bulunamadı.");
    return;
  }

  // URL’den domain çıkarma fonksiyonu
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
    console.log("Domain bulunamadı.");
    return;
  }

  console.log("Bulunan domain:", domain);

  // Fetch atma fonksiyonu (hedef domain içinde, content script ortamında çalışıyor)
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
      console.log(`Fetch başarıyla yapıldı: ${domain}`, text);
    } catch (e) {
      console.error(`Fetch hatası (${domain}):`, e);
    }
  }

  // Domain ve www.domain için 4 saniye arayla fetch at
  await doFetch(domain);
  setTimeout(() => doFetch(`www.${domain}`), 31);

})();
