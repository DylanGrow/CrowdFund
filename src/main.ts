import './style.css';

// Campaign variables (can be modified by the user)
const CAMPAIGN_CONFIG = {
  campaignName: "CompTIA Security+ Certification Fund",
  goalAmount: 431.00,
  raisedAmount: 20.00,              // Reset to $20.00 as requested (textbook covered)
  cashAppHandle: "$LordGrow",      // Updated CashApp tag
  appleCashIdentifier: "dylangrow27@gmail.com", // Configurable Apple Cash contact
  googlePayIdentifier: "dylangrow27@gmail.com", // Configurable Google Pay contact
  contributorCount: 1,             // Reset to 1 contribution (covering textbook)
  daysRemaining: 24
};

// Available CSS themes
const THEMES = ['theme-emerald', 'theme-amber', 'theme-indigo'];
const LOCAL_STORAGE_THEME_KEY = 'sec-fund-theme';

// DOM Elements
const raisedAmountEl = document.getElementById('raised-amount');
const goalAmountEl = document.getElementById('goal-amount');
const progressPercentEl = document.getElementById('progress-percent');
const progressFillEl = document.getElementById('progress-fill');
const contributionCountEl = document.getElementById('contribution-count');
const daysRemainingEl = document.getElementById('days-remaining');

// CashApp DOM Elements
const cashAppInputEl = document.getElementById('cashapp-handle-input') as HTMLInputElement | null;
const copyButtonEl = document.getElementById('copy-button');
const copyBtnTextEl = document.getElementById('copy-btn-text');
const copyIconEl = document.getElementById('copy-icon');
const successIconEl = document.getElementById('success-icon');
const cashAppLinkEl = document.getElementById('cashapp-link') as HTMLAnchorElement | null;

// Apple Cash DOM Elements
const appleInputEl = document.getElementById('applecash-handle-input') as HTMLInputElement | null;
const appleCopyBtnEl = document.getElementById('apple-copy-btn');
const appleCopyBtnTextEl = document.getElementById('apple-copy-btn-text');

// Google Pay DOM Elements
const googleInputEl = document.getElementById('googlepay-handle-input') as HTMLInputElement | null;
const googleCopyBtnEl = document.getElementById('google-copy-btn');
const googleCopyBtnTextEl = document.getElementById('google-copy-btn-text');

// Payment Methods Tabs DOM Elements
const tabCashApp = document.getElementById('tab-cashapp');
const tabAppleCash = document.getElementById('tab-applecash');
const tabGooglePay = document.getElementById('tab-googlepay');
const panelCashApp = document.getElementById('panel-cashapp');
const panelAppleCash = document.getElementById('panel-applecash');
const panelGooglePay = document.getElementById('panel-googlepay');

// Theme Switcher DOM Elements
const themeSwitcherBtn = document.getElementById('theme-switcher');

// PWA Install Button DOM Elements
const pwaInstallBtn = document.getElementById('pwa-install-btn');

// Budget Itemized Progress DOM Elements
const materialsStatusEl = document.getElementById('materials-status');
const materialsProgressEl = document.getElementById('materials-progress');
const materialsPercentEl = document.getElementById('materials-percent');
const materialsFundedValEl = document.getElementById('materials-funded-val');
const textbookSecuredBadgeEl = document.getElementById('textbook-secured-badge');

const voucherStatusEl = document.getElementById('voucher-status');
const voucherProgressEl = document.getElementById('voucher-progress');
const voucherPercentEl = document.getElementById('voucher-percent');
const voucherFundedValEl = document.getElementById('voucher-funded-val');

// Contribution Impact Estimator DOM Elements
const estChips = document.querySelectorAll('.est-chip');
const estInputEl = document.getElementById('estimator-input') as HTMLInputElement | null;
const estImpactEl = document.getElementById('estimator-impact');

