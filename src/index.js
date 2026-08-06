import { verifySignature, replyMessage, getGroupMemberProfile } from "./line.js";
import { translateAuto } from "./translate.js";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    const body = await request.text();
    const signature = request.headers.get("x-line-signature");

    const valid = await verifySignature(body, signature, env.LINE_CHANNEL_SECRET);
    if (!valid) {
      return new Response("Invalid signature", { status: 401 });
    }

    const data = JSON.parse(body);

    for (const event of data.events) {
      if (event.type !== "message" || event.message.type !== "text") continue;
      if (event.source.type !== "group") continue;

      const groupId = event.source.groupId;
      const userId = event.source.userId;

      const profile = await getGroupMemberProfile(groupId, userId, env.LINE_CHANNEL_ACCESS_TOKEN);
      if (!profile || profile.displayName !== env.TARGET_DISPLAY_NAME) continue;

      try {
        const translated = await translateAuto(event.message.text, env.DEEPL_API_KEY);
        await replyMessage(event.replyToken, translated, env.LINE_CHANNEL_ACCESS_TOKEN);
      } catch (e) {
        console.error("Translation failed:", e);
      }
    }

    return new Response("OK", { status: 200 });
  }
};
