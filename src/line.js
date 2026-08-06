export async function verifySignature(body, signature, channelSecret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(channelSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const computedSignature = btoa(String.fromCharCode(...new Uint8Array(signed)));
  return computedSignature === signature;
}

export async function replyMessage(replyToken, text, accessToken) {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }]
    })
  });
}

export async function getGroupMemberProfile(groupId, userId, accessToken) {
  const res = await fetch(
    `https://api.line.me/v2/bot/group/${groupId}/member/${userId}`,
    { headers: { "Authorization": `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  return await res.json();
}
