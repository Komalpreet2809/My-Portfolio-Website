/* ============================================
   PORTFOLIO — Interactions & Animations
   Komalpreet Kaur
   ============================================ */

/**
 * Removes grey/white checkerboard background from PNG, preserving all dark
 * and colored pixels (black ASCII art, teal/green tones are kept intact).
 */
function removeCheckerboard(imgSrc, callback) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const brightness = (r + g + b) / 3;
      const maxRGB = Math.max(r, g, b);
      const saturation = maxRGB === 0 ? 0 : (maxRGB - Math.min(r, g, b)) / maxRGB;

      // Only remove if: bright (light grey/white) AND unsaturated (no color)
      // This preserves black, dark, and all colored (teal/green) pixels
      if (brightness > 160 && saturation < 0.15) {
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    callback(canvas.toDataURL());
  };
  img.src = imgSrc;
}

document.addEventListener('DOMContentLoaded', () => {
  // --- Cinematic Splash Screen Logic (Data Decryption) ---
  const splashScreen = document.getElementById('splash-screen');
  const splashText = document.getElementById('splash-text');
  
  if (splashScreen && splashText) {
    document.body.classList.add('loading');
    
    const targetText = "KOMALPREET KAUR";
    splashText.innerHTML = ''; // Clear initial text
    
    // Create spans for each letter for a smooth staggered reveal
    targetText.split('').forEach((char, index) => {
      if (char === ' ') {
        // Create a line break for flexbox to push the next word to a new line
        const breakEl = document.createElement('div');
        breakEl.style.flexBasis = '100%';
        breakEl.style.height = '0';
        splashText.appendChild(breakEl);
      } else {
        const span = document.createElement('span');
        span.innerText = char;
        span.style.opacity = '0';
        span.style.transform = 'translateY(30px) scale(0.9)';
        span.style.display = 'inline-block';
        span.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        span.style.transitionDelay = `${index * 0.06}s`; // Stagger effect
        splashText.appendChild(span);
      }
    });

    // Trigger animation slightly after load
    setTimeout(() => {
      const spans = splashText.querySelectorAll('span');
      spans.forEach(span => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0) scale(1)';
      });
    }, 100);

    // Calculate total animation time based on string length and delays
    const totalAnimationTime = (targetText.length * 60) + 800;
    
    // Wait for text to fully reveal, hold for a split second, then instantly cut away
    setTimeout(() => {
      splashScreen.classList.add('reveal');
      document.body.classList.remove('loading');
      
      setTimeout(() => {
        splashScreen.style.display = 'none';
      }, 100); // Super fast cleanup since it instantly cuts
    }, totalAnimationTime + 500);
  }



  // --- Halftone Blob on Canvas ---
  const canvas = document.getElementById('halftoneCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
    }

    let lastWidth = window.innerWidth;
    resizeCanvas();

    window.addEventListener('resize', () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        resizeCanvas();
        drawHalftone();
      }
    });

    // Draw halftone dots creating a fluid blob shape
    function drawHalftone() {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const dotSpacing = 8;
      const maxRadius = 3.8;
      const cx = w * 0.55;
      const cy = h * 0.45;

      // Get color from CSS variable for theme support (always read live)
      function getDotColor() {
        return getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim() || '#333333';
      }

      for (let x = 0; x < w; x += dotSpacing) {
        for (let y = 0; y < h; y += dotSpacing) {
          const dx = (x - cx) / (w * 0.45);
          const dy = (y - cy) / (h * 0.45);
          const dist = Math.sqrt(dx * dx + dy * dy);

          const angle = Math.atan2(dy, dx);
          const blobRadius = 0.8 +
            0.15 * Math.sin(angle * 3 + 1.2) +
            0.1 * Math.sin(angle * 5 - 0.8) +
            0.08 * Math.cos(angle * 7 + 2.5) +
            0.12 * Math.sin(angle * 2 + 0.5);

          if (dist < blobRadius) {
            const edgeFade = 1 - (dist / blobRadius);
            const intensity = Math.pow(edgeFade, 0.6);
            const variation = 0.7 + 0.3 * Math.sin(x * 0.05 + y * 0.03);
            const radius = maxRadius * intensity * variation;

            if (radius > 0.3) {
              ctx.beginPath();
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              ctx.fillStyle = getDotColor();
              ctx.fill();
            }
          }
        }
      }
    }

    drawHalftone();
  }

  // --- Dock Nav — Active state based on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const dockItems = document.querySelectorAll('.dock-item');

  function updateActiveDock() {
    let current = 'hero';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 300;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    dockItems.forEach(item => {
      item.classList.remove('active');
      const hrefAttr = item.getAttribute('href');
      if (hrefAttr) {
        const href = hrefAttr.replace('#', '');
        if (href === current) {
          item.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveDock);
  updateActiveDock(); // Set initial state



  // --- Scroll Reveal (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Project Click Preview ---
  const workItems = document.querySelectorAll('.work-item');

  workItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      // Prevent collapse when clicking links
      if (e.target.closest('a')) return;
      if (e.target.closest('.video-player')) return;

      const isExpanded = item.classList.contains('expanded');

      // Close all items
      workItems.forEach(w => {
        if (w.classList.contains('expanded')) {
          w.classList.remove('expanded');
          const details = w.querySelector('.work-details');
          if (details) {
            details.style.overflow = 'hidden'; // Restore hidden before collapsing
            details.style.maxHeight = details.scrollHeight + 'px';
            void details.offsetHeight; // Force reflow
            details.style.maxHeight = null;
          }
        }
      });

      if (!isExpanded) {
        // Open the clicked one
        item.classList.add('expanded');
        const details = item.querySelector('.work-details');
        if (details) {
          details.style.maxHeight = (details.scrollHeight + 150) + "px";
          
          setTimeout(() => {
            if (item.classList.contains('expanded')) {
              details.style.maxHeight = "none";
              details.style.overflow = "visible"; // Bulletproof fix against iOS clipping
            }
          }, 600);
        }
        
        // Wait for the full 600ms CSS expansion animation to finish before calculating the center
        setTimeout(() => {
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 620);
      }
    });
  });

  // --- Magic Cat (decorative only, no sparkles/growth) ---

  // --- Smooth anchor scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // Skip modal/empty anchors

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Resume Modal Logic ---
  const resumeBtn = document.getElementById('resumeBtn');
  const resumeModal = document.getElementById('resumeModal');
  const closeModal = document.getElementById('closeModal');

  resumeBtn?.addEventListener('click', (e) => {
    // On mobile/narrow screens, allow default direct download
    if (window.innerWidth <= 768) return;

    e.preventDefault();
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeModal?.addEventListener('click', () => {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  window.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // --- Training Terminal Logs ---
  const terminalBody = document.getElementById('term-body');
  if (terminalBody) {
    const logs = [
      { text: "> python train_model.py", type: "info" },
      { text: "Loading dataset: 'real_world_messy_data.csv'...", type: "" },
      { text: "[OK] 1.2M samples loaded.", type: "term-success" },
      { text: "Initializing Transformer architecture...", type: "" },
      { text: "Optimizing with AdamW (lr=3e-4)...", type: "" },
      { text: "Epoch 1/50 - Loss: 0.842 - Acc: 0.612", type: "" },
      { text: "Epoch 5/50 - Loss: 0.521 - Acc: 0.745", type: "" },
      { text: "WARNING: Gradient explosion detected!", type: "term-warning" },
      { text: "Applying gradient clipping...", type: "term-info" },
      { text: "Epoch 12/50 - Loss: 0.312 - Acc: 0.889", type: "" },
      { text: "Epoch 20/50 - Loss: 0.198 - Acc: 0.942", type: "" },
      { text: "INFO: Model is starting to argue back.", type: "term-info" },
      { text: "Epoch 35/50 - Loss: 0.088 - Acc: 0.975", type: "" },
      { text: "Epoch 50/50 - Loss: 0.042 - Acc: 0.991", type: "term-success" },
      { text: "Saving weights to 'sci_fiction_v2.bin'...", type: "" },
      { text: "[SUCCESS] Training complete.", type: "term-success" },
      { text: "> Finalizing pipelines...", type: "term-info" }
    ];

    let logIndex = 0;
    function addLog() {
      // Clear terminal only before starting a fresh run
      if (logIndex === 0) {
        terminalBody.innerHTML = '';
      }

      const log = logs[logIndex];
      const div = document.createElement('div');
      if (log.type) div.className = log.type;
      div.textContent = log.text;
      terminalBody.appendChild(div);

      // Auto-scroll
      terminalBody.scrollTop = terminalBody.scrollHeight;

      logIndex++;

      if (logIndex >= logs.length) {
        // Show idle state before restarting after a long wait
        const idleDiv = document.createElement('div');
        idleDiv.className = 'term-info';
        idleDiv.textContent = "[IDLE] System ready for next training session...";
        idleDiv.style.marginTop = "1rem";
        terminalBody.appendChild(idleDiv);
        terminalBody.scrollTop = terminalBody.scrollHeight;

        logIndex = 0;
        setTimeout(addLog, 12000); // 12-second wait before clearing and restarting
        return;
      }

      // Random delay for next log
      const nextDelay = Math.random() * 1500 + 500;
      setTimeout(addLog, nextDelay);
    }

    // Start with a small initial delay
    setTimeout(addLog, 1500);
  }

  // --- Hire Me Modal Logic ---
  const openHireModalBtn = document.getElementById('openHireModal');
  const hireModal = document.getElementById('hireModal');
  const closeHireModalBtn = document.getElementById('closeHireModal');
  const hireContactBtn = document.getElementById('hireContactBtn');

  if (openHireModalBtn && hireModal) {
    openHireModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hireModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeHireModal = () => {
      hireModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeHireModalBtn?.addEventListener('click', closeHireModal);

    hireModal.addEventListener('click', (e) => {
      if (e.target === hireModal) {
        closeHireModal();
      }
    });

    hireContactBtn?.addEventListener('click', closeHireModal);
  }

  // --- Top Left Status Container Reference ---
  const statusTime = document.querySelector('.status-time');

  // --- Interactive Data Swarm Initialization ---
  function initDataSwarm() {
    const canvas = document.getElementById('aboutCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let width, height;
    let particles = [];
    const config = {
      particleCount: 350, // Increased for larger container
      connectionDistance: 75,
      mouseRadius: 150,
      baseSpeed: 0.3
    };

    // Get theme color dynamically (reads current CSS variable on each frame)
    function getThemeColor() {
      return getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim() || '#333333';
    }

    let mouse = { x: -1000, y: -1000 };

    let lastWidth = window.innerWidth;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      const newWidth = rect.width;
      const newHeight = rect.height;

      // Only re-init particles if width changed (prevents jump on mobile address bar toggle)
      const widthChanged = newWidth !== width;

      width = newWidth;
      height = newHeight;
      
      // Dynamically scale particles and connections based on screen size so it never looks sparse
      const area = width * height;
      config.particleCount = Math.min(700, Math.max(200, Math.floor(area / 1000)));
      config.connectionDistance = width > 1440 ? 120 : (width > 1024 ? 100 : 75);
      
      // Dynamically scale mouse radius so the repel circle doesn't clip on small screens
      config.mouseRadius = Math.min(150, Math.min(width, height) * 0.35);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      if (widthChanged || particles.length === 0) {
        initParticles();
      }
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * config.baseSpeed;
        this.vy = (Math.random() - 0.5) * config.baseSpeed;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.size = Math.random() * 1.5 + 0.5;
      }

      update() {
        // Mouse interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        // Repel from mouse
        const maxDistance = config.mouseRadius;
        let force = (maxDistance - distance) / maxDistance;
        if (force < 0) force = 0;

        let directionX = (forceDirectionX * force * this.density * 0.6);
        let directionY = (forceDirectionY * force * this.density * 0.6);

        if (distance < maxDistance) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          // Return to base wandering path gently
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 50;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 50;
          }
        }

        // Standard Movement
        this.baseX += this.vx;
        this.baseY += this.vy;

        // Wrap around boundaries
        this.baseX = (this.baseX + width) % width;
        this.baseY = (this.baseY + height) % height;
        if (this.baseX < 0) this.baseX = width;
        if (this.baseY < 0) this.baseY = height;

        // Ensure x/y follow base if mouse is far
        if (distance >= maxDistance) {
          this.x = this.baseX;
          this.y = this.baseY;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = getThemeColor();
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Cache color once per frame (reactive to theme, but not per-particle)
      const frameColor = getThemeColor();

      // Update and Draw Particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        // Inline draw with cached frameColor
        ctx.beginPath();
        ctx.arc(particles[i].x, particles[i].y, particles[i].size, 0, Math.PI * 2);
        ctx.fillStyle = frameColor;
        ctx.fill();

        // Connect nearby particles
        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.connectionDistance) {
            let opacity = 1 - (distance / config.connectionDistance);
            ctx.beginPath();
            ctx.strokeStyle = frameColor;
            ctx.globalAlpha = opacity * 0.3; // Subtle connections
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1; // Reset
          }
        }
      }
      requestAnimationFrame(animate);

    }

    window.addEventListener('resize', resize);

    // Smooth mouse tracking relative to canvas
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    // Touch support for mobile devices
    function handleTouch(e) {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    }

    canvas.addEventListener('touchstart', handleTouch, { passive: true });
    canvas.addEventListener('touchmove', handleTouch, { passive: true });

    // Reset repel effect when tapping anywhere outside the canvas on mobile
    document.addEventListener('touchstart', (e) => {
      if (e.target !== canvas) {
        mouse.x = -1000;
        mouse.y = -1000;
      }
    }, { passive: true });

    resize();
    animate();
  }

  // --- Dark Mode / Theme Toggle Logic (Moved here for access to functions) ---
  const themeToggles = [
    document.getElementById('themeToggle'),
    document.getElementById('themeToggle2')
  ].filter(Boolean);

  // Check for saved user preference — BEFORE canvas init so canvases get correct colors
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  themeToggles.forEach(themeToggle => {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  });

  // NOW initialize canvases (after theme is set)
  initDataSwarm();
});
// ==========================================
// UPSTASH LIVE TRAFFIC COUNTER & ANALYTICS MODAL
// ==========================================
const TRAFFIC_BASE_URL = "https://precise-sailfish-133753.upstash.io";
const TRAFFIC_TOKEN = "gQAAAAAAAgp5AAIgcDJhMmMyMWFlMWZhNGU0ODg4YTVhMjAyYTI5MzRlYjU2ZA";
const TRAFFIC_REFRESH_MS = 10000;
let trafficRefreshTimer = null;
let trafficRefreshInFlight = false;