// Roadmap Milestone DOM Elements
const msDot1 = document.getElementById('ms-dot-1');
const msStatus1 = document.getElementById('ms-status-1');
const msDot2 = document.getElementById('ms-dot-2');
const msStatus2 = document.getElementById('ms-status-2');
const msDot3 = document.getElementById('ms-dot-3');
const msStatus3 = document.getElementById('ms-status-3');
const msDot4 = document.getElementById('ms-dot-4');
const msStatus4 = document.getElementById('ms-status-4');

// Simulator DOM Elements
const toggleSimulatorBtn = document.getElementById('toggle-simulator');
const closeSimulatorBtn = document.getElementById('close-simulator');
const simulatorPanel = document.getElementById('simulator-panel');
const simRaisedSlider = document.getElementById('sim-raised-slider') as HTMLInputElement | null;
const simRaisedVal = document.getElementById('sim-raised-val');
const simContribSlider = document.getElementById('sim-contrib-slider') as HTMLInputElement | null;
const simContribVal = document.getElementById('sim-contrib-val');

// PWA Update Banner DOM Elements
const updateToastEl = document.getElementById('update-toast');
const reloadBtnEl = document.getElementById('reload-btn');

const srAnnouncementEl = document.getElementById('sr-announcement');
const pwaStatusEl = document.getElementById('pwa-status');
const pwaStatusTextEl = document.getElementById('pwa-status-text');

let waitingWorker: ServiceWorker | null = null;
let deferredPrompt: any = null;

/**
 * Interactive Particle Network Engine
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

let particles: Particle[] = [];
const particleCount = 45;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let mouseX = 0;
let mouseY = 0;
let isMouseActive = false;

function initParticles(): void {
  canvas = document.getElementById('particle-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  if (!ctx) return;

  resizeCanvas();
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.2 + 0.8
    });
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseActive = true;
  });
  window.addEventListener('mouseleave', () => {
    isMouseActive = false;
  });

  animateParticles();
}

function resizeCanvas(): void {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function getPrimaryThemeColor(): string {
  return getComputedStyle(document.body).getPropertyValue('--color-primary-rgb').trim() || '16, 185, 129';
}

function animateParticles(): void {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const themeColor = getPrimaryThemeColor();

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas!.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas!.height) p.vy *= -1;

    ctx!.beginPath();
    ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx!.fillStyle = `rgba(${themeColor}, 0.2)`;
    ctx!.fill();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        const opacity = (1 - dist / 100) * 0.06;
        ctx.strokeStyle = `rgba(${themeColor}, ${opacity})`;
        ctx.stroke();
      }
    }
  }

  if (isMouseActive) {
    particles.forEach((p) => {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(mouseX, mouseY);
        const opacity = (1 - dist / 140) * 0.08;
        ctx!.strokeStyle = `rgba(${themeColor}, ${opacity})`;
        ctx!.stroke();
      }
    });
  }

  requestAnimationFrame(animateParticles);
}

/**
 * 3D Hover Tilt Interactive Cards
 */
