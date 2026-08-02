/* ==========================================================================
   ARI FOOTBALL - PERSONALIZE STUDIO ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Data State & Catalog Models ---
  const DATA = {
    boots: [
      { id: 'boot-1', name: 'Ari Speed Phantom FG', price: 3490, imgColor: '#181b24', accentColor: '#ccff00' },
      { id: 'boot-2', name: 'Ari Control Master Pro', price: 3990, imgColor: '#111319', accentColor: '#e5b842' },
      { id: 'boot-3', name: 'Ari Precision Volt IC', price: 2990, imgColor: '#1a1d28', accentColor: '#00f0ff' }
    ],
    jerseys: [
      { id: 'jersey-1', name: 'Ari Thailand National Edition', price: 1290, imgColor: '#003399', accentColor: '#ffffff' },
      { id: 'jersey-2', name: 'Ari Manchester Red Season 26', price: 2900, imgColor: '#cc0000', accentColor: '#ffffff' },
      { id: 'jersey-3', name: 'Ari Madrid Gold Champion', price: 3200, imgColor: '#111111', accentColor: '#e5b842' }
    ],
    swatches: [
      { name: 'Neon Volt', code: '#541281ff' },
      { name: 'Metallic Gold', code: '#e5b842' },
      { name: 'Pure White', code: '#ffffff' },
      { name: 'Electric Cyan', code: '#00f0ff' },
      { name: 'Crimson Red', code: '#ff3366' },
      { name: 'Stealth Black', code: '#181818' }
    ],
    bootZones: [
      { id: 'heel', name: 'บริเวณส้นเท้า (Heel Zone)', cost: 300 },
      { id: 'collar', name: 'บริเวณหุ้มข้อ (Collar Line)', cost: 200 },
      { id: 'side', name: 'ข้างรองเท้า (Upper Side)', cost: 250 }
    ],
    jerseyZones: [
      { id: 'back', name: 'หลังเสื้อ (Name & Number Back)', cost: 350 },
      { id: 'chest', name: 'หน้าอก (Chest Mini Name)', cost: 200 },
      { id: 'sleeve', name: 'แขนเสื้อ (Sleeve Monogram)', cost: 150 }
    ],
    patches: {
      'none': { name: 'ไม่ติดอาร์ม', cost: 0 },
      'thai-league': { name: 'อาร์ม Thai League 2026', cost: 150 },
      'champions-league': { name: 'อาร์ม UEFA Champions League', cost: 250 },
      'ari-custom-flag': { name: 'อาร์มธงชาติไทย Ari Edition', cost: 120 }
    },
    gallery: [
      { id: 1, category: 'boot', title: 'Ari Speed Phantom "CHANATHIP #18"', desc: 'ปักชื่อไทยทองแท้บริเวณส้นเท้าบนตัวรองเท้าสีดำ Neon', price: 3790, name: 'CHANATHIP', number: '18', color: '#e5b842' },
      { id: 2, category: 'jersey', title: 'Thailand National "ARISON #10"', desc: 'สกรีนชื่อและเบอร์มาตรฐานฟุตบอลทีมชาติ อาร์มไทยลีกครบเซ็ต', price: 1790, name: 'ARISON', number: '10', color: '#ffffff' },
      { id: 3, category: 'boot', title: 'Ari Control Master "TEERASIL #9"', desc: 'เทคโนโลยี UV Transfer บริการปักอักษรสปอร์ตสี Volt Glow', price: 4290, name: 'TEERASIL', number: '9', color: '#ccff00' },
      { id: 4, category: 'jersey', title: 'Madrid Gold "SUPERSTAR #7"', desc: 'สกรีนสีทองเมทัลลิกสไตร์แชมเปียน พร้อมอาร์มดาวทอง 5 ดวง', price: 3550, name: 'SUPERSTAR', number: '7', color: '#e5b842' }
    ]
  };

  // --- Active Customizer State ---
  let state = {
    category: 'boot', // 'boot' | 'jersey'
    modelId: 'boot-1',
    size: 'US 8.5 (42 EUR)',
    name: 'ARISON',
    number: '10',
    font: 'Prompt, sans-serif',
    color: '#ccff00',
    view: 'side', // 'side' | 'heel' | 'collar' | 'back'
    zone: 'heel',
    patch: 'none',
    cart: []
  };

  // --- DOM Elements ---
  const elCategoryTabs = document.querySelectorAll('.tab-btn');
  const elModelSelector = document.getElementById('model-selector');
  const elSizeSelect = document.getElementById('size-select');
  const elCustomName = document.getElementById('custom-name');
  const elCustomNumber = document.getElementById('custom-number');
  const elNumberInputGroup = document.getElementById('number-input-group');
  const elFontSelect = document.getElementById('font-select');
  const elColorSwatches = document.getElementById('color-swatches');
  const elZoneSelect = document.getElementById('zone-select');
  const elPatchSelect = document.getElementById('patch-select');
  const elExtraPatchGroup = document.getElementById('extra-patch-group');
  const elStageSvg = document.getElementById('stage-svg');
  const elViewControls = document.getElementById('view-controls');
  const elTotalPriceDisplay = document.getElementById('total-price-display');
  const elBtnPrice = document.getElementById('btn-price');
  const elModelBadgeTag = document.getElementById('model-badge-tag');
  const elAddToCartBtn = document.getElementById('add-to-cart-btn');
  const elGalleryGrid = document.getElementById('gallery-grid');
  const elGalleryFilters = document.querySelectorAll('.filter-btn');

  // Cart DOM
  const elCartBtn = document.getElementById('cart-btn');
  const elCartCount = document.getElementById('cart-count');
  const elCartDrawer = document.getElementById('cart-drawer');
  const elCartBackdrop = document.getElementById('cart-backdrop');
  const elCartCloseBtn = document.getElementById('cart-close-btn');
  const elCartBody = document.getElementById('cart-body');
  const elCartSubtotalVal = document.getElementById('cart-subtotal-val');
  const elToastContainer = document.getElementById('toast-container');

  // --- Initialize App ---
  function init() {
    renderModels();
    renderSwatches();
    renderZones();
    renderStageSVG();
    renderGallery('all');
    calculateTotalPrice();

    // Event Listeners
    setupEventListeners();
  }

  // --- Render Models Selector ---
  function renderModels() {
    const list = state.category === 'boot' ? DATA.boots : DATA.jerseys;
    elModelSelector.innerHTML = list.map(m => `
      <div class="model-card ${m.id === state.modelId ? 'active' : ''}" data-id="${m.id}">
        <div class="model-name">${m.name}</div>
        <div class="model-price">฿${m.price.toLocaleString()}</div>
      </div>
    `).join('');

    // Attach Click
    document.querySelectorAll('.model-card').forEach(card => {
      card.addEventListener('click', () => {
        state.modelId = card.dataset.id;
        document.querySelectorAll('.model-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        calculateTotalPrice();
        renderStageSVG();
      });
    });
  }

  // --- Render Swatches ---
  function renderSwatches() {
    elColorSwatches.innerHTML = DATA.swatches.map(s => `
      <button class="swatch-btn ${s.code === state.color ? 'active' : ''}" 
              style="background-color: ${s.code}; ${s.code === '#ffffff' ? 'border-color: #555;' : ''}"
              data-color="${s.code}" 
              title="${s.name}">
      </button>
    `).join('');

    document.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.color = btn.dataset.color;
        document.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderStageSVG();
      });
    });
  }

  // --- Render Zones ---
  function renderZones() {
    const zones = state.category === 'boot' ? DATA.bootZones : DATA.jerseyZones;
    elZoneSelect.innerHTML = zones.map(z => `
      <option value="${z.id}" ${z.id === state.zone ? 'selected' : ''}>
        ${z.name} (+฿${z.cost})
      </option>
    `).join('');

    state.zone = zones[0].id;
  }

  // --- Calculate Total Price ---
  function calculateTotalPrice() {
    const isBoot = state.category === 'boot';
    const modelsList = isBoot ? DATA.boots : DATA.jerseys;
    const activeModel = modelsList.find(m => m.id === state.modelId) || modelsList[0];

    // Zone Cost
    const zonesList = isBoot ? DATA.bootZones : DATA.jerseyZones;
    const activeZone = zonesList.find(z => z.id === state.zone) || zonesList[0];
    const zoneCost = activeZone ? activeZone.cost : 0;

    // Patch Cost
    const patchObj = DATA.patches[state.patch] || { cost: 0 };
    const patchCost = patchObj.cost;

    const total = activeModel.price + zoneCost + patchCost;

    elTotalPriceDisplay.textContent = `฿${total.toLocaleString()}`;
    elBtnPrice.textContent = `฿${total.toLocaleString()}`;
    elModelBadgeTag.textContent = activeModel.name;

    return total;
  }

  // --- SVG Live Render Stage ---
  function renderStageSVG() {
    const isBoot = state.category === 'boot';
    const activeModel = (isBoot ? DATA.boots : DATA.jerseys).find(m => m.id === state.modelId) || (isBoot ? DATA.boots[0] : DATA.jerseys[0]);

    const nameText = (state.name || 'YOUR NAME').toUpperCase();
    const numberText = state.number || '10';
    const textColor = state.color;
    const fontStyle = state.font;

    if (isBoot) {
      // Football Boot SVG Graphic
      elStageSvg.innerHTML = `
        <defs>
          <linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#242836" />
            <stop offset="100%" stop-color="#0f1118" />
          </linearGradient>
          <linearGradient id="soleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${activeModel.accentColor}" />
            <stop offset="100%" stop-color="#111" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Boot Base Silhouette -->
        <g transform="translate(20, 20)">
          <!-- Sole Studs & Base -->
          <path d="M 60 270 Q 180 295 400 250 L 440 230 Q 350 255 100 250 Z" fill="url(#soleGrad)" filter="url(#glow)"/>
          <circle cx="80" cy="275" r="7" fill="${activeModel.accentColor}" />
          <circle cx="140" cy="285" r="7" fill="${activeModel.accentColor}" />
          <circle cx="220" cy="288" r="7" fill="${activeModel.accentColor}" />
          <circle cx="360" cy="265" r="7" fill="${activeModel.accentColor}" />

          <!-- Main Upper Body -->
          <path d="M 60 250 C 50 180 90 120 160 110 C 230 100 300 160 410 200 C 440 210 450 230 400 250 Z" fill="url(#bootGrad)" stroke="${activeModel.accentColor}" stroke-width="2"/>
          
          <!-- Heel Counter (ส้นเท้า) -->
          <path d="M 60 250 C 50 180 90 120 130 115 L 140 250 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
          
          <!-- Collar Line (หุ้มข้อ) -->
          <path d="M 130 115 Q 180 90 230 130" stroke="${activeModel.accentColor}" stroke-width="4" fill="none" stroke-dasharray="6,4"/>

          <!-- Ari Stripes Accent -->
          <path d="M 220 140 L 180 240 M 245 145 L 205 240 M 270 155 L 230 240" stroke="rgba(255,255,255,0.12)" stroke-width="8"/>
          
          <!-- Dynamic Personalized Text Overlay based on Zone -->
          ${state.zone === 'heel' ? `
            <!-- Heel Zone Text -->
            <text x="95" y="190" fill="${textColor}" font-family="${fontStyle}" font-size="18" font-weight="900" transform="rotate(-75 95 190)" letter-spacing="2" filter="url(#glow)">
              ${nameText}
            </text>
          ` : state.zone === 'collar' ? `
            <!-- Collar Zone Text -->
            <text x="170" y="105" fill="${textColor}" font-family="${fontStyle}" font-size="16" font-weight="800" transform="rotate(-12 170 105)" letter-spacing="1.5">
              ⚡ ${nameText} ⚡
            </text>
          ` : `
            <!-- Side Zone Text -->
            <text x="250" y="210" fill="${textColor}" font-family="${fontStyle}" font-size="20" font-weight="900" transform="rotate(-15 250 210)" letter-spacing="3" filter="url(#glow)">
              ${nameText}
            </text>
          `}

          <!-- Ari Brand Stamp -->
          <text x="360" y="235" fill="rgba(255,255,255,0.3)" font-size="12" font-weight="900">ARI SPEED</text>
        </g>
      `;
    } else {
      // Jersey Back SVG Graphic
      elStageSvg.innerHTML = `
        <defs>
          <linearGradient id="jerseyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${activeModel.imgColor}" />
            <stop offset="100%" stop-color="#0a0c12" />
          </linearGradient>
          <filter id="textShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.8"/>
          </filter>
        </defs>

        <!-- Jersey Outline -->
        <g transform="translate(50, 10)">
          <!-- Sleeves & Body -->
          <path d="M 110 30 L 40 80 L 70 140 L 110 110 L 110 320 L 290 320 L 290 110 L 330 140 L 360 80 L 290 30 Q 200 60 110 30 Z" 
                fill="url(#jerseyGrad)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
          
          <!-- Collar Stripe -->
          <path d="M 150 42 Q 200 65 250 42" stroke="${activeModel.accentColor}" stroke-width="5" fill="none"/>
          
          <!-- Sleeve Trim Stripes -->
          <line x1="45" y1="90" x2="72" y2="135" stroke="${activeModel.accentColor}" stroke-width="4"/>
          <line x1="355" y1="90" x2="328" y2="135" stroke="${activeModel.accentColor}" stroke-width="4"/>

          <!-- Sleeve Patch (If Selected) -->
          ${state.patch !== 'none' ? `
            <g transform="translate(305, 95)">
              <circle cx="15" cy="15" r="14" fill="#e5b842" stroke="#fff" stroke-width="1.5"/>
              <text x="15" y="19" fill="#000" font-size="9" font-weight="900" text-anchor="middle">ARI</text>
            </g>
          ` : ''}

          <!-- Personalized Back Name Text -->
          <text x="200" y="125" fill="${textColor}" font-family="${fontStyle}" font-size="26" font-weight="900" text-anchor="middle" letter-spacing="4" filter="url(#textShadow)">
            ${nameText}
          </text>

          <!-- Personalized Back Number Text -->
          <text x="200" y="240" fill="${textColor}" font-family="${fontStyle}" font-size="95" font-weight="900" text-anchor="middle" letter-spacing="2" filter="url(#textShadow)">
            ${numberText}
          </text>

          <!-- Authenticity Tag at Bottom Right -->
          <rect x="240" y="290" width="35" height="18" rx="2" fill="rgba(204,255,0,0.8)"/>
          <text x="257" y="302" fill="#000" font-size="8" font-weight="900" text-anchor="middle">AUTHENTIC</text>
        </g>
      `;
    }
  }

  // --- Render Demo Gallery ---
  function renderGallery(filter = 'all') {
    const items = filter === 'all'
      ? DATA.gallery
      : DATA.gallery.filter(g => g.category === filter);

    elGalleryGrid.innerHTML = items.map(item => `
      <div class="item-card">
        <div class="card-img-wrapper">
          <span class="badge badge-volt card-tag">${item.category === 'boot' ? 'BOOT UV PRINT' : 'JERSEY SCREEN'}</span>
          <svg viewBox="0 0 200 140" style="width: 100%; height: 100%;">
            <rect width="200" height="140" fill="transparent"/>
            <text x="100" y="60" fill="${item.color}" font-family="Prompt" font-size="16" font-weight="900" text-anchor="middle">${item.name}</text>
            <text x="100" y="100" fill="${item.color}" font-family="Prompt" font-size="32" font-weight="900" text-anchor="middle">#${item.number}</text>
          </svg>
        </div>
        <div class="card-body">
          <h3 class="card-title">${item.title}</h3>
          <p class="card-desc">${item.desc}</p>
          <div class="card-footer">
            <span class="card-price">฿${item.price.toLocaleString()}</span>
            <button class="btn-card load-style-btn" data-name="${item.name}" data-number="${item.number}" data-category="${item.category}" data-color="${item.color}">
              ลองสไตล์นี้ <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach click event for "ลองสไตล์นี้" buttons
    document.querySelectorAll('.load-style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        state.category = cat;
        state.name = btn.dataset.name;
        state.number = btn.dataset.number;
        state.color = btn.dataset.color;

        // Sync UI
        elCustomName.value = state.name;
        elCustomNumber.value = state.number;

        // Sync category tabs
        elCategoryTabs.forEach(t => {
          t.classList.toggle('active', t.dataset.category === cat);
        });

        if (cat === 'boot') {
          elNumberInputGroup.style.display = 'none';
          elExtraPatchGroup.style.display = 'none';
          elViewControls.style.display = 'flex';
        } else {
          elNumberInputGroup.style.display = 'block';
          elExtraPatchGroup.style.display = 'block';
          elViewControls.style.display = 'none';
        }

        renderModels();
        renderZones();
        renderSwatches();
        calculateTotalPrice();
        renderStageSVG();

        // Scroll to studio
        document.getElementById('studio').scrollIntoView({ behavior: 'smooth' });
        showToast(`โหลดสไตล์ ${state.name} #${state.number} ลงใน Studio เรียบร้อย!`);
      });
    });
  }

  // --- Setup Event Listeners ---
  function setupEventListeners() {

    // Category Tabs (Boot / Jersey)
    elCategoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const cat = tab.dataset.category;
        state.category = cat;

        elCategoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Toggle category-specific controls
        if (cat === 'boot') {
          state.modelId = DATA.boots[0].id;
          elNumberInputGroup.style.display = 'none';
          elExtraPatchGroup.style.display = 'none';
          elViewControls.style.display = 'flex';
        } else {
          state.modelId = DATA.jerseys[0].id;
          elNumberInputGroup.style.display = 'block';
          elExtraPatchGroup.style.display = 'block';
          elViewControls.style.display = 'none';
        }

        renderModels();
        renderZones();
        calculateTotalPrice();
        renderStageSVG();
      });
    });

    // Form Inputs
    elCustomName.addEventListener('input', (e) => {
      state.name = e.target.value;
      renderStageSVG();
    });

    elCustomNumber.addEventListener('input', (e) => {
      state.number = e.target.value;
      renderStageSVG();
    });

    elFontSelect.addEventListener('change', (e) => {
      state.font = e.target.value;
      renderStageSVG();
    });

    elZoneSelect.addEventListener('change', (e) => {
      state.zone = e.target.value;
      calculateTotalPrice();
      renderStageSVG();
    });

    elPatchSelect.addEventListener('change', (e) => {
      state.patch = e.target.value;
      calculateTotalPrice();
      renderStageSVG();
    });

    elSizeSelect.addEventListener('change', (e) => {
      state.size = e.target.value;
    });

    // View Angle Switcher
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.view = btn.dataset.view;
        renderStageSVG();
      });
    });

    // Gallery Filter Tabs
    elGalleryFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        elGalleryFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGallery(btn.dataset.filter);
      });
    });

    // Add To Cart Action
    elAddToCartBtn.addEventListener('click', () => {
      const isBoot = state.category === 'boot';
      const activeModel = (isBoot ? DATA.boots : DATA.jerseys).find(m => m.id === state.modelId);
      const price = calculateTotalPrice();

      const item = {
        id: Date.now(),
        modelName: activeModel.name,
        category: state.category,
        size: state.size,
        name: (state.name || 'CUSTOM').toUpperCase(),
        number: isBoot ? null : (state.number || '10'),
        color: state.color,
        price: price
      };

      state.cart.push(item);
      updateCartUI();
      showToast(`เพิ่ม ${item.modelName} ("${item.name}") ลงตะกร้าแล้ว!`);
      openCartDrawer();
    });

    // Cart Drawer Toggle
    elCartBtn.addEventListener('click', openCartDrawer);
    elCartCloseBtn.addEventListener('click', closeCartDrawer);
    elCartBackdrop.addEventListener('click', closeCartDrawer);

    // Checkout Button
    document.getElementById('checkout-btn').addEventListener('click', () => {
      if (state.cart.length === 0) {
        showToast('ตะกร้าสินค้าของคุณยังไม่มีรายการ!');
        return;
      }
      showToast('กำลังนำท่านไปยังหน้าชำระเงินความปลอดภัยสูง...');
    });
  }

  // --- Cart UI Updates ---
  function updateCartUI() {
    elCartCount.textContent = state.cart.length;

    if (state.cart.length === 0) {
      elCartBody.innerHTML = `
        <div class="cart-empty">
          <i class="fa-solid fa-cart-flatbed-suitcases cart-empty-icon"></i>
          <p>ยังไม่มีรายการสินค้าในตะกร้าของคุณ</p>
        </div>
      `;
      elCartSubtotalVal.textContent = '฿0';
      return;
    }

    let subtotal = 0;
    elCartBody.innerHTML = state.cart.map(item => {
      subtotal += item.price;
      return `
        <div class="cart-item">
          <div class="cart-item-img">
            <i class="fa-solid ${item.category === 'boot' ? 'fa-shoe-prints' : 'fa-shirt'}" style="color: ${item.color}; font-size: 1.8rem;"></i>
          </div>
          <div class="cart-item-details">
            <div class="cart-item-title">${item.modelName}</div>
            <div class="cart-item-spec">ข้อความ: <strong>${item.name}</strong> ${item.number ? `#${item.number}` : ''} (${item.size})</div>
            <div class="cart-item-price">฿${item.price.toLocaleString()}</div>
          </div>
          <button class="cart-item-remove" onclick="removeCartItem(${item.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    }).join('');

    elCartSubtotalVal.textContent = `฿${subtotal.toLocaleString()}`;
  }

  // Global Cart Item Removal
  window.removeCartItem = function (id) {
    state.cart = state.cart.filter(i => i.id !== id);
    updateCartUI();
    showToast('ลบรายการสินค้าเรียบร้อยแล้ว');
  };

  function openCartDrawer() {
    elCartDrawer.classList.add('open');
    elCartBackdrop.classList.add('open');
  }

  function closeCartDrawer() {
    elCartDrawer.classList.remove('open');
    elCartBackdrop.classList.remove('open');
  }

  // --- Toast Notification Helper ---
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-volt);"></i> ${message}`;
    elToastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Run app
  init();
});
