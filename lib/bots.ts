// Link-preview bots. When someone shares a tracked URL in a chat or feed, the
// app fetches it to build the preview; that fetch is recorded as a "share".
//
// To support a new app, add a row: `match` is tested against the User-Agent
// (case-insensitive), first match wins, so put more specific rules first.
export type Platform =
  | "imessage"
  | "whatsapp"
  | "telegram"
  | "linkedin"
  | "facebook"
  | "x"
  | "slack"
  | "discord"
  | "skype";

export const previewBots: { platform: Platform; match: RegExp }[] = [
  // iMessage sends "facebookexternalhit ... Facebot Twitterbot" together, so it must come
  // before the Facebook and X rules.
  { platform: "imessage", match: /facebookexternalhit.*twitterbot|twitterbot.*facebookexternalhit/i },
  { platform: "imessage", match: /applebot/i },
  { platform: "whatsapp", match: /whatsapp/i },
  { platform: "telegram", match: /telegrambot/i },
  { platform: "linkedin", match: /linkedinbot/i },
  { platform: "facebook", match: /facebookexternalhit|facebot/i },
  { platform: "x", match: /twitterbot/i },
  { platform: "slack", match: /slackbot/i },
  { platform: "discord", match: /discordbot/i },
  { platform: "skype", match: /skypeuripreview/i },
];