async function fetchTrafficValue(key, action = "get") {
  const response = await fetch(`${TRAFFIC_BASE_URL}/${action}/${key}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${TRAFFIC_TOKEN}` }
  });

  return response.json();
}

function renderTrafficCounts(totalValue, uniqueValue) {
  const totalEl = document.getElementById("modal-total-views");
  const uniqueEl = document.getElementById("modal-unique-views");
  const topViewEl = document.getElementById("top-view-count");

  if (totalEl && totalValue != null) {
    totalEl.textContent = Number(totalValue).toLocaleString();
  }
  if (topViewEl && totalValue != null) {
    topViewEl.textContent = Number(totalValue).toLocaleString();
  }
  if (uniqueEl && uniqueValue != null) {
    uniqueEl.textContent = Number(uniqueValue).toLocaleString();
  }
}

async function refreshTrafficCounter() {
  if (trafficRefreshInFlight) return;

  trafficRefreshInFlight = true;

  try {
    const [totalData, uniqueData] = await Promise.all([
      fetchTrafficValue("portfolio_views"),
      fetchTrafficValue("portfolio_unique_views")
    ]);

    renderTrafficCounts(totalData.result, uniqueData.result);
  } catch (err) {
    console.error("Analytics refresh error:", err);
  } finally {
    trafficRefreshInFlight = false;
  }
}

