import './style.css';

// Campaign variables (can be modified by the user)
const CAMPAIGN_CONFIG = {
  campaignName: "CompTIA Security+ Certification Fund",
  goalAmount: 431.00,
  raisedAmount: 185.00,
  cashAppHandle: "$SecurityFund",
  contributorCount: 14,
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
const cashAppInputEl = document.getElementById('cashapp-handle-input') as HTMLInputElement | null;
const copyButtonEl = document.getElementById('copy-button');
const copyBtnTextEl = document.getElementById('copy-btn-text');
const copyIconEl = document.getElementById('copy-icon');
const successIconEl = document.getElementById('success-icon');
const srAnnouncementEl = document.getElementById('sr-announcement');
const pwaStatusEl = document.getElementById('pwa-status');
const pwaStatusTextEl = document.getElementById('pwa-status-text');

// Theme Switcher DOM Elements
const themeSwitcherBtn = document.getElementById('theme-switcher');

// PWA Install Button DOM Elements
const pwaInstallBtn = document.getElementById('pwa-install-btn');

// Budget Itemized Progress DOM Elements
const materialsStatusEl = document.getElementById('materials-status');
const materialsProgressEl = document.getElementById('materials-progress');
const materialsPercentEl = document.getElementById('materials-percent');
const materialsFundedValEl = document.getElementById('materials-funded-val');

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

let waitingWorker: ServiceWorker | null = null;
let deferredPrompt: any = null;

/**
 * Fix 2: Frame-Busting logic (Defense-in-Depth anti-clickjacking check)
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
 * Formats a number as USD currency.
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
      msDot1.className = "absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-theme-primary ring-4 ring-zinc-950 transition-colors duration-300";
    } else {
      msStatus1.textContent = "PENDING";
      msStatus1.className = "text-[9px] font-mono font-bold text-zinc-500";
      msDot1.className = "absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-800 ring-4 ring-zinc-950 transition-colors duration-300";
    }
  }

  // Milestone 2: Video Courses (active after materials are bought, secured once voucher is funded)
  if (msDot2 && msStatus2) {
    if (raised >= 431) {
      msStatus2.textContent = "COMPLETED";
      msStatus2.className = "text-[9px] font-mono font-bold text-theme-primary transition-colors duration-300";
      msDot2.className = "absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-theme-primary ring-4 ring-zinc-950 transition-colors duration-300";
    } else if (raised >= 20) {
      msStatus2.textContent = "IN PROGRESS";
      msStatus2.className = "text-[9px] font-mono font-bold text-indigo-400 transition-colors duration-300";
      msDot2.className = "absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 ring-4 ring-zinc-950 transition-colors duration-300";
    } else {
      msStatus2.textContent = "PENDING";
      msStatus2.className = "text-[9px] font-mono font-bold text-zinc-500";
      msDot2.className = "absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-850 ring-4 ring-zinc-950 transition-colors duration-300";
    }
  }

  // Milestone 3: Mock Exams (active once raised reaches $200, completed at 100% funding)
  if (msDot3 && msStatus3) {
    if (raised >= 431) {
      msStatus3.textContent = "COMPLETED";
      msStatus3.className = "text-[9px] font-mono font-bold text-theme-primary transition-colors duration-300";
      msDot3.className = "absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-theme-primary ring-4 ring-zinc-950 transition-colors duration-300";
    } else if (raised >= 200) {
      msStatus3.textContent = "IN PROGRESS";
      msStatus3.className = "text-[9px] font-mono font-bold text-indigo-400 transition-colors duration-300";
      msDot3.className = "absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 ring-4 ring-zinc-950 transition-colors duration-300";
    } else {
      msStatus3.textContent = "PENDING";
      msStatus3.className = "text-[9px] font-mono font-bold text-zinc-650";
      msDot3.className = "absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 ring-4 ring-zinc-950 transition-colors duration-300";
    }
  }

  // Milestone 4: Certification Exam day (Scheduled at $431 funding)
  if (msDot4 && msStatus4) {
    if (raised >= 431) {
      msStatus4.textContent = "SCHEDULED";
      msStatus4.className = "text-[9px] font-mono font-bold text-theme-primary transition-colors duration-300";
      msDot4.className = "absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-theme-primary ring-4 ring-zinc-950 transition-colors duration-300";
    } else {
      msStatus4.textContent = "PENDING";
      msStatus4.className = "text-[9px] font-mono font-bold text-zinc-650";
      msDot4.className = "absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 ring-4 ring-zinc-950 transition-colors duration-300";
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
      materialsStatusEl.className = "text-[10px] px-1.5 py-0.5 rounded bg-theme-dark/30 text-theme-primary font-bold border border-theme-primary/10 transition-colors";
    } else if (materialsPercent > 0) {
      materialsStatusEl.textContent = "FUNDING";
      materialsStatusEl.className = "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700";
    } else {
      materialsStatusEl.textContent = "PENDING";
      materialsStatusEl.className = "text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-transparent";
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
      voucherStatusEl.className = "text-[10px] px-1.5 py-0.5 rounded bg-theme-dark/30 text-theme-primary font-bold border border-theme-primary/10 transition-colors";
    } else if (voucherPercent > 0) {
      voucherStatusEl.textContent = "FUNDING";
      voucherStatusEl.className = "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700";
    } else {
      voucherStatusEl.textContent = "PENDING";
      voucherStatusEl.className = "text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-transparent";
    }
  }
}

/**
 * Calculates and updates progress metrics (bar width and percent label).
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

  // Sync sub-item allocations
  updateItemizedBudgetProgress(CAMPAIGN_CONFIG.raisedAmount);
  
  // Sync milestone study roadmap
  updateRoadmapProgress(CAMPAIGN_CONFIG.raisedAmount);
}

/**
 * Calculates and updates the Contribution Impact Estimator text block.
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
 * Updates selected classes for preset chips.
 */
function updateActivePresetChip(selectedAmount: number | null): void {
  estChips.forEach((chip) => {
    const amountAttr = chip.getAttribute('data-amount');
    const chipAmount = amountAttr ? parseFloat(amountAttr) : null;
    
    if (chipAmount === selectedAmount) {
      chip.className = "est-chip px-3 py-1.5 bg-theme-primary text-zinc-950 font-bold border border-transparent text-xs font-mono rounded-lg transition-all cursor-pointer";
    } else {
      chip.className = "est-chip px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs font-mono rounded-lg transition-all cursor-pointer";
    }
  });
}

/**
 * Initializes preset chip event listeners.
 */
function setupEstimatorEvents(): void {
  // Preset chips click listeners
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

  // Custom input listener
  if (estInputEl) {
    estInputEl.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const amount = parseFloat(target.value);
      
      updateActivePresetChip(null);
      calculateContributionImpact(amount);
    });
  }

  // Trigger default estimation ($50.00 preset selected)
  if (estInputEl) {
    estInputEl.value = "50";
  }
  updateActivePresetChip(50);
  calculateContributionImpact(50);
}

