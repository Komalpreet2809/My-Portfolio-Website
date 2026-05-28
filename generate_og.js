const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to 1920x1005 with 2x scale for ultra-crisp Retina quality
  await page.setViewport({ width: 1920, height: 1005, deviceScaleFactor: 2 });
  
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
    
    // Ensure dark mode is forced
    document.documentElement.setAttribute('data-theme', 'dark');

    // Hide distracting UI elements from the preview card
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) scrollIndicator.style.display = 'none';
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) themeToggle.style.display = 'none';
    
    // Force animations to completion and REMOVE ALL BLUR
    const style = document.createElement('style');
    style.innerHTML = `
      .hero-animate, * {
        animation: none !important;
        transition: none !important;
        filter: none !important;
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  });
  
  // Give it a solid moment to render the layout adjustments perfectly
  await new Promise(r => setTimeout(r, 1500));
  
  const outputPath = path.join(__dirname, 'card.png');
  console.log("Taking perfect screenshot...");
  await page.screenshot({ path: outputPath });
  
  await browser.close();
  console.log("Done! Saved to", outputPath);
})();