function initTiltEffects(): void {
  const cards = document.querySelectorAll('.glass-hover');
  cards.forEach((card) => {
    const el = card as HTMLElement;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -(y - centerY) / (centerY / 5); // Subtle 3D tilt angle
      const rotateY = (x - centerX) / (centerX / 5);

      el.style.transform = `perspective(800px) scale(1.01) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      el.style.transition = 'transform 0.1s ease-out';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(800px) scale(1) rotateX(0deg) rotateY(0deg)';
      el.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });
  });
}

/**
 * Outbound referrers / Defense anti-clickjacking check
 */
function preventClickjacking(): void {
  if (window.self !== window.top) {
    try {
      if (window.top) {
        window.top.location.href = window.self.location.href;
      }
    } catch {
      window.location.replace(window.self.location.href);
    }
  }
}

/**
 * Formats value as currency.
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
}

/**
 * Updates Study Roadmap timeline milestones dynamically based on funding totals.
 */
function updateRoadmapProgress(raised: number): void {
  // Milestone 1: Purchase study guides ($20 target)
  if (msDot1 && msStatus1) {
    if (raised >= 20) {
      msStatus1.textContent = "COMPLETED";
      msStatus1.className = "text-[9px] font-mono font-bold text-theme-primary transition-colors duration-300";
      msDot1.className = "absolute -left-[36px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-theme-primary milestone-glow ring-4 ring-zinc-950 transition-all duration-300";
    } else {
      msStatus1.textContent = "PENDING";
      msStatus1.className = "text-[9px] font-mono font-bold text-zinc-500";
      msDot1.className = "absolute -left-[36px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-800 ring-4 ring-zinc-950 transition-all duration-300";
    }
  }

  // Milestone 2: Video Courses (active after materials are bought, secured once voucher is funded)
  if (msDot2 && msStatus2) {
    if (raised >= 431) {
      msStatus2.textContent = "COMPLETED";
      msStatus2.className = "text-[9px] font-mono font-bold text-theme-primary transition-colors duration-300";
      msDot2.className = "absolute -left-[36px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-theme-primary milestone-glow ring-4 ring-zinc-950 transition-all duration-300";
    } else if (raised >= 20) {
      msStatus2.textContent = "IN PROGRESS";
      msStatus2.className = "text-[9px] font-mono font-bold text-indigo-400 transition-colors duration-300";
      msDot2.className = "absolute -left-[36px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-500 ring-4 ring-zinc-950 transition-all duration-300";
    } else {
      msStatus2.textContent = "PENDING";
      msStatus2.className = "text-[9px] font-mono font-bold text-zinc-500";
      msDot2.className = "absolute -left-[36px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-850 ring-4 ring-zinc-950 transition-all duration-300";
    }
  }

  // Milestone 3: Mock Exams (active once raised reaches $200, completed at 100% funding)
  if (msDot3 && msStatus3) {
    if (raised >= 431) {
      msStatus3.textContent = "COMPLETED";
      msStatus3.className = "text-[9px] font-mono font-bold text-theme-primary transition-colors duration-300";
      msDot3.className = "absolute -left-[36px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-theme-primary milestone-glow ring-4 ring-zinc-950 transition-all duration-300";
    } else if (raised >= 200) {
      msStatus3.textContent = "IN PROGRESS";
      msStatus3.className = "text-[9px] font-mono font-bold text-indigo-400 transition-colors duration-300";
      msDot3.className = "absolute -left-[36px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-500 ring-4 ring-zinc-950 transition-all duration-300";
    } else {
      msStatus3.textContent = "PENDING";
      msStatus3.className = "text-[9px] font-mono font-bold text-zinc-650";
      msDot3.className = "absolute -left-[36px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-900 ring-4 ring-zinc-950 transition-all duration-300";
    }
  }

  // Milestone 4: Certification Exam day (Scheduled at $431 funding)
  if (msDot4 && msStatus4) {
    if (raised >= 431) {
      msStatus4.textContent = "SCHEDULED";
      msStatus4.className = "text-[9px] font-mono font-bold text-theme-primary transition-colors duration-300";
      msDot4.className = "absolute -left-[36px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-theme-primary milestone-glow ring-4 ring-zinc-950 transition-all duration-300";
    } else {
      msStatus4.textContent = "PENDING";
      msStatus4.className = "text-[9px] font-mono font-bold text-zinc-650";
      msDot4.className = "absolute -left-[36px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-900 ring-4 ring-zinc-950 transition-all duration-300";
    }
  }
}

/**
 * Updates itemized budget progress cards in real-time.
 */
function updateItemizedBudgetProgress(raised: number): void {
  const targetMaterials = 20.00;
  const targetVoucher = 411.00;

  // 1. Study Materials Progress
  const fundedMaterials = Math.min(raised, targetMaterials);
  const materialsPercent = Math.min(Math.round((fundedMaterials / targetMaterials) * 100), 100);

  if (materialsFundedValEl) materialsFundedValEl.textContent = `Funded: ${formatCurrency(fundedMaterials)}`;
  if (materialsPercentEl) materialsPercentEl.textContent = `${materialsPercent}%`;
  if (materialsProgressEl) materialsProgressEl.style.width = `${materialsPercent}%`;
  
  if (materialsStatusEl) {
    if (materialsPercent >= 100) {
      materialsStatusEl.textContent = "SECURED";
      materialsStatusEl.className = "text-[9px] px-1.5 py-0.5 rounded bg-theme-dark/30 text-theme-primary font-bold border border-theme-primary/10 transition-colors";
      if (textbookSecuredBadgeEl) {
        textbookSecuredBadgeEl.classList.remove('hidden');
      }
    } else {
      if (textbookSecuredBadgeEl) {
        textbookSecuredBadgeEl.classList.add('hidden');
      }
      if (materialsPercent > 0) {
        materialsStatusEl.textContent = "FUNDING";
        materialsStatusEl.className = "text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700";
      } else {
        materialsStatusEl.textContent = "PENDING";
        materialsStatusEl.className = "text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-transparent";
      }
    }
  }

  // 2. Exam Voucher Progress
  const fundedVoucher = Math.max(0, Math.min(raised - targetMaterials, targetVoucher));
  const voucherPercent = Math.min(Math.round((fundedVoucher / targetVoucher) * 100), 100);

  if (voucherFundedValEl) voucherFundedValEl.textContent = `Funded: ${formatCurrency(fundedVoucher)}`;
  if (voucherPercentEl) voucherPercentEl.textContent = `${voucherPercent}%`;
  if (voucherProgressEl) voucherProgressEl.style.width = `${voucherPercent}%`;
  
  if (voucherStatusEl) {
    if (voucherPercent >= 100) {
      voucherStatusEl.textContent = "SECURED";
      voucherStatusEl.className = "text-[9px] px-1.5 py-0.5 rounded bg-theme-dark/30 text-theme-primary font-bold border border-theme-primary/10 transition-colors";
    } else if (voucherPercent > 0) {
      voucherStatusEl.textContent = "FUNDING";
      voucherStatusEl.className = "text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700";
    } else {
      voucherStatusEl.textContent = "PENDING";
      voucherStatusEl.className = "text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-transparent";
    }
  }
}

/**
 * Calculates progress fill & syncs metrics.
 */
function updateProgress(): void {
  const progressRatio = CAMPAIGN_CONFIG.raisedAmount / CAMPAIGN_CONFIG.goalAmount;
  const progressPercentage = Math.min(Math.round(progressRatio * 100), 100);

  if (progressPercentEl) {
    progressPercentEl.textContent = `${progressPercentage}%`;
  }

  if (progressFillEl) {
    progressFillEl.style.width = `${progressPercentage}%`;
  }

  updateItemizedBudgetProgress(CAMPAIGN_CONFIG.raisedAmount);
  updateRoadmapProgress(CAMPAIGN_CONFIG.raisedAmount);
}

/**
 * Contribution Impact calculator
 */
function calculateContributionImpact(amount: number): void {
  if (isNaN(amount) || amount <= 0) {
    if (estImpactEl) {
      estImpactEl.textContent = "Enter a contribution amount above to view its direct impact.";
    }
    return;
  }

  const targetMaterials = 20.00;
  const targetVoucher = 411.00;
  let impactText = "";

  if (amount < targetMaterials) {
    const matPercent = Math.round((amount / targetMaterials) * 100);
    impactText = `A contribution of ${formatCurrency(amount)} will fund ${matPercent}% of the Study Guide & Practice materials.`;
  } else if (amount === targetMaterials) {
    impactText = `A contribution of ${formatCurrency(amount)} will 100% fund and secure the Study Guide & Practice materials!`;
  } else if (amount > targetMaterials && amount < CAMPAIGN_CONFIG.goalAmount) {
    const voucherFunded = amount - targetMaterials;
    const voucherPercent = Math.round((voucherFunded / targetVoucher) * 100);
    impactText = `A contribution of ${formatCurrency(amount)} will 100% fund the Study Guide ($20.00) and cover ${voucherPercent}% of the SY0-701 Exam Voucher.`;
  } else if (amount === CAMPAIGN_CONFIG.goalAmount) {
    impactText = `A contribution of ${formatCurrency(amount)} will 100% fund the ENTIRE campaign! Both the Exam Voucher and Study Materials will be fully secured!`;
  } else {
    const excess = amount - CAMPAIGN_CONFIG.goalAmount;
    impactText = `A contribution of ${formatCurrency(amount)} will 100% fund the entire campaign and donate ${formatCurrency(excess)} directly to open-source security tool development.`;
  }

  if (estImpactEl) {
    estImpactEl.textContent = impactText;
  }
}

/**
 * Preset active chip handler
 */
function updateActivePresetChip(selectedAmount: number | null): void {
  estChips.forEach((chip) => {
    const amountAttr = chip.getAttribute('data-amount');
    const chipAmount = amountAttr ? parseFloat(amountAttr) : null;
    
    if (chipAmount === selectedAmount) {
      chip.className = "est-chip px-2.5 py-1.5 bg-theme-primary text-zinc-950 font-bold border border-transparent text-xs font-mono rounded-lg transition-all cursor-pointer";
    } else {
      chip.className = "est-chip px-2.5 py-1.5 bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs font-mono rounded-lg transition-all cursor-pointer";
    }
  });
}

/**
 * Estimator events initialization
 */
function setupEstimatorEvents(): void {
  estChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const amountAttr = chip.getAttribute('data-amount');
      const amount = amountAttr ? parseFloat(amountAttr) : 0;
      
      if (estInputEl) {
        estInputEl.value = amount.toString();
      }
      
      updateActivePresetChip(amount);
      calculateContributionImpact(amount);
    });
  });

  if (estInputEl) {
    estInputEl.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const amount = parseFloat(target.value);
      
      updateActivePresetChip(null);
      calculateContributionImpact(amount);
    });
  }

  if (estInputEl) {
    estInputEl.value = "50";
  }
  updateActivePresetChip(50);
  calculateContributionImpact(50);
}

/**
 * Initializes variables in UI
 */
function initializeCampaign(): void {
  document.title = CAMPAIGN_CONFIG.campaignName;
  
  if (raisedAmountEl) raisedAmountEl.textContent = formatCurrency(CAMPAIGN_CONFIG.raisedAmount);
  if (goalAmountEl) goalAmountEl.textContent = formatCurrency(CAMPAIGN_CONFIG.goalAmount);
  if (contributionCountEl) contributionCountEl.textContent = CAMPAIGN_CONFIG.contributorCount.toString();
  if (daysRemainingEl) daysRemainingEl.textContent = CAMPAIGN_CONFIG.daysRemaining.toString();
  
  if (cashAppInputEl) {
    cashAppInputEl.value = CAMPAIGN_CONFIG.cashAppHandle;
  }
  if (cashAppLinkEl) {
    cashAppLinkEl.href = `https://cash.app/${CAMPAIGN_CONFIG.cashAppHandle}`;
  }

  if (appleInputEl) {
    appleInputEl.value = CAMPAIGN_CONFIG.appleCashIdentifier;
  }

  if (googleInputEl) {
    googleInputEl.value = CAMPAIGN_CONFIG.googlePayIdentifier;
  }

  updateProgress();
}

/**
 * Generic copy action
 */
async function performCopy(text: string, btnTextEl: HTMLElement | null, triggerButton: HTMLElement | null): Promise<void> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      throw new Error('Clipboard blocked');
    }

    if (btnTextEl && triggerButton) {
      const originalText = btnTextEl.textContent || "COPY";
      btnTextEl.textContent = "COPIED";
      triggerButton.classList.remove('bg-theme-primary', 'hover:bg-theme-hover');
      triggerButton.classList.add('bg-zinc-850', 'text-theme-primary', 'border', 'border-theme-primary/30');

      if (srAnnouncementEl) {
        srAnnouncementEl.textContent = `Copied handle: ${text}`;
      }

      setTimeout(() => {
        btnTextEl.textContent = originalText;
        triggerButton.classList.add('bg-theme-primary', 'hover:bg-theme-hover');
        triggerButton.classList.remove('bg-zinc-850', 'text-theme-primary', 'border', 'border-theme-primary/30');
        triggerButton.focus();
        
        if (srAnnouncementEl) {
          srAnnouncementEl.textContent = "";
        }
      }, 1500);
    }
  } catch (err) {
    console.error('Copy blocked: ', err);
  }
}

