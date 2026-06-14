/* ============================================================
   VITRALES DEL CAJÓN — Interactive Engine v2
   index.html only (catalogo & admin have their own scripts)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE    = '56999977550';
  const STORAGE_CHECKOUT  = 'vitralesCheckoutCart';
  const whatsappLink = (msg) => `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(msg)}`;

  // Lazy loading for non-hero images
  document.querySelectorAll('img').forEach(img => {
    if (!img.closest('.hero, .preloader') && !img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
  });

  // ── Preloader ──────────────────────────────
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 600);
      }, 800);
    });
    setTimeout(() => {
      if (preloader && !preloader.classList.contains('hidden')) preloader.classList.add('hidden');
    }, 3000);
  }

  // ── Hero Carousel ──────────────────────────
  const heroSlides = document.querySelectorAll('.carousel-slide');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroSlides.length > 1 && !prefersReduced) {
    let active = 0;
    setInterval(() => {
      heroSlides[active].classList.remove('active');
      active = (active + 1) % heroSlides.length;
      heroSlides[active].classList.add('active');
    }, 5000);
  }

  // ── Navbar Scroll ──────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── Mobile Nav Toggle ──────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // ── Active Nav Link ─────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navItems = navLinks ? navLinks.querySelectorAll('a') : [];
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });
  sections.forEach(s => sectionObs.observe(s));

  // ── Scroll Reveal ──────────────────────────
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── Toast ──────────────────────────────────
  const toast      = document.getElementById('toast');
  const toastMsg   = document.getElementById('toastMessage');
  let toastTimer;
  function showToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // ── Cart System (index.html) ─────────────────
  const STORAGE_CART = 'vitralesCatalogCart';
  const getCart  = () => JSON.parse(localStorage.getItem(STORAGE_CART) || '[]');
  const saveCart = c  => localStorage.setItem(STORAGE_CART, JSON.stringify(c));
  const getStoredProducts = () => JSON.parse(localStorage.getItem('vitralesCatalogProducts') || '[]');

  const cartToggle  = document.getElementById('cartToggle');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawer  = document.getElementById('cartDrawer');
  const cartClose   = document.getElementById('cartClose');
  const cartBadge   = document.getElementById('cartBadge');
  const cartItems   = document.getElementById('cartItems');
  const cartEmpty   = document.getElementById('cartEmpty');
  const cartFooter  = document.getElementById('cartFooter');
  const cartTotal   = document.getElementById('cartTotal');

  const formatPrice = v => '$' + Number(v || 0).toLocaleString('es-CL');

  function updateCartBadge() {
    if (!cartBadge) return;
    const n = getCart().reduce((s, i) => s + i.qty, 0);
    cartBadge.textContent = n;
  }

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCart();
  }

  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function addToCart(productId) {
    const products = getStoredProducts();
    const product = products.find(p => p.id === productId);
    if (!product || product.inStock === false) return;
    const cart = getCart();
    const ex = cart.find(i => i.id === productId);
    if (ex) ex.qty += 1;
    else cart.push({ id: productId, qty: 1 });
    saveCart(cart);
    updateCartBadge();
    renderCart();
    showToast(`"${product.name}" agregado al carrito`);
  }

  function removeFromCart(productId) {
    saveCart(getCart().filter(i => i.id !== productId));
    updateCartBadge();
    renderCart();
  }

  function renderCart() {
    if (!cartItems) return;
    const products = getStoredProducts();
    const cart = getCart();

    if (!cart.length) {
      if (cartEmpty)  cartEmpty.style.display = '';
      if (cartFooter) cartFooter.style.display = 'none';
      cartItems.innerHTML = '';
      cartItems.appendChild(cartEmpty);
      return;
    }

    if (cartEmpty)  cartEmpty.style.display = 'none';
    if (cartFooter) cartFooter.style.display = '';

    const rows = cart.map(item => {
      const p = products.find(x => x.id === item.id);
      if (!p) return '';
      return `<div class="cart-item-row" data-id="${p.id}" style="display:flex;gap:0.85rem;padding:1rem 0;border-bottom:1px solid rgba(12,45,131,0.07);">
        <img src="${p.image}" alt="${p.name}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;flex-shrink:0;" loading="lazy" onerror="this.src=''">
        <div style="flex:1;min-width:0;">
          <p style="font-size:0.78rem;font-weight:700;color:var(--deep-blue);margin-bottom:2px;">${p.name}</p>
          <p style="font-size:0.7rem;color:#6f7178;margin-bottom:6px;">${p.category}</p>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;">
            <div style="display:flex;align-items:center;gap:0.4rem;">
              <button type="button" class="cart-qty-btn" data-id="${p.id}" data-qty="${item.qty-1}"
                style="width:26px;height:26px;border-radius:50%;border:1px solid rgba(12,45,131,0.15);background:#f5f5f7;cursor:pointer;font-weight:700;">−</button>
              <span style="font-size:0.85rem;font-weight:700;width:20px;text-align:center;">${item.qty}</span>
              <button type="button" class="cart-qty-btn" data-id="${p.id}" data-qty="${item.qty+1}"
                style="width:26px;height:26px;border-radius:50%;border:1px solid rgba(12,45,131,0.15);background:#f5f5f7;cursor:pointer;font-weight:700;">+</button>
            </div>
            <span style="font-size:0.82rem;font-weight:800;color:var(--deep-blue);">${formatPrice(p.price * item.qty)}</span>
          </div>
        </div>
      </div>`;
    }).filter(Boolean).join('');

    const totalAmount = cart.reduce((s, item) => {
      const p = products.find(x => x.id === item.id);
      return s + (p ? p.price * item.qty : 0);
    }, 0);

    if (cartTotal) cartTotal.textContent = formatPrice(totalAmount);

    // Clear and repopulate
    cartItems.innerHTML = '';
    if (cartEmpty) {
      cartEmpty.style.display = 'none';
      cartItems.appendChild(cartEmpty);
    }
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rows;
    while (tempDiv.firstChild) cartItems.appendChild(tempDiv.firstChild);

    // Qty buttons
    cartItems.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const qty = Number(btn.dataset.qty);
        const cart = getCart();
        const updated = cart.map(i => i.id === id ? { ...i, qty: Math.max(0, qty) } : i).filter(i => i.qty > 0);
        saveCart(updated);
        updateCartBadge();
        renderCart();
      });
    });
  }

  if (cartToggle)  cartToggle.addEventListener('click', openCart);
  if (cartClose)   cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const products = getStoredProducts();
      const cart = getCart();
      if (!cart.length) { showToast('Agrega una obra antes de ir al checkout'); return; }
      const items = cart.map(i => {
        const p = products.find(x => x.id === i.id);
        return p ? { ...p, qty: i.qty } : null;
      }).filter(Boolean);
      localStorage.setItem(STORAGE_CHECKOUT, JSON.stringify(items));
      window.location.href = 'checkout.html';
    });
  }

  // ── Glass Style Selector ───────────────────
  const glassStyles = document.getElementById('glassStyles');
  if (glassStyles) {
    glassStyles.querySelectorAll('.glass-style-option').forEach(opt => {
      opt.addEventListener('click', () => {
        glassStyles.querySelectorAll('.glass-style-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });
  }

  // ── Cotizador Form ─────────────────────────
  const cotizadorForm = document.getElementById('cotizadorForm');
  if (cotizadorForm) {
    cotizadorForm.addEventListener('submit', e => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitCotizacion');
      const originalHTML = submitBtn.innerHTML;
      const selectedStyle = document.querySelector('.glass-style-option.selected')?.dataset.style || 'No definido';
      const msg = [
        'Hola, quiero solicitar una cotización a Vitrales del Cajón.',
        '',
        `Nombre: ${document.getElementById('nombre')?.value || 'No indicado'}`,
        `Email: ${document.getElementById('email')?.value || 'No indicado'}`,
        `Teléfono: ${document.getElementById('telefono')?.value || 'No indicado'}`,
        `Tipo de pieza: ${document.getElementById('tipo-pieza')?.selectedOptions?.[0]?.textContent || 'No indicado'}`,
        `Medidas: ${document.getElementById('medida-ancho')?.value || '-'} × ${document.getElementById('medida-alto')?.value || '-'} × ${document.getElementById('medida-profundo')?.value || '-'} cm`,
        `Estilo de vidrio: ${selectedStyle}`,
        `Presupuesto: ${document.getElementById('presupuesto')?.selectedOptions?.[0]?.textContent || 'No indicado'}`,
        '',
        `Idea: ${document.getElementById('descripcion')?.value || 'No indicada'}`
      ].join('\n');

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Abriendo WhatsApp...';
        showToast('Abriendo WhatsApp para enviar tu cotización ✓');
        window.location.href = whatsappLink(msg);
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
          cotizadorForm.reset();
          const firstStyle = glassStyles?.querySelector('.glass-style-option');
          if (firstStyle) firstStyle.classList.add('selected');
        }, 4000);
      }, 1400);
    });
  }

  // ── Newsletter ─────────────────────────────
  const nlSubmit = document.getElementById('newsletter-submit');
  if (nlSubmit) {
    nlSubmit.addEventListener('click', e => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      if (emailInput?.value.includes('@')) {
        showToast('¡Gracias por suscribirte! 💎');
        emailInput.value = '';
      } else {
        showToast('Por favor ingresa un correo válido');
      }
    });
  }

  // ── Smooth Scroll ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = (navbar?.offsetHeight || 70) + 20;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  // ── Counter Animation ──────────────────────
  const storyStats = document.querySelector('.story-stats');
  let statsAnimated = false;
  if (storyStats) {
    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          document.querySelectorAll('.stat-number').forEach(el => {
            const match = el.textContent.match(/(\d+)/);
            if (!match) return;
            const target = parseInt(match[1]);
            const suffix = el.textContent.replace(match[1], '');
            const start = performance.now();
            const dur = 2000;
            function update(now) {
              const p = Math.min((now - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              el.innerHTML = Math.floor(eased * target) + suffix.replace(/(\+|%)/, '<span>$1</span>');
              if (p < 1) requestAnimationFrame(update);
              else el.innerHTML = target + suffix.replace(/(\+|%)/, '<span>$1</span>');
            }
            requestAnimationFrame(update);
          });
          statsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statsObs.observe(storyStats);
  }

  // ── Keyboard ───────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });

  // ── Init ───────────────────────────────────
  updateCartBadge();
  renderCart();
});
