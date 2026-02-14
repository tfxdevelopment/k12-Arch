import {
  b as e
} from "./_deps/Y2CE7CMW.js";
import {
  k as t
} from "./_deps/M2D6NT5W.js";

// convex/crons.ts
var s = t();
s.interval(
  "cleanup stale sessions",
  { minutes: 5 },
  e.stats.cleanupStaleSessions,
  {}
);
s.cron(
  "weekly newsletter digest",
  "0 9 * * 0",
  // 9:00 AM UTC on Sundays
  e.newsletterActions.sendWeeklyDigest,
  {
    siteUrl: process.env.SITE_URL || "https://example.com",
    siteName: process.env.SITE_NAME || "Newsletter"
  }
);
s.cron(
  "weekly stats summary",
  "0 9 * * 1",
  // 9:00 AM UTC on Mondays
  e.newsletterActions.sendWeeklyStatsSummary,
  {
    siteName: process.env.SITE_NAME || "Newsletter"
  }
);
s.cron(
  "cleanup old content versions",
  "0 3 * * *",
  // 3:00 AM UTC daily
  e.versions.cleanupOldVersions,
  {}
);
var o = s;
export {
  o as default
};
//# sourceMappingURL=crons.js.map