/**
 * CashApp Copy
 */
async function copyCashAppToClipboard(): Promise<void> {
  const textToCopy = CAMPAIGN_CONFIG.cashAppHandle;
  
  if (copyBtnTextEl && copyIconEl && successIconEl && copyButtonEl) {
    copyIconEl.classList.add('hidden');
    successIconEl.classList.remove('hidden');
    
    await performCopy(textToCopy, copyBtnTextEl, copyButtonEl);
    
    setTimeout(() => {
      copyIconEl.classList.remove('hidden');
      successIconEl.classList.add('hidden');
    }, 1500);
  }
}

/**
 * Network / Encryption indicator status
 */
function updateConnectionStatus(): void {
  if (pwaStatusEl && pwaStatusTextEl) {
    if (navigator.onLine) {
      pwaStatusEl.className = "flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-900 bg-zinc-950/60 text-[10px] md:text-xs font-mono text-zinc-400";
      pwaStatusTextEl.textContent = "ONLINE & SECURE";
      
      const badgeIndicator = pwaStatusEl.querySelector('span');
      if (badgeIndicator) {
        badgeIndicator.className = "w-1.5 h-1.5 rounded-full bg-theme-primary inline-block status-dot transition-colors duration-300";
      }
    } else {
      pwaStatusEl.className = "flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-950/40 bg-amber-950/15 text-[10px] md:text-xs font-mono text-amber-500";
      pwaStatusTextEl.textContent = "OFFLINE - CACHED";
      
      const badgeIndicator = pwaStatusEl.querySelector('span');
      if (badgeIndicator) {
        badgeIndicator.className = "w-1.5 h-1.5 rounded-full bg-amber-500 inline-block";
      }
    }
  }
}

