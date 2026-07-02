const { chromium } = require('playwright');
const path = require('path');

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;800;900&display=swap');
  body {
    width: 1200px;
    height: 630px;
    background: #FBF9F4;
    font-family: 'Heebo', sans-serif;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 64px 72px;
    overflow: hidden;
  }
  .left {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 580px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    background: rgba(232,146,10,0.12);
    color: #B86800;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 100px;
    width: fit-content;
  }
  .logo {
    font-size: 72px;
    font-weight: 900;
    color: #1E1A14;
    line-height: 1;
    letter-spacing: -2px;
  }
  .tagline {
    font-size: 28px;
    font-weight: 700;
    color: #1E1A14;
    line-height: 1.3;
  }
  .tagline span {
    color: #E8920A;
  }
  .sub {
    font-size: 18px;
    font-weight: 400;
    color: #6b6052;
    line-height: 1.5;
    max-width: 480px;
  }
  .right {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-end;
  }
  .card {
    background: #fff;
    border-radius: 16px;
    padding: 20px 24px;
    width: 280px;
    box-shadow: 0 1px 2px rgba(30,26,20,.05), 0 8px 28px rgba(30,26,20,.07);
    border: 1px solid rgba(30,26,20,0.06);
  }
  .card-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6b6052;
    margin-bottom: 8px;
  }
  .card-value {
    font-size: 28px;
    font-weight: 900;
    color: #1E1A14;
  }
  .card-value.amber { color: #E8920A; }
  .pill {
    background: rgba(232,146,10,0.12);
    color: #B86800;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 100px;
    margin-top: 6px;
    display: inline-block;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #E8920A;
    display: inline-block;
    margin-right: 6px;
  }
  .domain {
    font-size: 15px;
    font-weight: 700;
    color: #6b6052;
    margin-top: 8px;
  }
</style>
</head>
<body>
  <div class="left">
    <div class="badge">For appointment businesses</div>
    <div class="logo">bapita</div>
    <div class="tagline">Built for you.<br/><span>Runs without you.</span></div>
    <div class="sub">Booking page, owner dashboard & automations — live in 48 hours. No tech needed.</div>
    <div class="domain">bapita.com</div>
  </div>
  <div class="right">
    <div class="card">
      <div class="card-label">Today's bookings</div>
      <div class="card-value">12</div>
      <div class="pill"><span class="dot"></span>Live dashboard</div>
    </div>
    <div class="card">
      <div class="card-label">Monthly revenue</div>
      <div class="card-value amber">₪8,400</div>
      <div class="pill">Auto-tracked</div>
    </div>
    <div class="card">
      <div class="card-label">Setup time</div>
      <div class="card-value">48h</div>
      <div class="pill">No tech needed</div>
    </div>
  </div>
</body>
</html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000); // let fonts load
  const outputPath = path.join(__dirname, 'v2/src/dashboard/img/og-image.png');
  await page.screenshot({ path: outputPath, type: 'png' });
  await browser.close();
  console.log('OG image saved to:', outputPath);
})();
