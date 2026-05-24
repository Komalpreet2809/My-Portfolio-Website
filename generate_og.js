const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set perfect Twitter Card dimensions
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 }); // Scale 2 for high quality
  
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
    
    // Remove the cursor and interactive elements that might distract
    const cursor = document.querySelector('.cursor-arrow');
    if (cursor) cursor.style.display = 'none';
    
    // Remove page borders if they mess up framing, actually they look nice, let's keep them
    
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
  
  const outputPath = path.join(__dirname, 'og-preview-card.png');
  console.log("Taking perfect screenshot...");
  await page.screenshot({ path: outputPath });
  
  await browser.close();
  console.log("Done! Saved to", outputPath);
})();
