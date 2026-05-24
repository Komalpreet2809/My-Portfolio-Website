const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set perfect Twitter Card dimensions
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 }); // Scale 2 for high quality
  
  const fileUrl = 'file://' + path.join(__dirname, 'og-card-template.html').replace(/\\/g, '/');
  console.log("Loading", fileUrl);
  
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  
  console.log("Waiting for fonts to load...");
  await page.evaluateHandle('document.fonts.ready');
  
  // Give it a tiny moment to ensure fonts are fully rendered
  await new Promise(r => setTimeout(r, 1000));
  
  const outputPath = path.join(__dirname, 'final-social-preview.png');
  console.log("Taking perfect screenshot...");
  await page.screenshot({ path: outputPath });
  
  await browser.close();
  console.log("Done! Saved to", outputPath);
})();
