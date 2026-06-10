/* ============================================
   VITRALES EN EL CAJÓN — Interactive Engine
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '56999977550';
  const whatsappLink = (message) => `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
  const STORAGE_CHECKOUT_CART = 'vitralesCheckoutCart';

  // Mobile performance: defer non-critical images and decode them asynchronously.
  document.querySelectorAll('img').forEach((img) => {
    if (!img.closest('.hero, .preloader') && !img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  });

  // Hero carousel
  const heroSlides = document.querySelectorAll('.carousel-slide');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroSlides.length > 1 && !prefersReducedMotion) {
    let activeHeroSlide = 0;

    setInterval(() => {
      heroSlides[activeHeroSlide].classList.remove('active');
      activeHeroSlide = (activeHeroSlide + 1) % heroSlides.length;
      heroSlides[activeHeroSlide].classList.add('active');
    }, 5000);
  }

  // ── Preloader ──────────────────────────────────────
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 600);
    }, 800);
  });

  // Fallback: hide preloader after 3s max
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  }, 3000);


  // ── Navbar Scroll Effect ───────────────────────────
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });


  // ── Mobile Navigation Toggle ───────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle) navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });


  // ── Active Nav Link Highlight ──────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinksList = navLinks.querySelectorAll('a');

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinksList.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));


  // ── Scroll Reveal Animations ───────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ── Product Filter Tabs ────────────────────────────
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');
  const filterEmpty = document.getElementById('filterEmpty');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      let visibleCount = 0;

      productCards.forEach((card, index) => {
        const category = card.dataset.category;
        const subcategory = card.dataset.subcategory;

        if (filter === 'all' || category === filter || subcategory === filter) {
          card.style.display = '';
          card.style.animation = `fadeUp 0.5s ${visibleCount * 0.06}s var(--ease-out) both`;
          visibleCount += 1;
        } else {
          card.style.display = 'none';
        }
      });

      if (filterEmpty) {
        filterEmpty.hidden = visibleCount > 0;
      }
    });
  });


  // ── Cart System ────────────────────────────────────
  const cart = [];
  const cartToggle = document.getElementById('cartToggle');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartClose = document.getElementById('cartClose');
  const cartBadge = document.getElementById('cartBadge');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotal = document.getElementById('cartTotal');

  // Product data
  const products = {
    'product-1': { name: 'Amanecer Andino', price: 385000, category: 'Pantalla de Lámparas', image: 'assets/images/tiffany_lamp.png' },
    'product-2': { name: 'Colibrí del Valle', price: 68000, category: 'Suncatcher', image: 'assets/images/suncatcher.png' },
    'product-3': { name: 'Geometría Sagrada', price: 720000, category: 'Ventanas', image: 'assets/images/window_panel.png' },
    'product-4': { name: 'Flor de Cordillera', price: 55000, category: 'Suncatcher', image: 'assets/images/suncatcher.png' },
    'product-5': { name: 'Crepúsculo Azul', price: 310000, category: 'Pantalla de Lámparas', image: 'assets/images/tiffany_lamp.png' },
    'product-6': { name: 'Mandala Chakana', price: 195000, category: 'Ventanas', image: 'assets/images/window_panel.png' },
    'product-7': { name: 'Luna del Valle', price: 180000, category: 'Suncatcher', image: 'assets/images/collection/obra_luna_hada.jpeg' },
    'product-8': { name: 'Geometría Azul', price: 200000, category: 'Decorativo', image: 'assets/images/collection/obra_escultura_azul.jpeg' },
    'product-9': { name: 'Compañero Lunar', price: 165000, category: 'Suncatcher', image: 'assets/images/collection/obra_perro_luna.jpeg' },
    'product-10': { name: 'Esfera Iridiscente', price: 195000, category: 'Decorativo', image: 'assets/images/collection/obra_esfera_iridiscente.jpeg' },
    'product-11': { name: 'Aros Hoja de Bosque', price: 85000, category: 'Joyas - Aros', image: 'assets/images/collection/obra_aros_hoja_verde.jpeg' },
    'product-12': { name: 'Colgante Arco Solar', price: 90000, category: 'Joyas - Colgantes', image: 'assets/images/collection/obra_colgante_arco_solar.jpeg' },
    'product-13': { name: 'Aros Media Luna', price: 88000, category: 'Joyas - Aros', image: 'assets/images/collection/obra_aros_media_luna.jpeg' },
    'product-14': { name: 'Aros Agua Azul', price: 92000, category: 'Joyas - Aros', image: 'assets/images/collection/obra_aros_azules.jpeg' },
    'product-15': { name: 'Aros Triángulo de Luz', price: 95000, category: 'Joyas - Aros', image: 'assets/images/collection/obra_aros_triangulo_luz.jpeg' },
    'product-16': { name: 'Aros Brasa Roja', price: 98000, category: 'Joyas - Aros', image: 'assets/images/collection/obra_aros_rojos.jpeg' },
    'product-17': { name: 'Colgante Hoja Andina', price: 89000, category: 'Joyas - Colgantes', image: 'assets/images/collection/obra_colgante_hoja.jpeg' },
    'product-18': { name: 'Colgante Bosque Ámbar', price: 96000, category: 'Joyas - Colgantes', image: 'assets/images/collection/obra_colgante_verde_ambar.jpeg' },
    'product-19': { name: 'Colgante Granate Prisma', price: 110000, category: 'Joyas - Colgantes', image: 'assets/images/collection/obra_colgante_granate.jpeg' },
    'product-20': { name: 'Colgante Círculo de Agua', price: 85000, category: 'Joyas - Colgantes', image: 'assets/images/collection/obra_colgante_circulo_agua.jpeg' },
    'product-21': { name: 'Dúo Cactus del Cajón', price: 145000, category: 'Decorativo', image: 'assets/images/collection/obra_cactus_duo.jpeg' },
    'product-22': { name: 'Mariposa Solar', price: 175000, category: 'Suncatcher', image: 'assets/images/collection/obra_mariposa_sol.jpeg' },
    'product-23': { name: 'Gato Luna Cobriza', price: 170000, category: 'Decorativo', image: 'assets/images/collection/obra_gato_luna.jpeg' }
  };

  function openCart() {
    cartOverlay.classList.add('open');
    cartDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartOverlay.classList.remove('open');
    cartDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartToggle) cartToggle.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Close cart on browse link
  const cartBrowse = document.getElementById('cart-browse');
  if (cartBrowse) {
    cartBrowse.addEventListener('click', closeCart);
  }

  function formatPrice(price) {
    return '$' + price.toLocaleString('es-CL');
  }

  function cartSummaryMessage() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const lines = cart.map((item, index) => `${index + 1}. ${item.name} — ${formatPrice(item.price)}`);
    return `Hola, quiero comprar estas obras de Vitrales del Cajón:\n\n${lines.join('\n')}\n\nTotal: ${formatPrice(total)}`;
  }

  function updateCartUI() {
    if (cartBadge) cartBadge.textContent = cart.length;

    if (cart.length === 0) {
      cartEmpty.style.display = '';
      cartFooter.style.display = 'none';
      // Remove cart items except empty message
      const items = cartItemsContainer.querySelectorAll('.cart-item');
      items.forEach(item => item.remove());
    } else {
      cartEmpty.style.display = 'none';
      cartFooter.style.display = '';

      // Rebuild cart items
      const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
      existingItems.forEach(item => item.remove());

      let total = 0;
      cart.forEach((item, index) => {
        total += item.price;
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
          <div class="cart-item-img"><img src="${item.image}" alt="${item.name}"></div>
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
          </div>
          <button class="cart-item-remove" data-index="${index}" aria-label="Eliminar"><i class="fas fa-trash-alt"></i></button>
        `;
        cartItemsContainer.appendChild(cartItemEl);
      });

      cartTotal.textContent = formatPrice(total);

      // Remove item listeners
      cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index);
          cart.splice(idx, 1);
          updateCartUI();
        });
      });
    }
  }

  function addToCart(productId) {
    const product = products[productId];
    if (product) {
      cart.push({ ...product });
      updateCartUI();
      showToast(`"${product.name}" agregado al carrito`);
    }
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (!cart.length) {
        showToast('Agrega una obra antes de finalizar');
        return;
      }

      const groupedCart = cart.reduce((items, item) => {
        const existing = items.find((entry) => entry.name === item.name);
        if (existing) {
          existing.qty += 1;
        } else {
          items.push({ ...item, qty: 1 });
        }
        return items;
      }, []);
      localStorage.setItem(STORAGE_CHECKOUT_CART, JSON.stringify(groupedCart));
      window.location.href = 'checkout.html';
    });
  }

  // Quick view buttons act as add-to-cart
  document.querySelectorAll('.product-quickview button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (card) addToCart(card.id);
    });
  });


  // ── Wishlist Toggle ────────────────────────────────
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('i');
      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.style.background = 'var(--deep-blue)';
        btn.style.color = '#fff';
        showToast('Agregado a favoritos ♥');
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.style.background = '';
        btn.style.color = '';
        showToast('Eliminado de favoritos');
      }
    });
  });


  // ── Toast Notification ─────────────────────────────
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout;

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }


  // ── Glass Style Selector ──────────────────────────
  const glassStyles = document.getElementById('glassStyles');
  if (glassStyles) {
    glassStyles.querySelectorAll('.glass-style-option').forEach(option => {
      option.addEventListener('click', () => {
        glassStyles.querySelectorAll('.glass-style-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
      });
    });
  }


  // ── Cotizador Form Submit ──────────────────────────
  const cotizadorForm = document.getElementById('cotizadorForm');
  if (cotizadorForm) {
    cotizadorForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('submitCotizacion');
      const originalText = submitBtn.innerHTML;
      const selectedStyle = document.querySelector('.glass-style-option.selected')?.dataset.style || 'No definido';
      const quoteMessage = [
        'Hola, quiero solicitar una cotización a Vitrales del Cajón.',
        '',
        `Nombre: ${document.getElementById('nombre')?.value || 'No indicado'}`,
        `Email: ${document.getElementById('email')?.value || 'No indicado'}`,
        `Teléfono: ${document.getElementById('telefono')?.value || 'No indicado'}`,
        `Tipo de pieza: ${document.getElementById('tipo-pieza')?.selectedOptions?.[0]?.textContent || 'No indicado'}`,
        `Medidas: ${document.getElementById('medida-ancho')?.value || '-'} x ${document.getElementById('medida-alto')?.value || '-'} x ${document.getElementById('medida-profundo')?.value || '-'} cm`,
        `Estilo de vidrio: ${selectedStyle}`,
        `Presupuesto: ${document.getElementById('presupuesto')?.selectedOptions?.[0]?.textContent || 'No indicado'}`,
        '',
        `Idea: ${document.getElementById('descripcion')?.value || 'No indicada'}`
      ].join('\n');

      // Loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Abriendo WhatsApp...';
        submitBtn.style.background = 'var(--turquoise)';
        showToast('Abriendo WhatsApp para enviar tu cotización');
        window.location.href = whatsappLink(quoteMessage);

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          cotizadorForm.reset();
          // Re-select default glass style
          const opalOption = document.getElementById('style-opal');
          if (opalOption) opalOption.classList.add('selected');
        }, 3000);
      }, 1500);
    });
  }


  // ── Newsletter Submit ──────────────────────────────
  const newsletterSubmit = document.getElementById('newsletter-submit');
  if (newsletterSubmit) {
    newsletterSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      if (emailInput && emailInput.value.includes('@')) {
        showToast('¡Gracias por suscribirte! 💎');
        emailInput.value = '';
      } else {
        showToast('Por favor ingresa un correo válido');
      }
    });
  }


  // ── Smooth Scroll for Anchor Links ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // ── Parallax Effect on Hero ────────────────────────
  // Hero background movement is handled by the CSS carousel Ken Burns effect.


  // ── Counter Animation for Story Stats ──────────────
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const storyStats = document.querySelector('.story-stats');
  if (storyStats) statsObserver.observe(storyStats);

  function animateCounters() {
    statNumbers.forEach(stat => {
      const text = stat.textContent;
      const match = text.match(/(\d+)/);
      if (!match) return;

      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      const duration = 2000;
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        stat.innerHTML = current + suffix.replace(/(\+|%)/, '<span>$1</span>');

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.innerHTML = target + suffix.replace(/(\+|%)/, '<span>$1</span>');
        }
      }

      requestAnimationFrame(updateCount);
    });
  }


  // ── Keyboard Accessibility ─────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });

});
