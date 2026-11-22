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
      step: 'stems',
      flowers: [
        { flower: 'Rose', file: 'rose.png' },
        { flower: 'Rose', file: 'rose.png' },
        { flower: 'Peony', file: 'peony.png' },
        { flower: "Baby's Breath", file: 'babys_breath.png' },
        { flower: 'Dahlia', file: 'dahlia.png' }
      ],
      greenery: ['eucalyptus', 'olive'],
      noteTheme: 'cream',
      noteTo: 'Kabir',
      noteFrom: 'Saanvi',
      noteBody: 'A little botanical bouquet handpicked just for you.',
      shuffleSeed: 1
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
  const postcardFontPicker = document.getElementById('postcard-font-picker');
  const postcardFontSelect = document.getElementById('postcard-font-select');
  const postcardBackMessage = document.getElementById('postcard-back-message');
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
      if (postcardFontPicker) {
        postcardFontPicker.style.display = state.postcard.flipped ? 'flex' : 'none';
      }
    });
  }

  // Handle Font Change & Size
  let currentFontSize = 16;
  const btnFontMinus = document.getElementById('btn-font-minus');
  const btnFontPlus = document.getElementById('btn-font-plus');
  if (postcardFontSelect && postcardBackMessage) {
    postcardFontSelect.addEventListener('change', (e) => {
      postcardBackMessage.style.fontFamily = e.target.value;
    });
    if (btnFontMinus) {
      btnFontMinus.addEventListener('click', () => {
        currentFontSize = Math.max(10, currentFontSize - 1);
        postcardBackMessage.style.fontSize = currentFontSize + 'px';
      });
    }
    if (btnFontPlus) {
      btnFontPlus.addEventListener('click', () => {
        currentFontSize = Math.min(32, currentFontSize + 1);
        postcardBackMessage.style.fontSize = currentFontSize + 'px';
      });
    }
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

  // Image Upload & Pan/Zoom on Postcard Front
  if (postcardPhotoArea && postcardFileInput) {
    let imgState = { scale: 1, tx: 0, ty: 0 };
    let isDraggingImg = false;
    let hasMoved = false;
    let startX = 0, startY = 0;

    const updateImgTransform = () => {
      if (postcardImagePreview) {
        postcardImagePreview.style.transform = `translate(${imgState.tx}px, ${imgState.ty}px) scale(${imgState.scale})`;
        postcardImagePreview.style.transformOrigin = 'center';
      }
    };

    postcardPhotoArea.addEventListener('mousedown', (e) => {
      if (postcardImagePreview.style.display === 'block') {
        isDraggingImg = true;
        hasMoved = false;
        startX = e.clientX - imgState.tx;
        startY = e.clientY - imgState.ty;
        postcardImagePreview.style.cursor = 'grabbing';
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (isDraggingImg) {
        hasMoved = true;
        imgState.tx = e.clientX - startX;
        imgState.ty = e.clientY - startY;
        updateImgTransform();
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDraggingImg) {
        isDraggingImg = false;
        postcardImagePreview.style.cursor = 'grab';
      }
    });

    postcardPhotoArea.addEventListener('wheel', (e) => {
      if (postcardImagePreview.style.display === 'block') {
        e.preventDefault();
        imgState.scale += e.deltaY * -0.002;
        imgState.scale = Math.max(0.2, Math.min(imgState.scale, 5));
        updateImgTransform();
      }
    });

    postcardPhotoArea.addEventListener('click', (e) => {
      if (!hasMoved) {
        postcardFileInput.click();
      }
    });

    postcardFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          postcardImagePreview.src = event.target.result;
          postcardImagePreview.style.display = 'block';
          postcardImagePreview.style.cursor = 'grab';
          photoUploadHint.style.display = 'none';
          imgState = { scale: 1, tx: 0, ty: 0 };
          updateImgTransform();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Stamp Templates by Theme
  const makeCandyStampCroppedImg = (imgPath) => `
    <div style="width: 44px; height: 54px; background-color: #EE3A4C; display: flex; align-items: center; justify-content: center; border: 2px dashed #FFFFFF; outline: 1.5px solid #EE3A4C; outline-offset: -1px; padding: 3px; box-sizing: border-box;">
      <div style="width: 100%; height: 100%; overflow: hidden; background-color: #FCE7EB; display: flex; align-items: center; justify-content: center;">
        <img src="${imgPath}" style="width: 140%; height: 140%; max-width: none; object-fit: cover; object-position: center;" alt="stamp"/>
      </div>
    </div>
  `;

  const makeKraftStampCroppedImg = (imgPath) => `
    <div style="width: 44px; height: 54px; background-color: #4A3124; display: flex; align-items: center; justify-content: center; border: 1.5px dashed #E6D9C8; padding: 3px; box-sizing: border-box; border-radius: 3px;">
      <div style="width: 100%; height: 100%; overflow: hidden; border-radius: 1px; display: flex; align-items: center; justify-content: center; background-color: #E6D9C8;">
        <img src="${imgPath}" style="width: 140%; height: 140%; max-width: none; object-fit: cover; object-position: center;" alt="stamp"/>
      </div>
    </div>
  `;

  const makeKraftComplexSvg = (svgContent) => `
    <div style="width: 44px; height: 54px; background-color: #4A3124; display: flex; align-items: center; justify-content: center; border: 1.5px dashed #E6D9C8; padding: 3px; box-sizing: border-box; border-radius: 3px;">
      <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
        ${svgContent}
      </div>
    </div>
  `;

  const complexHeartSvg = `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="#E6D9C8" stroke-width="2">
    <rect x="5" y="5" width="90" height="90" rx="5" stroke-dasharray="2 4"/>
    <path d="M 5 20 C 15 20 20 15 20 5 M 80 5 C 80 15 85 20 95 20 M 95 80 C 85 80 80 85 80 95 M 20 95 C 20 85 15 80 5 80" stroke-width="1.5"/>
    <path d="M 50 85 C 40 70 10 55 15 30 C 18 15 35 15 45 25 C 48 28 50 35 50 35" stroke-width="2.5"/>
    <path d="M 50 85 C 60 70 90 55 85 30 C 82 15 65 15 55 25 C 52 28 50 35 50 35" stroke-width="2.5"/>
    <path d="M 25 35 C 30 45 40 40 45 35 C 40 30 30 25 25 35 Z" fill="#E6D9C8"/>
    <path d="M 75 35 C 70 45 60 40 55 35 C 60 30 70 25 75 35 Z" fill="#E6D9C8"/>
    <path d="M 50 45 C 40 55 45 65 50 70 C 55 65 60 55 50 45 Z" stroke-dasharray="1 2"/>
    <path d="M 15 30 C 10 20 20 10 30 15 M 85 30 C 90 20 80 10 70 15" stroke-width="1.5"/>
    <circle cx="50" cy="25" r="3.5" fill="#E6D9C8"/>
    <path d="M 50 85 C 45 95 35 90 40 80 M 50 85 C 55 95 65 90 60 80" stroke-width="1.5"/>
  </svg>`;

  const complexMedallionSvg = `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="#E6D9C8" stroke-width="1.5">
    <circle cx="50" cy="50" r="45"/>
    <circle cx="50" cy="50" r="39" stroke-dasharray="3 4"/>
    <path d="M 50 15 L 56 44 L 85 50 L 56 56 L 50 85 L 44 56 L 15 50 L 44 44 Z" fill="#E6D9C8" fill-opacity="0.2"/>
    <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke-width="1" opacity="0.7"/>
    <path d="M 20 20 L 80 80 M 20 80 L 80 20" stroke-dasharray="2 3"/>
    <path d="M 15 15 C 25 10 30 20 25 25 C 20 30 10 25 15 15 Z" fill="#E6D9C8"/>
    <path d="M 85 15 C 75 10 70 20 75 25 C 80 30 90 25 85 15 Z" fill="#E6D9C8"/>
    <path d="M 15 85 C 25 90 30 80 25 75 C 20 70 10 75 15 85 Z" fill="#E6D9C8"/>
    <path d="M 85 85 C 75 90 70 80 75 75 C 80 70 90 75 85 85 Z" fill="#E6D9C8"/>
    <circle cx="50" cy="50" r="12" fill="#E6D9C8"/>
    <circle cx="50" cy="50" r="4" fill="#4A3124"/>
    <circle cx="50" cy="50" r="26" stroke-dasharray="1 3" stroke-width="3"/>
  </svg>`;

  const complexStarsSvg = `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <path d="M 60,30 L 68,52 L 92,55 L 75,68 L 82,90 L 60,78 L 38,90 L 45,68 L 28,55 L 52,52 Z" fill="#E6D9C8" stroke="#E6D9C8" stroke-width="2" stroke-linejoin="round"/>
    <line x1="55" y1="62" x2="55" y2="68" stroke="#4A3124" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="67" y1="62" x2="67" y2="68" stroke="#4A3124" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 60,65 L 61,71 L 65,71" stroke="#4A3124" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="50" cy="70" r="4" fill="#C15B3E" opacity="0.8"/>
    <circle cx="72" cy="70" r="4" fill="#C15B3E" opacity="0.8"/>

    <g transform="rotate(-15 30 25)">
      <path d="M 30,5 L 34,16 L 46,18 L 37,25 L 41,36 L 30,30 L 19,36 L 23,25 L 14,18 L 26,16 Z" fill="#E6D9C8" stroke="#E6D9C8" stroke-width="2" stroke-linejoin="round"/>
      <line x1="26" y1="22" x2="26" y2="26" stroke="#4A3124" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="33" y1="22" x2="33" y2="26" stroke="#4A3124" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 29,24 L 29.5,28 L 32,28" stroke="#4A3124" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="23" cy="27" r="3" fill="#C15B3E" opacity="0.8"/>
      <circle cx="36" cy="27" r="3" fill="#C15B3E" opacity="0.8"/>
    </g>

    <path d="M 75 15 L 77 22 L 84 24 L 77 26 L 75 33 L 73 26 L 66 24 L 73 22 Z" fill="#E6D9C8"/>
    <path d="M 15 45 L 16 50 L 21 51 L 16 52 L 15 57 L 14 52 L 9 51 L 14 50 Z" fill="#E6D9C8"/>
    <path d="M 40 85 L 41 88 L 44 89 L 41 90 L 40 93 L 39 90 L 36 89 L 39 88 Z" fill="#E6D9C8"/>
    <circle cx="85" cy="45" r="1.5" fill="#E6D9C8"/>
    <circle cx="25" cy="75" r="1.5" fill="#E6D9C8"/>
    <circle cx="50" cy="45" r="1.5" fill="#E6D9C8"/>
  </svg>`;

  const makeBlueStampCustomImg = (imgPath, zoom = "100%") => `
    <div style="width: 44px; height: 54px; background-color: #2C4159; display: flex; align-items: center; justify-content: center; border: 1.5px dashed #A9C2D8; padding: 3px; box-sizing: border-box; border-radius: 3px;">
      <div style="width: 100%; height: 100%; overflow: hidden; border-radius: 1px; display: flex; align-items: center; justify-content: center; background-color: #A9C2D8;">
        <img src="${imgPath}" style="width: ${zoom}; height: ${zoom}; max-width: none; object-fit: cover; object-position: center;" alt="stamp"/>
      </div>
    </div>
  `;

  const makeHeartsStampCustomImg = (imgPath, zoom = "100%", pos = "center") => `
    <div style="width: 44px; height: 54px; background-color: #C1121F; display: flex; align-items: center; justify-content: center; border: 1.5px dashed #FFF9F4; padding: 3px; box-sizing: border-box; border-radius: 3px;">
      <div style="width: 100%; height: 100%; overflow: hidden; border-radius: 1px; display: flex; align-items: center; justify-content: center; background-color: #FFF9F4;">
        <img src="${imgPath}" style="width: ${zoom}; height: ${zoom}; max-width: none; object-fit: cover; object-position: ${pos};" alt="stamp"/>
      </div>
    </div>
  `;

  const makeHeartsStampSendingYouLove = () => `
    <div style="width: 44px; height: 54px; background-color: #C1121F; display: flex; align-items: center; justify-content: center; border: 1.5px dashed #FFF9F4; padding: 3px; box-sizing: border-box; border-radius: 3px;">
      <div style="width: 100%; height: 100%; border-radius: 1px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #EF6069; position: relative; overflow: hidden;">
        
        <!-- Big red heart -->
        <svg style="position: absolute; top: 12%; width: 34px; height: 34px;" viewBox="0 0 24 24" fill="#D32531">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>

        <!-- Script Text -->
        <div style="position: relative; font-family: 'Caveat', cursive; color: #FFF9F4; font-size: 10.5px; font-weight: 600; line-height: 0.85; text-align: center; margin-top: -6px; transform: rotate(-6deg);">
          Sending<br>You<br>Love!
        </div>

        <!-- Subtext -->
        <div style="position: absolute; bottom: 3.5px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; color: #FFF9F4; font-size: 3.5px; text-align: center; letter-spacing: 0.3px;">
          I LOVE<br>ALL OF YOU
        </div>
      </div>
    </div>
  `;

  const themeStamps = {
    candy: [
      { id: 'candy_bear', html: makeCandyStampCroppedImg('assets/stamps/stamp_bear.png') },
      { id: 'candy_heart', html: makeCandyStampCroppedImg('assets/stamps/stamp_heart.png') },
      { id: 'candy_lock', html: makeCandyStampCroppedImg('assets/stamps/stamp_lock.png') },
      { id: 'candy_tulip', html: makeCandyStampCroppedImg('assets/stamps/stamp_tulip.png') },
      { id: 'candy_butterfly', html: makeCandyStampCroppedImg('assets/stamps/stamp_butterfly.png') }
    ],
    kraft: [
      { id: 'kraft_butterfly', html: makeKraftStampCroppedImg('assets/stamps/stamp_kraft_butterfly.png') },
      { id: 'kraft_flower', html: makeKraftStampCroppedImg('assets/stamps/stamp_kraft_flower.png') },
      { id: 'kraft_stars', html: makeKraftComplexSvg(complexStarsSvg) },
      { id: 'kraft_heart', html: makeKraftComplexSvg(complexHeartSvg) },
      { id: 'kraft_medallion', html: makeKraftComplexSvg(complexMedallionSvg) }
    ],
    'blue-ribbon': [
      { id: 'blue_bunny', html: makeBlueStampCustomImg('assets/stamps/stamp_blue_bunny.png', '130%') },
      { id: 'blue_card', html: makeBlueStampCustomImg('assets/stamps/stamp_blue_card.png', '100%') },
      { id: 'blue_cherries', html: makeBlueStampCustomImg('assets/stamps/stamp_blue_cherries.png', '130%') },
      { id: 'blue_tickets', html: makeBlueStampCustomImg('assets/stamps/stamp_blue_tickets.png', '100%') },
      { id: 'blue_heart', html: makeBlueStampCustomImg('assets/stamps/stamp_blue_heart.png', '130%') }
    ],
    'hearts': [
      { id: 'hearts_sending', html: makeHeartsStampSendingYouLove() },
      { id: 'hearts_dice', html: makeHeartsStampCustomImg('assets/stamps/stamp_hearts_dice.png', '135%', '35% 50%') },
      { id: 'hearts_painted', html: makeHeartsStampCustomImg('assets/stamps/stamp_hearts_painted.png', '115%', '45% 50%') },
      { id: 'hearts_lucky', html: makeHeartsStampCustomImg('assets/stamps/stamp_hearts_lucky.png', '125%', '35% 50%') },
      { id: 'hearts_text', html: makeHeartsStampCustomImg('assets/stamps/stamp_hearts_text.png', '115%', '50% 20%') }
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

  // ================= 3. BOUQUET WORKSPACE (DIGIBOUQUET BARE-STEM) =================
  const bStepBtns = document.querySelectorAll('.b-step-btn');
  const bqPanels = {
    stems: document.getElementById('bq-panel-stems'),
    arrange: document.getElementById('bq-panel-arrange'),
    greenery: document.getElementById('bq-panel-greenery'),
    note: document.getElementById('bq-panel-note')
  };
  const bqStemCountEl = document.getElementById('bq-stem-count');
  const bloomCards = document.querySelectorAll('.bloom-card');
  const btnReshuffleStems = document.getElementById('btn-reshuffle-stems');
  const btnClearStems = document.getElementById('btn-clear-stems');
  const greeneryCards = document.querySelectorAll('.greenery-card');
  const greeneryLayer = document.getElementById('greenery-layer');
  const stemsBloomCluster = document.getElementById('stems-bloom-cluster');
  const stemTieBand = document.getElementById('stem-tie-band');
  const tuckedMiniNote = document.getElementById('tucked-mini-note');
  const miniNotePreviewText = document.getElementById('mini-note-preview-text');
  const noteThemeChips = document.querySelectorAll('.note-theme-chip');
  const bouquetNoteEditor = document.getElementById('bouquet-note-card-editor');
  const bouquetToInput = document.getElementById('bouquet-to-input');
  const bouquetFromInput = document.getElementById('bouquet-from-input');
  const bouquetNoteBody = document.getElementById('bouquet-note-body');
  const unfoldedOverlay = document.getElementById('bouquet-unfolded-note-overlay');
  const unfoldedCard = document.getElementById('unfolded-note-card');
  const btnCloseUnfoldedNote = document.getElementById('btn-close-unfolded-note');
  const unfoldedTo = document.getElementById('unfolded-to');
  const unfoldedFrom = document.getElementById('unfolded-from');
  const unfoldedNoteBodyText = document.getElementById('unfolded-note-body-text');

  // Step Switcher
  function setBouquetStep(stepKey) {
    if (!bqPanels[stepKey]) return;
    state.bouquet.step = stepKey;
    bStepBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.step === stepKey));
    Object.keys(bqPanels).forEach(key => {
      if (bqPanels[key]) {
        bqPanels[key].style.display = key === stepKey ? 'block' : 'none';
      }
    });
  }

  bStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setBouquetStep(btn.dataset.step);
    });
  });

  // Next / Back Navigation buttons
  document.querySelectorAll('.bq-next-btn, .bq-back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (target === 'arrange' && state.bouquet.flowers.length < 5) {
        alert('Please select at least 5 flowers (up to 8 stems) to create a full botanical bouquet.');
        return;
      }
      if (target) setBouquetStep(target);
    });
  });

  const bqBtnDoneNote = document.getElementById('bq-btn-done-note');
  if (bqBtnDoneNote) {
    bqBtnDoneNote.addEventListener('click', () => {
      const btnVesselSelect = document.getElementById('btn-vessel-select');
      if (btnVesselSelect) {
        btnVesselSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Step 1: Flower Selection (5 to 8 stems total, allows duplicate stems)
  function updateStemCardsUI() {
    bloomCards.forEach(card => {
      const flowerName = card.dataset.flower;
      const count = state.bouquet.flowers.filter(f => f.flower === flowerName).length;
      card.classList.toggle('selected', count > 0);
      const badge = card.querySelector('.bloom-badge-qty');
      const val = card.querySelector('.stem-step-val');
      if (badge) badge.textContent = `×${count}`;
      if (val) val.textContent = count;
    });
    updateStemCountDisplay();
  }

  function addStem(flowerName, flowerFile) {
    if (state.bouquet.flowers.length >= 8) {
      alert('A bouquet holds up to 8 botanical stems in total. Use − on a flower to remove a stem first.');
      return;
    }
    state.bouquet.flowers.push({ flower: flowerName, file: flowerFile });
    updateStemCardsUI();
    renderBouquetPreview();
  }

  function removeStem(flowerName) {
    const idx = state.bouquet.flowers.map(f => f.flower).lastIndexOf(flowerName);
    if (idx > -1) {
      state.bouquet.flowers.splice(idx, 1);
      updateStemCardsUI();
      renderBouquetPreview();
    }
  }

  bloomCards.forEach(card => {
    const flowerName = card.dataset.flower;
    const flowerFile = card.dataset.file;

    // Tapping on card body/image adds a stem
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-step-sub') || e.target.closest('.btn-step-add')) {
        return;
      }
      addStem(flowerName, flowerFile);
    });

    const subBtn = card.querySelector('.btn-step-sub');
    if (subBtn) {
      subBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeStem(flowerName);
      });
    }

    const addBtn = card.querySelector('.btn-step-add');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addStem(flowerName, flowerFile);
      });
    }
  });

  function updateStemCountDisplay() {
    if (bqStemCountEl) {
      const count = state.bouquet.flowers.length;
      bqStemCountEl.textContent = `${count} / 8 stems`;
      if (count < 5) {
        bqStemCountEl.style.color = 'var(--ink-muted)';
        bqStemCountEl.title = 'Select 5–8 stems for a balanced bouquet';
      } else {
        bqStemCountEl.style.color = 'var(--ink-maroon)';
        bqStemCountEl.title = 'Perfect arrangement';
      }
    }
  }

  // Step 2: Arrange & Reshuffle Composition
  if (btnReshuffleStems) {
    btnReshuffleStems.addEventListener('click', () => {
      state.bouquet.shuffleSeed += 1;
      for (let i = state.bouquet.flowers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.bouquet.flowers[i], state.bouquet.flowers[j]] = [state.bouquet.flowers[j], state.bouquet.flowers[i]];
      }
      renderBouquetPreview(true);
    });
  }

  if (btnClearStems) {
    btnClearStems.addEventListener('click', () => {
      state.bouquet.shuffleSeed = 1;
      renderBouquetPreview();
    });
  }

  // Step 3: Greenery Selector
  greeneryCards.forEach(card => {
    card.addEventListener('click', () => {
      const foliage = card.dataset.greenery;
      const idx = state.bouquet.greenery.indexOf(foliage);
      if (idx > -1) {
        state.bouquet.greenery.splice(idx, 1);
        card.classList.remove('selected');
      } else {
        state.bouquet.greenery.push(foliage);
        card.classList.add('selected');
      }
      renderBouquetPreview();
    });
  });

  // Step 4: Card Themes & Note
  noteThemeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      noteThemeChips.forEach(c => c.classList.toggle('active', c === chip));
      const theme = chip.dataset.theme;
      state.bouquet.noteTheme = theme;
      if (bouquetNoteEditor) bouquetNoteEditor.setAttribute('data-theme', theme);
      if (unfoldedCard) unfoldedCard.setAttribute('data-theme', theme);
    });
  });

  function syncNoteDetails() {
    if (bouquetToInput) state.bouquet.noteTo = bouquetToInput.value;
    if (bouquetFromInput) state.bouquet.noteFrom = bouquetFromInput.value;
    if (bouquetNoteBody) state.bouquet.noteBody = bouquetNoteBody.value;

    if (unfoldedTo) unfoldedTo.textContent = `To: ${state.bouquet.noteTo || 'Kabir'}`;
    if (unfoldedFrom) unfoldedFrom.textContent = `From: ${state.bouquet.noteFrom || 'Saanvi'}`;
    if (unfoldedNoteBodyText) unfoldedNoteBodyText.textContent = state.bouquet.noteBody || 'A little botanical bouquet handpicked just for you.';

    if (miniNotePreviewText) {
      miniNotePreviewText.textContent = state.bouquet.noteTo ? `For ${state.bouquet.noteTo}` : 'A little note';
    }
  }

  if (bouquetToInput) bouquetToInput.addEventListener('input', syncNoteDetails);
  if (bouquetFromInput) bouquetFromInput.addEventListener('input', syncNoteDetails);
  if (bouquetNoteBody) bouquetNoteBody.addEventListener('input', syncNoteDetails);

  // Unfolded Note Modal Actions
  function openUnfoldedNote() {
    syncNoteDetails();
    if (unfoldedCard) unfoldedCard.setAttribute('data-theme', state.bouquet.noteTheme || 'cream');
    if (unfoldedOverlay) unfoldedOverlay.style.display = 'flex';
  }

  function closeUnfoldedNote() {
    if (unfoldedOverlay) unfoldedOverlay.style.display = 'none';
  }

  if (tuckedMiniNote) {
    tuckedMiniNote.addEventListener('click', openUnfoldedNote);
  }
  if (btnCloseUnfoldedNote) {
    btnCloseUnfoldedNote.addEventListener('click', closeUnfoldedNote);
  }
  if (unfoldedOverlay) {
    unfoldedOverlay.addEventListener('click', (e) => {
      if (e.target === unfoldedOverlay) closeUnfoldedNote();
    });
  }

  // Bare-Stem Bouquet Rendering Engine (Side-by-Side with Interleaved Greenery)
  function renderBouquetPreview(animated = false) {
    const total = state.bouquet.flowers.length;

    // Toggle tie band and mini note based on stem count
    if (stemTieBand) stemTieBand.style.display = total === 0 ? 'none' : 'flex';
    if (tuckedMiniNote) tuckedMiniNote.style.display = total === 0 ? 'none' : 'block';

    if (total === 0) {
      if (greeneryLayer) greeneryLayer.innerHTML = '';
      if (stemsBloomCluster) stemsBloomCluster.innerHTML = '';
      return;
    }

    const seed = state.bouquet.shuffleSeed;

    // 1. Interleaved Greenery (Positioned in intermediate niches BETWEEN flowers)
    if (greeneryLayer) {
      greeneryLayer.innerHTML = '';

      const greenerySlots = {
        eucalyptus: { slotRatio: 0.18, angle: -18, yOffset: -18, zIdx: 5 },
        fern:       { slotRatio: 0.38, angle: -8,  yOffset: -24, zIdx: 6 },
        olive:      { slotRatio: 0.62, angle: +8,  yOffset: -22, zIdx: 6 },
        ruscus:     { slotRatio: 0.82, angle: +18, yOffset: -18, zIdx: 5 }
      };

      state.bouquet.greenery.forEach(foliage => {
        const config = greenerySlots[foliage] || { slotRatio: 0.5, angle: 0, yOffset: -20, zIdx: 5 };
        const slotX = -115 + (230 * config.slotRatio);
        const jitterX = Math.sin(seed * 9 + config.slotRatio * 17) * 4;
        const finalSlotX = Math.round(slotX + jitterX);
        const finalAngle = Math.round(config.angle + Math.sin(seed * 7 + config.slotRatio * 13) * 3);
        const finalY = Math.round(config.yOffset + Math.sin(seed * 13 + config.slotRatio * 19) * 4);

        const item = document.createElement('div');
        item.className = `greenery-item greenery-${foliage}`;
        item.style.left = `calc(50% + ${finalSlotX}px)`;
        item.style.transform = `rotate(${finalAngle}deg) translateY(${finalY}px)`;
        item.style.zIndex = config.zIdx;
        item.innerHTML = `<img src="assets/greenery/${foliage}.svg" alt="${foliage}">`;
        greeneryLayer.appendChild(item);
      });
    }

    // 2. Flower Stems Cluster (Positioned BESIDE one another, staggered heights)
    if (stemsBloomCluster) {
      stemsBloomCluster.innerHTML = '';

      state.bouquet.flowers.forEach((item, i) => {
        const t = total > 1 ? (i / (total - 1)) : 0.5;
        const centerOffset = total > 1 ? -110 + (220 * t) : 0;
        const baseAngle = total > 1 ? -16 + (32 * t) : 0;

        const arch = total > 1 ? Math.sin(t * Math.PI) * 16 : 0;
        const tier = (i % 2 === 0 ? 8 : -10);
        const staggerY = -arch + tier;

        const jitterX = Math.sin(seed * 11 + i * 5.3) * 4;
        const jitterAngle = Math.sin(seed * 7 + i * 4.1) * 2.5;
        const jitterY = Math.sin(seed * 17 + i * 7.1) * 4;

        const finalX = Math.round(centerOffset + jitterX);
        const finalAngle = (baseAngle + jitterAngle).toFixed(1);
        const finalY = Math.round(staggerY + jitterY);
        const zIdx = (i % 2 === 0 ? 4 : 7);

        const stemEl = document.createElement('div');
        stemEl.className = 'stem-flower-item';
        stemEl.style.left = `calc(50% + ${finalX}px)`;
        stemEl.style.transform = `rotate(${finalAngle}deg) translateY(${finalY}px)`;
        stemEl.style.zIndex = zIdx;
        stemEl.innerHTML = `<img src="assets/flowers/${item.file}" alt="${item.flower}" class="stem-flower-img">`;
        stemsBloomCluster.appendChild(stemEl);
      });
    }
  }

  // Initial call to render default bouquet
  renderBouquetPreview();
  updateStemCardsUI();
  syncNoteDetails();

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
  const envSelectorContainer = document.getElementById('envelope-selector-container');
  const envThumbBtns = document.querySelectorAll('.env-thumb-btn');

  state.envelopeIndex = 0;

  const getEnvelopeSVG = () => `
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#D3A5AF" flood-opacity="0.5"/></filter>
        <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000000" flood-opacity="0.08"/></filter>
        <linearGradient id="envBack" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#F2C4CD"/><stop offset="100%" stop-color="#E8B2BC"/></linearGradient>
        <linearGradient id="envFront" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#FADCE3"/><stop offset="100%" stop-color="#F4C8D2"/></linearGradient>
        <linearGradient id="waxSeal" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#E57373"/><stop offset="100%" stop-color="#C62828"/></linearGradient>
      </defs>
      <g transform="translate(10, 20)">
        <path d="M0,20 L80,20 L80,60 L0,60 Z" fill="url(#envBack)"/>
        <path d="M0,20 L40,45 L80,20" fill="#DFA4B0"/>
        <rect x="5" y="3" width="70" height="42" fill="#FFF9F4" rx="1.5" filter="url(#innerShadow)"/>
        <line x1="15" y1="14" x2="35" y2="14" stroke="#E2D9D1" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="15" y1="21" x2="65" y2="21" stroke="#E2D9D1" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="15" y1="28" x2="55" y2="28" stroke="#E2D9D1" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M35 37 l-1-1 c-1.5-1.5 -4 0.5 -1.5 2.5 l2.5 2.5 l2.5-2.5 c2.5-2 0-4 -1.5-2.5 z" fill="#FF99A8" />
        <path d="M0,20 L40,50 L80,20 L80,65 C80,67 78,69 76,69 L4,69 C2,69 0,67 0,65 Z" fill="url(#envFront)" filter="url(#softShadow)"/>
        <path d="M0,69 L40,40 L80,69" fill="none" stroke="#FFFFFF" stroke-width="0.8" opacity="0.6"/>
        <path d="M0,20 L40,50 L80,20" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity="0.8"/>
        <circle cx="40" cy="48" r="6" fill="url(#waxSeal)" filter="url(#innerShadow)"/>
        <circle cx="40" cy="48" r="4.5" fill="none" stroke="#FFFFFF" stroke-width="0.5" opacity="0.4"/>
        <path d="M38.5,48.5 Q40,45 41.5,48.5 Q40,51 38.5,48.5" fill="#FFFFFF" opacity="0.6"/>
      </g>
      <g fill="#FF99A8" opacity="0.8"><circle cx="85" cy="20" r="1.5" /><circle cx="75" cy="10" r="1" /><circle cx="20" cy="15" r="2" /><circle cx="15" cy="25" r="1" /></g>
      <g fill="#E2B4BD" opacity="0.6"><path d="M90,30 Q90,33 93,33 Q90,33 90,36 Q90,33 87,33 Q90,33 90,30 Z" /><path d="M25,5 Q25,7 27,7 Q25,7 25,9 Q25,7 23,7 Q25,7 25,5 Z" /></g>
    </svg>
  `;

  const getEnvelopeImage = (size = "120px") => {
    if (state.envelopeIndex == 0) {
      return `<div style="width: ${size}; height: ${size}; margin: 0 auto; display: flex; align-items: center; justify-content: center;">${getEnvelopeSVG()}</div>`;
    }
    let clip = "";
    if (state.envelopeIndex == 5) {
      clip = "clip-path: polygon(18% 44%, 50% 21%, 82% 44%, 82% 87%, 18% 87%);";
    }
    return `
      <div style="width: ${size}; height: ${size}; position: relative; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
        <img src="assets/envelopes/env${state.envelopeIndex}.jpg" style="width: 100%; height: 100%; object-fit: contain; ${clip ? clip : 'mix-blend-mode: multiply;'}" />
      </div>
    `;
  };

  const getBoxImage = (size = "120px") => `
    <div style="width: ${size}; height: ${size}; position: relative; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
      <img src="assets/keepsake_box.jpg" style="width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply;" />
    </div>
  `;

  vesselBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vesselBtns.forEach(b => b.classList.toggle('active', b === btn));
      const v = btn.dataset.vessel;
      state.vessel = v;
      if (v === 'envelope') {
        envSelectorContainer.style.display = 'block';
      } else {
        envSelectorContainer.style.display = 'none';
      }
      updateVesselLivePreview();
    });
  });

  envThumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      envThumbBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.style.borderColor = b === btn ? '#D4A373' : 'transparent';
      });
      state.envelopeIndex = btn.dataset.index;
      updateVesselLivePreview();
      
      // Update the main Envelope button icon to reflect the selected envelope
      const mainEnvBtn = document.querySelector('.vessel-btn[data-vessel="envelope"] div');
      if (mainEnvBtn) {
        mainEnvBtn.innerHTML = getEnvelopeImage("44px");
      }
    });
  });

  function updateVesselLivePreview() {
    if (!vesselPreviewRender) return;
    if (state.vessel === 'envelope') {
      vesselPreviewRender.innerHTML = getEnvelopeImage();
    } else if (state.vessel === 'box') {
      vesselPreviewRender.innerHTML = getBoxImage();
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
          <div style="font-size:12px; color:#736B63; margin-top:8px;">Delivered in Envelope</div>
        </div>
      `;
    } else if (state.activeMedium === 'bouquet') {
      const stemCount = state.bouquet.flowers.length;
      const flowerNames = state.bouquet.flowers.map(f => f.flower).join(' • ');
      html = `
        <div class="revealed-bouquet-presentation" style="background: radial-gradient(circle at 50% 68%, #FFFDFB 0%, #F9ECEF 100%); border: 1px solid var(--paper-border); border-radius: 8px; padding: 14px 10px 10px; text-align: center;">
          <div style="font-family: var(--font-editorial); font-size: 15px; font-weight: 600; color: var(--ink-maroon); margin-bottom: 2px;">Botanical Bare-Stem Bouquet</div>
          <p style="font-size: 11px; color: var(--ink-muted); margin-bottom: 8px;">Hand-tied with natural jute twine • ${stemCount} stems</p>
          <div class="bare-stem-stage" id="modal-revealed-bouquet-stage" style="height: 220px; background: transparent; border: none; margin-bottom: 8px;">
            <div class="greenery-layer">${document.getElementById('greenery-layer')?.innerHTML || ''}</div>
            <div class="stems-bloom-cluster">${document.getElementById('stems-bloom-cluster')?.innerHTML || ''}</div>
            <div class="stem-tie-band"></div>
            <div class="tucked-mini-note" id="modal-tucked-mini-note" style="cursor:pointer;" title="Tap to unfold note">
              <div class="mini-note-inner">
                <span class="mini-note-stamp">💌</span>
                <span class="mini-note-text">${state.bouquet.noteTo ? 'For ' + state.bouquet.noteTo : 'A note for you'}</span>
              </div>
              <div class="mini-note-pulse">Tap to read</div>
            </div>
          </div>
          <div style="font-size: 10px; color: var(--ink-muted); font-style: italic;">Tap the note tucked in the stems to read the full dedication</div>
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

    // Attach click to modal mini note
    const modalMiniNote = document.getElementById('modal-tucked-mini-note');
    if (modalMiniNote) {
      modalMiniNote.addEventListener('click', openUnfoldedNote);
    }

    // Prepend to Keepsake Shelf
    if (shelfItemsGrid) {
      const card = document.createElement('div');
      card.className = 'shelf-item-card';
      const vesselNames = { envelope: '✉️ Envelope', box: '🎁 Keepsake Box', truck: '🚚 Delivery Truck' };
      const itemTitle = state.activeMedium === 'bouquet' ? `BOTANICAL BOUQUET (${state.bouquet.flowers.length} STEMS)` : state.activeMedium.toUpperCase();
      const snippet = state.activeMedium === 'bouquet' ? `Hand-tied with ${state.bouquet.flowers.map(f => f.flower).slice(0, 3).join(', ')}...` : "Preserved freshly from today's atelier.";
      card.innerHTML = `
        <div class="item-tag-vessel">${vesselNames[state.vessel]}</div>
        <h4>${itemTitle}</h4>
        <p class="item-snippet">${snippet}</p>
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