/**
 * Strict TypeScript DOM Initialization Guard
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

  updateProgress();
}

/**
 * Copies the CashApp handle to the clipboard and triggers accessible feedback.
 */
async function copyToClipboard(): Promise<void> {
  const textToCopy = CAMPAIGN_CONFIG.cashAppHandle;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      if (cashAppInputEl) {
        cashAppInputEl.select();
        document.execCommand('copy');
        window.getSelection()?.removeAllRanges();
      } else {
        throw new Error('No clipboard method available');
      }
    }

    // Visual feedback logic
    if (copyBtnTextEl && copyIconEl && successIconEl && copyButtonEl) {
      copyBtnTextEl.textContent = "COPIED";
      copyIconEl.classList.add('hidden');
      successIconEl.classList.remove('hidden');
      
      copyButtonEl.classList.remove('bg-theme-primary', 'hover:bg-theme-hover');
      copyButtonEl.classList.add('bg-zinc-800', 'text-theme-primary', 'border', 'border-theme-primary/50', 'shadow-theme-glow');

      if (srAnnouncementEl) {
        srAnnouncementEl.textContent = `CashApp handle ${textToCopy} copied successfully.`;
      }

      // Reset feedback after 2 seconds
      setTimeout(() => {
        copyBtnTextEl.textContent = "COPY";
        copyIconEl.classList.remove('hidden');
        successIconEl.classList.add('hidden');
        copyButtonEl.classList.add('bg-theme-primary', 'hover:bg-theme-hover');
        copyButtonEl.classList.remove('bg-zinc-800', 'text-theme-primary', 'border', 'border-theme-primary/50', 'shadow-theme-glow');
        
        copyButtonEl.focus();

        if (srAnnouncementEl) {
          srAnnouncementEl.textContent = "";
        }
      }, 2000);
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    if (srAnnouncementEl) {
      srAnnouncementEl.textContent = "Failed to copy. Please manually select and copy the handle.";
    }
  }
}

