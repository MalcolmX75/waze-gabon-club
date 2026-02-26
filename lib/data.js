import C from './colors';

export const DEEP_LINKS = [
  { key: "deeplink1", lat: 0.3924, lon: 9.4536, icon: "\u{1F3D9}\u{FE0F}" },
  { key: "deeplink2", lat: 0.4584, lon: 9.4123, icon: "\u2708\u{FE0F}" },
  { key: "deeplink3", lat: 0.5244, lon: 9.4317, icon: "\u26BD" },
  { key: "deeplink4", lat: 0.3988, lon: 9.4495, icon: "\u{1F6D2}" },
  { key: "deeplink5", lat: 0.4133, lon: 9.4478, icon: "\u{1F3E5}" },
  { key: "deeplink6", lat: 0.3847, lon: 9.4419, icon: "\u{1F393}" },
];

export const TUTORIALS = [
  { id: "install", icon: "\u{1F4F2}", color: C.waze },
  { id: "profile", icon: "\u{1F464}", color: C.green },
  { id: "places", icon: "\u{1F4CD}", color: C.blue },
  { id: "navigate", icon: "\u{1F5FA}\u{FE0F}", color: "#e85d04" },
  { id: "report", icon: "\u26A0\u{FE0F}", color: C.danger },
  { id: "editor", icon: "\u270F\u{FE0F}", color: "#7c3aed" },
];

export const ARTICLES = [
  { key: "item1", url: "https://blog.google/waze/conversational-reporting-waze/" },
  { key: "item2", url: "https://blog.google/products-and-platforms/products/maps/maps-waze-new-features-information-on-the-go/" },
  { key: "item3", url: "https://blog.google/products-and-platforms/products/maps/maps-waze-new-features-information-on-the-go/" },
  { key: "item4", url: "https://www.waze.com/discuss/t/august-2025-office-hours-waze-insight/387489" },
  { key: "item5", url: "https://www.bmwblog.com/2025/03/01/waze-instrument-cluster-carplay-android-auto-update/" },
  { key: "item6", url: "https://www.waze.com/discuss/t/the-january-2025-newsletter-has-landed/364338" },
];

export const FEATURES = [
  { key: "nav", icon: "\u{1F9ED}", color: C.waze },
  { key: "alerts", icon: "\u26A0\u{FE0F}", color: C.danger },
  { key: "community", icon: "\u{1F465}", color: C.green },
  { key: "carplay", icon: "\u{1F698}", color: "#7c3aed" },
  { key: "fuel", icon: "\u26FD", color: C.yellow },
  { key: "report", icon: "\u{1F4E2}", color: "#f97316" },
];

export const FAQ_COUNT = 7;

export const COMMUNITY_CARDS = [
  { key: "whatsapp", icon: "\u{1F4AC}", cta: "community.whatsapp.join", gradient: `linear-gradient(160deg, ${C.whatsapp}, #128C7E)`, link: "whatsapp" },
  { key: "facebook", icon: "\u{1F4D8}", cta: "community.facebook.follow", gradient: `linear-gradient(160deg, ${C.facebook}, #0d5bc4)`, link: "facebook" },
  { key: "telegram", icon: "\u2708\u{FE0F}", cta: "community.telegram.join", gradient: `linear-gradient(160deg, ${C.telegram}, #006699)`, link: "telegram" },
  { key: "editor", icon: "\u{1F5FA}\u{FE0F}", cta: "community.editor.open", gradient: `linear-gradient(160deg, ${C.green}, #006830)`, link: "editor" },
];

export const STEP_COLORS = [C.waze, C.green, C.danger, "#7c3aed"];

export const HERO_STATS = [
  { value: "140M+", key: "hero.stats.users" },
  { value: "185+", key: "hero.stats.countries" },
  { value: "100%", key: "hero.stats.free" },
  { value: "24/7", key: "hero.stats.realtime" },
];

export const NAV_ITEMS = [
  { id: "home", key: "nav.home" },
  { id: "features", key: "nav.features" },
  { id: "tutorials", key: "nav.tutorials" },
  { id: "livemap", key: "nav.map" },
  { id: "community", key: "nav.community" },
  { id: "articles", key: "nav.news" },
  { id: "faq", key: "nav.faq" },
];
