/**
 * The local scrapers (scripts/) drive your installed Google Chrome via an
 * explicit executablePath, so Puppeteer's bundled Chromium is never used.
 * Skip the ~150MB browser download on install — this also keeps Vercel builds
 * lean (the scrapers don't run on Vercel; the app just reads data/*.csv).
 */
module.exports = {
  skipDownload: true,
};
