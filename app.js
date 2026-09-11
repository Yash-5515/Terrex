/**
 * TERREX Renewable Energy Corporate Portal
 * Interactive Application Logic & UI/UX Behaviors
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSolutionsTabs();
  initProjectFilter();
  initImpactEstimator();
  initContactForm();
  initStatsCounter();
  initAccordion();
});

/**
 * 1. Navbar Scroll State & Active Spy
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ScrollSpy for Nav Links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('text-amber-400', 'font-semibold');
            link.classList.remove('text-slate-300');
          } else {
            link.classList.remove('text-amber-400', 'font-semibold');
            link.classList.add('text-slate-300');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * 2. Mobile Menu Drawer
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  const menuLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('flex');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * 3. Solutions Section Interactive Tabs
 */
function initSolutionsTabs() {
  const tabs = document.querySelectorAll('[data-solution-tab]');
  const panels = document.querySelectorAll('[data-solution-panel]');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-solution-tab');

      // Update active tab buttons
      tabs.forEach(t => {
        const isCurrent = t === tab;
        t.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        if (isCurrent) {
          t.classList.add('bg-amber-500/15', 'text-amber-400', 'border-amber-500/40');
          t.classList.remove('text-slate-400', 'border-white/10', 'bg-slate-900/40');
        } else {
          t.classList.remove('bg-amber-500/15', 'text-amber-400', 'border-amber-500/40');
          t.classList.add('text-slate-400', 'border-white/10', 'bg-slate-900/40');
        }
      });

      // Update panels with smooth transition
      panels.forEach(panel => {
        if (panel.getAttribute('data-solution-panel') === target) {
          panel.classList.remove('hidden');
          panel.style.opacity = '0';
          panel.style.transform = 'translateY(8px)';
          setTimeout(() => {
            panel.style.transition = 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
          }, 10);
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * 4. Project Portfolio Filtering
 */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('[data-project-category]');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-project-category').split(' ');
        const matches = filterValue === 'all' || categories.includes(filterValue);

        if (matches) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px) scale(0.98)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/**
 * 5. Interactive Clean Energy Impact Estimator (ESG Calculator)
 */
function initImpactEstimator() {
  const slider = document.getElementById('mw-slider');
  const mwDisplay = document.getElementById('display-mw');
  const mwhDisplay = document.getElementById('display-mwh');
  const co2Display = document.getElementById('display-co2');
  const homesDisplay = document.getElementById('display-homes');
  const treesDisplay = document.getElementById('display-trees');
  const capexDisplay = document.getElementById('display-capex');

  if (!slider) return;

  const calculateImpact = () => {
    const mw = parseFloat(slider.value);

    // Standard institutional renewable modeling factors
    // Avg 1,750 capacity factor generation hours/year (varies by irradiance)
    const annualMWh = Math.round(mw * 1750);
    // ~0.707 metric tons of CO2 offset per MWh clean solar generation vs grid baseline
    const co2Offset = Math.round(annualMWh * 0.707);
    // Typical US/EU household average consumption ~10.5 MWh/yr
    const homesPowered = Math.round(annualMWh / 10.5);
    // 1 metric ton CO2 ~ equivalent to annual sequestration of ~45 mature tree saplings
    const treesEquivalent = Math.round(co2Offset * 45);
    // Estimated institutional development & EPC value (~$0.95M/MW)
    const estimatedValue = (mw * 0.95).toFixed(1);

    if (mwDisplay) mwDisplay.textContent = `${mw} MW`;
    if (mwhDisplay) mwhDisplay.textContent = annualMWh.toLocaleString();
    if (co2Display) co2Display.textContent = co2Offset.toLocaleString();
    if (homesDisplay) homesDisplay.textContent = homesPowered.toLocaleString();
    if (treesDisplay) treesDisplay.textContent = treesEquivalent.toLocaleString();
    if (capexDisplay) capexDisplay.textContent = `$${estimatedValue}M`;
  };

  slider.addEventListener('input', calculateImpact);
  calculateImpact(); // Initial render
}

/**
 * 6. Dual-Track Contact Form (Project vs Partner)
 */
function initContactForm() {
  const trackBtns = document.querySelectorAll('[data-contact-track]');
  const trackLabel = document.getElementById('form-track-label');
  const inquirySelect = document.getElementById('inquiry-type');
  const contactForm = document.getElementById('contact-form');
  const feedbackMsg = document.getElementById('form-feedback');

  if (!trackBtns.length || !contactForm) return;

  const optionsProject = [
    { value: 'utility-scale', text: 'Utility-Scale Solar Project (50MW+)' },
    { value: 'commercial-industrial', text: 'Commercial & Industrial Solar (C&I)' },
    { value: 'epc-procurement', text: 'Turnkey EPC & Engineering Inquiry' },
    { value: 'storage-hybrid', text: 'Solar + BESS (Battery Energy Storage)' }
  ];

  const optionsPartner = [
    { value: 'institutional-capital', text: 'Institutional Investment & Tax Equity' },
    { value: 'land-lease', text: 'Landowner Ground Lease (100+ Acres)' },
    { value: 'joint-venture', text: 'Co-Development & Joint Venture' },
    { value: 'corporate-ppa', text: 'Corporate Renewable PPA Off-take' }
  ];

  trackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const track = btn.getAttribute('data-contact-track');

      trackBtns.forEach(b => {
        b.classList.remove('active', 'bg-amber-500', 'text-slate-950', 'font-bold');
        b.classList.add('text-slate-400', 'bg-slate-800/40');
      });

      btn.classList.add('active', 'bg-amber-500', 'text-slate-950', 'font-bold');
      btn.classList.remove('text-slate-400', 'bg-slate-800/40');

      if (trackLabel) {
        trackLabel.textContent = track === 'project' ? 'Project Initiation Inquiry' : 'Strategic Partnership & Capital Inquiry';
      }

      // Populate relevant dropdown options
      if (inquirySelect) {
        inquirySelect.innerHTML = '';
        const list = track === 'project' ? optionsProject : optionsPartner;
        list.forEach(item => {
          const opt = document.createElement('option');
          opt.value = item.value;
          opt.textContent = item.text;
          opt.className = 'bg-slate-900 text-white';
          inquirySelect.appendChild(opt);
        });
      }
    });
  });

  // Handle Form Submission with Accessible Feedback
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950 inline" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Transmitting to Deal Desk...
      `;
    }

    setTimeout(() => {
      if (feedbackMsg) {
        feedbackMsg.classList.remove('hidden');
        feedbackMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      contactForm.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }, 900);
  });
}

/**
 * 7. Stat Counters Animation on Scroll
 */
function initStatsCounter() {
  const statElements = document.querySelectorAll('[data-target-stat]');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target-stat'));
        const prefix = el.getAttribute('data-stat-prefix') || '';
        const suffix = el.getAttribute('data-stat-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-stat-decimals') || '0', 10);
        
        let start = 0;
        const duration = 1800;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out expo
          const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = start + (target - start) * easeOut;

          el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
          }
        };

        requestAnimationFrame(updateCount);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  statElements.forEach(el => observer.observe(el));
}

/**
 * 8. Accordions
 */
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Optional: close other accordion items
      document.querySelectorAll('.accordion-item').forEach(i => {
        if (i !== item) i.classList.remove('active');
      });

      if (isActive) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
