// config.js
// ======== AI助手配置文件（中文版） ========

// 1️⃣ 填写你的 Cloudflare Worker 地址
// 例子: https://crypto-ai-assistant.8805811q.workers.dev
const API_BASE = "https://你的worker子域名.workers.dev";

// 2️⃣ 定时自动刷新行情（分钟）
const AUTO_REFRESH_MINUTES = 5;

// 3️⃣ 默认关注币种（可改）
const DEFAULT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "狗狗币", "比特币"];

// 4️⃣ 界面主题设置（黑底金字）
const THEME = {
  background: "#000000",
  color: "#FFD700",
  accent: "#FFA500",
};

// 5️⃣ 是否启用 Telegram 推送（已配置 Worker Secrets 即可）
const TELEGRAM_ENABLED = true;

// 6️⃣ 是否启用语音播报（如不需要可改为 false）
const VOICE_ENABLED = false;

// 7️⃣ 自动行情推送开关（如果开启，系统会每隔 AUTO_REFRESH_MINUTES 分钟自动拉取行情）
const AUTO_PUSH_ENABLED = true;

// 导出配置供 app.js 调用
export {
  API_BASE,
  AUTO_REFRESH_MINUTES,
  DEFAULT_SYMBOLS,
  THEME,
  TELEGRAM_ENABLED,
  VOICE_ENABLED,
  AUTO_PUSH_ENABLED,
};
