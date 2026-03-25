/* ============================================
   PORTFOLIO — Interactions & Animations
   Exact match to aureliencorre.fr
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
      const r = data[i], g = data[i+1], b = data[i+2];
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
  // --- Site Preloader Logic (Staggered Strip Reveal) ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    document.body.classList.add('loading');
    
    // Initial pause to show the solid dark screen
    setTimeout(() => {
      preloader.classList.add('reveal'); // Triggers staggered strip animation
      
      // Wait for the longest strip animation to finish (0.45s delay + 0.85s duration)
      setTimeout(() => {
        document.body.classList.remove('loading');
        preloader.style.display = 'none'; 
      }, 1500);
    }, 800);
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

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw halftone dots creating a fluid blob shape
    function drawHalftone() {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const dotSpacing = 8;
      const maxRadius = 3.8;
      const cx = w * 0.55;
      const cy = h * 0.45;

      // Get color from CSS variable for theme support
      const dotColor = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim() || '#1D4B39';

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
              ctx.fillStyle = dotColor; 
              ctx.fill();
            }
          }
        }
      }
    }

    drawHalftone();
    window.addEventListener('resize', () => {
      resizeCanvas();
      drawHalftone();
    });
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
      const href = item.getAttribute('href').replace('#', '');
      if (href === current) {
        item.classList.add('active');
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

      const isExpanded = item.classList.contains('expanded');
      
      // Close all items
      workItems.forEach(w => w.classList.remove('expanded'));
      
      if (!isExpanded) {
        // Open the clicked one
        item.classList.add('expanded');
        setTimeout(() => {
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
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

  // --- Top Left Status (Real-time Clock) ---
  const locationTime = document.getElementById('locationTime');
  const statusTime = document.querySelector('.status-time');
  if (locationTime && statusTime) {
    function updateTime() {
      const now = new Date();
      const options = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      };
      const timeString = now.toLocaleTimeString('en-US', options).toUpperCase();
      statusTime.textContent = timeString;
    }
    
    updateTime(); // Initial call
    setInterval(updateTime, 1000); // Update every second
  }

  // --- Custom Cursor Logic ---
  const cursorArrow = document.querySelector('.cursor-arrow');

  if (cursorArrow) {
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update arrow position instantly
      cursorArrow.style.left = `${mouseX}px`;
      cursorArrow.style.top = `${mouseY}px`;
    });

    // Hover effect
    const interactiveElements = document.querySelectorAll('a, button, .hero-btn, .dock-item, .hire-action-icon, #resumeBtn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorArrow.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorArrow.classList.remove('hovering');
      });
    });
  }


  // --- Interactive Data Swarm Initialization ---
  function initDataSwarm() {
    const canvas = document.getElementById('aboutCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let width, height;
    let particles = [];
    const config = {
      particleCount: 250, // Reduced for performance, connections make it look fuller
      connectionDistance: 60,
      mouseRadius: 150,
      baseSpeed: 0.3
    };

    // Cache theme color to avoid 15,000 DOM queries per second (performance fix)
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim() || '#1D4B39';

    let mouse = { x: -1000, y: -1000 };

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      // Use logical size for styling, physical size drawing
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initParticles();
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
        if(this.baseX < 0) this.baseX = width;
        if(this.baseY < 0) this.baseY = height;
        
        // Ensure x/y follow base if mouse is far
        if(distance >= maxDistance) {
           this.x = this.baseX;
           this.y = this.baseY;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = themeColor;
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
      
      // Update and Draw Particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect nearby particles
        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.connectionDistance) {
            let opacity = 1 - (distance / config.connectionDistance);
            ctx.beginPath();
            ctx.strokeStyle = themeColor;
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


    resize();
    animate();
  }

  initDataSwarm();
});
