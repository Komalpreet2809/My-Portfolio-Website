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

    // Inject styles specifically to fit the 1200x630 viewport perfectly without overflow
    const style = document.createElement('style');
    style.innerHTML = `
      .hero-main-content {
        padding: 4rem 3rem 0 3rem !important;
        align-items: center !important;
      }
      .hero-name {
        font-size: 7.5rem !important;
        line-height: 0.85 !important;
      }
      .hero-left {
        transform: scale(0.8) !important;
        transform-origin: left center !important;
      }
      .page-border {
        border-width: 15px !important;
      }
    `;
    document.head.appendChild(style);
  });
  
  // Give it a tiny moment to render the layout adjustments
  await new Promise(r => setTimeout(r, 500));
  
  const outputPath = path.join(__dirname, 'komal-social-card.png');
  console.log("Taking perfect screenshot...");
  await page.screenshot({ path: outputPath });
  
  await browser.close();
  console.log("Done! Saved to", outputPath);
})();
