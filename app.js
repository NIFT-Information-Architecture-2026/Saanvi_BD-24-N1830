// ==========================================================================
// A LITTLE SOMETHING, FROM ME TO YOU — MINIMAL ATELIER SCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    activeRoom: 'studio',
    activeMedium: 'postcard',
    vessel: 'envelope',
    postcard: {
      orientation: 'portrait',
      color: '#FFFFFF',
      stamp: 'heart',
      flipped: false
    },
    letter: {
      paper: 'paper-pure',
      ink: '#1A1A1A',
      envelope: 'maroon-lace',
      seal: 'gold'
    },
    bouquet: {
      mode: 'bespoke',
      flowers: ['Dahlia', 'Peony', "Baby's Breath"],
      wrap: 'wrap-kraft',
      ribbon: 'ribbon-silk'
    },
    greetingCard: {
      size: 'standard',
      orientation: 'portrait',
      template: '1',
      inside: false,
      pocketMode: 'polaroid'
    }
  };

  // ================= 0. OPENING ENVELOPE SPLASH =================
  const splashScreen = document.getElementById('splash-screen');
  const splashEnvelope = document.getElementById('splash-envelope');
  const appHeader = document.getElementById('app-header');
  const appStage = document.getElementById('app-stage');
  const appBottomNav = document.getElementById('app-bottom-nav');

  if (splashEnvelope) {
    splashEnvelope.addEventListener('click', () => {
      splashScreen.style.opacity = '0';
      splashScreen.style.transition = 'opacity 0.4s ease';
      setTimeout(() => {
        splashScreen.style.display = 'none';
        appHeader.style.display = 'flex';
        appStage.style.display = 'block';
        appBottomNav.style.display = 'flex';
      }, 400);
    });
  }

  // ================= HEADER SAVE POPOVER =================
  const btnSavePopover = document.getElementById('btn-save-popover');
  const savePopover = document.getElementById('save-popover');

  if (btnSavePopover && savePopover) {
    btnSavePopover.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = savePopover.style.display === 'flex';
      savePopover.style.display = isVisible ? 'none' : 'flex';
    });

    document.addEventListener('click', (e) => {
      if (!savePopover.contains(e.target) && e.target !== btnSavePopover) {
        savePopover.style.display = 'none';
      }
    });
  }

  // ================= GLOBAL ROOM NAVIGATION =================
  const navTabs = document.querySelectorAll('.nav-tab');
  const roomViews = document.querySelectorAll('.room-view');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const room = tab.dataset.room;
      state.activeRoom = room;

      navTabs.forEach(t => t.classList.toggle('active', t === tab));
      roomViews.forEach(view => {
        const isMatch = view.id === `room-${room}`;
        view.style.display = isMatch ? 'flex' : 'none';
        view.classList.toggle('active', isMatch);
      });
    });
  });

  // ================= STUDIO MEDIUM SELECTOR =================
  const mediumCards = document.querySelectorAll('.medium-card');
  const canvasPostcard = document.getElementById('canvas-postcard');
  const canvasLetter = document.getElementById('canvas-letter');
  const canvasBouquet = document.getElementById('canvas-bouquet');
  const canvasCard = document.getElementById('canvas-greeting-card');

  const canvases = {
    'postcard': canvasPostcard,
    'letter': canvasLetter,
    'bouquet': canvasBouquet,
    'greeting-card': canvasCard
  };

  mediumCards.forEach(card => {
    card.addEventListener('click', () => {
      const med = card.dataset.medium;
      state.activeMedium = med;

      mediumCards.forEach(c => c.classList.toggle('active', c === card));
      Object.keys(canvases).forEach(key => {
        if (canvases[key]) {
          canvases[key].style.display = key === med ? 'block' : 'none';
        }
      });
    });
  });

  // ================= 1. POSTCARD WORKSPACE =================
  const postcardCard = document.getElementById('postcard-card');
  const btnFlipPostcard = document.getElementById('btn-flip-postcard');
  const postcardWrapper = document.getElementById('postcard-container');
  const btnOrientPort = document.getElementById('btn-postcard-orient-port');
  const btnOrientLand = document.getElementById('btn-postcard-orient-land');
  const postcardThemeDots = document.querySelectorAll('#postcard-theme-palette .theme-dot');
  const stampPickBtns = document.querySelectorAll('.stamp-pick-btn');
  const postcardStampDisplay = document.getElementById('postcard-stamp-display');
  const postcardStampPicker = document.getElementById('postcard-stamp-picker');
  const postcardPhotoArea = document.getElementById('postcard-photo-area');
  const postcardFileInput = document.getElementById('postcard-file-input');
  const postcardImagePreview = document.getElementById('postcard-image-preview');
  const photoUploadHint = document.getElementById('photo-upload-hint');

  // Flip Postcard with stamp picker toggle
  if (btnFlipPostcard) {
    btnFlipPostcard.addEventListener('click', () => {
      state.postcard.flipped = !state.postcard.flipped;
      postcardCard.classList.toggle('flipped', state.postcard.flipped);
      if (postcardStampPicker) {
        postcardStampPicker.style.display = state.postcard.flipped ? 'flex' : 'none';
      }
    });
  }

  // Orientation
  if (btnOrientPort && btnOrientLand) {
    btnOrientPort.addEventListener('click', () => {
      btnOrientPort.classList.add('active');
      btnOrientLand.classList.remove('active');
      postcardWrapper.className = 'postcard-wrapper portrait';
      state.postcard.orientation = 'portrait';
    });
    btnOrientLand.addEventListener('click', () => {
      btnOrientLand.classList.add('active');
      btnOrientPort.classList.remove('active');
      postcardWrapper.className = 'postcard-wrapper landscape';
      state.postcard.orientation = 'landscape';
    });
  }

  // Theme changes
  postcardThemeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      postcardThemeDots.forEach(d => d.classList.toggle('active', d === dot));
      const theme = dot.dataset.theme;
      state.postcard.color = theme; // storing theme under color
      postcardWrapper.dataset.theme = theme;
      if (typeof updateStampPicker === 'function') {
        updateStampPicker(theme);
      }
    });
  });

  // Image Upload on Postcard Front
  if (postcardPhotoArea && postcardFileInput) {
    postcardPhotoArea.addEventListener('click', () => {
      postcardFileInput.click();
    });

    postcardFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          postcardImagePreview.src = event.target.result;
          postcardImagePreview.style.display = 'block';
          photoUploadHint.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Stamp Templates by Theme
  const makeStampImg = (imgPath) => `
    <div style="width: 44px; height: 54px; display: flex; align-items: center; justify-content: center; background: transparent;">
      <img src="${imgPath}" style="width: 100%; height: 100%; object-fit: contain;" alt="stamp"/>
    </div>
  `;

  const makeKraftStampSvg = (svgContent) => `
    <div style="width: 44px; height: 54px; display: flex; align-items: center; justify-content: center; background: transparent;">
      <div style="width: 100%; height: 100%; background-color: #4A3124; display: flex; align-items: center; justify-content: center; border: 1.5px dashed #E6D9C8; padding: 2px; box-sizing: border-box; border-radius: 4px;">
        <svg viewBox="0 0 24 24" width="22" height="22">${svgContent}</svg>
      </div>
    </div>
  `;

  const themeStamps = {
    candy: [
      { id: 'candy_bear', html: makeStampImg('assets/stamps/stamp_bear.png') },
      { id: 'candy_heart', html: makeStampImg('assets/stamps/stamp_heart.png') },
      { id: 'candy_lock', html: makeStampImg('assets/stamps/stamp_lock.png') },
      { id: 'candy_tulip', html: makeStampImg('assets/stamps/stamp_tulip.png') },
      { id: 'candy_butterfly', html: makeStampImg('assets/stamps/stamp_butterfly.png') }
    ],
    kraft: [
      { id: 'kraft_butterfly', html: makeStampImg('assets/stamps/stamp_kraft_butterfly.png') },
      { id: 'kraft_flower', html: makeStampImg('assets/stamps/stamp_kraft_flower.png') },
      { id: 'kraft_stars', html: makeStampImg('assets/stamps/stamp_kraft_stars.png') },
      { id: 'kraft_heart', html: makeKraftStampSvg(`<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E6D9C8"/>`) },
      { id: 'kraft_key', html: makeKraftStampSvg(`<circle cx="7.5" cy="15.5" r="4.5" fill="none" stroke="#E6D9C8" stroke-width="2"/><path d="M10.5 12.5 L19 4 L22 7 L19 10" fill="none" stroke="#E6D9C8" stroke-width="2" stroke-linejoin="round"/><path d="M16 7 L14.5 8.5" fill="none" stroke="#E6D9C8" stroke-width="2" stroke-linecap="round"/>`) }
    ]
  };

  function updateStampPicker(theme) {
    const stamps = themeStamps[theme] || themeStamps['candy'];
    
    stampPickBtns.forEach((btn, index) => {
      if (stamps[index]) {
        btn.dataset.stamp = stamps[index].id;
        btn.innerHTML = stamps[index].html;
        btn.style.display = 'block';
      } else {
        btn.style.display = 'none';
      }
    });

    // Auto-select first stamp
    if (stamps.length > 0) {
      stampPickBtns.forEach(b => b.classList.remove('active'));
      stampPickBtns[0].classList.add('active');
      state.postcard.stamp = stamps[0].id;
      if (postcardStampDisplay) {
        postcardStampDisplay.innerHTML = stamps[0].html;
      }
    }
  };

  // Click listeners for stamp buttons
  stampPickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stampPickBtns.forEach(b => b.classList.toggle('active', b === btn));
      state.postcard.stamp = btn.dataset.stamp;
      if (postcardStampDisplay) {
        postcardStampDisplay.innerHTML = btn.innerHTML;
      }
    });
  });

  // Initialize with candy theme stamps
  updateStampPicker('candy');

  // ================= 2. LETTER WORKSPACE =================
  const letterSheet = document.getElementById('letter-sheet');
  const paperCircles = document.querySelectorAll('.paper-circle');
  const inkDots = document.querySelectorAll('.ink-dot');
  const letterTextarea = document.getElementById('letter-body-textarea');
  const stickerIconBtns = document.querySelectorAll('.sticker-icon-btn');
  const stickersCanvasOverlay = document.getElementById('stickers-canvas-overlay');
  const polaroidTrigger = document.getElementById('polaroid-trigger');
  const polaroidFileInput = document.getElementById('polaroid-file-input');
  const polaroidImg = document.getElementById('polaroid-img');
  const polaroidEmptyText = document.getElementById('polaroid-empty-text');

  // Paper options
  paperCircles.forEach(circle => {
    circle.addEventListener('click', () => {
      paperCircles.forEach(c => c.classList.toggle('active', c === circle));
      const paperClass = circle.dataset.paper;
      state.letter.paper = paperClass;
      letterSheet.className = `letter-sheet ${paperClass}`;
    });
  });

  // Ink options
  inkDots.forEach(dot => {
    dot.addEventListener('click', () => {
      inkDots.forEach(d => d.classList.toggle('active', d === dot));
      const ink = dot.dataset.ink;
      state.letter.ink = ink;
      letterTextarea.style.color = ink;
    });
  });

  // Draggable Stickers implementation
  stickerIconBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const stickerGlyph = btn.dataset.sticker;
      createDraggableSticker(stickerGlyph);
    });
  });

  function createDraggableSticker(glyph) {
    const el = document.createElement('div');
    el.className = 'draggable-sticker-placed';
    el.innerText = glyph;
    el.style.left = '40%';
    el.style.top = '40%';

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    el.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = el.offsetLeft;
      initialTop = el.offsetTop;
      e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        el.style.left = `${initialLeft + dx}px`;
        el.style.top = `${initialTop + dy}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    stickersCanvasOverlay.appendChild(el);
  }

  // Polaroid upload from gallery
  if (polaroidTrigger && polaroidFileInput) {
    polaroidTrigger.addEventListener('click', () => {
      polaroidFileInput.click();
    });

    polaroidFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          polaroidImg.src = event.target.result;
          polaroidImg.style.display = 'block';
          polaroidEmptyText.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Envelope Swatches & Wax Seal
  const envSwatchBtns = document.querySelectorAll('.env-swatch-btn');
  const sealSwatchBtns = document.querySelectorAll('.seal-swatch-btn');
  const previewEnvelopeRender = document.getElementById('preview-envelope-render');
  const previewSealRender = document.getElementById('preview-seal-render');

  const envClassMap = {
    'manila': 'swatch-manila',
    'vellum': 'swatch-vellum',
    'maroon-lace': 'env-maroon-lace',
    'charcoal': 'swatch-charcoal'
  };

  envSwatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      envSwatchBtns.forEach(b => b.classList.toggle('active', b === btn));
      const envKey = btn.dataset.env;
      state.letter.envelope = envKey;
      previewEnvelopeRender.className = `preview-envelope env-${envKey}`;
      updateVesselLivePreview();
    });
  });

  sealSwatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sealSwatchBtns.forEach(b => b.classList.toggle('active', b === btn));
      const sealKey = btn.dataset.seal;
      state.letter.seal = sealKey;
      previewSealRender.className = `preview-wax-seal seal-${sealKey}`;
      updateVesselLivePreview();
    });
  });

  // ================= 3. BOUQUET WORKSPACE =================
  const btnTabBespoke = document.getElementById('btn-tab-bespoke');
  const btnTabReadymade = document.getElementById('btn-tab-readymade');
  const bespokeView = document.getElementById('bouquet-bespoke-view');
  const readymadeView = document.getElementById('bouquet-readymade-view');
  const bloomCards = document.querySelectorAll('.bloom-card');
  const stemsBloomCluster = document.getElementById('stems-bloom-cluster');
  const bouquetWrapFrame = document.getElementById('bouquet-wrap-frame');
  const bouquetRibbonNode = document.getElementById('bouquet-ribbon-node');
  const wrapSwatchBtns = document.querySelectorAll('.wrap-swatch-btn');
  const ribbonSwatchBtns = document.querySelectorAll('.ribbon-swatch-btn');
  const readymadeGrid = document.getElementById('readymade-sets-grid');

  // Mode Toggles
  if (btnTabBespoke && btnTabReadymade) {
    btnTabBespoke.addEventListener('click', () => {
      btnTabBespoke.classList.add('active');
      btnTabReadymade.classList.remove('active');
      bespokeView.style.display = 'block';
      readymadeView.style.display = 'none';
      state.bouquet.mode = 'bespoke';
    });

    btnTabReadymade.addEventListener('click', () => {
      btnTabReadymade.classList.add('active');
      btnTabBespoke.classList.remove('active');
      bespokeView.style.display = 'none';
      readymadeView.style.display = 'block';
      state.bouquet.mode = 'readymade';
    });
  }

  // 15 Blooms Selection
  const flowerEmojis = {
    'Dahlia': '🌺', 'Tulip': '🌷', 'Gardenia': '🌼', 'Peony': '🌸', 'Lily': '🪷',
    'Orchid': '💮', 'Rose': '🌹', 'Sunflower': '🌻', 'Lilac': '🪻', "Baby's Breath": '🌾',
    'Hydrangea': '💐', 'Snapdragon': '🌿', 'Japanese Anemones': '🥀',
    'Persian Buttercup': '🏵️', 'Foxglove': '🌱'
  };

  bloomCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      const flower = card.dataset.flower;
      const idx = state.bouquet.flowers.indexOf(flower);
      if (idx > -1) {
        state.bouquet.flowers.splice(idx, 1);
      } else {
        state.bouquet.flowers.push(flower);
      }
      renderBouquetPreview();
    });
  });

  function renderBouquetPreview() {
    if (!stemsBloomCluster) return;
    stemsBloomCluster.innerHTML = '';
    state.bouquet.flowers.forEach(f => {
      const span = document.createElement('span');
      span.className = 'cluster-flower';
      span.innerText = flowerEmojis[f] || '🌸';
      stemsBloomCluster.appendChild(span);
    });
  }

  // 8 Readymade Combinations (6 flower types, 8-9 flowers each)
  const readymadeSetsData = [
    { name: 'Dawn Meadow', flowers: ['Dahlia', 'Peony', 'Lily', "Baby's Breath", 'Lilac', 'Gardenia'] },
    { name: 'Warm Terracotta', flowers: ['Sunflower', 'Rose', 'Persian Buttercup', 'Foxglove', 'Snapdragon', 'Dahlia'] },
    { name: 'Quiet Solace', flowers: ['Lily', 'Orchid', 'Gardenia', "Baby's Breath", 'Tulip', 'Hydrangea'] },
    { name: 'Nostalgic Tea', flowers: ['Peony', 'Lilac', 'Japanese Anemones', 'Rose', 'Lily', "Baby's Breath"] },
    { name: 'Linen & Moss', flowers: ['Snapdragon', 'Foxglove', 'Hydrangea', 'Gardenia', 'Tulip', 'Lily'] },
    { name: 'Midnight Bloom', flowers: ['Japanese Anemones', 'Dahlia', 'Rose', 'Orchid', 'Persian Buttercup', 'Lilac'] },
    { name: 'Spring Gentle', flowers: ['Tulip', 'Peony', 'Gardenia', 'Hydrangea', "Baby's Breath", 'Sunflower'] },
    { name: 'Archival Flora', flowers: ['Foxglove', 'Dahlia', 'Lilac', 'Rose', 'Snapdragon', 'Persian Buttercup'] }
  ];

  if (readymadeGrid) {
    readymadeGrid.innerHTML = '';
    readymadeSetsData.forEach((set, i) => {
      const card = document.createElement('div');
      card.className = 'set-card';
      card.innerHTML = `
        <h5>0${i+1}. ${set.name}</h5>
        <p>${set.flowers.slice(0, 4).join(', ')} & more</p>
      `;
      card.addEventListener('click', () => {
        state.bouquet.flowers = [...set.flowers];
        bloomCards.forEach(c => {
          c.classList.toggle('selected', set.flowers.includes(c.dataset.flower));
        });
        renderBouquetPreview();
        btnTabBespoke.click(); // Switch back to view preview
      });
      readymadeGrid.appendChild(card);
    });
  }

  // Wrapping Paper
  wrapSwatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      wrapSwatchBtns.forEach(b => b.classList.toggle('active', b === btn));
      const wrapClass = btn.dataset.wrap;
      state.bouquet.wrap = wrapClass;
      bouquetWrapFrame.className = `bouquet-wrap-frame ${wrapClass}`;
    });
  });

  // Ribbon Tie
  ribbonSwatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ribbonSwatchBtns.forEach(b => b.classList.toggle('active', b === btn));
      const ribClass = btn.dataset.ribbon;
      state.bouquet.ribbon = ribClass;
      bouquetRibbonNode.className = `bouquet-ribbon-node ${ribClass}`;
    });
  });

  // ================= 4. GREETING CARD WORKSPACE =================
  const greetingCardEl = document.getElementById('greeting-card-element');
  const btnCardSizeStd = document.getElementById('btn-card-size-std');
  const btnCardSizeMini = document.getElementById('btn-card-size-mini');
  const btnCardOrientPort = document.getElementById('btn-card-orient-port');
  const btnCardOrientLand = document.getElementById('btn-card-orient-land');
  const templateBtns = document.querySelectorAll('.template-thumb-btn');
  const btnFlipGreeting = document.getElementById('btn-flip-greeting');
  const greetingCoverView = document.getElementById('greeting-cover-view');
  const greetingInsideView = document.getElementById('greeting-inside-view');
  const pocketTabBtns = document.querySelectorAll('.pocket-tab-btn');
  const pocketPolaroidZone = document.getElementById('pocket-polaroid-zone');
  const pocketFlowerZone = document.getElementById('pocket-flower-zone');
  const pocketVinylZone = document.getElementById('pocket-vinyl-zone');
  const coverArtContainer = document.getElementById('cover-art-container');
  const cardCoverUpload = document.getElementById('card-cover-upload');
  const cardCoverPreview = document.getElementById('card-cover-preview');
  const coverArtPlaceholder = document.getElementById('cover-art-placeholder');
  const pocketPhotoTrigger = document.getElementById('pocket-photo-trigger');
  const cardPocketFile = document.getElementById('card-pocket-file');
  const pocketPhotoImg = document.getElementById('pocket-photo-img');
  const pocketPhotoText = document.getElementById('pocket-photo-text');

  // Card Size
  if (btnCardSizeStd && btnCardSizeMini) {
    btnCardSizeStd.addEventListener('click', () => {
      btnCardSizeStd.classList.add('active');
      btnCardSizeMini.classList.remove('active');
      greetingCardEl.classList.remove('size-mini');
      state.greetingCard.size = 'standard';
    });
    btnCardSizeMini.addEventListener('click', () => {
      btnCardSizeMini.classList.add('active');
      btnCardSizeStd.classList.remove('active');
      greetingCardEl.classList.add('size-mini');
      state.greetingCard.size = 'mini';
    });
  }

  // Card Orientation
  if (btnCardOrientPort && btnCardOrientLand) {
    btnCardOrientPort.addEventListener('click', () => {
      btnCardOrientPort.classList.add('active');
      btnCardOrientLand.classList.remove('active');
      greetingCardEl.classList.add('portrait');
      greetingCardEl.classList.remove('landscape');
      state.greetingCard.orientation = 'portrait';
    });
    btnCardOrientLand.addEventListener('click', () => {
      btnCardOrientLand.classList.add('active');
      btnCardOrientPort.classList.remove('active');
      greetingCardEl.classList.remove('portrait');
      greetingCardEl.classList.add('landscape');
      state.greetingCard.orientation = 'landscape';
    });
  }

  // 10 Templates
  templateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      templateBtns.forEach(b => b.classList.toggle('active', b === btn));
      const tmpl = btn.dataset.tmpl;
      state.greetingCard.template = tmpl;
      const titleInput = greetingCardEl.querySelector('.cover-editable-title');
      if (titleInput) {
        const sampleTitles = [
          'A quiet wish', 'With fond thoughts', 'For dear days', 'A little joy',
          'Across the miles', 'Gentle autumn', 'A tender note', 'Always kept',
          'Small blessings', 'From my desk'
        ];
        titleInput.value = sampleTitles[(parseInt(tmpl)-1) % sampleTitles.length];
      }
    });
  });

  // Flip Greeting Card Inside / Cover
  if (btnFlipGreeting) {
    btnFlipGreeting.addEventListener('click', () => {
      state.greetingCard.inside = !state.greetingCard.inside;
      greetingCoverView.style.display = state.greetingCard.inside ? 'none' : 'flex';
      greetingInsideView.style.display = state.greetingCard.inside ? 'flex' : 'none';
      btnFlipGreeting.innerText = state.greetingCard.inside ? 'Flip to cover' : 'Flip to inside';
    });
  }

  // Cover image upload
  if (coverArtContainer && cardCoverUpload) {
    coverArtContainer.addEventListener('click', () => {
      cardCoverUpload.click();
    });
    cardCoverUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          cardCoverPreview.src = event.target.result;
          cardCoverPreview.style.display = 'block';
          coverArtPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Inside Left Pocket: Polaroid vs Pressed Flower vs Vinyl
  pocketTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pocketTabBtns.forEach(b => b.classList.toggle('active', b === btn));
      const pMode = btn.dataset.pocket;
      state.greetingCard.pocketMode = pMode;
      pocketPolaroidZone.style.display = pMode === 'polaroid' ? 'block' : 'none';
      pocketFlowerZone.style.display = pMode === 'flower' ? 'block' : 'none';
      pocketVinylZone.style.display = pMode === 'vinyl' ? 'block' : 'none';
    });
  });

  if (pocketPhotoTrigger && cardPocketFile) {
    pocketPhotoTrigger.addEventListener('click', () => {
      cardPocketFile.click();
    });
    cardPocketFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          pocketPhotoImg.src = event.target.result;
          pocketPhotoImg.style.display = 'block';
          pocketPhotoText.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ================= 5. DELIVERY VESSELS (3 OPTIONS) =================
  const vesselBtns = document.querySelectorAll('.vessel-btn');
  const vesselPreviewRender = document.getElementById('vessel-preview-render');

  vesselBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vesselBtns.forEach(b => b.classList.toggle('active', b === btn));
      const v = btn.dataset.vessel;
      state.vessel = v;
      updateVesselLivePreview();
    });
  });

  function updateVesselLivePreview() {
    if (!vesselPreviewRender) return;
    if (state.vessel === 'envelope') {
      vesselPreviewRender.innerHTML = `
        <span class="preview-big-icon">✉️</span>
        <p class="preview-vessel-name">${state.letter.envelope === 'maroon-lace' ? 'Maroon Lace Envelope' : 'Stationery Envelope'} with ${state.letter.seal.toUpperCase()} Seal</p>
      `;
    } else if (state.vessel === 'box') {
      vesselPreviewRender.innerHTML = `
        <span class="preview-big-icon">🎁</span>
        <p class="preview-vessel-name">Tied Keepsake Box with Ribbon</p>
      `;
    } else {
      vesselPreviewRender.innerHTML = `
        <span class="preview-big-icon">🚚</span>
        <p class="preview-vessel-name">Delivery Truck</p>
      `;
    }
  }

  // ================= 6. DISPATCH & UNWRAPPING MODAL =================
  const btnDispatchAction = document.getElementById('btn-dispatch-action');
  const unwrapModal = document.getElementById('unwrap-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const modalVesselArt = document.getElementById('modal-vessel-art');
  const hugeVesselIcon = document.getElementById('huge-vessel-icon');
  const modalVesselHint = document.getElementById('modal-vessel-hint');
  const modalVesselStage = document.getElementById('modal-vessel-stage');
  const modalRevealedStage = document.getElementById('modal-revealed-stage');
  const modalRevealedContent = document.getElementById('modal-revealed-content');
  const btnInstantOpen = document.getElementById('btn-instant-open');
  const shelfItemsGrid = document.getElementById('shelf-items-grid');

  if (btnDispatchAction) {
    btnDispatchAction.addEventListener('click', () => {
      modalVesselStage.style.display = 'block';
      modalRevealedStage.style.display = 'none';

      if (state.vessel === 'envelope') {
        hugeVesselIcon.innerText = '✉️';
        modalVesselHint.innerText = 'Slide wax seal to open';
      } else if (state.vessel === 'box') {
        hugeVesselIcon.innerText = '🎁';
        modalVesselHint.innerText = 'Untie ribbon to open';
      } else {
        hugeVesselIcon.innerText = '🚚';
        modalVesselHint.innerText = 'Tap truck door to reveal';
      }

      unwrapModal.style.display = 'flex';
    });
  }

  function revealGiftModal() {
    modalVesselStage.style.display = 'none';
    modalRevealedStage.style.display = 'block';

    let html = '';
    const fromVal = document.getElementById('postcard-from-input')?.value || 'Saanvi';
    const toVal = document.getElementById('postcard-to-input')?.value || 'Kabir';

    if (state.activeMedium === 'postcard') {
      html = `
        <div style="background:${state.postcard.color}; border:1px solid #DCD7CE; padding:12px; border-radius:4px;">
          <h4 style="font-family:'Playfair Display', serif; font-size:15px;">Morning light</h4>
          <p style="font-family:'Caveat', cursive; font-size:18px; margin:8px 0;">"${document.getElementById('postcard-back-message')?.value || 'A quiet dispatch from my morning.'}"</p>
          <small style="color:#736B63;">To: ${toVal} • From: ${fromVal}</small>
        </div>
      `;
    } else if (state.activeMedium === 'letter') {
      html = `
        <div style="background:#FFFFFF; border:1px solid #DCD7CE; padding:14px; border-radius:4px; font-family:'Caveat', cursive; font-size:18px;">
          <p>"${document.getElementById('letter-body-textarea')?.value || 'Just a note to say I am thinking of you.'}"</p>
          <div style="font-size:12px; color:#736B63; margin-top:8px;">Delivered in Maroon Lace Envelope</div>
        </div>
      `;
    } else if (state.activeMedium === 'bouquet') {
      html = `
        <div style="background:#F7F4EE; border:1px solid #DCD7CE; padding:12px; border-radius:4px;">
          <h4 style="font-family:'Playfair Display', serif; font-size:14px;">Botanical Bouquet</h4>
          <p style="font-size:12px; color:#736B63; margin-top:4px;">${state.bouquet.flowers.join(' • ')}</p>
        </div>
      `;
    } else {
      html = `
        <div style="background:#FFFFFF; border:1px solid #DCD7CE; padding:12px; border-radius:4px;">
          <h4 style="font-family:'Playfair Display', serif; font-size:14px;">Folded Greeting Card</h4>
          <p style="font-family:'Caveat', cursive; font-size:16px; margin-top:4px;">"A quiet wish for you today."</p>
        </div>
      `;
    }

    modalRevealedContent.innerHTML = html;

    // Prepend to Keepsake Shelf
    if (shelfItemsGrid) {
      const card = document.createElement('div');
      card.className = 'shelf-item-card';
      const vesselNames = { envelope: '✉️ Envelope', box: '🎁 Keepsake Box', truck: '🚚 Delivery Truck' };
      card.innerHTML = `
        <div class="item-tag-vessel">${vesselNames[state.vessel]}</div>
        <h4>${state.activeMedium.toUpperCase()}</h4>
        <p class="item-snippet">Preserved freshly from today's atelier.</p>
        <div class="item-footer"><span>From: ${fromVal}</span><span>Just now</span></div>
      `;
      shelfItemsGrid.prepend(card);
    }
  }

  if (modalVesselArt) modalVesselArt.addEventListener('click', revealGiftModal);
  if (btnInstantOpen) btnInstantOpen.addEventListener('click', revealGiftModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', () => { unwrapModal.style.display = 'none'; });

  // ================= 7. KEEPSAKES TABS =================
  const segBtns = document.querySelectorAll('.seg-btn');
  const subtabs = document.querySelectorAll('.keepsakes-subtab');

  segBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabKey = btn.dataset.tab;
      segBtns.forEach(b => b.classList.toggle('active', b === btn));
      subtabs.forEach(sub => {
        const isMatch = sub.id === `tab-${tabKey}`;
        sub.style.display = isMatch ? 'block' : 'none';
        sub.classList.toggle('active', isMatch);
      });
    });
  });

});
