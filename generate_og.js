const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to 1920x1005 (Exactly 1.91:1 aspect ratio)
  // This gives the massive font plenty of room so it doesn't overflow,
  // and Twitter will automatically shrink the image down to 1200x630 perfectly!
  await page.setViewport({ width: 1920, height: 1005, deviceScaleFactor: 1 });
  
  const fileUrl = 'file://' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
  console.log("Loading", fileUrl);
  
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  
  console.log("Waiting for fonts to load...");
  await page.evaluateHandle('document.fonts.ready');
  
  console.log("Forcing layout state to final hero screen...");
  await page.evaluate(() => {
    // Instantly remove splash screen
    const splash = document.getElementById('splash-screen');
    if (splash) splash.style.display = 'none';
    
    // Remove loading class
    document.body.classList.remove('loading');
    
    // Ensure light mode is forced
    document.documentElement.setAttribute('data-theme', 'light');
    
    // Force animations to completion
    const heroAnimate = document.querySelectorAll('.hero-animate');
    heroAnimate.forEach(el => {
      el.style.animation = 'none';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.style.filter = 'blur(0)';
    });
  });
  
  // Give it a tiny moment to render the layout adjustments
  await new Promise(r => setTimeout(r, 500));
  
  const outputPath = path.join(__dirname, 'perfect-social-card.png');
  console.log("Taking perfect screenshot...");
  await page.screenshot({ path: outputPath });
  
  await browser.close();
  console.log("Done! Saved to", outputPath);
})();
