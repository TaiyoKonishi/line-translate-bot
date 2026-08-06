export async function translateToJapanese(text, apiKey) {
  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      "Authorization": `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      text: text,
      target_lang: "JA"
    })
  });

  if (!res.ok) {
    throw new Error(`DeepL API error: ${res.status}`);
  }

  const data = await res.json();
  return data.translations[0].text;
}
