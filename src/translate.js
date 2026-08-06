function isJapanese(text) {
  return /[\u3040-\u30FF\u4E00-\u9FFF]/.test(text);
}

export async function translateAuto(text, apiKey) {
  const targetLang = isJapanese(text) ? "EN" : "JA";

  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      "Authorization": `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      text: text,
      target_lang: targetLang
    })
  });

  if (!res.ok) {
    throw new Error(`DeepL API error: ${res.status}`);
  }

  const data = await res.json();
  return data.translations[0].text;
}