/**
 * Monitors and updates PWA online/offline status.
 */
function updateConnectionStatus(): void {
  if (pwaStatusEl && pwaStatusTextEl) {
    if (navigator.onLine) {
      pwaStatusEl.className = "flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-900 bg-zinc-950 text-[10px] md:text-xs font-mono text-zinc-400";
      pwaStatusTextEl.textContent = "ONLINE & ENCRYPTED";
      
      const badgeIndicator = pwaStatusEl.querySelector('span');
      if (badgeIndicator) {
        badgeIndicator.className = "w-2 h-2 rounded-full bg-theme-primary inline-block animate-ping transition-colors duration-300";
      }
    } else {
      pwaStatusEl.className = "flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-950/40 bg-amber-950/10 text-[10px] md:text-xs font-mono text-amber-500";
      pwaStatusTextEl.textContent = "OFFLINE MODE - CACHED";
      
      const badgeIndicator = pwaStatusEl.querySelector('span');
      if (badgeIndicator) {
        badgeIndicator.className = "w-2 h-2 rounded-full bg-amber-500 inline-block";
      }
    }
  }
}

/**
 * Cycle through available CSS themes and store selection in localStorage.
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
 * Restores the theme from localStorage on start.
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
 * Dev Simulator control: handles raised amount adjustment.
 */
function handleSimRaisedInput(e: Event): void {
  const target = e.target as HTMLInputElement;
  const value = parseFloat(target.value);
  
  CAMPAIGN_CONFIG.raisedAmount = value;

  if (simRaisedVal) simRaisedVal.textContent = formatCurrency(value);
  if (raisedAmountEl) raisedAmountEl.textContent = formatCurrency(value);
  updateProgress();
}

/**
 * Dev Simulator control: handles contributor count adjustment.
 */
function handleSimContribInput(e: Event): void {
  const target = e.target as HTMLInputElement;
  const value = parseInt(target.value, 10);
  
  CAMPAIGN_CONFIG.contributorCount = value;

  if (simContribVal) simContribVal.textContent = value.toString();
  if (contributionCountEl) contributionCountEl.textContent = value.toString();
}

/**
 * FAQ Accordion Keyboard Navigation & ARIA Synchronization
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
 * Sets up listeners for the PWA install button.
 */
function setupInstallButton(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default mini-infobar on mobile browsers
    e.preventDefault();
    deferredPrompt = e;
    
    // Unhide install button
    if (pwaInstallBtn) {
      pwaInstallBtn.classList.remove('hidden');
    }
  });

  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA installation choice outcome: ${outcome}`);
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
    console.log('PWA app installed successfully');
  });

  // Keep button hidden if already launched as standalone app
  if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
    if (pwaInstallBtn) {
      pwaInstallBtn.classList.add('hidden');
    }
  }
}

/**
 * Display Reload Toast when waiting worker is detected
 */
function showUpdateToast(worker: ServiceWorker): void {
  waitingWorker = worker;
  if (updateToastEl) {
    updateToastEl.classList.remove('hidden');
  }
}

/**
 * Register Progressive Web App with updatefound monitoring
 */
function setupServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then((reg) => {
          console.log('PWA Service Worker registered with scope:', reg.scope);

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
          console.warn('PWA Service Worker registration failed:', err);
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
if (copyButtonEl) copyButtonEl.addEventListener('click', copyToClipboard);
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
  setupInstallButton(); // Set up PWA installation listeners
  updateConnectionStatus();
  setupServiceWorker();
});
