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

  // Halftone Divider Parallax
  const halftone = document.querySelector('.halftone-divider');
  if (halftone) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY || window.pageYOffset;
      halftone.style.backgroundPosition = `0px ${scrolled * 0.15}px`;
    });
  }

  // --- Neural Net Initialization ---
  function initNeuralNet() {
    const canvas = document.getElementById('neuralNetCanvas');
    const display = document.getElementById('neuralDetailContent');
    if (!canvas || !display) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    const nodes = [];
    const connections = [];
    const pulses = [];
    
    const nodeData = [
      { id: 0, layer: 0, title: "CORE_ORIGIN", content: "<h4>Chandigarh, India</h4><p>Raised in the heart of Punjab. Driven by logic, data, and curiosity.</p>" },
      { id: 1, layer: 0, title: "INPUT_STREAM", content: "<h4>Data Ingestion</h4><p>Specializing in processing messy, real-world signals into clean intelligence.</p>" },
      { id: 2, layer: 1, title: "ARCH_CV", content: "<h4>Computer Vision</h4><p>Building systems that can see, reason, and interpret visual context with precision.</p>" },
      { id: 3, layer: 1, title: "ARCH_NLP", content: "<h4>GenAI & LLMs</h4><p>Developing RAG systems and fine-tuning models to understand and generate human logic.</p>" },
      { id: 4, layer: 2, title: "OUTPUT_V1", content: "<h4>AI Architect</h4><p>The final layer: Turning complex models into production-ready solutions.</p>" }
    ];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      setupNodes();
    }

    function setupNodes() {
      nodes.length = 0;
      connections.length = 0;
      
      const layerCounts = [2, 2, 1];
      const xGap = width / (layerCounts.length + 1);
      
      nodeData.forEach(data => {
        const layerIdx = data.layer;
        const nodesInLayer = layerCounts[layerIdx];
        const nodeIdxInLayer = nodeData.filter(n => n.layer === layerIdx).indexOf(data);
        
        const x = xGap * (layerIdx + 1);
        const yGap = height / (nodesInLayer + 1);
        const y = yGap * (nodeIdxInLayer + 1);
        
        nodes.push({ ...data, x, y, radius: 6, hover: false });
      });

      // Connect layers
      nodes.forEach(n1 => {
        nodes.forEach(n2 => {
          if (n2.layer === n1.layer + 1) {
            connections.push({ from: n1, to: n2 });
          }
        });
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim();

      // Draw Connections
      connections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = (conn.from.hover || conn.to.hover) ? 0.6 : 0.15;
        ctx.lineWidth = (conn.from.hover || conn.to.hover) ? 2 : 1;
        ctx.stroke();
      });

      // Draw Pulses
      if (Math.random() < 0.05) {
        const conn = connections[Math.floor(Math.random() * connections.length)];
        pulses.push({ conn, progress: 0, speed: 0.01 + Math.random() * 0.02 });
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;
        if (p.progress > 1) {
          pulses.splice(i, 1);
          continue;
        }
        const px = p.conn.from.x + (p.conn.to.x - p.conn.from.x) * p.progress;
        const py = p.conn.from.y + (p.conn.to.y - p.conn.from.y) * p.progress;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.8;
        ctx.fill();
      }

      // Draw Nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + (node.hover ? 4 : 0), 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = node.hover ? 1 : 0.4;
        ctx.fill();

        // Label
        if (node.hover || width > 400) {
          ctx.font = '700 8px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(node.title, node.x, node.y - 15);
        }
      });

      requestAnimationFrame(draw);
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      
      let foundHover = false;
      nodes.forEach(node => {
        const dist = Math.sqrt((node.x - mx) ** 2 + (node.y - my) ** 2);
        if (dist < 20) {
          if (!node.hover) {
            node.hover = true;
            display.innerHTML = node.content;
            display.classList.add('active');
          }
          foundHover = true;
          canvas.style.cursor = 'pointer';
        } else {
          node.hover = false;
        }
      });
      if (!foundHover) canvas.style.cursor = 'default';
    });

    resize();
    window.addEventListener('resize', resize);
    draw();
  }

  initNeuralNet();
});