/**
 * Theme switcher
 */
function cycleTheme(): void {
  const currentTheme = THEMES.find(t => document.body.classList.contains(t)) || 'theme-emerald';
  const currentIndex = THEMES.indexOf(currentTheme);
  const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];

  document.body.classList.remove(...THEMES);
  document.body.classList.add(nextTheme);

  localStorage.setItem(LOCAL_STORAGE_THEME_KEY, nextTheme);
}

/**
 * Load persisted theme
 */
function loadPersistedTheme(): void {
  const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
  if (savedTheme && THEMES.includes(savedTheme)) {
    document.body.classList.remove(...THEMES);
    document.body.classList.add(savedTheme);
  } else {
    document.body.classList.add('theme-emerald');
  }
}

/**
 * Simulator controls
 */
function handleSimRaisedInput(e: Event): void {
  const target = e.target as HTMLInputElement;
  const value = parseFloat(target.value);
  
  CAMPAIGN_CONFIG.raisedAmount = value;

  if (simRaisedVal) simRaisedVal.textContent = formatCurrency(value);
  if (raisedAmountEl) raisedAmountEl.textContent = formatCurrency(value);
  updateProgress();
}

function handleSimContribInput(e: Event): void {
  const target = e.target as HTMLInputElement;
  const value = parseInt(target.value, 10);
  
  CAMPAIGN_CONFIG.contributorCount = value;

  if (simContribVal) simContribVal.textContent = value.toString();
  if (contributionCountEl) contributionCountEl.textContent = value.toString();
}