async function initTrafficCounter() {
  const hasVisited = localStorage.getItem("komal_visited");
  
  try {
    const totalPromise = fetchTrafficValue("portfolio_views", "incr");

    let uniquePromise;
    if (!hasVisited) {
      uniquePromise = fetchTrafficValue("portfolio_unique_views", "incr");
      localStorage.setItem("komal_visited", "true");
    } else {
      uniquePromise = fetchTrafficValue("portfolio_unique_views");
    }
    
    const [totalData, uniqueData] = await Promise.all([totalPromise, uniquePromise]);
    renderTrafficCounts(totalData.result, uniqueData.result);
  } catch (err) {
    console.error("Analytics fetch error:", err);
  }

  if (!trafficRefreshTimer) {
    trafficRefreshTimer = window.setInterval(refreshTrafficCounter, TRAFFIC_REFRESH_MS);
  }
}

// Analytics Modal Toggles
const analyticsModal = document.getElementById('analyticsModal');
const closeAnalyticsBtn = document.getElementById('closeAnalyticsModal');

if (analyticsModal && closeAnalyticsBtn) {
  const statusTimeBtn = document.getElementById('openAnalyticsModal');
  if (statusTimeBtn) {
    statusTimeBtn.addEventListener('click', () => {
      analyticsModal.classList.add('active');
    });
  }


  closeAnalyticsBtn.addEventListener('click', () => {
    analyticsModal.classList.remove('active');
  });

  analyticsModal.addEventListener('click', (e) => {
    if (e.target === analyticsModal) {
      analyticsModal.classList.remove('active');
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTrafficCounter();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      refreshTrafficCounter();
    }
  });

  // --- Custom Video Player Logic ---
  const videoPlayers = document.querySelectorAll('.video-player');
  
  videoPlayers.forEach(player => {
    const video = player.querySelector('.work-detail-video');
    const playPauseBtn = player.querySelector('[data-action="playpause"]');
    const muteBtn = player.querySelector('[data-action="mute"]');
    const fullscreenBtn = player.querySelector('[data-action="fullscreen"]');
    const progressBar = player.querySelector('.video-progress-bar');
    const progressWrap = player.querySelector('.video-progress-wrap');
    
    const iconPlay = player.querySelector('.icon-play');
    const iconPause = player.querySelector('.icon-pause');
    const iconMuted = player.querySelector('.icon-muted');
    const iconUnmuted = player.querySelector('.icon-unmuted');
    let isScrubbing = false;

    if (!video) return;

    player.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    video.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    function setProgressFromTime(currentTime) {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const percentage = (currentTime / video.duration) * 100;
      progressBar.style.width = `${percentage}%`;
    }

    function seekFromPointer(clientX) {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const rect = progressWrap.getBoundingClientRect();
      const pointerX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const percentage = rect.width === 0 ? 0 : pointerX / rect.width;
      video.currentTime = percentage * video.duration;
      setProgressFromTime(video.currentTime);
    }

    // Play/Pause
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent accordion collapse
      if (video.paused) {
        video.play();
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
      } else {
        video.pause();
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
      }
    });

    // Mute/Unmute
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      if (video.muted) {
        iconMuted.style.display = 'block';
        iconUnmuted.style.display = 'none';
      } else {
        iconMuted.style.display = 'none';
        iconUnmuted.style.display = 'block';
      }
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    });

    // Progress Bar Update
    video.addEventListener('timeupdate', () => {
      if (!isScrubbing) {
        setProgressFromTime(video.currentTime);
      }
    });

    video.addEventListener('loadedmetadata', () => {
      setProgressFromTime(video.currentTime);
    });

    function stopScrubbing() {
      isScrubbing = false;
    }

    function getClientXFromTouchEvent(event) {
      const touch = event.touches[0] || event.changedTouches[0];
      return touch ? touch.clientX : null;
    }

    progressWrap.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      isScrubbing = true;
      seekFromPointer(e.clientX);
    });

    progressWrap.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      seekFromPointer(e.clientX);
    });

    progressWrap.addEventListener('touchstart', (e) => {
      const clientX = getClientXFromTouchEvent(e);
      if (clientX == null) return;
      e.preventDefault();
      e.stopPropagation();
      isScrubbing = true;
      seekFromPointer(clientX);
    }, { passive: false });

    window.addEventListener('mousemove', (e) => {
      if (!isScrubbing) return;
      seekFromPointer(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      stopScrubbing();
    });

    window.addEventListener('touchmove', (e) => {
      if (!isScrubbing) return;
      const clientX = getClientXFromTouchEvent(e);
      if (clientX == null) return;
      e.preventDefault();
      seekFromPointer(clientX);
    }, { passive: false });

    window.addEventListener('touchend', () => {
      stopScrubbing();
    });

    window.addEventListener('touchcancel', () => {
      stopScrubbing();
    });
    
    // Play state on end
    video.addEventListener('ended', () => {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    });
  });
});