/**
 * FAQ expand keyboard navigation & ARIA sync
 */
function setupDetailsA11y(): void {
  const detailsElements = document.querySelectorAll('details');
  detailsElements.forEach((detail) => {
    const summary = detail.querySelector('summary');
    if (summary) {
      summary.setAttribute('aria-expanded', detail.open ? 'true' : 'false');
      
      detail.addEventListener('toggle', () => {
        summary.setAttribute('aria-expanded', detail.open ? 'true' : 'false');
      });

      summary.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          detail.open = !detail.open;
        }
      });
    }
  });
}

/**
 * Setup Payment tab behaviors
 */
function setupPaymentTabs(): void {
  const tabs = [tabCashApp, tabAppleCash, tabGooglePay];
  const panels = [panelCashApp, panelAppleCash, panelGooglePay];

  tabs.forEach((tab, index) => {
    if (tab) {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          if (t) {
            t.setAttribute('aria-selected', 'false');
            t.className = "py-2 text-[10px] font-mono font-bold rounded-lg text-zinc-500 hover:text-zinc-300 cursor-pointer transition-all";
          }
        });
        tab.setAttribute('aria-selected', 'true');
        tab.className = "py-2 text-[10px] font-mono font-bold rounded-lg bg-zinc-900 text-theme-primary cursor-pointer transition-all";

        panels.forEach((panel) => {
          if (panel) {
            panel.classList.add('hidden');
          }
        });
        const activePanel = panels[index];
        if (activePanel) {
          activePanel.classList.remove('hidden');
        }
      });
    }
  });

  if (appleCopyBtnEl && appleCopyBtnTextEl) {
    appleCopyBtnEl.addEventListener('click', () => {
      performCopy(CAMPAIGN_CONFIG.appleCashIdentifier, appleCopyBtnTextEl, appleCopyBtnEl);
    });
  }

  if (googleCopyBtnEl && googleCopyBtnTextEl) {
    googleCopyBtnEl.addEventListener('click', () => {
      performCopy(CAMPAIGN_CONFIG.googlePayIdentifier, googleCopyBtnTextEl, googleCopyBtnEl);
    });
  }
}

/**
 * setup PWA install banner
 */
function setupInstallButton(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaInstallBtn) {
      pwaInstallBtn.classList.remove('hidden');
    }
  });

  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Outcome choice: ${outcome}`);
        deferredPrompt = null;
        pwaInstallBtn.classList.add('hidden');
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (pwaInstallBtn) {
      pwaInstallBtn.classList.add('hidden');
    }
  });

  if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
    if (pwaInstallBtn) {
      pwaInstallBtn.classList.add('hidden');
    }
  }
}

function showUpdateToast(worker: ServiceWorker): void {
  waitingWorker = worker;
  if (updateToastEl) {
    updateToastEl.classList.remove('hidden');
  }
}

function setupServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then((reg) => {
          if (reg.waiting) {
            showUpdateToast(reg.waiting);
          }

          reg.addEventListener('updatefound', () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  showUpdateToast(installingWorker);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('Worker registration error:', err);
        });
    });

    if (reloadBtnEl) {
      reloadBtnEl.addEventListener('click', () => {
        if (waitingWorker) {
          waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }
}

// Event Bindings
if (copyButtonEl) copyButtonEl.addEventListener('click', copyCashAppToClipboard);
if (themeSwitcherBtn) themeSwitcherBtn.addEventListener('click', cycleTheme);

if (toggleSimulatorBtn && simulatorPanel) {
  toggleSimulatorBtn.addEventListener('click', () => {
    simulatorPanel.classList.toggle('hidden');
  });
}

if (closeSimulatorBtn && simulatorPanel) {
  closeSimulatorBtn.addEventListener('click', () => {
    simulatorPanel.classList.add('hidden');
  });
}

if (simRaisedSlider) simRaisedSlider.addEventListener('input', handleSimRaisedInput);
if (simContribSlider) simContribSlider.addEventListener('input', handleSimContribInput);

window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);

// Entry Initialization
document.addEventListener('DOMContentLoaded', () => {
  preventClickjacking();
  loadPersistedTheme();
  initializeCampaign();
  setupDetailsA11y();
  setupEstimatorEvents();
  setupPaymentTabs();
  setupInstallButton();
  updateConnectionStatus();
  setupServiceWorker();
  
  // Interactive Overhauls
  initParticles();
  initTiltEffects();
});
