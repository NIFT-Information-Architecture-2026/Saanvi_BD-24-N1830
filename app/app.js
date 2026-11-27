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
      step: 1,
      theme: 'crimson-heart',
      fontSize: 19,
      fontFamily: "'Caveat', cursive",
      to: 'Kabir',
      from: 'Saanvi',
      body: '',
      envelope: 'dusty-blue',
      seal: 'gold-celestial',
      hasPhoto: true,
      photo: 'assets/medium_letter.png',
      stickers: []
    },
    bouquet: {
      step: 'stems',
      flowers: [
        { flower: 'Snapdragon', file: 'snapdragon.png' },
        { flower: 'Lily', file: 'lily.png' },
        { flower: 'Foxglove', file: 'foxglove.png' },
        { flower: "Baby's Breath", file: 'babys_breath.png' },
        { flower: 'Anemones', file: 'anemones.png' },
        { flower: 'Buttercup', file: 'buttercup.png' },
        { flower: 'Peony', file: 'peony.png' },
        { flower: 'Gardenia', file: 'gardenia.png' }
      ],
      greenery: [],
      noteTheme: 'cream',
      noteTo: 'Kabir',
      noteFrom: 'Saanvi',
      noteBody: 'A little botanical bouquet handpicked just for you.',
      shuffleSeed: 1
    },
    greetingCard: {
      step: 1,
      theme: 'crimson-romance',
      coverElements: [
        {
          id: 'cover-title-1',
          type: 'text',
          text: 'A Little Wish For You',
          x: 18,
          y: 65,
          width: 210,
          fontSize: 24,
          fontFamily: "'Caveat', cursive"
        }
      ],
      coverFontSize: 24,
      coverFontFamily: "'Caveat', cursive",
      insideKeepsakes: [],
      insideRightStickers: [],
      insideTo: 'Kabir',
      insideFrom: 'Saanvi',
      insideBody: 'Wishing you all the joy, peace, and warmth this season brings.',
      insideFontSize: 19,
      insideFontFamily: "'Caveat', cursive",
      vessel: 'envelope',
      envelope: 'dusty-blue',
      seal: 'gold-celestial',
      boxIndex: '1',
      isOpened: false,
      previewFace: 'inside'
    }
  };

  // ================= 0. OPENING ENVELOPE SPLASH =================
  const splashScreen = document.getElementById('splash-screen');
  const splashEnvelope = document.getElementById('splash-envelope');
  const appHeader = document.getElementById('app-header');
  const appStage = document.getElementById('app-stage');
  const appBottomNav = document.getElementById('app-bottom-nav');

  function openApp() {
    if (!splashScreen || splashScreen.dataset.opened === 'true') return;
    splashScreen.dataset.opened = 'true';
    splashScreen.style.opacity = '0';
    splashScreen.style.transform = 'scale(1.02)';
    setTimeout(() => {
      splashScreen.style.display = 'none';
      if (appHeader) appHeader.style.display = 'flex';
      if (appStage) appStage.style.display = 'block';
      if (appBottomNav) appBottomNav.style.display = 'flex';
      window.dispatchEvent(new Event('resize'));
    }, 420);
  }

  if (splashScreen) {
    splashScreen.addEventListener('click', openApp);
  }
  if (splashEnvelope) {
    splashEnvelope.addEventListener('click', openApp);
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
      if (room === 'studio') {
        returnToStudioHub();
      }
    });
  });

  // ================= STUDIO 2x2 HUB & WORKSPACE NAVIGATION =================
  const studioHub = document.getElementById('studio-hub');
  const studioEditorArea = document.getElementById('studio-editor-area');
  const studioGridCards = document.querySelectorAll('.studio-grid-card');
  const btnBackHub = document.getElementById('btn-back-hub');
  const editorMediumTitle = document.getElementById('editor-medium-title');

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

  function selectMedium(med) {
    if (med === 'card') med = 'greeting-card';
    state.activeMedium = med;

    if (studioHub) studioHub.style.display = 'none';
    if (studioEditorArea) studioEditorArea.style.display = 'block';

    const editorHeaderBar = document.querySelector('.editor-header-bar');
    if (editorHeaderBar) {
      editorHeaderBar.style.display = (med === 'postcard' || med === 'bouquet' || med === 'letter' || med === 'greeting-card') ? 'none' : 'flex';
    }

    const titleMap = {
      'postcard': 'Postcard',
      'letter': 'Letter',
      'bouquet': 'Bouquet',
      'greeting-card': 'Card'
    };
    if (editorMediumTitle) {
      editorMediumTitle.textContent = titleMap[med] || med;
    }

    Object.keys(canvases).forEach(key => {
      if (canvases[key]) {
        canvases[key].style.display = key === med ? 'block' : 'none';
      }
    });

    window.dispatchEvent(new Event('resize'));
    if (med === 'postcard' && typeof setPostcardStep === 'function') {
      setPostcardStep(1);
    }
    if (med === 'bouquet') {
      if (typeof setBouquetStep === 'function') {
        setBouquetStep(1);
      }
      if (typeof renderBouquetPreview === 'function') {
        renderBouquetPreview();
      }
    }
    if (med === 'letter') {
      if (typeof setLetterStep === 'function') {
        setLetterStep(1);
      }
    }
    if (med === 'greeting-card') {
      if (typeof setCardStep === 'function') {
        setCardStep(1);
      }
    }
  }

  function returnToStudioHub() {
    state.activeMedium = null;
    if (studioEditorArea) studioEditorArea.style.display = 'none';
    if (studioHub) studioHub.style.display = 'flex';
    const canvases = {
      'postcard': document.getElementById('canvas-postcard'),
      'letter': document.getElementById('canvas-letter'),
      'bouquet': document.getElementById('canvas-bouquet'),
      'greeting-card': document.getElementById('canvas-greeting-card')
    };
    Object.keys(canvases).forEach(key => {
      if (canvases[key]) canvases[key].style.display = 'none';
    });
  }

  studioGridCards.forEach(card => {
    card.addEventListener('click', () => {
      const med = card.dataset.medium;
      selectMedium(med);
    });
  });

  if (btnBackHub) {
    btnBackHub.addEventListener('click', () => {
      returnToStudioHub();
    });
  }

  window.selectMedium = selectMedium;
  window.setPostcardStep = setPostcardStep;
  window.setBouquetStep = setBouquetStep;
  window.setCardStep = setCardStep;
  window.renderRecipientExperience = renderRecipientExperience;
  window.renderRecipientBouquetExperience = renderRecipientBouquetExperience;
  window.renderRecipientCardExperience = renderRecipientCardExperience;

  const btnBouquetBackToHub = document.getElementById('btn-bouquet-back-to-hub');
  if (btnBouquetBackToHub) {
    btnBouquetBackToHub.addEventListener('click', returnToStudioHub);
  }

  const btnPostcardBackToHub = document.getElementById('btn-postcard-back-to-hub');
  let currentPostcardStep = 1;

  function setPostcardStep(stepNum) {
    currentPostcardStep = stepNum;
    const postcardStep1Pane = document.getElementById('postcard-step1-pane');
    const postcardStep2Pane = document.getElementById('postcard-step2-pane');
    const postcardStep3Pane = document.getElementById('postcard-step3-pane');
    const postcardDot1 = document.getElementById('postcard-dot-1');
    const postcardDot2 = document.getElementById('postcard-dot-2');
    const postcardDot3 = document.getElementById('postcard-dot-3');
    const postcardLine1 = document.getElementById('postcard-line-1');
    const postcardLine2 = document.getElementById('postcard-line-2');

    if (stepNum === 1) {
      if (postcardStep1Pane) postcardStep1Pane.style.display = 'block';
      if (postcardStep2Pane) postcardStep2Pane.style.display = 'none';
      if (postcardStep3Pane) postcardStep3Pane.style.display = 'none';
      if (postcardDot1) {
        postcardDot1.classList.add('active');
        postcardDot1.classList.remove('completed');
      }
      if (postcardLine1) postcardLine1.classList.remove('active');
      if (postcardDot2) postcardDot2.classList.remove('active', 'completed');
      if (postcardLine2) postcardLine2.classList.remove('active');
      if (postcardDot3) postcardDot3.classList.remove('active', 'completed');
    } else if (stepNum === 2) {
      if (postcardStep1Pane) postcardStep1Pane.style.display = 'none';
      if (postcardStep2Pane) postcardStep2Pane.style.display = 'block';
      if (postcardStep3Pane) postcardStep3Pane.style.display = 'none';
      if (postcardDot1) {
        postcardDot1.classList.remove('active');
        postcardDot1.classList.add('completed');
      }
      if (postcardLine1) postcardLine1.classList.add('active');
      if (postcardDot2) {
        postcardDot2.classList.add('active');
        postcardDot2.classList.remove('completed');
      }
      if (postcardLine2) postcardLine2.classList.remove('active');
      if (postcardDot3) postcardDot3.classList.remove('active', 'completed');
      if (typeof updateVesselLivePreview === 'function') {
        updateVesselLivePreview();
      }
    } else if (stepNum === 3) {
      if (postcardStep1Pane) postcardStep1Pane.style.display = 'none';
      if (postcardStep2Pane) postcardStep2Pane.style.display = 'none';
      if (postcardStep3Pane) postcardStep3Pane.style.display = 'block';
      if (postcardDot1) {
        postcardDot1.classList.remove('active');
        postcardDot1.classList.add('completed');
      }
      if (postcardLine1) postcardLine1.classList.add('active');
      if (postcardDot2) {
        postcardDot2.classList.remove('active');
        postcardDot2.classList.add('completed');
      }
      if (postcardLine2) postcardLine2.classList.add('active');
      if (postcardDot3) {
        postcardDot3.classList.add('active');
        postcardDot3.classList.remove('completed');
      }
      if (typeof renderStep3Preview === 'function') {
        renderStep3Preview();
      }
      if (typeof autoSaveToVault === 'function') {
        autoSaveToVault();
      }
    }
  }

  if (btnPostcardBackToHub) {
    btnPostcardBackToHub.addEventListener('click', () => {
      if (currentPostcardStep === 3) {
        setPostcardStep(2);
      } else if (currentPostcardStep === 2) {
        setPostcardStep(1);
      } else {
        returnToStudioHub();
      }
    });
  }

  // Initially show only the 2x2 studio hub
  returnToStudioHub();

  // ================= 1. POSTCARD WORKSPACE =================
  const postcardCard = document.getElementById('postcard-card');
  const btnFlipPostcard = document.getElementById('btn-flip-postcard');
  const btnPostcardNextStep = document.getElementById('btn-postcard-next-step');
  const btnPostcardBackToStep1 = document.getElementById('btn-postcard-back-to-step1');
  const postcardWrapper = document.getElementById('postcard-container');
  const btnOrientPort = document.getElementById('btn-postcard-orient-port');
  const btnOrientLand = document.getElementById('btn-postcard-orient-land');
  const postcardThemeDots = document.querySelectorAll('#postcard-theme-palette .theme-circle-btn');
  const stampPickBtns = document.querySelectorAll('.stamp-pick-btn');
  const postcardStampDisplay = document.getElementById('postcard-stamp-display');
  const postcardBackControls = document.getElementById('postcard-back-controls');
  const btnStampShuffle = document.getElementById('btn-stamp-shuffle');
  const postcardFontSelect = document.getElementById('postcard-font-select');
  const postcardBackMessage = document.getElementById('postcard-back-message');
  const postcardPhotoArea = document.getElementById('postcard-photo-area');
  const postcardFileInput = document.getElementById('postcard-file-input');
  const postcardImagePreview = document.getElementById('postcard-image-preview');
  const photoUploadHint = document.getElementById('photo-upload-hint');
  const btnToggleFront = document.getElementById('btn-toggle-front');
  const btnToggleBack = document.getElementById('btn-toggle-back');
  const postcardTitleInput = document.getElementById('postcard-title-input');
  const postcardToInput = document.getElementById('postcard-to-input');
  const postcardFromInput = document.getElementById('postcard-from-input');

  const postcardDot1 = document.getElementById('postcard-dot-1');
  const postcardDot2 = document.getElementById('postcard-dot-2');
  const postcardDot3 = document.getElementById('postcard-dot-3');

  // Step 2 & Step 1 Navigation wiring
  if (btnPostcardNextStep) {
    btnPostcardNextStep.addEventListener('click', () => {
      setPostcardStep(2);
    });
  }
  if (btnPostcardBackToStep1) {
    btnPostcardBackToStep1.addEventListener('click', () => {
      setPostcardStep(1);
    });
  }
  if (postcardDot1) {
    postcardDot1.addEventListener('click', () => setPostcardStep(1));
  }
  if (postcardDot2) {
    postcardDot2.addEventListener('click', () => setPostcardStep(2));
  }
  if (postcardDot3) {
    postcardDot3.addEventListener('click', () => setPostcardStep(3));
  }

  // Flip Postcard & Sync Front/Back Toggle
  function setPostcardFace(face) {
    const isBack = face === 'back';
    state.postcard.flipped = isBack;
    if (postcardCard) {
      postcardCard.classList.toggle('flipped', isBack);
    }
    if (btnToggleFront) btnToggleFront.classList.toggle('active', !isBack);
    if (btnToggleBack) btnToggleBack.classList.toggle('active', isBack);
    if (postcardBackControls) {
      postcardBackControls.style.display = isBack ? 'flex' : 'none';
    }
  }

  if (btnToggleFront) {
    btnToggleFront.addEventListener('click', () => setPostcardFace('front'));
  }
  if (btnToggleBack) {
    btnToggleBack.addEventListener('click', () => setPostcardFace('back'));
  }
  if (btnFlipPostcard) {
    btnFlipPostcard.addEventListener('click', () => {
      setPostcardFace(state.postcard.flipped ? 'front' : 'back');
    });
  }

  // Handle Font Change & Size
  let currentFontSize = 16;
  const btnFontMinus = document.getElementById('btn-font-minus');
  const btnFontPlus = document.getElementById('btn-font-plus');
  if (postcardFontSelect && postcardBackMessage) {
    postcardFontSelect.addEventListener('change', (e) => {
      postcardBackMessage.style.fontFamily = e.target.value;
      if (postcardToInput) postcardToInput.style.fontFamily = e.target.value;
      if (postcardFromInput) postcardFromInput.style.fontFamily = e.target.value;
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
      if (postcardWrapper) postcardWrapper.className = 'postcard-wrapper portrait';
      state.postcard.orientation = 'portrait';
    });
    btnOrientLand.addEventListener('click', () => {
      btnOrientLand.classList.add('active');
      btnOrientPort.classList.remove('active');
      if (postcardWrapper) postcardWrapper.className = 'postcard-wrapper landscape';
      state.postcard.orientation = 'landscape';
    });
  }

  // Theme changes
  postcardThemeDots.forEach(btn => {
    btn.addEventListener('click', () => {
      postcardThemeDots.forEach(b => b.classList.toggle('active', b === btn));
      const theme = btn.dataset.theme;
      state.postcard.color = theme;
      if (postcardWrapper) {
        postcardWrapper.dataset.theme = theme;
      }
      updateStampPicker(theme);
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
          if (photoUploadHint) photoUploadHint.style.display = 'none';
          imgState = { scale: 1, tx: 0, ty: 0 };
          updateImgTransform();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Theme-Specific Custom Stamps
  const makeCandyStampCroppedImg = (imgPath) => `
    <div style="width: 100%; height: 100%; box-sizing: border-box; background-color: #EE3A4C; display: flex; align-items: center; justify-content: center; border: 1.5px dashed #FFFFFF; outline: 1px solid #EE3A4C; outline-offset: -1px; padding: 2px; border-radius: 3px;">
      <div style="width: 100%; height: 100%; overflow: hidden; background-color: #FCE7EB; display: flex; align-items: center; justify-content: center; border-radius: 2px;">
        <img src="${imgPath}" style="width: 130%; height: 130%; max-width: none; object-fit: cover; object-position: center;" alt="stamp"/>
      </div>
    </div>
  `;

  const makeKraftStampCroppedImg = (imgPath) => `
    <div style="width: 100%; height: 100%; box-sizing: border-box; background-color: #4A3124; display: flex; align-items: center; justify-content: center; border: 1.5px dashed #E6D9C8; padding: 2px; border-radius: 3px;">
      <div style="width: 100%; height: 100%; overflow: hidden; border-radius: 2px; display: flex; align-items: center; justify-content: center; background-color: #E6D9C8;">
        <img src="${imgPath}" style="width: 130%; height: 130%; max-width: none; object-fit: cover; object-position: center;" alt="stamp"/>
      </div>
    </div>
  `;

  const makeKraftComplexSvg = (svgContent) => `
    <div style="width: 100%; height: 100%; box-sizing: border-box; background-color: #4A3124; display: flex; align-items: center; justify-content: center; border: 1.5px dashed #E6D9C8; padding: 2px; border-radius: 3px;">
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
    <div style="width: 100%; height: 100%; box-sizing: border-box; background-color: #2C4159; display: flex; align-items: center; justify-content: center; border: 1.5px dashed #A9C2D8; padding: 2px; border-radius: 3px;">
      <div style="width: 100%; height: 100%; overflow: hidden; border-radius: 2px; display: flex; align-items: center; justify-content: center; background-color: #A9C2D8;">
        <img src="${imgPath}" style="width: ${zoom}; height: ${zoom}; max-width: none; object-fit: cover; object-position: center;" alt="stamp"/>
      </div>
    </div>
  `;

  // Hearts stamps
  const stampSendingYouLove = `
    <div style="width: 100%; height: 100%; box-sizing: border-box; background: #C1121F; border: 1.5px dashed #FFF0F2; outline: 1px solid #C1121F; outline-offset: -1px; border-radius: 3px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 2px;">
      <svg style="position: absolute; top: 8%; width: 28px; height: 28px;" viewBox="0 0 24 24" fill="#D32531">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <div style="position: relative; font-family: 'Caveat', cursive; color: #FFF9F4; font-size: 9.5px; font-weight: 700; line-height: 0.85; text-align: center; margin-top: -3px; transform: rotate(-5deg);">
        Sending<br>You<br>Love!
      </div>
      <div style="font-size: 6px; color: #FFF9F4; margin-top: 1px;">♡</div>
    </div>
  `;

  const stampCupidBow = `
    <div style="width: 100%; height: 100%; box-sizing: border-box; background: #FCE8EC; border: 1.5px dashed #C1121F; outline: 1px solid #FCE8EC; outline-offset: -1px; border-radius: 3px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
      <svg viewBox="0 0 32 32" width="25" height="25" fill="#C1121F">
        <path d="M11 13c-1.5-2.5-4.5-2.5-6.5-1s-1 4.5 2 5.5l4.5-4.5z" opacity="0.6"/>
        <path d="M13 9.5c-1-2.5-3.5-3.5-5.5-1.8s-1 4.2 2.8 5.2l2.7-3.4z" opacity="0.4"/>
        <circle cx="18.5" cy="10" r="2.3"/>
        <path d="M17 12.5c-1 1-2.8 2.6-1.8 4.5l2.6 3.6c.8.9 1.8 0 .9-.9l-1.8-2.6 1.8-1.8 2.6-.9-4.3-1.9z"/>
        <path d="M20.5 7.5l3.5 3.5m-3.5 0l3.5-3.5" stroke="#C1121F" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M15 17.5l7.5-7.5" stroke="#C1121F" stroke-width="1.2" stroke-linecap="round"/>
        <polygon points="23,9 22,12 20,10"/>
      </svg>
    </div>
  `;

  const stampLaceHeart = `
    <div style="width: 100%; height: 100%; box-sizing: border-box; background: #FCE8EC; border: 1.5px dashed #C1121F; outline: 1px solid #FCE8EC; outline-offset: -1px; border-radius: 3px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
      <svg viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="#C1121F" stroke-width="1">
        <path d="M16 26 C10 20 4 15 4 10 C4 6 7 4 11 4 C13.5 4 15 5.5 16 7 C17 5.5 18.5 4 21 4 C25 4 28 6 28 10 C28 15 22 20 16 26 Z" fill="#F8CBD3"/>
        <path d="M16 23 C11.5 18 6.5 14 6.5 10 C6.5 7 8.5 5.5 11 5.5 C13 5.5 14.5 6.8 16 8 C17.5 6.8 19 5.5 21 5.5 C23.5 5.5 25.5 7 25.5 10 C25.5 14 20.5 18 16 23 Z" stroke-dasharray="1 1"/>
        <circle cx="16" cy="13" r="2.8" fill="#C1121F"/>
        <circle cx="11" cy="9.5" r="1.4" fill="#C1121F"/>
        <circle cx="21" cy="9.5" r="1.4" fill="#C1121F"/>
      </svg>
    </div>
  `;

  const stampModernHeart = `
    <div style="width: 100%; height: 100%; box-sizing: border-box; background: #FCE8EC; border: 1.5px dashed #C1121F; outline: 1px solid #FCE8EC; outline-offset: -1px; border-radius: 3px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
      <svg viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="#C1121F" stroke-width="1.3">
        <path d="M16 25 C11 20 5 15 5 10 C5 6.5 8 4.5 11.5 4.5 C13.8 4.5 15.2 5.8 16 7 C16.8 5.8 18.2 4.5 20.5 4.5 C24 4.5 27 6.5 27 10 C27 15 21 20 16 25 Z" fill="#FCE8EC"/>
        <path d="M16 21 C12.5 17 8 13.5 8 10 C8 7.5 9.8 6 12 6 C13.5 6 15 7 16 8 C17 7 18.5 6 20 6 C22.2 6 24 7.5 24 10 C24 13.5 19.5 17 16 21 Z" fill="#C1121F"/>
        <path d="M16 5.5 L16 3 M23.5 7 L25.5 5 M8.5 7 L6.5 5" stroke-linecap="round"/>
      </svg>
    </div>
  `;

  const stampFlowerSprig = `
    <div style="width: 100%; height: 100%; box-sizing: border-box; background: #FFF9F4; border: 1.5px dashed #C1121F; outline: 1px solid #FFF9F4; outline-offset: -1px; border-radius: 3px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
      <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
        <path d="M16 27 C16 22 17 15 15 6" stroke="#4A6B4A" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M16 20 C18 19 21 20 22 18 C20 17 18 18 16 19" fill="#5E855E"/>
        <path d="M15 15 C13 14 10 15 9 13 C11 12 13 13 15 14" fill="#5E855E"/>
        <circle cx="15" cy="6" r="3" fill="#F495B3"/>
        <circle cx="15" cy="6" r="1" fill="#C1121F"/>
        <circle cx="21" cy="12" r="2.5" fill="#F495B3"/>
        <circle cx="21" cy="12" r="0.8" fill="#C1121F"/>
        <circle cx="10" cy="18" r="2.5" fill="#F495B3"/>
        <circle cx="10" cy="18" r="0.8" fill="#C1121F"/>
      </svg>
    </div>
  `;

  // All Theme Stamps
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
      { id: 'hearts_sending', html: stampSendingYouLove },
      { id: 'hearts_cupid', html: stampCupidBow },
      { id: 'hearts_lace_heart', html: stampLaceHeart },
      { id: 'hearts_modern_heart', html: stampModernHeart },
      { id: 'hearts_flower_sprig', html: stampFlowerSprig }
    ]
  };

  let currentThemeName = 'candy';
  let currentStampIdx = 0;

  function updateStampPicker(theme) {
    currentThemeName = theme || currentThemeName || 'candy';
    const stamps = themeStamps[currentThemeName] || themeStamps['candy'];
    
    stampPickBtns.forEach((btn, index) => {
      if (stamps[index]) {
        btn.dataset.stamp = stamps[index].id;
        btn.innerHTML = stamps[index].html;
        btn.style.display = 'flex';
      } else {
        btn.style.display = 'none';
      }
    });

    if (currentStampIdx >= stamps.length) {
      currentStampIdx = 0;
    }

    if (stamps.length > 0) {
      stampPickBtns.forEach((b, i) => b.classList.toggle('active', i === currentStampIdx));
      state.postcard.stamp = stamps[currentStampIdx].id;
      if (postcardStampDisplay) {
        postcardStampDisplay.innerHTML = stamps[currentStampIdx].html;
      }
    }
  }

  // Click listeners for stamp buttons
  stampPickBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      currentStampIdx = index;
      const stamps = themeStamps[currentThemeName] || themeStamps['candy'];
      stampPickBtns.forEach((b, i) => b.classList.toggle('active', i === index));
      state.postcard.stamp = btn.dataset.stamp;
      if (postcardStampDisplay && stamps[index]) {
        postcardStampDisplay.innerHTML = stamps[index].html;
      }
    });
  });

  // Shuffle button
  if (btnStampShuffle) {
    btnStampShuffle.addEventListener('click', () => {
      const stamps = themeStamps[currentThemeName] || themeStamps['candy'];
      currentStampIdx = (currentStampIdx + 1) % stamps.length;
      stampPickBtns.forEach((b, i) => b.classList.toggle('active', i === currentStampIdx));
      state.postcard.stamp = stamps[currentStampIdx].id;
      if (postcardStampDisplay && stamps[currentStampIdx]) {
        postcardStampDisplay.innerHTML = stamps[currentStampIdx].html;
      }
    });
  }

  // Initialize with candy theme stamps (default)
  updateStampPicker('candy');

  // ================= 2. LETTER WORKSPACE (3-STEP ATELIER) =================
  const letterDots = [1, 2, 3].map(i => document.getElementById(`letter-dot-${i}`));
  const letterLines = [1, 2].map(i => document.getElementById(`letter-line-${i}`));
  const letterPanels = {
    1: document.getElementById('letter-panel-compose'),
    2: document.getElementById('letter-panel-envelope'),
    3: document.getElementById('letter-panel-preview')
  };

  const btnLetterBackToHub = document.getElementById('btn-letter-back-to-hub');
  if (btnLetterBackToHub) {
    btnLetterBackToHub.addEventListener('click', returnToStudioHub);
  }

  const letterSheet = document.getElementById('letter-sheet');
  const letterTextarea = document.getElementById('letter-body-textarea');
  const letterToInput = document.getElementById('letter-to-input');
  const letterFromInput = document.getElementById('letter-from-input');
  const letterDisplayDate = document.getElementById('letter-display-date');
  const stickersCanvasOverlay = document.getElementById('stickers-canvas-overlay');
  const stickersVisualTray = document.getElementById('stickers-visual-tray');

  const btnLetterFontMinus = document.getElementById('btn-letter-font-minus');
  const btnLetterFontPlus = document.getElementById('btn-letter-font-plus');
  const letterFontSelect = document.getElementById('letter-font-select');
  const letterThemeBtns = document.querySelectorAll('.letter-theme-circle-btn');

  // Step navigation buttons
  const btnLetterToStep2 = document.getElementById('btn-letter-to-step2');
  const btnLetterBackToStep1 = document.getElementById('btn-letter-back-to-step1');
  const btnLetterToStep3 = document.getElementById('btn-letter-to-step3');
  const btnLetterBackToStep2 = document.getElementById('btn-letter-back-to-step2');

  // Step 2 controls
  const letterEnvBtns = document.querySelectorAll('#letter-panel-envelope .env-card-btn');
  const letterSealBtns = document.querySelectorAll('#letter-panel-envelope .seal-pick-btn');
  const previewEnvBgImg = document.getElementById('preview-env-bg-img');
  const previewSealRender = document.getElementById('preview-seal-render');

  // Step 3 preview controls
  const letterPackagedStage = document.getElementById('letter-packaged-stage');
  const letterSealedEnvelope = document.getElementById('letter-sealed-envelope');
  const sealedEnvBgImg = document.getElementById('sealed-env-bg-img');
  const sealedWaxSeal = document.getElementById('sealed-wax-seal');
  const sealedToName = document.getElementById('sealed-to-name');
  const letterUnfoldedView = document.getElementById('letter-unfolded-view');
  const letterUnfoldedCard = document.getElementById('letter-unfolded-card');
  const btnLetterOpenUnfold = document.getElementById('btn-letter-open-unfold');
  const btnLetterRefold = document.getElementById('btn-letter-refold');
  const btnLetterSaveVault = document.getElementById('btn-letter-save-vault');
  const btnLetterDispatch = document.getElementById('btn-letter-dispatch');

  // Photo controls in Step 1
  const letterPhotoCard = document.getElementById('letter-photo-card');
  const btnDeleteLetterPhoto = document.getElementById('btn-delete-letter-photo');
  const btnAddLetterPhoto = document.getElementById('btn-add-letter-photo');
  const letterPhotoFrame = document.getElementById('letter-photo-frame');
  const letterPhotoFileInput = document.getElementById('letter-photo-file-input');
  const letterPhotoImg = document.getElementById('letter-photo-img');

  function setLetterStep(stepNum) {
    state.letter.step = stepNum;

    // Update dots & lines
    letterDots.forEach((dot, idx) => {
      if (!dot) return;
      const i = idx + 1;
      dot.classList.toggle('active', i === stepNum);
      dot.classList.toggle('completed', i < stepNum);
    });
    letterLines.forEach((line, idx) => {
      if (!line) return;
      const i = idx + 1;
      line.classList.toggle('active', i < stepNum);
    });

    // Toggle panels
    Object.keys(letterPanels).forEach(key => {
      const p = letterPanels[key];
      if (p) p.style.display = (parseInt(key, 10) === stepNum) ? 'block' : 'none';
    });

    if (stepNum === 1) {
      autoResizeLetterTextarea();
    } else if (stepNum === 2) {
      updateLetterEnvPreview();
    } else if (stepNum === 3) {
      renderLetterStep3();
      autoSaveLetterToVault();
    }
  }

  // Theme selection
  letterThemeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      letterThemeBtns.forEach(b => b.classList.toggle('active', b === btn));
      const themeKey = btn.dataset.theme;
      state.letter.theme = themeKey;
      if (letterSheet) {
        letterSheet.className = `letter-sheet theme-${themeKey}`;
      }
    });
  });

  // Font styling
  function updateLetterFontStyle() {
    if (!letterTextarea) return;
    letterTextarea.style.fontSize = `${state.letter.fontSize}px`;
    letterTextarea.style.fontFamily = state.letter.fontFamily;
    autoResizeLetterTextarea();
  }

  if (btnLetterFontMinus) {
    btnLetterFontMinus.addEventListener('click', () => {
      if (state.letter.fontSize > 13) {
        state.letter.fontSize -= 2;
        updateLetterFontStyle();
      }
    });
  }

  if (btnLetterFontPlus) {
    btnLetterFontPlus.addEventListener('click', () => {
      if (state.letter.fontSize < 32) {
        state.letter.fontSize += 2;
        updateLetterFontStyle();
      }
    });
  }

  if (letterFontSelect) {
    letterFontSelect.addEventListener('change', (e) => {
      state.letter.fontFamily = e.target.value;
      updateLetterFontStyle();
    });
  }

  // Auto-extending textarea
  function autoResizeLetterTextarea() {
    if (!letterTextarea) return;
    letterTextarea.style.height = 'auto';
    const newH = Math.max(300, letterTextarea.scrollHeight);
    letterTextarea.style.height = newH + 'px';
  }

  if (letterTextarea) {
    letterTextarea.addEventListener('input', () => {
      state.letter.body = letterTextarea.value;
      autoResizeLetterTextarea();
    });
  }

  if (letterToInput) {
    letterToInput.addEventListener('input', () => {
      state.letter.to = letterToInput.value;
    });
  }
  if (letterFromInput) {
    letterFromInput.addEventListener('input', () => {
      state.letter.from = letterFromInput.value;
    });
  }

  // Draggable Stickers (15 stickers tray)
  const stickerCardBtns = document.querySelectorAll('.sticker-card-btn');
  stickerCardBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const imgSrc = btn.dataset.stickerImg;
      if (imgSrc) {
        placeStickerOnLetter(imgSrc);
      }
    });
  });

  function placeStickerOnLetter(imgSrc, posX = null, posY = null) {
    if (!stickersCanvasOverlay) return;

    const stickerEl = document.createElement('div');
    stickerEl.className = 'letter-placed-sticker';

    const leftPercent = posX !== null ? posX : (40 + (Math.random() - 0.5) * 22);
    const topPercent = posY !== null ? posY : (35 + (Math.random() - 0.5) * 28);

    stickerEl.style.left = `${leftPercent}%`;
    stickerEl.style.top = `${topPercent}%`;

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = 'Sticker';

    const btnRemove = document.createElement('button');
    btnRemove.className = 'btn-remove-sticker';
    btnRemove.innerHTML = '&times;';
    btnRemove.title = 'Remove';
    btnRemove.addEventListener('click', (e) => {
      e.stopPropagation();
      stickerEl.remove();
      syncLetterStickersState();
    });

    stickerEl.appendChild(img);
    stickerEl.appendChild(btnRemove);

    makeStickerDraggable(stickerEl);
    stickersCanvasOverlay.appendChild(stickerEl);
    syncLetterStickersState();
  }

  function makeStickerDraggable(el) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    const onPointerDown = (e) => {
      isDragging = true;
      el.classList.add('selected');
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
      initialLeft = el.offsetLeft;
      initialTop = el.offsetTop;
      e.stopPropagation();
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - startX;
      const dy = clientY - startY;

      const parentW = stickersCanvasOverlay.offsetWidth;
      const parentH = stickersCanvasOverlay.offsetHeight;

      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      newLeft = Math.max(0, Math.min(newLeft, parentW - el.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, parentH - el.offsetHeight));

      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
    };

    const onPointerUp = () => {
      if (isDragging) {
        isDragging = false;
        el.classList.remove('selected');
        syncLetterStickersState();
      }
    };

    el.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);

    el.addEventListener('touchstart', onPointerDown, { passive: true });
    document.addEventListener('touchmove', onPointerMove, { passive: true });
    document.addEventListener('touchend', onPointerUp);
  }

  function syncLetterStickersState() {
    if (!stickersCanvasOverlay) return;
    const placed = stickersCanvasOverlay.querySelectorAll('.letter-placed-sticker');
    state.letter.stickers = Array.from(placed).map(el => {
      const img = el.querySelector('img');
      return {
        src: img ? img.getAttribute('src') : '',
        left: el.style.left,
        top: el.style.top
      };
    });
  }

  // Step Navigation Buttons
  if (btnLetterToStep2) btnLetterToStep2.addEventListener('click', () => setLetterStep(2));
  if (btnLetterBackToStep1) btnLetterBackToStep1.addEventListener('click', () => setLetterStep(1));
  if (btnLetterToStep3) btnLetterToStep3.addEventListener('click', () => setLetterStep(3));
  if (btnLetterBackToStep2) btnLetterBackToStep2.addEventListener('click', () => setLetterStep(2));

  letterDots.forEach((dot, idx) => {
    if (dot) {
      dot.addEventListener('click', () => setLetterStep(idx + 1));
    }
  });

  // Step 1: Photo Card Controls (Polaroid style with × cross mark delete)
  if (btnDeleteLetterPhoto) {
    btnDeleteLetterPhoto.addEventListener('click', (e) => {
      e.stopPropagation();
      state.letter.hasPhoto = false;
      if (letterPhotoCard) letterPhotoCard.style.display = 'none';
      if (btnAddLetterPhoto) btnAddLetterPhoto.classList.remove('active');
    });
  }

  if (btnAddLetterPhoto) {
    btnAddLetterPhoto.addEventListener('click', () => {
      state.letter.hasPhoto = true;
      if (letterPhotoCard) letterPhotoCard.style.display = 'block';
      btnAddLetterPhoto.classList.add('active');
    });
  }

  if (letterPhotoFrame && letterPhotoFileInput) {
    letterPhotoFrame.addEventListener('click', () => {
      letterPhotoFileInput.click();
    });

    letterPhotoFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        state.letter.photo = loadEvt.target.result;
        state.letter.hasPhoto = true;
        if (letterPhotoImg) letterPhotoImg.src = loadEvt.target.result;
        if (letterPhotoCard) letterPhotoCard.style.display = 'block';
        if (btnAddLetterPhoto) btnAddLetterPhoto.classList.add('active');
      };
      reader.readAsDataURL(file);
    });
  }

  // Step 2: Envelope & Wax Seal Selection
  const envelopeAssetMap = {
    'dusty-blue': 'assets/letter/envelopes/env_dusty_blue.jpg',
    'blush-lace': 'assets/letter/envelopes/env_blush_lace.jpg',
    'crimson-velvet': 'assets/letter/envelopes/env_crimson_velvet.jpg',
    'ivory-lace': 'assets/letter/envelopes/env_ivory_lace.jpg'
  };

  const sealAssetMap = {
    'gold-celestial': 'assets/letter/seals/seal_gold_celestial.png',
    'blue-love': 'assets/letter/seals/seal_blue_love.png',
    'pink-crescent': 'assets/letter/seals/seal_pink_crescent.png',
    'crimson-heart': 'assets/letter/seals/seal_crimson_heart.png'
  };

  function updateLetterEnvPreview() {
    const envSrc = envelopeAssetMap[state.letter.envelope] || envelopeAssetMap['dusty-blue'];
    const sealSrc = sealAssetMap[state.letter.seal] || sealAssetMap['gold-celestial'];

    if (previewEnvBgImg) previewEnvBgImg.src = envSrc;
    if (previewSealRender) previewSealRender.src = sealSrc;
  }

  letterEnvBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      letterEnvBtns.forEach(b => b.classList.toggle('active', b === btn));
      state.letter.envelope = btn.dataset.env;
      updateLetterEnvPreview();
    });
  });

  letterSealBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      letterSealBtns.forEach(b => b.classList.toggle('active', b === btn));
      state.letter.seal = btn.dataset.seal;
      updateLetterEnvPreview();
    });
  });

  // Step 3: Preview & Dispatch
  function renderLetterStep3() {
    if (letterPackagedStage) letterPackagedStage.style.display = 'flex';
    if (letterUnfoldedView) letterUnfoldedView.style.display = 'none';

    const envSrc = envelopeAssetMap[state.letter.envelope] || envelopeAssetMap['dusty-blue'];
    const sealSrc = sealAssetMap[state.letter.seal] || sealAssetMap['gold-celestial'];

    if (sealedEnvBgImg) sealedEnvBgImg.src = envSrc;
    if (sealedWaxSeal) sealedWaxSeal.src = sealSrc;

    if (sealedToName) {
      sealedToName.textContent = state.letter.to || (letterToInput ? letterToInput.value : 'Kabir');
    }

    renderUnfoldedLetterCard();
  }

  function openLetterPreview() {
    if (letterPackagedStage) letterPackagedStage.style.display = 'none';
    if (letterUnfoldedView) letterUnfoldedView.style.display = 'flex';
    renderUnfoldedLetterCard();
  }

  function closeLetterPreview() {
    if (letterUnfoldedView) letterUnfoldedView.style.display = 'none';
    if (letterPackagedStage) letterPackagedStage.style.display = 'flex';
  }

  // Both clicking on the envelope directly and clicking "Click to Open Letter" unfold the letter!
  if (letterSealedEnvelope) {
    letterSealedEnvelope.addEventListener('click', openLetterPreview);
  }
  if (btnLetterOpenUnfold) {
    btnLetterOpenUnfold.addEventListener('click', openLetterPreview);
  }
  if (btnLetterRefold) {
    btnLetterRefold.addEventListener('click', closeLetterPreview);
  }

  function renderUnfoldedLetterCard() {
    if (!letterUnfoldedCard) return;

    const toVal = state.letter.to || (letterToInput ? letterToInput.value : 'Kabir');
    const fromVal = state.letter.from || (letterFromInput ? letterFromInput.value : 'Saanvi');
    const bodyVal = state.letter.body || (letterTextarea ? letterTextarea.value : 'A handwritten letter straight from the heart.');
    const dateVal = letterDisplayDate ? letterDisplayDate.textContent : 'October 6, 2026';

    const photoCardHtml = (state.letter.hasPhoto && state.letter.photo) ? `
      <div class="letter-photo-card" style="float: right; margin: 2px 0 10px 14px; pointer-events: none; width: 104px;">
        <div class="letter-photo-frame" style="cursor: default;">
          <img src="${state.letter.photo}" alt="Keepsake Photo" style="width:100%; height:100%; object-fit:cover;" />
        </div>
      </div>
    ` : '';

    const stickersHtml = state.letter.stickers.map(st => `
      <div style="position: absolute; left: ${st.left}; top: ${st.top}; pointer-events: none;">
        <img src="${st.src}" style="max-width: 78px; max-height: 78px; object-fit: contain; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.22));" />
      </div>
    `).join('');

    letterUnfoldedCard.innerHTML = `
      <div class="letter-sheet theme-${state.letter.theme}" style="margin: 0 auto; box-shadow: 0 8px 24px rgba(40,20,25,0.15);">
        <div class="letter-inner-content">
          <div class="letter-header-row">
            <span class="letter-date">${escapeHtml(dateVal)}</span>
            <div class="letter-from-to">
              <span>To: ${escapeHtml(toVal)}</span>
              <span>From: ${escapeHtml(fromVal)}</span>
            </div>
          </div>
          ${photoCardHtml}
          <div style="font-family: ${state.letter.fontFamily}; font-size: ${state.letter.fontSize}px; line-height: 1.6; color: #2D181B; white-space: pre-wrap; word-break: break-word; min-height: 260px;">
            ${escapeHtml(bodyVal)}
          </div>
        </div>
        <div style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; overflow:hidden; border-radius:14px;">
          ${stickersHtml}
        </div>
      </div>
    `;
  }

  // Vault saving
  function autoSaveLetterToVault() {
    saveCurrentLetterToVault(false);
  }

  function saveCurrentLetterToVault(isManual = false) {
    try {
      const vaultItems = JSON.parse(localStorage.getItem('between_us_vault_items') || '[]');
      const toVal = state.letter.to || (letterToInput ? letterToInput.value : 'Kabir');
      const fromVal = state.letter.from || (letterFromInput ? letterFromInput.value : 'Saanvi');
      const bodyVal = state.letter.body || (letterTextarea ? letterTextarea.value : '');

      const letterData = {
        type: 'letter',
        id: 'lt_' + Date.now(),
        title: `Keepsake Letter`,
        to: toVal,
        from: fromVal,
        body: bodyVal,
        theme: state.letter.theme,
        fontSize: state.letter.fontSize,
        fontFamily: state.letter.fontFamily,
        envelope: state.letter.envelope,
        seal: state.letter.seal,
        hasPhoto: state.letter.hasPhoto,
        photo: state.letter.photo,
        stickers: state.letter.stickers,
        savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      if (vaultItems.length > 0 && vaultItems[0].id && vaultItems[0].id.startsWith('lt_') && (Date.now() - parseInt(vaultItems[0].id.replace('lt_', ''))) < 10000) {
        vaultItems[0] = letterData;
      } else {
        vaultItems.unshift(letterData);
      }

      if (vaultItems.length > 30) vaultItems.pop();
      localStorage.setItem('between_us_vault_items', JSON.stringify(vaultItems));

      if (isManual) {
        if (typeof showToast === 'function') showToast('Saved to Vault ♡');
        if (btnLetterSaveVault) {
          const origHtml = btnLetterSaveVault.innerHTML;
          btnLetterSaveVault.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Saved to Vault ♡</span>
          `;
          setTimeout(() => {
            btnLetterSaveVault.innerHTML = origHtml;
          }, 2400);
        }
      }
    } catch (e) {
      console.error('Failed to save letter to vault:', e);
    }
  }

  if (btnLetterSaveVault) {
    btnLetterSaveVault.addEventListener('click', () => saveCurrentLetterToVault(true));
  }

  // Dispatch sharing
  function generateShareableLetterUrl() {
    const toVal = state.letter.to || (letterToInput ? letterToInput.value : 'Kabir');
    const fromVal = state.letter.from || (letterFromInput ? letterFromInput.value : 'Saanvi');
    const bodyVal = state.letter.body || (letterTextarea ? letterTextarea.value : '');

    const payload = {
      type: 'letter',
      to: toVal,
      from: fromVal,
      body: bodyVal,
      th: state.letter.theme,
      fs: state.letter.fontSize,
      ff: state.letter.fontFamily,
      env: state.letter.envelope,
      sl: state.letter.seal,
      stk: state.letter.stickers
    };

    const jsonStr = JSON.stringify(payload);
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?letter=${encoded}`;
  }

  function openLetterDispatchModal() {
    const modal = document.getElementById('dispatch-modal');
    if (!modal) return;
    const iconEl = document.getElementById('dispatch-badge-icon');
    const titleEl = document.getElementById('dispatch-modal-title');
    const subEl = document.getElementById('dispatch-modal-sub');
    const copyDescEl = document.getElementById('dispatch-copy-desc');
    const urlInput = document.getElementById('dispatch-url-input');

    if (iconEl) iconEl.textContent = '💌';
    if (titleEl) titleEl.textContent = 'Dispatch Your Letter';
    if (subEl) subEl.textContent = 'Share your sealed keepsake letter with someone special.';
    if (copyDescEl) copyDescEl.textContent = 'Anyone with this link can break the seal and read your letter';

    const shareUrl = generateShareableLetterUrl();
    if (urlInput) urlInput.value = shareUrl;

    modal.style.display = 'flex';
  }

  if (btnLetterDispatch) {
    btnLetterDispatch.addEventListener('click', openLetterDispatchModal);
  }

  // ================= 3. BOUQUET WORKSPACE (DIGIBOUQUET BARE-STEM) =================
  // ================= 3. BOUQUET WORKSPACE (DIGIBOUQUET BARE-STEM) =================
  const bouquetDots = [1, 2, 3, 4, 5].map(i => document.getElementById(`bouquet-dot-${i}`));
  const bouquetLines = [1, 2, 3, 4].map(i => document.getElementById(`bouquet-line-${i}`));
  const bqPanels = {
    stems: document.getElementById('bq-panel-stems'),
    greenery: document.getElementById('bq-panel-greenery'),
    arrange: document.getElementById('bq-panel-arrange'),
    note: document.getElementById('bq-panel-note'),
    preview: document.getElementById('bq-panel-preview')
  };

  const stepKeyMap = {
    1: 'stems',
    2: 'greenery',
    3: 'arrange',
    4: 'note',
    5: 'preview'
  };

  const keyToStepNum = {
    'stems': 1,
    'greenery': 2,
    'arrange': 3,
    'note': 4,
    'preview': 5
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
  const bareStemStage = document.getElementById('bare-stem-stage');

  let currentBouquetStep = 1;

  // 5-Step Switcher
  function setBouquetStep(stepInput) {
    let stepNum = typeof stepInput === 'number' ? stepInput : (parseInt(stepInput, 10) || keyToStepNum[stepInput]);
    if (!stepNum || stepNum < 1) stepNum = 1;
    if (stepNum > 5) stepNum = 5;
    const stepKey = stepKeyMap[stepNum];

    // Validation: Require at least 5 flowers when trying to proceed past step 1
    if (stepNum > 1 && state.bouquet.flowers.length < 5) {
      alert('Please select at least 5 flowers (up to 8 stems) to create a full botanical bouquet.');
      return;
    }

    currentBouquetStep = stepNum;
    state.bouquet.step = stepKey;

    // Update 5-dot step indicator
    bouquetDots.forEach((dot, idx) => {
      if (!dot) return;
      const dotNum = idx + 1;
      if (dotNum < stepNum) {
        dot.classList.remove('active');
        dot.classList.add('completed');
      } else if (dotNum === stepNum) {
        dot.classList.add('active');
        dot.classList.remove('completed');
      } else {
        dot.classList.remove('active', 'completed');
      }
    });

    bouquetLines.forEach((line, idx) => {
      if (!line) return;
      line.classList.toggle('active', (idx + 1) < stepNum);
    });

    // Toggle panels
    Object.keys(bqPanels).forEach(key => {
      if (bqPanels[key]) {
        bqPanels[key].style.display = key === stepKey ? 'block' : 'none';
      }
    });

    // Stage placement & visibility:
    // When in Step 4: bouquet disappears! (only the note is visible)
    // When in Step 5: sits inside .bouquet-step5-hero-slot, display = 'flex'
    // When in Steps 1-3: sits above #bq-panel-stems, display = 'flex'
    const assembledContainer = document.getElementById('bouquet-assembled-preview');
    const heroSlot = document.getElementById('bouquet-step5-hero-slot');
    const canvasBouquet = document.getElementById('canvas-bouquet');
    const panelStems = document.getElementById('bq-panel-stems');

    if (assembledContainer) {
      if (stepNum === 4) {
        assembledContainer.style.display = 'none';
      } else if (stepNum === 5 && heroSlot) {
        assembledContainer.style.display = 'flex';
        heroSlot.appendChild(assembledContainer);
      } else if (canvasBouquet && panelStems) {
        assembledContainer.style.display = 'flex';
        if (assembledContainer.parentElement !== canvasBouquet) {
          canvasBouquet.insertBefore(assembledContainer, panelStems);
        }
      }
    }

    if (bareStemStage) {
      bareStemStage.classList.toggle('step-arrange-active', stepNum === 3);
    }
    if (stepNum === 3) {
      renderStemOrderStrip();
    }
    if (stepNum === 5) {
      autoSaveBouquetToVault();
    }
  }

  // Wire Dots Click
  bouquetDots.forEach((dot, idx) => {
    if (dot) {
      dot.addEventListener('click', () => {
        setBouquetStep(idx + 1);
      });
    }
  });

  // Next / Back Navigation buttons
  document.querySelectorAll('#canvas-bouquet .bq-next-btn, #canvas-bouquet .bq-back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (target) setBouquetStep(target);
    });
  });

  // Step 5: Read Attached Note ♡ pill button
  const btnBouquetToggleNote = document.getElementById('btn-bouquet-toggle-note');
  if (btnBouquetToggleNote) {
    btnBouquetToggleNote.addEventListener('click', openBouquetUnfoldedNote);
  }

  // Step 5: Save to Vault button
  const btnBouquetSaveVault = document.getElementById('btn-bouquet-save-vault');
  if (btnBouquetSaveVault) {
    btnBouquetSaveVault.addEventListener('click', () => {
      saveCurrentBouquetToVault(true);
      btnBouquetSaveVault.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Saved to Vault ✓</span>
      `;
      setTimeout(() => {
        btnBouquetSaveVault.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Save to Vault</span>
        `;
      }, 2200);
    });
  }

  // Step 5: Send Bouquet button
  const btnBouquetSend = document.getElementById('btn-bouquet-send');
  if (btnBouquetSend) {
    btnBouquetSend.addEventListener('click', () => {
      openBouquetDispatchModal();
    });
  }

  function openBouquetUnfoldedNote() {
    if (!unfoldedOverlay) return;
    const toVal = bouquetToInput ? bouquetToInput.value : state.bouquet.noteTo;
    const fromVal = bouquetFromInput ? bouquetFromInput.value : state.bouquet.noteFrom;
    const bodyVal = bouquetNoteBody ? bouquetNoteBody.value : state.bouquet.noteBody;
    if (unfoldedTo) unfoldedTo.textContent = toVal || 'Kabir';
    if (unfoldedFrom) unfoldedFrom.textContent = fromVal || 'Saanvi';
    if (unfoldedNoteBodyText) unfoldedNoteBodyText.textContent = bodyVal || 'A little botanical bouquet handpicked just for you.';
    unfoldedOverlay.style.display = 'flex';
  }

  function autoSaveBouquetToVault() {
    saveCurrentBouquetToVault(false);
  }

  function saveCurrentBouquetToVault(isManual = false) {
    try {
      const vaultData = JSON.parse(localStorage.getItem('between_us_vault_items') || '[]');
      const toVal = bouquetToInput ? bouquetToInput.value : state.bouquet.noteTo;
      const fromVal = bouquetFromInput ? bouquetFromInput.value : state.bouquet.noteFrom;
      const bodyVal = bouquetNoteBody ? bouquetNoteBody.value : state.bouquet.noteBody;

      const item = {
        type: 'bouquet',
        title: 'Botanical Bouquet',
        flowers: [...state.bouquet.flowers],
        greenery: [...state.bouquet.greenery],
        shuffleSeed: state.bouquet.shuffleSeed,
        theme: state.bouquet.noteTheme || 'cream',
        to: toVal,
        from: fromVal,
        body: bodyVal,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      const isDuplicate = vaultData.some(v => v.type === 'bouquet' && v.to === item.to && v.from === item.from && v.body === item.body && v.flowers && v.flowers.length === item.flowers.length);
      if (!isDuplicate) {
        vaultData.unshift(item);
        localStorage.setItem('between_us_vault_items', JSON.stringify(vaultData));
        if (isManual) {
          showAtelierToast('Bouquet saved to your Vault ♡');
        }
      } else if (isManual) {
        showAtelierToast('Already saved in your Vault ♡');
      }
    } catch (err) {
      console.warn('Vault bouquet save error:', err);
    }
  }

  function generateShareableBouquetUrl() {
    const toVal = bouquetToInput ? bouquetToInput.value : state.bouquet.noteTo;
    const fromVal = bouquetFromInput ? bouquetFromInput.value : state.bouquet.noteFrom;
    const bodyVal = bouquetNoteBody ? bouquetNoteBody.value : state.bouquet.noteBody;

    const payload = {
      type: 'bouquet',
      fl: state.bouquet.flowers.map(f => ({ f: f.flower, file: f.file })),
      gr: state.bouquet.greenery,
      sd: state.bouquet.shuffleSeed,
      th: state.bouquet.noteTheme || 'cream',
      to: toVal,
      from: fromVal,
      m: bodyVal,
      d: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    const jsonStr = JSON.stringify(payload);
    const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
    const base = window.location.origin + window.location.pathname;
    return `${base}#bouquet=${encodeURIComponent(b64)}`;
  }

  function openBouquetDispatchModal() {
    const modal = document.getElementById('dispatch-modal');
    if (!modal) return;
    const iconEl = document.getElementById('dispatch-badge-icon');
    const titleEl = document.getElementById('dispatch-modal-title');
    const subEl = document.getElementById('dispatch-modal-sub');
    const copyDescEl = document.getElementById('dispatch-copy-desc');
    const urlInput = document.getElementById('dispatch-url-input');

    if (iconEl) iconEl.textContent = '🌸';
    if (titleEl) titleEl.textContent = 'Send Your Botanical Bouquet';
    if (subEl) subEl.textContent = 'Share your handpicked bouquet and personal note.';
    if (copyDescEl) copyDescEl.textContent = 'Anyone with this link can view your bouquet and read your attached note';

    const shareUrl = generateShareableBouquetUrl();
    if (urlInput) urlInput.value = shareUrl;

    modal.style.display = 'flex';
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
    // When a new flower is selected, add it beside existing flowers (alternating right and left)
    if (state.bouquet.flowers.length % 2 === 0) {
      state.bouquet.flowers.push({ flower: flowerName, file: flowerFile });
    } else {
      state.bouquet.flowers.unshift({ flower: flowerName, file: flowerFile });
    }
    updateStemCardsUI();
    renderBouquetPreview();
    if (state.bouquet.step === 'arrange') renderStemOrderStrip();
  }

  function removeStem(flowerName) {
    const idx = state.bouquet.flowers.map(f => f.flower).lastIndexOf(flowerName);
    if (idx > -1) {
      state.bouquet.flowers.splice(idx, 1);
      updateStemCardsUI();
      renderBouquetPreview();
      if (state.bouquet.step === 'arrange') renderStemOrderStrip();
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
      renderStemOrderStrip();
    });
  }

  if (btnClearStems) {
    btnClearStems.addEventListener('click', () => {
      state.bouquet.shuffleSeed = 1;
      renderBouquetPreview();
      renderStemOrderStrip();
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

    if (unfoldedTo) unfoldedTo.textContent = state.bouquet.noteTo || 'Kabir';
    if (unfoldedFrom) unfoldedFrom.textContent = state.bouquet.noteFrom || 'Saanvi';
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

  // Step 2 Direct Hand Tool: Pointer Drag & Reordering
  let activeDragIndex = -1;
  let dragStartX = 0;
  let dragHasMoved = false;

  function attachStemDragHandlers(stemEl, index, baseTransform, total) {
    stemEl.addEventListener('pointerdown', (e) => {
      if (state.bouquet.step !== 'arrange') return;
      e.preventDefault();
      activeDragIndex = index;
      dragStartX = e.clientX;
      dragHasMoved = false;
      stemEl.classList.add('is-dragging');
      try {
        stemEl.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    stemEl.addEventListener('pointermove', (e) => {
      if (activeDragIndex !== index) return;
      const deltaX = e.clientX - dragStartX;
      if (Math.abs(deltaX) > 3) dragHasMoved = true;
      stemEl.style.transform = `${baseTransform} translateX(${deltaX}px) scale(1.08)`;
    });

    const onPointerDone = (e) => {
      if (activeDragIndex !== index) return;
      stemEl.classList.remove('is-dragging');
      try {
        stemEl.releasePointerCapture(e.pointerId);
      } catch (err) {}

      if (dragHasMoved && bareStemStage) {
        const stageRect = bareStemStage.getBoundingClientRect();
        const stageCenterX = stageRect.left + (stageRect.width / 2);
        const relX = e.clientX - stageCenterX; // relative px offset from center (-95 to +95)
        const fanHalfWidth = 160;
        const normalized = Math.max(0, Math.min(1, (relX + fanHalfWidth) / (fanHalfWidth * 2)));
        let targetIndex = Math.round(normalized * (total - 1));
        targetIndex = Math.max(0, Math.min(total - 1, targetIndex));

        if (targetIndex !== index) {
          const [movedItem] = state.bouquet.flowers.splice(index, 1);
          state.bouquet.flowers.splice(targetIndex, 0, movedItem);
          renderBouquetPreview(true);
          renderStemOrderStrip();
        } else {
          stemEl.style.transform = baseTransform;
        }
      } else {
        stemEl.style.transform = baseTransform;
      }
      activeDragIndex = -1;
      dragHasMoved = false;
    };

    stemEl.addEventListener('pointerup', onPointerDone);
    stemEl.addEventListener('pointercancel', onPointerDone);
  }

  // Interactive Reorder Strip in Step 2 Panel
  function renderStemOrderStrip() {
    const stripEl = document.getElementById('stem-reorder-strip');
    if (!stripEl) return;
    stripEl.innerHTML = '';
    state.bouquet.flowers.forEach((item, idx) => {
      const pill = document.createElement('div');
      pill.className = 'stem-reorder-pill';
      pill.innerHTML = `
        <button type="button" class="stem-reorder-arrow btn-nudge-left" title="Move Left" ${idx === 0 ? 'disabled' : ''}>‹</button>
        <img src="assets/flowers/${item.file}" alt="${item.flower}" class="stem-reorder-thumb">
        <span class="stem-reorder-name">${idx + 1}. ${item.flower}</span>
        <button type="button" class="stem-reorder-arrow btn-nudge-right" title="Move Right" ${idx === state.bouquet.flowers.length - 1 ? 'disabled' : ''}>›</button>
      `;

      pill.querySelector('.btn-nudge-left')?.addEventListener('click', () => {
        if (idx > 0) {
          const [moved] = state.bouquet.flowers.splice(idx, 1);
          state.bouquet.flowers.splice(idx - 1, 0, moved);
          renderBouquetPreview(true);
          renderStemOrderStrip();
        }
      });

      pill.querySelector('.btn-nudge-right')?.addEventListener('click', () => {
        if (idx < state.bouquet.flowers.length - 1) {
          const [moved] = state.bouquet.flowers.splice(idx, 1);
          state.bouquet.flowers.splice(idx + 1, 0, moved);
          renderBouquetPreview(true);
          renderStemOrderStrip();
        }
      });

      stripEl.appendChild(pill);
    });
  }

  // Precise Flower Stem Tip and Bloom Calibration
  // stemX, stemY: exact pixel coordinates of the drawn stem tip in the image
  // naturalAngle: botanical lean of the drawn flower from vertical (degrees)
  // scale: balanced bloom sizing so blooms sit beside each other without overlapping
  // Precise Flower Stem Tip and Bloom Calibration
  const FLOWER_CALIBRATION = {
    anemones:     { stemX: 300, stemY: 961, naturalAngle: 0.6,  scale: 0.85, W: 682,  H: 1024, isSpire: false },
    babys_breath: { stemX: 404, stemY: 991, naturalAngle: -3.3, scale: 0.80, W: 682,  H: 1024, isSpire: true  },
    buttercup:    { stemX: 352, stemY: 983, naturalAngle: -1.7, scale: 0.80, W: 682,  H: 1024, isSpire: false },
    dahlia:       { stemX: 262, stemY: 987, naturalAngle: 18.8, scale: 0.64, W: 828,  H: 1024, isSpire: false },
    foxglove:     { stemX: 350, stemY: 1007,naturalAngle: 0.4,  scale: 0.90, W: 682,  H: 1024, isSpire: true  },
    gardenia:     { stemX: 308, stemY: 983, naturalAngle: 15.1, scale: 0.74, W: 828,  H: 1024, isSpire: false },
    hydrangea:    { stemX: 432, stemY: 515, naturalAngle: 5.8,  scale: 1.10, W: 1024, H: 712,  isSpire: false },
    lavender:     { stemX: 232, stemY: 993, naturalAngle: 16.9, scale: 0.84, W: 682,  H: 1024, isSpire: true  },
    lily:         { stemX: 518, stemY: 666, naturalAngle: -0.4, scale: 0.85, W: 1024, H: 711,  isSpire: true  },
    orchid:       { stemX: 182, stemY: 1023,naturalAngle: 16.8, scale: 0.72, W: 828,  H: 1024, isSpire: false },
    peony:        { stemX: 354, stemY: 959, naturalAngle: 7.9,  scale: 0.80, W: 768,  H: 1024, isSpire: false },
    rose:         { stemX: 354, stemY: 1023,naturalAngle: 3.9,  scale: 0.78, W: 768,  H: 1024, isSpire: false },
    snapdragon:   { stemX: 340, stemY: 993, naturalAngle: 2.6,  scale: 0.92, W: 682,  H: 1024, isSpire: true  },
    sunflower:    { stemX: 352, stemY: 1001,naturalAngle: 12.1, scale: 0.72, W: 819,  H: 1024, isSpire: false },
    tulip:        { stemX: 378, stemY: 907, naturalAngle: -1.9, scale: 0.92, W: 692,  H: 1024, isSpire: true  }
  };

  // Tiered Floristry Slot Presets (Balanced, airy spread so all blooms are visible)
  const BOUQUET_SLOT_PRESETS = {
    8: [
      // Back Tier (4 tall stems / spires framing the bouquet)
      { angle: -28, height: 300, zIdx: 10, shiftX: -14, scaleMul: 0.94 },
      { angle: -9,  height: 280, zIdx: 11, shiftX: -4,  scaleMul: 0.90 },
      { angle: +9,  height: 280, zIdx: 12, shiftX: +4,  scaleMul: 0.90 },
      { angle: +28, height: 300, zIdx: 13, shiftX: +14, scaleMul: 0.94 },
      // Front Tier (4 focal blooms spread across left and right)
      { angle: -38, height: 205, zIdx: 20, shiftX: -18, scaleMul: 0.92 },
      { angle: -13, height: 175, zIdx: 21, shiftX: -6,  scaleMul: 0.88 },
      { angle: +13, height: 175, zIdx: 22, shiftX: +6,  scaleMul: 0.88 },
      { angle: +38, height: 205, zIdx: 25, shiftX: +18, scaleMul: 0.92 }
    ],
    7: [
      // Back Tier (4 tall stems)
      { angle: -28, height: 300, zIdx: 10, shiftX: -14, scaleMul: 0.94 },
      { angle: -9,  height: 280, zIdx: 11, shiftX: -4,  scaleMul: 0.90 },
      { angle: +9,  height: 280, zIdx: 12, shiftX: +4,  scaleMul: 0.90 },
      { angle: +28, height: 300, zIdx: 13, shiftX: +14, scaleMul: 0.94 },
      // Front Tier (3 focal blooms)
      { angle: -34, height: 195, zIdx: 20, shiftX: -16, scaleMul: 0.90 },
      { angle: 0,   height: 175, zIdx: 25, shiftX: 0,   scaleMul: 0.92 },
      { angle: +34, height: 195, zIdx: 22, shiftX: +16, scaleMul: 0.90 }
    ],
    6: [
      // Back Tier (3 tall stems)
      { angle: -26, height: 300, zIdx: 10, shiftX: -13, scaleMul: 0.94 },
      { angle: 0,   height: 285, zIdx: 11, shiftX: 0,   scaleMul: 0.90 },
      { angle: +26, height: 300, zIdx: 12, shiftX: +13, scaleMul: 0.94 },
      // Front Tier (3 focal blooms)
      { angle: -34, height: 195, zIdx: 20, shiftX: -16, scaleMul: 0.90 },
      { angle: 0,   height: 175, zIdx: 25, shiftX: 0,   scaleMul: 0.92 },
      { angle: +34, height: 195, zIdx: 22, shiftX: +16, scaleMul: 0.90 }
    ],
    5: [
      // Back Tier (2 tall stems)
      { angle: -18, height: 300, zIdx: 10, shiftX: -10, scaleMul: 0.94 },
      { angle: +18, height: 300, zIdx: 11, shiftX: +10, scaleMul: 0.94 },
      // Front Tier (3 focal blooms)
      { angle: -34, height: 195, zIdx: 20, shiftX: -16, scaleMul: 0.90 },
      { angle: 0,   height: 175, zIdx: 25, shiftX: 0,   scaleMul: 0.92 },
      { angle: +34, height: 195, zIdx: 22, shiftX: +16, scaleMul: 0.90 }
    ]
  };

  // SVGs for lower stems and lavender ribbon bow
  function getBouquetRibbonSVG() {
    return `
      <svg viewBox="0 0 140 95" width="140" height="95" style="overflow:visible; filter: drop-shadow(0 3px 6px rgba(82, 19, 25, 0.15));">
        <path d="M 65 30 C 55 45 40 65 32 88 C 30 92 38 90 42 85 C 50 68 62 48 68 32 Z" fill="#C9B6E4" opacity="0.95"/>
        <path d="M 64 30 C 56 45 42 65 35 86" stroke="#B39DD4" stroke-width="1.5" fill="none" opacity="0.6"/>
        <path d="M 75 30 C 85 45 100 65 108 88 C 110 92 102 90 98 85 C 90 68 78 48 72 32 Z" fill="#C9B6E4" opacity="0.95"/>
        <path d="M 76 30 C 84 45 98 65 105 86" stroke="#B39DD4" stroke-width="1.5" fill="none" opacity="0.6"/>
        <path d="M 68 25 C 45 10 20 18 25 32 C 30 46 55 35 68 28 Z" fill="#D6C5EE" stroke="#B8A2DA" stroke-width="1.2"/>
        <path d="M 32 26 C 38 22 52 24 64 27" stroke="#FFF" stroke-width="2" stroke-linecap="round" opacity="0.5" fill="none"/>
        <path d="M 72 25 C 95 10 120 18 115 32 C 110 46 85 35 72 28 Z" fill="#D6C5EE" stroke="#B8A2DA" stroke-width="1.2"/>
        <path d="M 108 26 C 102 22 88 24 76 27" stroke="#FFF" stroke-width="2" stroke-linecap="round" opacity="0.5" fill="none"/>
        <ellipse cx="70" cy="27" rx="9" ry="8" fill="#B39DD4" stroke="#947CB5" stroke-width="1.5"/>
        <ellipse cx="68" cy="25" rx="5" ry="4" fill="#E2D4F5" opacity="0.6"/>
      </svg>
    `;
  }

  function getBouquetLowerStemsSVG() {
    return `
      <svg viewBox="0 0 60 75" width="60" height="75" style="overflow:visible;">
        <line x1="24" y1="5" x2="16" y2="68" stroke="#4a6b32" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="28" y1="5" x2="22" y2="72" stroke="#3d5828" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="30" y1="5" x2="30" y2="74" stroke="#527838" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="32" y1="5" x2="38" y2="72" stroke="#44632c" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="36" y1="5" x2="46" y2="66" stroke="#4a6b32" stroke-width="4.5" stroke-linecap="round"/>
      </svg>
    `;
  }

  // Tiered Floristry Bouquet Engine
  function renderBouquetPreview(animated = false) {
    const total = state.bouquet.flowers.length;

    // Toggle ribbon bow and mini note based on stem count
    if (stemTieBand) {
      stemTieBand.style.display = total === 0 ? 'none' : 'flex';
      stemTieBand.innerHTML = total === 0 ? '' : getBouquetRibbonSVG();
    }
    if (tuckedMiniNote) tuckedMiniNote.style.display = total === 0 ? 'none' : 'block';

    // Ensure lower stems handle container exists
    let lowerStemsEl = document.getElementById('lower-stems-container');
    if (!lowerStemsEl && bareStemStage) {
      lowerStemsEl = document.createElement('div');
      lowerStemsEl.id = 'lower-stems-container';
      lowerStemsEl.className = 'lower-stems-container';
      bareStemStage.appendChild(lowerStemsEl);
    }
    if (lowerStemsEl) {
      lowerStemsEl.style.display = total === 0 ? 'none' : 'block';
      lowerStemsEl.innerHTML = total === 0 ? '' : getBouquetLowerStemsSVG();
    }

    if (total === 0) {
      if (greeneryLayer) greeneryLayer.innerHTML = '';
      if (stemsBloomCluster) stemsBloomCluster.innerHTML = '';
      return;
    }

    // 1. Interleaved Greenery (Framed behind bouquet flowers)
    if (greeneryLayer) {
      greeneryLayer.innerHTML = '';

      const greenerySlots = {
        eucalyptus: { angle: -42, yOffset: 12, zIdx: 6, shiftX: -6 },
        fern:       { angle: -16, yOffset: 0,  zIdx: 6, shiftX: -2 },
        olive:      { angle: +16, yOffset: 0,  zIdx: 6, shiftX: +2 },
        ruscus:     { angle: +42, yOffset: 12, zIdx: 6, shiftX: +6 }
      };

      state.bouquet.greenery.forEach(foliage => {
        const config = greenerySlots[foliage] || { angle: 0, yOffset: 0, zIdx: 6, shiftX: 0 };
        const finalAngle = Math.round(config.angle);
        const finalY = Math.round(config.yOffset);

        const item = document.createElement('div');
        item.className = `greenery-item greenery-${foliage}`;
        item.style.left = `calc(50% + ${config.shiftX}px)`;
        item.style.transform = `rotate(${finalAngle}deg) translateY(${finalY}px)`;
        item.style.zIndex = config.zIdx;
        item.innerHTML = `<img src="assets/greenery/${foliage}.svg" alt="${foliage}" draggable="false">`;
        greeneryLayer.appendChild(item);
      });
    }

    // 2. Flower Stems Cluster (Tiered composition with spires in back and blooms in front)
    if (stemsBloomCluster) {
      stemsBloomCluster.innerHTML = '';

      const presets = BOUQUET_SLOT_PRESETS[total] || BOUQUET_SLOT_PRESETS[5];
      const backCount = total === 8 ? 4 : (total === 7 ? 4 : (total === 6 ? 3 : 2));

      // Separate into spires (for back tier) and lush focal blooms (for front tier)
      const spires = [];
      const blooms = [];
      state.bouquet.flowers.forEach((f, origIdx) => {
        const key = f.file.replace(/\.(png|jpg|svg)$/i, '');
        const cal = FLOWER_CALIBRATION[key] || { isSpire: false };
        if (cal.isSpire) {
          spires.push({ ...f, origIdx });
        } else {
          blooms.push({ ...f, origIdx });
        }
      });

      // Fill back slots first with spires, then remaining with blooms
      const arranged = new Array(total);
      const backItems = [];
      while (backItems.length < backCount && spires.length > 0) {
        backItems.push(spires.shift());
      }
      while (backItems.length < backCount && blooms.length > 0) {
        backItems.push(blooms.shift());
      }
      const frontItems = [...spires, ...blooms];

      for (let i = 0; i < backCount; i++) {
        arranged[i] = backItems[i];
      }
      for (let i = backCount; i < total; i++) {
        arranged[i] = frontItems[i - backCount];
      }

      arranged.forEach((item, slotIdx) => {
        if (!item) return;
        const fileKey = item.file.replace(/\.(png|jpg|svg)$/i, '');
        const cal = FLOWER_CALIBRATION[fileKey] || { stemX: 350, stemY: 980, naturalAngle: 0, scale: 0.8, W: 768, H: 1024 };
        const slot = presets[slotIdx] || presets[0];

        // Compensate for botanical drawing angle
        const appliedRotation = slot.angle - cal.naturalAngle;

        // Exact Stem Tip Pinning to Container Origin (50%, 100%)
        const stemXPct = (cal.stemX / cal.W * 100).toFixed(2);
        const stemYFromBottomPct = ((1 - cal.stemY / cal.H) * 100).toFixed(2);
        const finalScale = (cal.scale * slot.scaleMul).toFixed(3);

        const stemEl = document.createElement('div');
        stemEl.className = 'stem-flower-item';
        stemEl.dataset.stemIndex = item.origIdx;
        stemEl.dataset.flower = item.flower;
        stemEl.title = `${item.flower} (Stem ${item.origIdx + 1} of ${total} - Drag in Step 2 to rearrange)`;
        stemEl.style.bottom = '95px'; // anchored at ribbon knot
        stemEl.style.left = `calc(50% + ${slot.shiftX}px)`;
        stemEl.style.width = '2px';
        stemEl.style.height = `${slot.height}px`;
        stemEl.style.transformOrigin = '50% 100%';
        stemEl.style.transform = `rotate(${appliedRotation.toFixed(1)}deg)`;
        stemEl.style.zIndex = slot.zIdx;

        stemEl.innerHTML = `<img src="assets/flowers/${item.file}" alt="${item.flower}" class="stem-flower-img" draggable="false" style="position: absolute; bottom: 0; left: 0; height: ${slot.height}px; width: auto; max-width: none; transform-origin: ${stemXPct}% ${cal.stemY / cal.H * 100}%; transform: translate(-${stemXPct}%, ${stemYFromBottomPct}%) scale(${finalScale});">`;

        // Attach Step 2 Hand Tool drag handlers
        const baseTransform = `rotate(${appliedRotation.toFixed(1)}deg)`;
        attachStemDragHandlers(stemEl, item.origIdx, baseTransform, total);

        stemsBloomCluster.appendChild(stemEl);
      });
    }
  }

  // Initial call to render default bouquet
  renderBouquetPreview();
  updateStemCardsUI();
  syncNoteDetails();

  // ================= 4. GREETING CARD 4-STEP ATELIER =================
  const cardCanvasWorkspace = document.getElementById('canvas-greeting-card');
  const btnCardBackToHub = document.getElementById('btn-card-back-to-hub');
  if (btnCardBackToHub) {
    btnCardBackToHub.addEventListener('click', returnToStudioHub);
  }

  // Dots & Lines
  const cardDot1 = document.getElementById('card-dot-1');
  const cardDot2 = document.getElementById('card-dot-2');
  const cardDot3 = document.getElementById('card-dot-3');
  const cardDot4 = document.getElementById('card-dot-4');
  const cardLine1 = document.getElementById('card-line-1');
  const cardLine2 = document.getElementById('card-line-2');
  const cardLine3 = document.getElementById('card-line-3');

  // Step Panels
  const cardPanelCover = document.getElementById('card-panel-cover');
  const cardPanelInside = document.getElementById('card-panel-inside');
  const cardPanelDelivery = document.getElementById('card-panel-delivery');
  const cardPanelPreview = document.getElementById('card-panel-preview');

  // Step 1: Cover Elements
  const cardCoverCanvas = document.getElementById('card-cover-canvas');
  const cardCoverElementsLayer = document.getElementById('card-cover-elements-layer');
  const cardThemeBtns = document.querySelectorAll('.card-theme-btn');
  const cardCoverPhotoInput = document.getElementById('card-cover-photo-input');
  const btnCardAddCoverPhoto = document.getElementById('btn-card-add-cover-photo');
  const btnCardAddCoverText = document.getElementById('btn-card-add-cover-text');
  const cardFontSelect = document.getElementById('card-font-select');
  const btnCardFontMinus = document.getElementById('btn-card-font-minus');
  const btnCardFontPlus = document.getElementById('btn-card-font-plus');
  const btnCardToStep2 = document.getElementById('btn-card-to-step2');

  // Step 2: Inside Elements
  const cardInsideBifold = document.getElementById('card-inside-bifold');
  const insideKeepsakesDropzone = document.getElementById('inside-keepsakes-dropzone');
  const insideRightStickersOverlay = document.getElementById('inside-right-stickers-overlay');
  const cardInsideToInput = document.getElementById('card-inside-to-input');
  const cardInsideBodyTextarea = document.getElementById('card-inside-body-textarea');
  const cardInsideFromInput = document.getElementById('card-inside-from-input');
  const cardInsideFontSelect = document.getElementById('card-inside-font-select');
  const btnInsideFontMinus = document.getElementById('btn-inside-font-minus');
  const btnInsideFontPlus = document.getElementById('btn-inside-font-plus');

  const btnCardAddPolaroid = document.getElementById('btn-card-add-polaroid');
  const btnCardAddFlower = document.getElementById('btn-card-add-flower');
  const btnCardAddVinyl = document.getElementById('btn-card-add-vinyl');
  const btnCardAddSticker = document.getElementById('btn-card-add-sticker');
  const cardPolaroidFileInput = document.getElementById('card-polaroid-file-input');

  const cardFlowersPopup = document.getElementById('card-flowers-popup');
  const cardFlowersPopupGrid = document.getElementById('card-flowers-popup-grid');
  const btnCloseFlowerPopup = document.getElementById('btn-close-flower-popup');

  const cardStickersPopup = document.getElementById('card-stickers-popup');
  const cardStickersPopupGrid = document.getElementById('card-stickers-popup-grid');
  const btnCloseStickerPopup = document.getElementById('btn-close-sticker-popup');

  const btnCardBackToStep1 = document.getElementById('btn-card-back-to-step1');
  const btnCardToStep3 = document.getElementById('btn-card-to-step3');

  // Step 3: Delivery Elements
  const cardVesselBtns = document.querySelectorAll('#card-panel-delivery .card-vessel-btn');
  const cardEnvelopeOptions = document.getElementById('card-envelope-options');
  const cardBoxOptions = document.getElementById('card-box-options');
  const cardEnvChoices = document.querySelectorAll('.card-env-choice');
  const cardSealChoices = document.querySelectorAll('.card-seal-choice');
  const cardBoxChoices = document.querySelectorAll('.card-box-choice');
  const cardVesselLiveRender = document.getElementById('card-vessel-live-render');
  const btnCardBackToStep2 = document.getElementById('btn-card-back-to-step2');
  const btnCardToStep4 = document.getElementById('btn-card-to-step4');

  // Step 4: Preview & Dispatch Elements
  const cardPreviewVesselStage = document.getElementById('card-preview-vessel-stage');
  const cardPreviewVesselWrap = document.getElementById('card-preview-vessel-wrap');
  const cardPreviewRevealedStage = document.getElementById('card-preview-revealed-stage');
  const cardRevealDisplay = document.getElementById('card-reveal-display');
  const btnCardPreviewFlip = document.getElementById('btn-card-preview-flip');
  const cardFlipLabel = document.getElementById('card-flip-label');
  const btnCardToggleOpen = document.getElementById('btn-card-toggle-open');
  const btnCardOpenText = document.getElementById('btn-card-open-text');
  const btnCardSaveVault = document.getElementById('btn-card-save-vault');
  const btnCardDispatch = document.getElementById('btn-card-dispatch');
  const btnCardBackToStep3 = document.getElementById('btn-card-back-to-step3');

  // 15 Flowers Catalog
  const CARD_FLOWERS = [
    { name: 'Rose', file: 'rose.png' },
    { name: 'Peony', file: 'peony.png' },
    { name: "Baby's Breath", file: 'babys_breath.png' },
    { name: 'Sunflower', file: 'sunflower.png' },
    { name: 'Tulip', file: 'tulip.png' },
    { name: 'Hydrangea', file: 'hydrangea.png' },
    { name: 'Lavender', file: 'lavender.png' },
    { name: 'Snapdragon', file: 'snapdragon.png' },
    { name: 'Lily', file: 'lily.png' },
    { name: 'Buttercup', file: 'buttercup.png' },
    { name: 'Anemones', file: 'anemones.png' },
    { name: 'Gardenia', file: 'gardenia.png' },
    { name: 'Dahlia', file: 'dahlia.png' },
    { name: 'Orchid', file: 'orchid.png' },
    { name: 'Foxglove', file: 'foxglove.png' }
  ];

  // 15 Letter Stickers Catalog
  const CARD_STICKERS = [
    { name: 'Pink Hearts', file: 'sticker_hearts_pink.png' },
    { name: 'Pink Lily', file: 'sticker_lily_pink.png' },
    { name: 'White Tulips', file: 'sticker_tulips_white.png' },
    { name: 'Glass Star', file: 'sticker_glass_star.png' },
    { name: 'Butterflies', file: 'sticker_butterflies.png' },
    { name: 'Retro Star', file: 'sticker_retro_star.png' },
    { name: 'Vinyl Disc', file: 'sticker_vinyl_record.png' },
    { name: 'Cream Smiley', file: 'sticker_smiley_cream.png' },
    { name: 'Scallop Heart', file: 'sticker_scallop_heart.png' },
    { name: 'Love Bubble', file: 'sticker_love_bubble.png' },
    { name: 'Stitched Star', file: 'sticker_stitched_star.png' },
    { name: 'Plush Bunnies', file: 'sticker_plush_bunnies.png' },
    { name: 'Bow Paperclip', file: 'sticker_paperclips_bow.png' },
    { name: 'Disco Ball', file: 'sticker_disco_ball.png' },
    { name: 'Teddy Bear', file: 'sticker_teddy_bear.png' }
  ];

  const CARD_ENVELOPE_MAP = {
    'dusty-blue': 'assets/letter/envelopes/env_dusty_blue.jpg',
    'blush-lace': 'assets/letter/envelopes/env_blush_lace.jpg',
    'crimson-velvet': 'assets/letter/envelopes/env_crimson_velvet.jpg',
    'ivory-lace': 'assets/letter/envelopes/env_ivory_lace.jpg'
  };

  const CARD_SEAL_MAP = {
    'gold-celestial': 'assets/letter/seals/seal_gold_celestial.png',
    'blue-love': 'assets/letter/seals/seal_blue_love.png',
    'pink-crescent': 'assets/letter/seals/seal_pink_crescent.png',
    'crimson-heart': 'assets/letter/seals/seal_crimson_heart.png'
  };

  // Web Audio Synth for Functional Vinyl Player
  let vinylAudioCtx = null;
  let vinylIsPlaying = false;
  let vinylLoopTimer = null;
  let vinylMelodyIdx = 0;

  function initVinylAudio() {
    if (!vinylAudioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) vinylAudioCtx = new AudioContext();
    }
    if (vinylAudioCtx && vinylAudioCtx.state === 'suspended') {
      vinylAudioCtx.resume();
    }
  }

  function playVinylTone(freq, duration = 0.55) {
    if (!vinylAudioCtx) return;
    try {
      const osc = vinylAudioCtx.createOscillator();
      const gain = vinylAudioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, vinylAudioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, vinylAudioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.14, vinylAudioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, vinylAudioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(vinylAudioCtx.destination);

      osc.start(vinylAudioCtx.currentTime);
      osc.stop(vinylAudioCtx.currentTime + duration);
    } catch (e) {}
  }

  const VINYL_MELODY = [
    { f: 261.63, d: 0.6 },
    { f: 329.63, d: 0.6 },
    { f: 392.00, d: 0.7 },
    { f: 523.25, d: 0.9 },
    { f: 493.88, d: 0.6 },
    { f: 392.00, d: 0.6 },
    { f: 329.63, d: 0.7 },
    { f: 440.00, d: 1.0 },
    { f: 349.23, d: 0.6 },
    { f: 440.00, d: 0.6 },
    { f: 523.25, d: 0.8 },
    { f: 392.00, d: 1.1 }
  ];

  function startVinylAudio() {
    initVinylAudio();
    vinylIsPlaying = true;
    document.querySelectorAll('.vinyl-player-widget').forEach(el => el.classList.add('is-playing'));
    document.querySelectorAll('.vinyl-play-btn').forEach(btn => {
      btn.innerHTML = '⏸';
      btn.title = 'Pause Record';
    });

    function loopMelody() {
      if (!vinylIsPlaying) return;
      const note = VINYL_MELODY[vinylMelodyIdx];
      playVinylTone(note.f, note.d);
      vinylMelodyIdx = (vinylMelodyIdx + 1) % VINYL_MELODY.length;
      vinylLoopTimer = setTimeout(loopMelody, note.d * 750);
    }
    loopMelody();
  }

  function stopVinylAudio() {
    vinylIsPlaying = false;
    if (vinylLoopTimer) {
      clearTimeout(vinylLoopTimer);
      vinylLoopTimer = null;
    }
    document.querySelectorAll('.vinyl-player-widget').forEach(el => el.classList.remove('is-playing'));
    document.querySelectorAll('.vinyl-play-btn').forEach(btn => {
      btn.innerHTML = '▶';
      btn.title = 'Play Record';
    });
  }

  function toggleVinylAudio() {
    if (vinylIsPlaying) {
      stopVinylAudio();
    } else {
      startVinylAudio();
    }
  }

  // Active Selected Item on Cover for Font / Style manipulation
  let activeSelectedCoverItem = null;

  // Stepper Controller
  function setCardStep(stepNum) {
    state.greetingCard.step = stepNum;

    // Update Dots & Lines
    if (cardDot1) cardDot1.classList.toggle('active', stepNum === 1);
    if (cardDot2) cardDot2.classList.toggle('active', stepNum === 2);
    if (cardDot3) cardDot3.classList.toggle('active', stepNum === 3);
    if (cardDot4) cardDot4.classList.toggle('active', stepNum === 4);

    if (cardLine1) cardLine1.style.background = stepNum >= 2 ? 'var(--brand-burgundy, #521319)' : 'rgba(82, 19, 25, 0.15)';
    if (cardLine2) cardLine2.style.background = stepNum >= 3 ? 'var(--brand-burgundy, #521319)' : 'rgba(82, 19, 25, 0.15)';
    if (cardLine3) cardLine3.style.background = stepNum >= 4 ? 'var(--brand-burgundy, #521319)' : 'rgba(82, 19, 25, 0.15)';

    // Toggle Panels
    if (cardPanelCover) cardPanelCover.style.display = stepNum === 1 ? 'block' : 'none';
    if (cardPanelInside) cardPanelInside.style.display = stepNum === 2 ? 'block' : 'none';
    if (cardPanelDelivery) cardPanelDelivery.style.display = stepNum === 3 ? 'block' : 'none';
    if (cardPanelPreview) cardPanelPreview.style.display = stepNum === 4 ? 'block' : 'none';

    if (stepNum === 1) {
      renderCoverElements();
    } else if (stepNum === 2) {
      if (cardInsideBifold) {
        cardInsideBifold.className = `card-inside-bifold theme-${state.greetingCard.theme || 'crimson-romance'}`;
      }
      renderInsideKeepsakes();
      syncInsideNoteInputs();
    } else if (stepNum === 3) {
      updateCardVesselLivePreview();
    } else if (stepNum === 4) {
      renderCardStep4Preview();
    }
  }

  [cardDot1, cardDot2, cardDot3, cardDot4].forEach((dot, idx) => {
    if (dot) {
      dot.addEventListener('click', () => setCardStep(idx + 1));
    }
  });

  if (btnCardToStep2) btnCardToStep2.addEventListener('click', () => setCardStep(2));
  if (btnCardBackToStep1) btnCardBackToStep1.addEventListener('click', () => setCardStep(1));
  if (btnCardToStep3) btnCardToStep3.addEventListener('click', () => setCardStep(3));
  if (btnCardBackToStep2) btnCardBackToStep2.addEventListener('click', () => setCardStep(2));
  if (btnCardToStep4) btnCardToStep4.addEventListener('click', () => setCardStep(4));
  if (btnCardBackToStep3) btnCardBackToStep3.addEventListener('click', () => setCardStep(3));

  // --- Step 1: Design Cover Logic ---
  cardThemeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cardThemeBtns.forEach(b => b.classList.toggle('active', b === btn));
      const theme = btn.dataset.cardTheme;
      state.greetingCard.theme = theme;
      if (cardCoverCanvas) {
        cardCoverCanvas.className = `card-cover-canvas theme-${theme}`;
      }
      if (cardInsideBifold) {
        cardInsideBifold.className = `card-inside-bifold theme-${theme}`;
      }
    });
  });

  if (btnCardAddCoverPhoto && cardCoverPhotoInput) {
    btnCardAddCoverPhoto.addEventListener('click', () => cardCoverPhotoInput.click());
    cardCoverPhotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          state.greetingCard.coverElements.push({
            id: 'photo_' + Date.now(),
            type: 'photo',
            src: evt.target.result,
            x: 20,
            y: 18,
            width: 180
          });
          renderCoverElements();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnCardAddCoverText) {
    btnCardAddCoverText.addEventListener('click', () => {
      state.greetingCard.coverElements.push({
        id: 'text_' + Date.now(),
        type: 'text',
        text: 'Type your message...',
        x: 18,
        y: 50,
        width: 200,
        fontSize: state.greetingCard.coverFontSize || 24,
        fontFamily: state.greetingCard.coverFontFamily || "'Caveat', cursive"
      });
      renderCoverElements();
    });
  }

  if (cardFontSelect) {
    cardFontSelect.addEventListener('change', () => {
      state.greetingCard.coverFontFamily = cardFontSelect.value;
      if (activeSelectedCoverItem && activeSelectedCoverItem.type === 'text') {
        activeSelectedCoverItem.fontFamily = cardFontSelect.value;
        renderCoverElements();
      }
    });
  }

  if (btnCardFontMinus) {
    btnCardFontMinus.addEventListener('click', () => {
      if (activeSelectedCoverItem && activeSelectedCoverItem.type === 'text') {
        activeSelectedCoverItem.fontSize = Math.max(12, (activeSelectedCoverItem.fontSize || 24) - 2);
        renderCoverElements();
      } else {
        state.greetingCard.coverFontSize = Math.max(12, (state.greetingCard.coverFontSize || 24) - 2);
      }
    });
  }

  if (btnCardFontPlus) {
    btnCardFontPlus.addEventListener('click', () => {
      if (activeSelectedCoverItem && activeSelectedCoverItem.type === 'text') {
        activeSelectedCoverItem.fontSize = Math.min(52, (activeSelectedCoverItem.fontSize || 24) + 2);
        renderCoverElements();
      } else {
        state.greetingCard.coverFontSize = Math.min(52, (state.greetingCard.coverFontSize || 24) + 2);
      }
    });
  }

  function renderCoverElements() {
    if (!cardCoverElementsLayer) return;
    cardCoverElementsLayer.innerHTML = '';

    (state.greetingCard.coverElements || []).forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'card-placed-item';
      if (activeSelectedCoverItem && activeSelectedCoverItem.id === item.id) {
        itemEl.classList.add('is-selected');
      }
      itemEl.dataset.id = item.id;
      itemEl.style.left = item.x + '%';
      itemEl.style.top = item.y + '%';
      if (item.width) {
        itemEl.style.width = typeof item.width === 'number' ? item.width + 'px' : item.width;
      }

      if (item.type === 'photo') {
        itemEl.innerHTML = `
          <button class="btn-item-delete" title="Delete">×</button>
          <img src="${item.src}" class="card-cover-photo-img" style="width:100%; height:auto; border-radius:6px; display:block; pointer-events:none;" />
          <div class="card-resize-handle" title="Drag to resize"></div>
        `;
      } else {
        itemEl.innerHTML = `
          <button class="btn-item-delete" title="Delete">×</button>
          <div class="card-item-content card-text-content" contenteditable="true" spellcheck="false" style="font-family:${item.fontFamily || "'Caveat', cursive"}; font-size:${item.fontSize || 24}px;">${escapeHtml(item.text)}</div>
          <div class="card-resize-handle" title="Drag to resize"></div>
        `;

        const contentEl = itemEl.querySelector('.card-item-content');
        if (contentEl) {
          contentEl.addEventListener('input', () => {
            item.text = contentEl.innerText;
          });
        }
      }

      attachItemInteractions(
        itemEl,
        item,
        cardCoverElementsLayer,
        () => {},
        () => {
          state.greetingCard.coverElements = state.greetingCard.coverElements.filter(i => i.id !== item.id);
          if (activeSelectedCoverItem && activeSelectedCoverItem.id === item.id) {
            activeSelectedCoverItem = null;
          }
          renderCoverElements();
        }
      );

      cardCoverElementsLayer.appendChild(itemEl);
    });
  }

  // --- Step 2: Inside Card Logic ---
  function syncInsideNoteInputs() {
    if (cardInsideToInput) cardInsideToInput.value = state.greetingCard.insideTo || 'Kabir';
    if (cardInsideBodyTextarea) cardInsideBodyTextarea.value = state.greetingCard.insideBody || 'Wishing you all the joy, peace, and warmth this season brings.';
    if (cardInsideFromInput) cardInsideFromInput.value = state.greetingCard.insideFrom || 'Saanvi';

    applyInsideFont();
  }

  function applyInsideFont() {
    const ff = state.greetingCard.insideFontFamily || "'Caveat', cursive";
    const fs = state.greetingCard.insideFontSize || 19;
    if (cardInsideToInput) {
      cardInsideToInput.style.fontFamily = ff;
      cardInsideToInput.style.fontSize = Math.max(16, fs) + 'px';
    }
    if (cardInsideBodyTextarea) {
      cardInsideBodyTextarea.style.fontFamily = ff;
      cardInsideBodyTextarea.style.fontSize = fs + 'px';
    }
    if (cardInsideFromInput) {
      cardInsideFromInput.style.fontFamily = ff;
      cardInsideFromInput.style.fontSize = Math.max(16, fs) + 'px';
    }
  }

  if (cardInsideToInput) {
    cardInsideToInput.addEventListener('input', () => {
      state.greetingCard.insideTo = cardInsideToInput.value;
      document.querySelectorAll('.vinyl-label-sub').forEach(el => {
        el.textContent = `For ${escapeHtml(state.greetingCard.insideTo || 'Kabir')}`;
      });
    });
  }

  if (cardInsideBodyTextarea) {
    cardInsideBodyTextarea.addEventListener('input', () => {
      state.greetingCard.insideBody = cardInsideBodyTextarea.value;
    });
  }

  if (cardInsideFromInput) {
    cardInsideFromInput.addEventListener('input', () => {
      state.greetingCard.insideFrom = cardInsideFromInput.value;
    });
  }

  if (cardInsideFontSelect) {
    cardInsideFontSelect.addEventListener('change', () => {
      state.greetingCard.insideFontFamily = cardInsideFontSelect.value;
      applyInsideFont();
    });
  }

  if (btnInsideFontMinus) {
    btnInsideFontMinus.addEventListener('click', () => {
      state.greetingCard.insideFontSize = Math.max(14, (state.greetingCard.insideFontSize || 19) - 2);
      applyInsideFont();
    });
  }

  if (btnInsideFontPlus) {
    btnInsideFontPlus.addEventListener('click', () => {
      state.greetingCard.insideFontSize = Math.min(34, (state.greetingCard.insideFontSize || 19) + 2);
      applyInsideFont();
    });
  }

  // Keepsakes Tools: Polaroid, Pressed Flower, Vinyl, Sticker
  if (btnCardAddPolaroid && cardPolaroidFileInput) {
    btnCardAddPolaroid.addEventListener('click', () => cardPolaroidFileInput.click());
    cardPolaroidFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          state.greetingCard.insideKeepsakes.push({
            id: 'polaroid_' + Date.now(),
            type: 'polaroid',
            src: evt.target.result,
            caption: 'Cherished Memory',
            x: 12,
            y: 14,
            width: 140
          });
          renderInsideKeepsakes();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 15 Flowers Popup
  function populateCardFlowersPopup() {
    if (!cardFlowersPopupGrid) return;
    cardFlowersPopupGrid.innerHTML = '';
    CARD_FLOWERS.forEach(fl => {
      const btn = document.createElement('button');
      btn.className = 'flower-popup-item';
      btn.innerHTML = `
        <img src="assets/flowers/${fl.file}" alt="${fl.name}" class="flower-popup-thumb" />
        <span class="flower-popup-name">${fl.name}</span>
      `;
      btn.addEventListener('click', () => {
        state.greetingCard.insideKeepsakes.push({
          id: 'flower_' + Date.now(),
          type: 'flower',
          name: fl.name,
          file: fl.file,
          x: 24,
          y: 20,
          width: 95
        });
        if (cardFlowersPopup) cardFlowersPopup.style.display = 'none';
        renderInsideKeepsakes();
      });
      cardFlowersPopupGrid.appendChild(btn);
    });
  }

  if (btnCardAddFlower && cardFlowersPopup) {
    btnCardAddFlower.addEventListener('click', () => {
      populateCardFlowersPopup();
      cardFlowersPopup.style.display = 'block';
    });
  }
  if (btnCloseFlowerPopup && cardFlowersPopup) {
    btnCloseFlowerPopup.addEventListener('click', () => {
      cardFlowersPopup.style.display = 'none';
    });
  }

  // 15 Stickers Popup
  function populateCardStickersPopup() {
    if (!cardStickersPopupGrid) return;
    cardStickersPopupGrid.innerHTML = '';
    CARD_STICKERS.forEach(stk => {
      const btn = document.createElement('button');
      btn.className = 'sticker-popup-item';
      btn.innerHTML = `
        <img src="assets/stickers/${stk.file}" alt="${stk.name}" class="sticker-popup-thumb" />
      `;
      btn.addEventListener('click', () => {
        state.greetingCard.insideKeepsakes.push({
          id: 'sticker_' + Date.now(),
          type: 'sticker',
          name: stk.name,
          file: stk.file,
          x: 28,
          y: 35,
          width: 75
        });
        if (cardStickersPopup) cardStickersPopup.style.display = 'none';
        renderInsideKeepsakes();
      });
      cardStickersPopupGrid.appendChild(btn);
    });
  }

  if (btnCardAddSticker && cardStickersPopup) {
    btnCardAddSticker.addEventListener('click', () => {
      populateCardStickersPopup();
      cardStickersPopup.style.display = 'block';
    });
  }
  if (btnCloseStickerPopup && cardStickersPopup) {
    btnCloseStickerPopup.addEventListener('click', () => {
      cardStickersPopup.style.display = 'none';
    });
  }

  // Functional Vinyl Record
  if (btnCardAddVinyl) {
    btnCardAddVinyl.addEventListener('click', () => {
      const hasVinyl = state.greetingCard.insideKeepsakes.some(i => i.type === 'vinyl');
      if (hasVinyl) {
        showAtelierToast('Vinyl record is already placed on your card ♡');
        return;
      }
      state.greetingCard.insideKeepsakes.push({
        id: 'vinyl_' + Date.now(),
        type: 'vinyl',
        title: 'Golden Hour (Acoustic)',
        x: 10,
        y: 28,
        width: 155
      });
      renderInsideKeepsakes();
    });
  }

  function renderInsideKeepsakes() {
    if (!insideKeepsakesDropzone) return;
    insideKeepsakesDropzone.innerHTML = '';

    (state.greetingCard.insideKeepsakes || []).forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'card-placed-item';
      itemEl.dataset.id = item.id;
      itemEl.style.left = item.x + '%';
      itemEl.style.top = item.y + '%';
      if (item.width) {
        itemEl.style.width = typeof item.width === 'number' ? item.width + 'px' : item.width;
      }

      if (item.type === 'polaroid') {
        itemEl.innerHTML = `
          <button class="btn-item-delete" title="Delete">×</button>
          <div class="placed-polaroid-frame">
            <div class="polaroid-pin"></div>
            <img src="${item.src}" class="polaroid-photo" alt="Memory" />
            <div class="polaroid-caption" contenteditable="true" spellcheck="false">${escapeHtml(item.caption || 'Cherished Memory')}</div>
          </div>
          <div class="card-resize-handle" title="Drag to resize"></div>
        `;
        const capEl = itemEl.querySelector('.polaroid-caption');
        if (capEl) {
          capEl.addEventListener('input', () => {
            item.caption = capEl.innerText;
          });
        }
      } else if (item.type === 'flower') {
        itemEl.innerHTML = `
          <button class="btn-item-delete" title="Delete">×</button>
          <img src="assets/flowers/${item.file}" class="placed-flower-img" alt="${item.name}" style="width:100%; height:auto; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.12)); pointer-events:none;" />
          <div class="card-resize-handle" title="Drag to resize"></div>
        `;
      } else if (item.type === 'vinyl') {
        itemEl.innerHTML = `
          <button class="btn-item-delete" title="Delete">×</button>
          <div class="vinyl-player-widget ${vinylIsPlaying ? 'is-playing' : ''}">
            <div class="vinyl-sleeve">
              <div class="vinyl-disc">
                <div class="vinyl-center-label">
                  <span class="vinyl-label-title">Side A</span>
                  <span class="vinyl-label-sub">For ${escapeHtml(state.greetingCard.insideTo || 'Kabir')}</span>
                </div>
              </div>
              <div class="vinyl-needle-arm"></div>
            </div>
            <div class="vinyl-player-controls">
              <button type="button" class="vinyl-play-btn" title="${vinylIsPlaying ? 'Pause Record' : 'Play Record'}">${vinylIsPlaying ? '⏸' : '▶'}</button>
              <span class="vinyl-track-info">Golden Hour (Acoustic)</span>
            </div>
          </div>
          <div class="card-resize-handle" title="Drag to resize"></div>
        `;
      } else if (item.type === 'sticker') {
        itemEl.innerHTML = `
          <button class="btn-item-delete" title="Delete">×</button>
          <img src="assets/stickers/${item.file}" class="placed-sticker-img" alt="${item.name}" style="width:100%; height:auto; filter:drop-shadow(0 3px 8px rgba(0,0,0,0.18)); pointer-events:none;" />
          <div class="card-resize-handle" title="Drag to resize"></div>
        `;
      }

      attachItemInteractions(
        itemEl,
        item,
        insideKeepsakesDropzone,
        () => {},
        () => {
          if (item.type === 'vinyl' && vinylIsPlaying) {
            stopVinylAudio();
          }
          state.greetingCard.insideKeepsakes = state.greetingCard.insideKeepsakes.filter(i => i.id !== item.id);
          renderInsideKeepsakes();
        }
      );

      insideKeepsakesDropzone.appendChild(itemEl);
    });
  }

  // Generalized Interaction Engine: Dragging, Resizing & Deleting
  function attachItemInteractions(itemEl, itemData, parentContainer, onUpdate, onDelete) {
    const deleteBtn = itemEl.querySelector('.btn-item-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onDelete();
      });
    }

    const vinylBtn = itemEl.querySelector('.vinyl-play-btn');
    if (vinylBtn) {
      vinylBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleVinylAudio();
      });
    }

    // Selection
    itemEl.addEventListener('click', (e) => {
      if (e.target.closest('.btn-item-delete') || e.target.closest('.vinyl-play-btn')) return;
      parentContainer.querySelectorAll('.card-placed-item').forEach(el => el.classList.remove('is-selected'));
      itemEl.classList.add('is-selected');
      activeSelectedCoverItem = itemData;
      if (itemData.type === 'text') {
        if (cardFontSelect) cardFontSelect.value = itemData.fontFamily || "'Caveat', cursive";
      }
    });

    // Resize
    const resizeHandle = itemEl.querySelector('.card-resize-handle');
    if (resizeHandle) {
      let isResizing = false;
      let startX = 0;
      let startW = 0;

      resizeHandle.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        isResizing = true;
        startX = e.clientX;
        startW = itemEl.offsetWidth;
        try { resizeHandle.setPointerCapture(e.pointerId); } catch (err) {}
      });

      resizeHandle.addEventListener('pointermove', (e) => {
        if (!isResizing) return;
        const deltaX = e.clientX - startX;
        const parentW = parentContainer.offsetWidth || 300;
        const newW = Math.max(50, Math.min(parentW * 0.95, startW + deltaX));
        itemData.width = Math.round(newW);
        itemEl.style.width = itemData.width + 'px';
      });

      const onResizeEnd = (e) => {
        if (!isResizing) return;
        isResizing = false;
        try { resizeHandle.releasePointerCapture(e.pointerId); } catch (err) {}
        onUpdate();
      };
      resizeHandle.addEventListener('pointerup', onResizeEnd);
      resizeHandle.addEventListener('pointercancel', onResizeEnd);
    }

    // Drag
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialLeftPx = 0;
    let initialTopPx = 0;

    itemEl.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.btn-item-delete') || e.target.closest('.card-resize-handle') || e.target.closest('.vinyl-play-btn')) return;
      if (e.target.getAttribute('contenteditable') === 'true') return;

      e.preventDefault();
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      initialLeftPx = itemEl.offsetLeft;
      initialTopPx = itemEl.offsetTop;
      itemEl.classList.add('is-dragging');
      try { itemEl.setPointerCapture(e.pointerId); } catch (err) {}
    });

    itemEl.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      const parentW = parentContainer.offsetWidth || 300;
      const parentH = parentContainer.offsetHeight || 400;

      const newLeftPx = Math.max(0, Math.min(parentW - 40, initialLeftPx + deltaX));
      const newTopPx = Math.max(0, Math.min(parentH - 40, initialTopPx + deltaY));

      itemData.x = parseFloat(((newLeftPx / parentW) * 100).toFixed(1));
      itemData.y = parseFloat(((newTopPx / parentH) * 100).toFixed(1));

      itemEl.style.left = itemData.x + '%';
      itemEl.style.top = itemData.y + '%';
    });

    const onDragEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      itemEl.classList.remove('is-dragging');
      try { itemEl.releasePointerCapture(e.pointerId); } catch (err) {}
      onUpdate();
    };

    itemEl.addEventListener('pointerup', onDragEnd);
    itemEl.addEventListener('pointercancel', onDragEnd);
  }

  // --- Step 3: Delivery Options Logic ---
  cardVesselBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cardVesselBtns.forEach(b => b.classList.toggle('active', b === btn));
      const v = btn.dataset.vessel;
      state.greetingCard.vessel = v;
      if (cardEnvelopeOptions) cardEnvelopeOptions.style.display = v === 'envelope' ? 'block' : 'none';
      if (cardBoxOptions) cardBoxOptions.style.display = v === 'box' ? 'block' : 'none';
      updateCardVesselLivePreview();
    });
  });

  cardEnvChoices.forEach(btn => {
    btn.addEventListener('click', () => {
      cardEnvChoices.forEach(b => b.classList.toggle('active', b === btn));
      state.greetingCard.envelope = btn.dataset.env;
      updateCardVesselLivePreview();
    });
  });

  cardSealChoices.forEach(btn => {
    btn.addEventListener('click', () => {
      cardSealChoices.forEach(b => b.classList.toggle('active', b === btn));
      state.greetingCard.seal = btn.dataset.seal;
      updateCardVesselLivePreview();
    });
  });

  cardBoxChoices.forEach(btn => {
    btn.addEventListener('click', () => {
      cardBoxChoices.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.style.borderColor = b === btn ? '#521319' : 'transparent';
      });
      state.greetingCard.boxIndex = btn.dataset.index;
      updateCardVesselLivePreview();
    });
  });

  function updateCardVesselLivePreview() {
    if (!cardVesselLiveRender) return;
    const vessel = state.greetingCard.vessel || 'envelope';

    if (vessel === 'envelope') {
      const envKey = state.greetingCard.envelope || 'dusty-blue';
      const sealKey = state.greetingCard.seal || 'gold-celestial';
      const envSrc = CARD_ENVELOPE_MAP[envKey] || 'assets/letter/envelopes/env_dusty_blue.jpg';
      const sealSrc = CARD_SEAL_MAP[sealKey] || 'assets/letter/seals/seal_gold_celestial.png';

      cardVesselLiveRender.innerHTML = `
        <div class="card-envelope-live-preview" style="position:relative; width:220px; height:150px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
          <img src="${envSrc}" style="width:100%; height:100%; object-fit:cover; border-radius:10px; box-shadow:0 8px 24px rgba(82, 19, 25, 0.16); display:block;" alt="Envelope" />
          <img src="${sealSrc}" class="preview-seal-overlay-img" style="position:absolute; left:50%; top:54%; transform:translate(-50%, -50%); width:68px; height:68px; object-fit:contain; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.32)); z-index:5;" alt="Wax Seal" />
        </div>
      `;
    } else if (vessel === 'box') {
      const boxIdx = state.greetingCard.boxIndex || '1';
      const boxSrc = boxImages[boxIdx] || 'assets/boxes/box1.jpg';
      cardVesselLiveRender.innerHTML = `
        <div style="position:relative; width:140px; height:140px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
          <img src="${boxSrc}" style="width:100%; height:100%; object-fit:contain; mix-blend-mode:multiply; filter:drop-shadow(0 6px 16px rgba(82,19,25,0.15));" alt="Gift Box" />
        </div>
      `;
    } else {
      cardVesselLiveRender.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:10px 0;">
          <img src="assets/truck.png" style="width:210px; max-width:90%; height:auto; object-fit:contain; filter:drop-shadow(0 6px 14px rgba(82, 19, 25, 0.12));" alt="Delivery Truck" />
          <p class="preview-vessel-name" style="margin-top:8px; font-family:'Playfair Display', Georgia, serif; color:#521319; font-size:14px; font-weight:600;">Special Delivery Truck</p>
        </div>
      `;
    }
  }

  // --- Step 4: Preview & Dispatch Logic ---
  function renderCardStep4Preview() {
    if (!cardPreviewVesselWrap) return;
    const vessel = state.greetingCard.vessel || 'envelope';

    state.greetingCard.isOpened = false;
    state.greetingCard.previewFace = 'inside';

    const openBtnRow = document.querySelector('#card-panel-preview .step3-open-btn-row');
    if (openBtnRow) openBtnRow.style.display = 'flex';
    if (cardPreviewVesselStage) cardPreviewVesselStage.style.display = 'block';
    if (cardPreviewRevealedStage) cardPreviewRevealedStage.style.display = 'none';
    if (btnCardOpenText) btnCardOpenText.textContent = 'Click to Open ♡';
    if (cardFlipLabel) cardFlipLabel.textContent = 'View Cover';

    if (vessel === 'envelope') {
      const envKey = state.greetingCard.envelope || 'dusty-blue';
      const sealKey = state.greetingCard.seal || 'gold-celestial';
      const envSrc = CARD_ENVELOPE_MAP[envKey] || 'assets/letter/envelopes/env_dusty_blue.jpg';
      const sealSrc = CARD_SEAL_MAP[sealKey] || 'assets/letter/seals/seal_gold_celestial.png';

      cardPreviewVesselWrap.innerHTML = `
        <div class="card-envelope-arriving-package" style="position:relative; width:240px; height:160px; margin:0 auto; cursor:pointer;">
          <img src="${envSrc}" style="width:100%; height:100%; object-fit:cover; border-radius:10px; box-shadow:0 12px 28px rgba(82,19,25,0.18);" alt="Envelope" />
          <img src="${sealSrc}" class="sealed-wax-seal" style="position:absolute; left:50%; top:54%; transform:translate(-50%, -50%); width:76px; height:76px; object-fit:contain; filter:drop-shadow(0 5px 12px rgba(0,0,0,0.36));" alt="Wax Seal" />
          <div style="position:absolute; bottom:14px; left:0; width:100%; text-align:center; font-family:'Caveat', cursive; font-size:18px; color:rgba(255,255,255,0.92); text-shadow:0 1px 3px rgba(0,0,0,0.5);">For ${escapeHtml(state.greetingCard.insideTo || 'Kabir')}</div>
        </div>
      `;
    } else if (vessel === 'box') {
      const boxIdx = state.greetingCard.boxIndex || '1';
      const boxSrc = boxImages[boxIdx] || 'assets/boxes/box1.jpg';
      cardPreviewVesselWrap.innerHTML = `
        <div style="position:relative; width:170px; height:170px; margin:0 auto; cursor:pointer;">
          <img src="${boxSrc}" style="width:100%; height:100%; object-fit:contain; mix-blend-mode:multiply; filter:drop-shadow(0 10px 22px rgba(82,19,25,0.18));" alt="Gift Box" />
        </div>
      `;
    } else {
      cardPreviewVesselWrap.innerHTML = `
        <div style="position:relative; width:230px; margin:0 auto; cursor:pointer; display:flex; flex-direction:column; align-items:center;">
          <img src="assets/truck.png" style="width:100%; height:auto; object-fit:contain; filter:drop-shadow(0 8px 20px rgba(82,19,25,0.15));" alt="Delivery Truck" />
          <p style="margin-top:8px; font-family:'Playfair Display', Georgia, serif; color:#521319; font-size:14px; font-weight:600;">Special Delivery Truck</p>
        </div>
      `;
    }
  }

  function openCardInPreview() {
    state.greetingCard.isOpened = true;
    if (cardPreviewVesselStage) cardPreviewVesselStage.style.display = 'none';
    if (cardPreviewRevealedStage) cardPreviewRevealedStage.style.display = 'block';
    const openBtnRow = document.querySelector('#card-panel-preview .step3-open-btn-row');
    if (openBtnRow) openBtnRow.style.display = 'none';
    renderCardRevealedDisplay();
  }

  function renderCardRevealedDisplay() {
    if (!cardRevealDisplay) return;
    const face = state.greetingCard.previewFace || 'inside';
    const theme = state.greetingCard.theme || 'crimson-romance';

    if (face === 'inside') {
      if (cardFlipLabel) cardFlipLabel.textContent = 'View Cover';
      let keepsakesHtml = '';
      (state.greetingCard.insideKeepsakes || []).forEach(item => {
        if (item.type === 'polaroid') {
          keepsakesHtml += `
            <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width || 130}px;">
              <div class="placed-polaroid-frame">
                <div class="polaroid-pin"></div>
                <img src="${item.src}" class="polaroid-photo" alt="Memory" />
                <div class="polaroid-caption">${escapeHtml(item.caption || 'Cherished Memory')}</div>
              </div>
            </div>
          `;
        } else if (item.type === 'flower') {
          keepsakesHtml += `
            <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width || 90}px;">
              <img src="assets/flowers/${item.file}" class="placed-flower-img" alt="${item.name}" style="width:100%; height:auto; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.12)); pointer-events:none;" />
            </div>
          `;
        } else if (item.type === 'vinyl') {
          keepsakesHtml += `
            <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width || 150}px;">
              <div class="vinyl-player-widget ${vinylIsPlaying ? 'is-playing' : ''}">
                <div class="vinyl-sleeve">
                  <div class="vinyl-disc">
                    <div class="vinyl-center-label">
                      <span class="vinyl-label-title">Side A</span>
                      <span class="vinyl-label-sub">For ${escapeHtml(state.greetingCard.insideTo || 'Kabir')}</span>
                    </div>
                  </div>
                  <div class="vinyl-needle-arm"></div>
                </div>
                <div class="vinyl-player-controls">
                  <button type="button" class="vinyl-play-btn" title="${vinylIsPlaying ? 'Pause Record' : 'Play Record'}">${vinylIsPlaying ? '⏸' : '▶'}</button>
                  <span class="vinyl-track-info">Golden Hour (Acoustic)</span>
                </div>
              </div>
            </div>
          `;
        } else if (item.type === 'sticker') {
          keepsakesHtml += `
            <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width || 70}px;">
              <img src="assets/stickers/${item.file}" class="placed-sticker-img" alt="${item.name}" style="width:100%; height:auto; filter:drop-shadow(0 3px 8px rgba(0,0,0,0.18)); pointer-events:none;" />
            </div>
          `;
        }
      });

      cardRevealDisplay.innerHTML = `
        <div class="card-inside-bifold theme-${theme}" style="margin:0 auto; box-shadow:0 12px 32px rgba(82, 19, 25, 0.18);">
          <div class="inside-left-panel" style="position:relative;">
            <div class="panel-watermark-label">Memories &amp; Keepsakes</div>
            <div class="inside-keepsakes-dropzone" style="position:relative; width:100%; height:100%;">
              ${keepsakesHtml}
            </div>
          </div>
          <div class="inside-bifold-crease"></div>
          <div class="inside-right-panel">
            <div class="card-inside-note-header">
              <span class="card-note-label">To:</span>
              <span style="font-family:${state.greetingCard.insideFontFamily || "'Caveat', cursive"}; font-size:18px; color:inherit; font-weight:600;">${escapeHtml(state.greetingCard.insideTo || 'Kabir')}</span>
            </div>
            <div style="font-family:${state.greetingCard.insideFontFamily || "'Caveat', cursive"}; font-size:${state.greetingCard.insideFontSize || 19}px; line-height:1.65; color:inherit; white-space:pre-wrap; word-break:break-word; min-height:180px; padding:6px 0;">
              ${escapeHtml(state.greetingCard.insideBody || 'Wishing you all the joy, peace, and warmth this season brings.')}
            </div>
            <div class="card-inside-note-footer">
              <span class="card-note-label">From:</span>
              <span style="font-family:${state.greetingCard.insideFontFamily || "'Caveat', cursive"}; font-size:18px; color:inherit; font-weight:600;">${escapeHtml(state.greetingCard.insideFrom || 'Saanvi')}</span>
            </div>
          </div>
        </div>
      `;

      cardRevealDisplay.querySelectorAll('.vinyl-play-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleVinylAudio();
        });
      });
    } else {
      if (cardFlipLabel) cardFlipLabel.textContent = 'View Inside';
      let coverItemsHtml = '';
      (state.greetingCard.coverElements || []).forEach(item => {
        if (item.type === 'photo') {
          coverItemsHtml += `
            <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width ? (typeof item.width === 'number' ? item.width + 'px' : item.width) : '55%'};">
              <img src="${item.src}" class="card-cover-photo-img" style="width:100%; height:auto; border-radius:6px; display:block;" />
            </div>
          `;
        } else if (item.type === 'text') {
          coverItemsHtml += `
            <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width ? (typeof item.width === 'number' ? item.width + 'px' : item.width) : '60%'};">
              <div class="card-item-content card-text-content" style="font-family:${item.fontFamily || "'Caveat', cursive"}; font-size:${item.fontSize || 24}px; text-align:center;">
                ${escapeHtml(item.text)}
              </div>
            </div>
          `;
        }
      });

      cardRevealDisplay.innerHTML = `
        <div class="card-cover-canvas theme-${theme}" style="margin:0 auto; box-shadow:0 12px 32px rgba(82, 19, 25, 0.18);">
          <div class="card-cover-elements-layer">
            ${coverItemsHtml}
          </div>
        </div>
      `;
    }
  }

  if (cardPreviewVesselWrap) cardPreviewVesselWrap.addEventListener('click', openCardInPreview);
  if (btnCardToggleOpen) btnCardToggleOpen.addEventListener('click', openCardInPreview);

  if (btnCardPreviewFlip) {
    btnCardPreviewFlip.addEventListener('click', () => {
      state.greetingCard.previewFace = state.greetingCard.previewFace === 'inside' ? 'cover' : 'inside';
      renderCardRevealedDisplay();
    });
  }

  function saveCurrentCardToVault(isManual = false) {
    try {
      const vaultData = JSON.parse(localStorage.getItem('between_us_vault_items') || '[]');
      const item = {
        type: 'card',
        title: 'Greeting Card',
        theme: state.greetingCard.theme || 'crimson-romance',
        coverElements: [...(state.greetingCard.coverElements || [])],
        insideKeepsakes: [...(state.greetingCard.insideKeepsakes || [])],
        to: state.greetingCard.insideTo || 'Kabir',
        from: state.greetingCard.insideFrom || 'Saanvi',
        body: state.greetingCard.insideBody || '',
        fontSize: state.greetingCard.insideFontSize || 19,
        fontFamily: state.greetingCard.insideFontFamily || "'Caveat', cursive",
        vessel: state.greetingCard.vessel || 'envelope',
        envelope: state.greetingCard.envelope || 'dusty-blue',
        seal: state.greetingCard.seal || 'gold-celestial',
        boxIndex: state.greetingCard.boxIndex || '1',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      const isDuplicate = vaultData.some(v => v.type === 'card' && v.to === item.to && v.from === item.from && v.body === item.body && v.theme === item.theme);
      if (!isDuplicate) {
        vaultData.unshift(item);
        localStorage.setItem('between_us_vault_items', JSON.stringify(vaultData));
        if (isManual) {
          showAtelierToast('Greeting card saved to your Vault ♡');
        }
      } else if (isManual) {
        showAtelierToast('Already saved in your Vault ♡');
      }
    } catch (err) {
      console.warn('Vault card save error:', err);
    }
  }

  if (btnCardSaveVault) {
    btnCardSaveVault.addEventListener('click', () => {
      saveCurrentCardToVault(true);
      btnCardSaveVault.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Saved to Vault ✓</span>
      `;
      setTimeout(() => {
        btnCardSaveVault.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Save to Vault</span>
        `;
      }, 2200);
    });
  }

  function generateShareableCardUrl() {
    const payload = {
      type: 'card',
      th: state.greetingCard.theme,
      cv: state.greetingCard.coverElements,
      ks: state.greetingCard.insideKeepsakes,
      to: state.greetingCard.insideTo,
      from: state.greetingCard.insideFrom,
      m: state.greetingCard.insideBody,
      ff: state.greetingCard.insideFontFamily,
      fs: state.greetingCard.insideFontSize,
      v: state.greetingCard.vessel,
      env: state.greetingCard.envelope,
      sl: state.greetingCard.seal,
      bi: state.greetingCard.boxIndex,
      d: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    const jsonStr = JSON.stringify(payload);
    const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
    const base = window.location.origin + window.location.pathname;
    return `${base}#card=${encodeURIComponent(b64)}`;
  }

  function openCardDispatchModal() {
    const modal = document.getElementById('dispatch-modal');
    if (!modal) return;
    const iconEl = document.getElementById('dispatch-badge-icon');
    const titleEl = document.getElementById('dispatch-modal-title');
    const subEl = document.getElementById('dispatch-modal-sub');
    const copyDescEl = document.getElementById('dispatch-copy-desc');
    const urlInput = document.getElementById('dispatch-url-input');

    if (iconEl) iconEl.textContent = '💌';
    if (titleEl) titleEl.textContent = 'Send Your Greeting Card';
    if (subEl) subEl.textContent = 'Share your personalized card and keepsakes.';
    if (copyDescEl) copyDescEl.textContent = 'Anyone with this link can unwrap and open your card';

    const shareUrl = generateShareableCardUrl();
    if (urlInput) urlInput.value = shareUrl;

    modal.style.display = 'flex';
  }

  if (btnCardDispatch) {
    btnCardDispatch.addEventListener('click', openCardDispatchModal);
  }

  // ================= 5. DELIVERY VESSELS (3 OPTIONS) =================
  const vesselBtns = document.querySelectorAll('#postcard-step2-pane .vessel-btn');
  const vesselPreviewRender = document.getElementById('vessel-preview-render');
  const envSelectorContainer = document.getElementById('envelope-selector-container');
  const envThumbBtns = document.querySelectorAll('.env-thumb-btn');
  const boxSelectorContainer = document.getElementById('box-selector-container');
  const boxThumbBtns = document.querySelectorAll('.box-thumb-btn');

  const boxImages = {
    '1': 'assets/boxes/box1.jpg',
    '2': 'assets/boxes/box2.jpg',
    '3': 'assets/boxes/box3.jpg'
  };

  state.envelopeIndex = 0;
  state.boxIndex = '1';

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

  const getBoxImage = (size = "130px") => {
    const boxSrc = boxImages[state.boxIndex || '1'] || 'assets/boxes/box1.jpg';
    return `
      <div style="width: ${size}; height: ${size}; position: relative; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
        <img src="${boxSrc}" style="width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply;" alt="Gift Box" />
      </div>
    `;
  };

  vesselBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vesselBtns.forEach(b => b.classList.toggle('active', b === btn));
      const v = btn.dataset.vessel;
      state.vessel = v;
      if (v === 'envelope') {
        if (envSelectorContainer) envSelectorContainer.style.display = 'block';
        if (boxSelectorContainer) boxSelectorContainer.style.display = 'none';
      } else if (v === 'box') {
        if (envSelectorContainer) envSelectorContainer.style.display = 'none';
        if (boxSelectorContainer) boxSelectorContainer.style.display = 'block';
      } else {
        if (envSelectorContainer) envSelectorContainer.style.display = 'none';
        if (boxSelectorContainer) boxSelectorContainer.style.display = 'none';
      }
      updateVesselLivePreview();
    });
  });

  envThumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      envThumbBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.style.borderColor = b === btn ? '#521319' : 'transparent';
      });
      state.envelopeIndex = btn.dataset.index;
      updateVesselLivePreview();
      
      // Update the main Envelope button icon to reflect the selected envelope
      const mainEnvBtn = document.querySelector('#postcard-step2-pane .vessel-btn[data-vessel="envelope"] div');
      if (mainEnvBtn) {
        mainEnvBtn.innerHTML = getEnvelopeImage("44px");
      }
    });
  });

  boxThumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      boxThumbBtns.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.style.borderColor = isActive ? '#521319' : 'transparent';
      });
      state.boxIndex = btn.dataset.index;
      updateVesselLivePreview();

      // Update the main Gift Box button icon to reflect the selected box
      const mainBoxBtn = document.querySelector('#postcard-step2-pane .vessel-btn[data-vessel="box"] div');
      if (mainBoxBtn) {
        mainBoxBtn.innerHTML = getBoxImage("44px");
      }
    });
  });

  function updateVesselLivePreview() {
    if (!vesselPreviewRender) return;
    if (state.vessel === 'envelope') {
      vesselPreviewRender.innerHTML = getEnvelopeImage();
    } else if (state.vessel === 'box') {
      vesselPreviewRender.innerHTML = getBoxImage('140px');
    } else {
      vesselPreviewRender.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 10px 0;">
          <img src="assets/truck.png" style="width: 210px; max-width: 90%; height: auto; object-fit: contain; filter: drop-shadow(0 6px 14px rgba(82, 19, 25, 0.12));" alt="Delivery Truck" />
          <p class="preview-vessel-name" style="margin-top: 8px; font-family:'Playfair Display', Georgia, serif; color:#521319; font-size:14px; font-weight:600;">Special Delivery Truck</p>
        </div>
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
      setPostcardStep(3);
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
          <div style="font-family: var(--font-editorial); font-size: 15px; font-weight: 600; color: var(--ink-maroon); margin-bottom: 2px;">Hand-Tied Botanical Bouquet</div>
          <p style="font-size: 11px; color: var(--ink-muted); margin-bottom: 8px;">Tied with lavender satin ribbon • ${stemCount} stems</p>
          <div class="bare-stem-stage" id="modal-revealed-bouquet-stage" style="height: 380px; background: transparent; border: none; margin-bottom: 8px;">
            <div class="lower-stems-container">${document.getElementById('lower-stems-container')?.innerHTML || ''}</div>
            <div class="greenery-layer">${document.getElementById('greenery-layer')?.innerHTML || ''}</div>
            <div class="stems-bloom-cluster">${document.getElementById('stems-bloom-cluster')?.innerHTML || ''}</div>
            <div class="stem-tie-band">${document.getElementById('stem-tie-band')?.innerHTML || ''}</div>
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

  // ================= STEP 3: PREVIEW & DISPATCH =================
  let step3PostcardRevealed = false;
  let step3PostcardFlipped = false;

  const step3VesselDisplay = document.getElementById('step3-vessel-display');
  const step3VesselWrapper = document.getElementById('step3-vessel-wrapper');
  const step3PostcardReveal = document.getElementById('step3-postcard-reveal');
  const step3RevealCard = document.getElementById('step3-reveal-card');
  const btnStep3ToggleOpen = document.getElementById('btn-step3-toggle-open');
  const btnStep3OpenText = document.getElementById('btn-step3-open-text');
  const btnStep3Flip = document.getElementById('btn-step3-flip');
  const btnStep3SaveVault = document.getElementById('btn-step3-save-vault');
  const btnStep3Dispatch = document.getElementById('btn-step3-dispatch');

  // Dispatch Share Modal Elements
  const dispatchModal = document.getElementById('dispatch-modal');
  const btnCloseDispatchModal = document.getElementById('btn-close-dispatch-modal');
  const btnDispatchCopyUrl = document.getElementById('btn-dispatch-copy-url');
  const btnDispatchSendFriends = document.getElementById('btn-dispatch-send-friends');
  const dispatchUrlInput = document.getElementById('dispatch-url-input');
  const btnCopySmall = document.getElementById('btn-copy-small');

  function renderStep3Preview() {
    step3PostcardRevealed = false;
    step3PostcardFlipped = false;

    if (step3PostcardReveal) step3PostcardReveal.style.display = 'none';
    if (step3VesselDisplay) step3VesselDisplay.style.display = 'flex';
    if (btnStep3OpenText) btnStep3OpenText.textContent = 'Click to Open ♡';

    if (!step3VesselWrapper) return;

    if (state.vessel === 'envelope') {
      const envIndex = state.envelopeIndex || '1';
      step3VesselWrapper.innerHTML = `
        <div style="position: relative; width: 210px; height: 145px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          <img src="assets/flowers/peony.png" style="position: absolute; left: -34px; top: 16px; width: 68px; height: 68px; object-fit: contain; transform: rotate(-24deg); opacity: 0.95; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.06)); pointer-events: none;" />
          <img src="assets/flowers/rose.png" style="position: absolute; right: -32px; top: 20px; width: 65px; height: 65px; object-fit: contain; transform: rotate(18deg); opacity: 0.95; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.06)); pointer-events: none;" />
          <svg style="position: absolute; top: -14px; left: 16px; width: 34px; height: 26px;" viewBox="0 0 34 26" fill="none">
            <line x1="8" y1="20" x2="2" y2="10" stroke="#F4A5B5" stroke-width="2.2" stroke-linecap="round"/>
            <line x1="16" y1="18" x2="16" y2="5" stroke="#F4A5B5" stroke-width="2.2" stroke-linecap="round"/>
            <line x1="24" y1="20" x2="30" y2="10" stroke="#F4A5B5" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
          <img src="assets/envelopes/env${envIndex}.jpg" style="width: 100%; height: 100%; object-fit: contain; position: relative; z-index: 2; filter: drop-shadow(0 8px 20px rgba(82, 19, 25, 0.12));" alt="Envelope" />
        </div>
      `;
    } else if (state.vessel === 'box') {
      const boxSrc = boxImages[state.boxIndex || '1'] || 'assets/boxes/box1.jpg';
      step3VesselWrapper.innerHTML = `
        <div style="position: relative; width: 175px; height: 175px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          <img src="assets/flowers/peony.png" style="position: absolute; right: -24px; bottom: 10px; width: 62px; height: 62px; object-fit: contain; transform: rotate(16deg); opacity: 0.9; pointer-events: none;" />
          <img src="${boxSrc}" style="width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; filter: drop-shadow(0 8px 18px rgba(82, 19, 25, 0.14));" alt="Keepsake Box" />
        </div>
      `;
    } else {
      step3VesselWrapper.innerHTML = `
        <div style="position: relative; width: 230px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          <img src="assets/truck.png" style="width: 100%; height: auto; object-fit: contain; filter: drop-shadow(0 8px 20px rgba(82, 19, 25, 0.15));" alt="Delivery Truck" />
        </div>
      `;
    }
  }

  function renderRevealedPostcardFace() {
    if (!step3RevealCard) return;
    const payload = getPostcardStatePayload();
    step3RevealCard.innerHTML = getPostcardFaceHtml(payload, step3PostcardFlipped);
  }

  function getPostcardFaceHtml(data, isBack) {
    const isLand = data.o === 'landscape';
    const cardWidth = isLand ? '340px' : '260px';
    const cardHeight = isLand ? '220px' : '330px';

    // Theme border styling
    let themeBorder = 'border: 8px solid #FDFBF7; box-shadow: 0 4px 16px rgba(82, 19, 25, 0.1);';
    if (data.t === 'candy') {
      themeBorder = 'border: 8px solid transparent; border-image: repeating-linear-gradient(45deg, #EE3A4C 0, #EE3A4C 8px, #FFFFFF 8px, #FFFFFF 12px, #F8A5B7 12px, #F8A5B7 20px, #FFFFFF 20px, #FFFFFF 24px) 8; box-shadow: 0 4px 16px rgba(82, 19, 25, 0.1);';
    } else if (data.t === 'kraft') {
      themeBorder = 'border: 8px solid #D2B48C; background: #FDF9F3; box-shadow: 0 4px 16px rgba(82, 19, 25, 0.1);';
    } else if (data.t === 'blue-ribbon') {
      themeBorder = 'border: 8px solid #9BB7D4; background: #F8FAFD; box-shadow: 0 4px 16px rgba(82, 19, 25, 0.1);';
    } else if (data.t === 'hearts') {
      themeBorder = 'border: 8px solid #FCE8EC; background: #FFF9FA; box-shadow: 0 4px 16px rgba(82, 19, 25, 0.1);';
    }

    if (!isBack) {
      // FRONT FACE
      let photoHtml = '';
      if (data.img) {
        photoHtml = `<div style="flex:1; width:100%; overflow:hidden; border-radius:4px; display:flex; align-items:center; justify-content:center; background:#F5EBE6;"><img src="${data.img}" style="width:100%; height:100%; object-fit:cover;" /></div>`;
      } else {
        photoHtml = `
          <div style="flex:1; width:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(255,245,246,0.6); border:1px dashed #E8A8B4; border-radius:6px; padding:12px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C97384" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span style="font-family:'Cormorant Garamond', serif; font-style:italic; font-size:12px; color:#8E4A56; margin-top:4px;">A Little Something</span>
          </div>
        `;
      }

      let titleHtml = '';
      if (data.title) {
        titleHtml = `<div style="text-align:center; font-family:'Playfair Display', Georgia, serif; font-size:16px; font-weight:600; color:#521319; margin-top:8px; border-bottom:1px solid #E8A8B4; padding-bottom:3px;">${escapeHtml(data.title)}</div>`;
      }

      return `
        <div style="width:${cardWidth}; height:${cardHeight}; margin:0 auto; background:#FFFDF9; border-radius:8px; padding:12px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between; ${themeBorder}">
          ${photoHtml}
          ${titleHtml}
        </div>
      `;
    } else {
      // BACK FACE
      const stampHtml = getStampHtmlByKey(data.sk, data.t);
      return `
        <div style="width:${cardWidth}; height:${cardHeight}; margin:0 auto; background:#FFFDF9; border-radius:8px; padding:12px; box-sizing:border-box; display:flex; gap:10px; ${themeBorder}">
          <!-- Left side: note -->
          <div style="flex:1.1; display:flex; flex-direction:column; justify-content:space-between; text-align:left; overflow:hidden;">
            <div style="font-family:${data.f}; font-size:15px; color:#3A2024; line-height:1.35; white-space:pre-wrap; word-break:break-word; max-height:100%; overflow-y:auto;">
              ${escapeHtml(data.msg || 'Write your note here...')}
            </div>
          </div>

          <!-- Divider -->
          <div style="width:1px; background:#E8D8D8; margin:2px 0;"></div>

          <!-- Right side: date, stamp, To/From -->
          <div style="flex:0.9; display:flex; flex-direction:column; justify-content:space-between; text-align:right;">
            <div>
              <div style="font-family:${data.f}; font-size:12px; color:#521319; margin-bottom:6px;">${escapeHtml(data.d)}</div>
              <div style="width:46px; height:46px; margin-left:auto;">
                ${stampHtml}
              </div>
            </div>
            <div style="text-align:left; font-family:${data.f}; font-size:13px; color:#521319; margin-top:10px;">
              <div style="border-bottom:1px solid #E8D0D6; padding-bottom:2px; margin-bottom:4px;">
                <span style="font-size:10px; font-weight:700; color:#8E4A56;">TO:</span> ${escapeHtml(data.to)}
              </div>
              <div style="border-bottom:1px solid #E8D0D6; padding-bottom:2px;">
                <span style="font-size:10px; font-weight:700; color:#8E4A56;">FROM:</span> ${escapeHtml(data.from)}
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  function getStampHtmlByKey(key, theme) {
    if (theme === 'kraft') {
      if (key === 'stamp_kraft_butterfly') return makeKraftStampCroppedImg('assets/stamps/stamp_kraft_butterfly.png');
      if (key === 'stamp_kraft_flower') return makeKraftStampCroppedImg('assets/stamps/stamp_kraft_flower.png');
      if (key === 'stamp_kraft_stars') return makeKraftComplexSvg(complexStarsSvg);
      if (key === 'stamp_kraft_heart') return makeKraftComplexSvg(complexHeartSvg);
      return makeKraftComplexSvg(complexMedallionSvg);
    }
    if (theme === 'blue-ribbon') {
      if (key === 'stamp_blue_bunny') return makeBlueStampCustomImg('assets/stamps/stamp_blue_bunny.png');
      if (key === 'stamp_blue_cherries') return makeBlueStampCustomImg('assets/stamps/stamp_blue_cherries.png');
      if (key === 'stamp_blue_card') return makeBlueStampCustomImg('assets/stamps/stamp_blue_card.png');
      if (key === 'stamp_blue_tickets') return makeBlueStampCustomImg('assets/stamps/stamp_blue_tickets.png');
      return makeBlueStampCustomImg('assets/stamps/stamp_blue_heart.png');
    }
    // Hearts / Candy default
    if (key === 'stamp_cupid') return stampCupidBow;
    if (key === 'stamp_lace_heart') return stampLaceHeart;
    if (key === 'stamp_modern_heart') return stampModernHeart;
    if (key === 'stamp_flower_sprig') return stampFlowerSprig;
    return stampSendingYouLove;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Toggle "Click to Open ♡" in Step 3
  if (btnStep3ToggleOpen) {
    btnStep3ToggleOpen.addEventListener('click', () => {
      step3PostcardRevealed = !step3PostcardRevealed;
      if (step3PostcardRevealed) {
        if (step3PostcardReveal) step3PostcardReveal.style.display = 'flex';
        if (step3VesselDisplay) step3VesselDisplay.style.display = 'none';
        if (btnStep3OpenText) btnStep3OpenText.textContent = 'Fold Postcard ♡';
        renderRevealedPostcardFace();
      } else {
        if (step3PostcardReveal) step3PostcardReveal.style.display = 'none';
        if (step3VesselDisplay) step3VesselDisplay.style.display = 'flex';
        if (btnStep3OpenText) btnStep3OpenText.textContent = 'Click to Open ♡';
      }
    });
  }

  // Flip Postcard in Step 3
  if (btnStep3Flip) {
    btnStep3Flip.addEventListener('click', () => {
      step3PostcardFlipped = !step3PostcardFlipped;
      renderRevealedPostcardFace();
    });
  }

  // ================= VAULT STORAGE & TOAST =================
  function showToast(msg) {
    const toast = document.getElementById('atelier-toast');
    const toastMsg = document.getElementById('atelier-toast-msg');
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = msg;
    toast.style.display = 'block';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.display = 'none';
    }, 2800);
  }

  function getPostcardStatePayload() {
    const fromVal = document.getElementById('postcard-from-input')?.value || 'Saanvi';
    const toVal = document.getElementById('postcard-to-input')?.value || 'Kabir';
    const noteVal = document.getElementById('postcard-back-message')?.value || '';
    const dateVal = document.getElementById('postcard-date-display')?.textContent || 'October 6, 2026';
    const titleVal = document.getElementById('postcard-title-input')?.value || '';
    const fontVal = document.getElementById('postcard-font-select')?.value || "'Caveat', cursive";
    const themeVal = document.getElementById('postcard-container')?.dataset.theme || 'candy';
    const orientVal = state.postcard.orientation || 'landscape';
    const vesselVal = state.vessel || 'envelope';
    const envIndex = state.envelopeIndex || '1';
    const boxIndex = state.boxIndex || '1';
    const stampKey = state.postcard.stamp || 'stamp_sending';

    let photoSrc = '';
    const imgEl = document.getElementById('postcard-image-preview');
    if (imgEl && imgEl.style.display !== 'none' && imgEl.src && !imgEl.src.startsWith('data:image/svg')) {
      if (imgEl.src.length < 90000) {
        photoSrc = imgEl.src;
      }
    }

    return {
      t: themeVal,
      o: orientVal,
      v: vesselVal,
      ei: envIndex,
      bi: boxIndex,
      sk: stampKey,
      f: fontVal,
      to: toVal,
      from: fromVal,
      msg: noteVal,
      d: dateVal,
      title: titleVal,
      img: photoSrc
    };
  }

  function saveCurrentPostcardToVault(isManual = false) {
    try {
      const vaultItems = JSON.parse(localStorage.getItem('between_us_vault_items') || '[]');
      const postcardData = getPostcardStatePayload();
      postcardData.id = 'pc_' + Date.now();
      postcardData.savedAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      // Deduplicate recent identical saves within 10 seconds
      if (vaultItems.length > 0 && (Date.now() - parseInt(vaultItems[0].id.replace('pc_', ''))) < 10000) {
        vaultItems[0] = postcardData;
      } else {
        vaultItems.unshift(postcardData);
      }

      if (vaultItems.length > 30) vaultItems.pop();
      localStorage.setItem('between_us_vault_items', JSON.stringify(vaultItems));

      if (isManual) {
        showToast('Saved to Vault ✓');
        if (btnStep3SaveVault) {
          const origHtml = btnStep3SaveVault.innerHTML;
          btnStep3SaveVault.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Saved to Vault ✓</span>
          `;
          setTimeout(() => {
            btnStep3SaveVault.innerHTML = origHtml;
          }, 2400);
        }
      }
    } catch (e) {
      console.error('Failed to save to vault:', e);
    }
  }

  function autoSaveToVault() {
    saveCurrentPostcardToVault(false);
  }

  if (btnStep3SaveVault) {
    btnStep3SaveVault.addEventListener('click', () => {
      saveCurrentPostcardToVault(true);
    });
  }

  // ================= DISPATCH SHARING MODAL =================
  function generateShareableUrl() {
    const payload = getPostcardStatePayload();
    const jsonStr = JSON.stringify(payload);
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?card=${encoded}`;
  }

  if (btnStep3Dispatch) {
    btnStep3Dispatch.addEventListener('click', () => {
      const iconEl = document.getElementById('dispatch-badge-icon');
      const titleEl = document.getElementById('dispatch-modal-title');
      const subEl = document.getElementById('dispatch-modal-sub');
      const copyDescEl = document.getElementById('dispatch-copy-desc');
      if (iconEl) iconEl.textContent = '💌';
      if (titleEl) titleEl.textContent = 'Dispatch Your Postcard';
      if (subEl) subEl.textContent = 'Share your thoughtful gift with someone special.';
      if (copyDescEl) copyDescEl.textContent = 'Anyone with this link can view and flip your postcard';
      const shareUrl = generateShareableUrl();
      if (dispatchUrlInput) dispatchUrlInput.value = shareUrl;
      if (dispatchModal) dispatchModal.style.display = 'flex';
      autoSaveToVault();
    });
  }

  if (btnCloseDispatchModal) {
    btnCloseDispatchModal.addEventListener('click', () => {
      if (dispatchModal) dispatchModal.style.display = 'none';
    });
  }

  if (dispatchModal) {
    dispatchModal.addEventListener('click', (e) => {
      if (e.target === dispatchModal) {
        dispatchModal.style.display = 'none';
      }
    });
  }

  function copyShareUrlToClipboard() {
    const shareUrl = dispatchUrlInput?.value || generateShareableUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Link copied to clipboard! ✓');
      }).catch(() => {
        fallbackCopyText(shareUrl);
      });
    } else {
      fallbackCopyText(shareUrl);
    }
  }

  function fallbackCopyText(text) {
    if (dispatchUrlInput) {
      dispatchUrlInput.select();
      document.execCommand('copy');
      showToast('Link copied to clipboard! ✓');
    }
  }

  if (btnDispatchCopyUrl) {
    btnDispatchCopyUrl.addEventListener('click', copyShareUrlToClipboard);
  }
  if (btnCopySmall) {
    btnCopySmall.addEventListener('click', copyShareUrlToClipboard);
  }

  if (btnDispatchSendFriends) {
    btnDispatchSendFriends.addEventListener('click', () => {
      const shareUrl = dispatchUrlInput?.value || generateShareableUrl();
      if (navigator.share) {
        navigator.share({
          title: 'A Little Something, from Me to You',
          text: 'I made a special handwritten postcard for you on Between Us ♡',
          url: shareUrl
        }).catch(err => {
          if (err.name !== 'AbortError') {
            openFallbackShare(shareUrl);
          }
        });
      } else {
        openFallbackShare(shareUrl);
      }
    });
  }

  function openFallbackShare(url) {
    const text = encodeURIComponent('I made a special handwritten postcard for you on Between Us ♡ ' + url);
    const waUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(waUrl, '_blank');
  }

  // ================= RECIPIENT PUBLIC EXPERIENCE =================
  let recipientPostcardFlipped = false;

  function checkUrlRecipientView() {
    try {
      let rawQuery = window.location.search;
      if (!rawQuery && window.location.hash) {
        rawQuery = '?' + window.location.hash.replace(/^[#?]+/, '');
      }
      if (!rawQuery && window.location.href.includes('?')) {
        rawQuery = window.location.href.slice(window.location.href.indexOf('?'));
      }
      const urlParams = new URLSearchParams(rawQuery);
      const cardParam = urlParams.get('card');
      const bouquetParam = urlParams.get('bouquet');
      const letterParam = urlParams.get('letter');
      if (cardParam) {
        const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(cardParam))));
        const cardData = JSON.parse(jsonStr);
        if (cardData.type === 'card' || cardData.type === 'greeting-card') {
          renderRecipientCardExperience(cardData);
        } else {
          renderRecipientExperience(cardData);
        }
      } else if (bouquetParam) {
        const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(bouquetParam))));
        const bqData = JSON.parse(jsonStr);
        renderRecipientBouquetExperience(bqData);
      } else if (letterParam) {
        const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(letterParam))));
        const letterData = JSON.parse(jsonStr);
        renderRecipientLetterExperience(letterData);
      }
    } catch (err) {
      console.warn('No valid recipient param found or decode error:', err);
    }
  }

  function renderRecipientExperience(data) {
    window.renderRecipientExperience = renderRecipientExperience;
    // Hide standard app stages
    if (splashScreen) splashScreen.style.display = 'none';
    if (appHeader) appHeader.style.display = 'none';
    if (appStage) appStage.style.display = 'none';
    if (appBottomNav) appBottomNav.style.display = 'none';

    const recipientStage = document.getElementById('recipient-stage');
    if (!recipientStage) return;
    recipientStage.style.display = 'flex';

    // Populate Dedication
    const recipientGreeting = document.getElementById('recipient-dedication-heading');
    const recipientFromToText = document.getElementById('recipient-from-to-text');
    if (recipientGreeting) recipientGreeting.textContent = 'A little something for you';
    if (recipientFromToText) {
      recipientFromToText.textContent = `From ${data.from || 'Someone Special'} to ${data.to || 'You'}`;
    }

    // Hide bouquet section if previously open
    const bouquetWrap = document.getElementById('recipient-bouquet-wrap');
    if (bouquetWrap) bouquetWrap.style.display = 'none';

    // Render Recipient Vessel
    const recipientVesselStage = document.getElementById('recipient-vessel-stage');
    if (recipientVesselStage) recipientVesselStage.style.display = 'block';

    const recipientVesselArt = document.getElementById('recipient-vessel-art');
    if (recipientVesselArt) {
      if (data.v === 'envelope') {
        const envIndex = data.ei || '1';
        recipientVesselArt.innerHTML = `
          <div style="position: relative; width: 220px; height: 150px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
            <img src="assets/flowers/peony.png" style="position: absolute; left: -34px; top: 16px; width: 70px; height: 70px; object-fit: contain; transform: rotate(-24deg); opacity: 0.95; pointer-events: none;" />
            <img src="assets/flowers/rose.png" style="position: absolute; right: -32px; top: 20px; width: 68px; height: 68px; object-fit: contain; transform: rotate(18deg); opacity: 0.95; pointer-events: none;" />
            <img src="assets/envelopes/env${envIndex}.jpg" style="width: 100%; height: 100%; object-fit: contain; position: relative; z-index: 2; filter: drop-shadow(0 8px 20px rgba(82, 19, 25, 0.14));" alt="Envelope" />
          </div>
        `;
      } else if (data.v === 'box') {
        const boxSrc = boxImages[data.bi || '1'] || 'assets/boxes/box1.jpg';
        recipientVesselArt.innerHTML = `
          <div style="position: relative; width: 180px; height: 180px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
            <img src="assets/flowers/peony.png" style="position: absolute; right: -24px; bottom: 10px; width: 64px; height: 64px; object-fit: contain; transform: rotate(16deg); opacity: 0.9; pointer-events: none;" />
            <img src="${boxSrc}" style="width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; filter: drop-shadow(0 8px 18px rgba(82, 19, 25, 0.14));" alt="Gift Box" />
          </div>
        `;
      } else {
        recipientVesselArt.innerHTML = `
          <div style="position: relative; width: 240px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
            <img src="assets/truck.png" style="width: 100%; height: auto; object-fit: contain; filter: drop-shadow(0 8px 20px rgba(82, 19, 25, 0.15));" alt="Delivery Truck" />
          </div>
        `;
      }
    }

    // Interactive Open
    const btnRecipientOpen = document.getElementById('btn-recipient-open');
    const recipientPostcardWrap = document.getElementById('recipient-postcard-wrap');
    const recipientCardInner = document.getElementById('recipient-card-inner');
    const btnRecipientFlip = document.getElementById('btn-recipient-flip');

    recipientPostcardFlipped = false;

    function renderRecipientCardFace() {
      if (!recipientCardInner) return;
      recipientCardInner.innerHTML = getPostcardFaceHtml(data, recipientPostcardFlipped);
    }

    if (btnRecipientOpen) {
      btnRecipientOpen.addEventListener('click', () => {
        if (recipientVesselStage) recipientVesselStage.style.display = 'none';
        if (recipientPostcardWrap) recipientPostcardWrap.style.display = 'block';
        renderRecipientCardFace();
      });
    }

    if (btnRecipientFlip) {
      btnRecipientFlip.addEventListener('click', () => {
        recipientPostcardFlipped = !recipientPostcardFlipped;
        renderRecipientCardFace();
      });
    }

    // Recipient Footer Actions
    const btnRecipientSaveVault = document.getElementById('btn-recipient-save-vault');
    if (btnRecipientSaveVault) {
      btnRecipientSaveVault.addEventListener('click', () => {
        try {
          const vaultItems = JSON.parse(localStorage.getItem('between_us_vault_items') || '[]');
          data.id = 'pc_' + Date.now();
          data.savedAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          vaultItems.unshift(data);
          localStorage.setItem('between_us_vault_items', JSON.stringify(vaultItems));
          showToast('Saved to your Keepsakes! ✓');
        } catch (e) {
          console.error(e);
        }
      });
    }

    const btnRecipientCreate = document.getElementById('btn-recipient-create');
    if (btnRecipientCreate) {
      btnRecipientCreate.textContent = '✨ Make Your Own Postcard';
      btnRecipientCreate.addEventListener('click', () => {
        window.location.href = window.location.pathname;
      });
    }
  }

  function renderRecipientBouquetExperience(data) {
    window.renderRecipientBouquetExperience = renderRecipientBouquetExperience;
    if (splashScreen) splashScreen.style.display = 'none';
    if (appHeader) appHeader.style.display = 'none';
    if (appStage) appStage.style.display = 'none';
    if (appBottomNav) appBottomNav.style.display = 'none';

    const recipientStage = document.getElementById('recipient-stage');
    if (!recipientStage) return;
    recipientStage.style.display = 'flex';

    // Populate Dedication
    const recipientGreeting = document.getElementById('recipient-dedication-heading');
    const recipientFromToText = document.getElementById('recipient-from-to-text');
    if (recipientGreeting) recipientGreeting.textContent = 'A little something for you';
    if (recipientFromToText) {
      recipientFromToText.textContent = `From ${data.from || 'Someone Special'} to ${data.to || 'You'}`;
    }

    // Hide vessel and postcard sections
    const vesselStage = document.getElementById('recipient-vessel-stage');
    const postcardWrap = document.getElementById('recipient-postcard-wrap');
    if (vesselStage) vesselStage.style.display = 'none';
    if (postcardWrap) postcardWrap.style.display = 'none';

    // Show bouquet section
    const bouquetWrap = document.getElementById('recipient-bouquet-wrap');
    const bouquetDisplay = document.getElementById('recipient-bouquet-display');
    if (bouquetWrap) bouquetWrap.style.display = 'flex';

    if (bouquetDisplay) {
      const rawFlowers = data.fl || data.flowers || [
        { f: 'Rose', file: 'rose.png' },
        { f: 'Peony', file: 'peony.png' },
        { f: "Baby's Breath", file: 'babys_breath.png' },
        { f: 'Lily', file: 'lily.png' },
        { f: 'Sunflower', file: 'sunflower.png' }
      ];
      const greenery = data.gr || data.greenery || ['eucalyptus', 'olive'];
      const total = rawFlowers.length;

      // Render Greenery Sprigs
      let grHtml = '';
      greenery.forEach((type, idx) => {
        const rot = idx % 2 === 0 ? -(22 + idx * 8) : (20 + idx * 9);
        const lft = idx % 2 === 0 ? 15 + idx * 10 : 55 - idx * 8;
        grHtml += `<img src="assets/greenery/${type}.svg" style="position: absolute; bottom: 80px; left: ${lft}%; transform: translateX(-50%) rotate(${rot}deg); width: 140px; height: 180px; object-fit: contain; opacity: 0.85; pointer-events: none;" />`;
      });

      // Render Stems Cluster
      let stemsHtml = '';
      rawFlowers.forEach((item, idx) => {
        const fFile = item.file || (item.f ? item.f.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.png' : 'rose.png');
        const fName = item.f || item.flower || 'Flower';
        const offsetPercent = total > 1 ? (idx / (total - 1)) * 100 : 50;
        const xPos = 20 + (offsetPercent * 0.6);
        const rot = -18 + (offsetPercent * 0.36);
        stemsHtml += `
          <div style="position: absolute; bottom: 30px; left: ${xPos}%; transform: translateX(-50%) rotate(${rot}deg); width: 85px; height: 230px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end;">
            <img src="assets/flowers/${fFile}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.06));" alt="${fName}" />
          </div>
        `;
      });

      bouquetDisplay.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%; overflow: hidden; display: flex; align-items: flex-end; justify-content: center;">
          <div style="position: absolute; inset: 0; pointer-events: none;">${grHtml}</div>
          <div style="position: relative; width: 100%; height: 100%;">${stemsHtml}</div>
          <div style="position: absolute; bottom: 42px; width: 56px; height: 16px; background: #C8AD8D; border-radius: 4px; border: 1px solid #A88D6D; z-index: 50; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 10px; color: #5B4125; letter-spacing: 0.5px;">୨୧</span>
          </div>
        </div>
      `;
    }

    // Wire unwrap note button
    const btnOpenNote = document.getElementById('btn-recipient-open-bouquet-note');
    if (btnOpenNote) {
      btnOpenNote.onclick = () => {
        if (!unfoldedOverlay) return;
        if (unfoldedTo) unfoldedTo.textContent = `To: ${data.to || 'You'}`;
        if (unfoldedFrom) unfoldedFrom.textContent = `From: ${data.from || 'Someone Special'}`;
        if (unfoldedNoteBodyText) unfoldedNoteBodyText.textContent = data.m || data.body || 'A little botanical bouquet handpicked just for you.';
        if (unfoldedCard) unfoldedCard.dataset.theme = data.th || data.theme || 'cream';
        unfoldedOverlay.style.display = 'flex';
      };
    }

    // Footer actions
    const btnSaveVault = document.getElementById('btn-recipient-save-vault');
    if (btnSaveVault) {
      btnSaveVault.onclick = () => {
        try {
          const vault = JSON.parse(localStorage.getItem('between_us_vault_items') || '[]');
          vault.unshift({
            type: 'bouquet',
            title: 'Botanical Bouquet',
            flowers: data.fl || data.flowers,
            greenery: data.gr || data.greenery,
            theme: data.th || data.theme || 'cream',
            to: data.to,
            from: data.from,
            body: data.m || data.body,
            date: data.d || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          });
          localStorage.setItem('between_us_vault_items', JSON.stringify(vault));
          btnSaveVault.textContent = 'Saved to Keepsakes ✓';
        } catch (e) {}
      };
    }

    const btnMakeOwn = document.getElementById('btn-recipient-create');
    if (btnMakeOwn) {
      btnMakeOwn.textContent = '✨ Make Your Own Bouquet';
      btnMakeOwn.onclick = () => {
        recipientStage.style.display = 'none';
        if (appHeader) appHeader.style.display = 'flex';
        if (appStage) appStage.style.display = 'block';
        if (appBottomNav) appBottomNav.style.display = 'flex';
        selectMedium('bouquet');
      };
    }
  }

  function renderRecipientLetterExperience(data) {
    window.renderRecipientLetterExperience = renderRecipientLetterExperience;
    if (splashScreen) splashScreen.style.display = 'none';
    if (appHeader) appHeader.style.display = 'none';
    if (appStage) appStage.style.display = 'none';
    if (appBottomNav) appBottomNav.style.display = 'none';

    let recipientStage = document.getElementById('recipient-experience-stage');
    if (!recipientStage) {
      recipientStage = document.createElement('div');
      recipientStage.id = 'recipient-experience-stage';
      recipientStage.className = 'recipient-experience-stage';
      document.body.appendChild(recipientStage);
    }
    recipientStage.style.display = 'flex';

    const toVal = data.to || 'You';
    const fromVal = data.from || 'Someone who loves you';
    const bodyVal = data.body || data.m || '';
    const themeVal = data.th || data.theme || 'crimson-heart';
    const fontVal = data.ff || data.fontFamily || "'Caveat', cursive";
    const sizeVal = data.fs || data.fontSize || 19;
    const envVal = data.env || data.envelope || 'maroon-lace';
    const sealVal = data.sl || data.seal || 'gold';
    const stickersVal = data.stk || data.stickers || [];

    const envColors = {
      'manila': '#D9C2A7',
      'vellum': '#ECE8E1',
      'maroon-lace': '#5C1D24',
      'charcoal': '#333333'
    };
    const sealColors = {
      'gold': '#C5A059',
      'cream': '#EFECE6',
      'maroon': '#6B202A'
    };

    const stickersHtml = stickersVal.map(st => `
      <div style="position: absolute; left: ${st.left}; top: ${st.top}; pointer-events: none;">
        <img src="${st.src}" style="max-width: 78px; max-height: 78px; object-fit: contain; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.22));" />
      </div>
    `).join('');

    recipientStage.innerHTML = `
      <div class="recipient-card-wrapper" style="padding: 24px 16px; text-align: center; max-width: 440px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 16px;">
        <div style="font-family:'Playfair Display', Georgia, serif; font-size:22px; font-weight:600; color:#521319;">
          A letter for you ♡
        </div>

        <!-- Sealed envelope view -->
        <div id="recip-letter-sealed-view" style="display:flex; flex-direction:column; align-items:center; gap:16px;">
          <div class="letter-sealed-envelope" style="width:240px; height:155px; box-shadow:0 10px 25px rgba(40,20,25,0.18);">
            <div class="sealed-env-body" style="background:${envColors[envVal] || '#5C1D24'};">
              <div class="sealed-env-flap"></div>
              <div class="sealed-wax-seal" style="background:${sealColors[sealVal] || '#C5A059'};"></div>
              <div class="sealed-env-to">To: <span>${escapeHtml(toVal)}</span></div>
            </div>
          </div>
          <button id="btn-recip-open-letter" class="btn-letter-unfold">
            <span class="unfold-heart">♡</span> Break the Seal &amp; Open Letter <span class="unfold-heart">♡</span>
          </button>
        </div>

        <!-- Unfolded letter view -->
        <div id="recip-letter-unfolded-view" style="display:none; flex-direction:column; align-items:center; gap:16px; width:100%;">
          <div class="letter-sheet theme-${themeVal}" style="margin: 0 auto; width:100%; box-shadow: 0 8px 24px rgba(40,20,25,0.15);">
            <div class="letter-inner-content">
              <div class="letter-header-row">
                <span class="letter-date">A Special Keepsake</span>
                <div class="letter-from-to">
                  <span>To: ${escapeHtml(toVal)}</span>
                  <span>From: ${escapeHtml(fromVal)}</span>
                </div>
              </div>
              <div style="font-family: ${fontVal}; font-size: ${sizeVal}px; line-height: 1.6; color: #2D181B; white-space: pre-wrap; word-break: break-word; min-height: 260px; text-align: left;">
                ${escapeHtml(bodyVal)}
              </div>
            </div>
            <div style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; overflow:hidden; border-radius:14px;">
              ${stickersHtml}
            </div>
          </div>

          <div style="display:flex; gap:10px; justify-content:center; width:100%; margin-top:8px;">
            <button id="btn-recip-letter-save" class="letter-action-btn secondary">Save to Keepsakes ♡</button>
            <button id="btn-recip-letter-create" class="letter-action-btn primary">Write Your Own Letter →</button>
          </div>
        </div>
      </div>
    `;

    const btnOpen = document.getElementById('btn-recip-open-letter');
    const sealedView = document.getElementById('recip-letter-sealed-view');
    const unfoldedView = document.getElementById('recip-letter-unfolded-view');
    if (btnOpen) {
      btnOpen.onclick = () => {
        sealedView.style.display = 'none';
        unfoldedView.style.display = 'flex';
      };
    }

    const btnSave = document.getElementById('btn-recip-letter-save');
    if (btnSave) {
      btnSave.onclick = () => {
        try {
          const vault = JSON.parse(localStorage.getItem('between_us_vault_items') || '[]');
          vault.unshift({
            type: 'letter',
            id: 'lt_' + Date.now(),
            title: `Letter from ${fromVal}`,
            to: toVal,
            from: fromVal,
            body: bodyVal,
            theme: themeVal,
            fontSize: sizeVal,
            fontFamily: fontVal,
            envelope: envVal,
            seal: sealVal,
            stickers: stickersVal,
            savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          });
          localStorage.setItem('between_us_vault_items', JSON.stringify(vault));
          btnSave.textContent = 'Saved to Keepsakes ♡';
        } catch (e) {}
      };
    }

    const btnCreate = document.getElementById('btn-recip-letter-create');
    if (btnCreate) {
      btnCreate.onclick = () => {
        recipientStage.style.display = 'none';
        if (appHeader) appHeader.style.display = 'flex';
        if (appStage) appStage.style.display = 'block';
        if (appBottomNav) appBottomNav.style.display = 'flex';
        selectMedium('letter');
      };
    }
  }

  function renderRecipientCardExperience(data) {
    window.renderRecipientCardExperience = renderRecipientCardExperience;
    if (splashScreen) splashScreen.style.display = 'none';
    if (appHeader) appHeader.style.display = 'none';
    if (appStage) appStage.style.display = 'none';
    if (appBottomNav) appBottomNav.style.display = 'none';

    let recipientStage = document.getElementById('recipient-experience-stage');
    if (!recipientStage) {
      recipientStage = document.createElement('div');
      recipientStage.id = 'recipient-experience-stage';
      recipientStage.className = 'recipient-experience-stage';
      document.body.appendChild(recipientStage);
    }
    recipientStage.style.display = 'flex';

    const toVal = data.to || 'You';
    const fromVal = data.from || 'Someone who loves you';
    const bodyVal = data.m || data.body || '';
    const themeVal = data.th || data.theme || 'crimson-romance';
    const fontVal = data.ff || data.fontFamily || "'Caveat', cursive";
    const sizeVal = data.fs || data.fontSize || 19;
    const vesselVal = data.v || data.vessel || 'envelope';
    const envVal = data.env || data.envelope || 'dusty-blue';
    const sealVal = data.sl || data.seal || 'gold-celestial';
    const boxIdx = data.bi || data.boxIndex || '1';
    const keepsakesVal = data.ks || data.insideKeepsakes || [];
    const coverElementsVal = data.cv || data.coverElements || [];

    let vesselHtml = '';
    if (vesselVal === 'envelope') {
      const envSrc = CARD_ENVELOPE_MAP[envVal] || 'assets/letter/envelopes/env_dusty_blue.jpg';
      const sealSrc = CARD_SEAL_MAP[sealVal] || 'assets/letter/seals/seal_gold_celestial.png';
      vesselHtml = `
        <div class="card-envelope-arriving-package" style="position:relative; width:240px; height:160px; margin:0 auto; cursor:pointer;">
          <img src="${envSrc}" style="width:100%; height:100%; object-fit:cover; border-radius:10px; box-shadow:0 12px 28px rgba(82,19,25,0.18);" alt="Envelope" />
          <img src="${sealSrc}" class="sealed-wax-seal" style="position:absolute; left:50%; top:54%; transform:translate(-50%, -50%); width:76px; height:76px; object-fit:contain; filter:drop-shadow(0 5px 12px rgba(0,0,0,0.36));" alt="Wax Seal" />
          <div style="position:absolute; bottom:14px; left:0; width:100%; text-align:center; font-family:'Caveat', cursive; font-size:18px; color:rgba(255,255,255,0.92); text-shadow:0 1px 3px rgba(0,0,0,0.5);">For ${escapeHtml(toVal)}</div>
        </div>
      `;
    } else if (vesselVal === 'box') {
      const boxSrc = boxImages[boxIdx] || 'assets/boxes/box1.jpg';
      vesselHtml = `
        <div style="position:relative; width:170px; height:170px; margin:0 auto; cursor:pointer;">
          <img src="${boxSrc}" style="width:100%; height:100%; object-fit:contain; mix-blend-mode:multiply; filter:drop-shadow(0 10px 22px rgba(82,19,25,0.18));" alt="Gift Box" />
        </div>
      `;
    } else {
      vesselHtml = `
        <div style="position:relative; width:230px; margin:0 auto; cursor:pointer; display:flex; flex-direction:column; align-items:center;">
          <img src="assets/truck.png" style="width:100%; height:auto; object-fit:contain; filter:drop-shadow(0 8px 20px rgba(82,19,25,0.15));" alt="Delivery Truck" />
          <p style="margin-top:8px; font-family:'Playfair Display', Georgia, serif; color:#521319; font-size:14px; font-weight:600;">Special Delivery Truck</p>
        </div>
      `;
    }

    recipientStage.innerHTML = `
      <div class="recipient-card-wrapper" style="padding: 24px 16px; text-align: center; max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 16px;">
        <div style="font-family:'Playfair Display', Georgia, serif; font-size:22px; font-weight:600; color:#521319;">
          A card for you ♡
        </div>

        <!-- Arriving vessel view -->
        <div id="recip-card-vessel-view" style="display:flex; flex-direction:column; align-items:center; gap:16px;">
          ${vesselHtml}
          <button id="btn-recip-open-card" class="btn-click-to-open">
            Click to Open ♡
          </button>
        </div>

        <!-- Revealed card view -->
        <div id="recip-card-revealed-view" style="display:none; flex-direction:column; align-items:center; gap:16px; width:100%;">
          <div id="recip-card-content-area" style="width:100%;"></div>
          <div style="display:flex; gap:10px; justify-content:center; width:100%; margin-top:8px;">
            <button id="btn-recip-card-flip" class="btn-flip-card-pill">
              <span id="recip-flip-text">View Cover</span>
            </button>
            <button id="btn-recip-card-save" class="letter-action-btn secondary">Save to Vault ♡</button>
            <button id="btn-recip-card-create" class="letter-action-btn primary">Design Your Own Card →</button>
          </div>
        </div>
      </div>
    `;

    let recipFace = 'inside';
    const contentArea = document.getElementById('recip-card-content-area');
    const flipText = document.getElementById('recip-flip-text');

    function renderRecipCard() {
      if (recipFace === 'inside') {
        flipText.textContent = 'View Cover';
        let ksHtml = '';
        keepsakesVal.forEach(item => {
          if (item.type === 'polaroid') {
            ksHtml += `
              <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width || 130}px;">
                <div class="placed-polaroid-frame">
                  <div class="polaroid-pin"></div>
                  <img src="${item.src}" class="polaroid-photo" alt="Memory" />
                  <div class="polaroid-caption">${escapeHtml(item.caption || 'Cherished Memory')}</div>
                </div>
              </div>
            `;
          } else if (item.type === 'flower') {
            ksHtml += `
              <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width || 90}px;">
                <img src="assets/flowers/${item.file}" class="placed-flower-img" alt="${item.name}" style="width:100%; height:auto; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.12)); pointer-events:none;" />
              </div>
            `;
          } else if (item.type === 'vinyl') {
            ksHtml += `
              <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width || 150}px;">
                <div class="vinyl-player-widget ${vinylIsPlaying ? 'is-playing' : ''}">
                  <div class="vinyl-sleeve">
                    <div class="vinyl-disc">
                      <div class="vinyl-center-label">
                        <span class="vinyl-label-title">Side A</span>
                        <span class="vinyl-label-sub">For ${escapeHtml(toVal)}</span>
                      </div>
                    </div>
                    <div class="vinyl-needle-arm"></div>
                  </div>
                  <div class="vinyl-player-controls">
                    <button type="button" class="vinyl-play-btn" title="${vinylIsPlaying ? 'Pause Record' : 'Play Record'}">${vinylIsPlaying ? '⏸' : '▶'}</button>
                    <span class="vinyl-track-info">Golden Hour (Acoustic)</span>
                  </div>
                </div>
              </div>
            `;
          } else if (item.type === 'sticker') {
            ksHtml += `
              <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width || 70}px;">
                <img src="assets/stickers/${item.file}" class="placed-sticker-img" alt="${item.name}" style="width:100%; height:auto; filter:drop-shadow(0 3px 8px rgba(0,0,0,0.18)); pointer-events:none;" />
              </div>
            `;
          }
        });

        contentArea.innerHTML = `
          <div class="card-inside-bifold theme-${themeVal}" style="margin:0 auto; box-shadow:0 12px 32px rgba(82, 19, 25, 0.18);">
            <div class="inside-left-panel" style="position:relative;">
              <div class="panel-watermark-label">Memories &amp; Keepsakes</div>
              <div class="inside-keepsakes-dropzone" style="position:relative; width:100%; height:100%;">
                ${ksHtml}
              </div>
            </div>
            <div class="inside-bifold-crease"></div>
            <div class="inside-right-panel">
              <div class="card-inside-note-header">
                <span class="card-note-label">To:</span>
                <span style="font-family:${fontVal}; font-size:18px; color:inherit; font-weight:600;">${escapeHtml(toVal)}</span>
              </div>
              <div style="font-family:${fontVal}; font-size:${sizeVal}px; line-height:1.65; color:inherit; white-space:pre-wrap; word-break:break-word; min-height:180px; padding:6px 0;">
                ${escapeHtml(bodyVal)}
              </div>
              <div class="card-inside-note-footer">
                <span class="card-note-label">From:</span>
                <span style="font-family:${fontVal}; font-size:18px; color:inherit; font-weight:600;">${escapeHtml(fromVal)}</span>
              </div>
            </div>
          </div>
        `;

        contentArea.querySelectorAll('.vinyl-play-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleVinylAudio();
          });
        });
      } else {
        flipText.textContent = 'View Inside';
        let cvHtml = '';
        coverElementsVal.forEach(item => {
          if (item.type === 'photo') {
            cvHtml += `
              <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width ? (typeof item.width === 'number' ? item.width + 'px' : item.width) : '55%'};">
                <img src="${item.src}" class="card-cover-photo-img" style="width:100%; height:auto; border-radius:6px; display:block;" />
              </div>
            `;
          } else if (item.type === 'text') {
            cvHtml += `
              <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width ? (typeof item.width === 'number' ? item.width + 'px' : item.width) : '60%'};">
                <div class="card-item-content card-text-content" style="font-family:${item.fontFamily || "'Caveat', cursive"}; font-size:${item.fontSize || 24}px; text-align:center;">
                  ${escapeHtml(item.text)}
                </div>
              </div>
            `;
          }
        });

        contentArea.innerHTML = `
          <div class="card-cover-canvas theme-${themeVal}" style="margin:0 auto; box-shadow:0 12px 32px rgba(82, 19, 25, 0.18);">
            <div class="card-cover-elements-layer">
              ${cvHtml}
            </div>
          </div>
        `;
      }
    }

    const btnOpen = document.getElementById('btn-recip-open-card');
    const vesselView = document.getElementById('recip-card-vessel-view');
    const revealedView = document.getElementById('recip-card-revealed-view');
    if (btnOpen) {
      btnOpen.onclick = () => {
        vesselView.style.display = 'none';
        revealedView.style.display = 'flex';
        renderRecipCard();
      };
    }
    const vesselWrap = vesselView ? vesselView.querySelector('.card-envelope-arriving-package, div[style*="cursor:pointer"]') : null;
    if (vesselWrap) {
      vesselWrap.onclick = () => {
        vesselView.style.display = 'none';
        revealedView.style.display = 'flex';
        renderRecipCard();
      };
    }

    const btnFlip = document.getElementById('btn-recip-card-flip');
    if (btnFlip) {
      btnFlip.onclick = () => {
        recipFace = recipFace === 'inside' ? 'cover' : 'inside';
        renderRecipCard();
      };
    }

    const btnSave = document.getElementById('btn-recip-card-save');
    if (btnSave) {
      btnSave.onclick = () => {
        try {
          const vault = JSON.parse(localStorage.getItem('between_us_vault_items') || '[]');
          vault.unshift({
            type: 'card',
            id: 'gc_' + Date.now(),
            title: `Card from ${fromVal}`,
            to: toVal,
            from: fromVal,
            body: bodyVal,
            theme: themeVal,
            coverElements: coverElementsVal,
            insideKeepsakes: keepsakesVal,
            fontSize: sizeVal,
            fontFamily: fontVal,
            vessel: vesselVal,
            envelope: envVal,
            seal: sealVal,
            boxIndex: boxIdx,
            savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          });
          localStorage.setItem('between_us_vault_items', JSON.stringify(vault));
          btnSave.textContent = 'Saved to Vault ✓';
        } catch (e) {}
      };
    }

    const btnCreate = document.getElementById('btn-recip-card-create');
    if (btnCreate) {
      btnCreate.onclick = () => {
        recipientStage.style.display = 'none';
        if (appHeader) appHeader.style.display = 'flex';
        if (appStage) appStage.style.display = 'block';
        if (appBottomNav) appBottomNav.style.display = 'flex';
        selectMedium('greeting-card');
      };
    }
  }

  // ================= VAULT ROOM DYNAMIC LIST =================
  function renderVaultItems() {
    const vaultGrid = document.getElementById('vault-items-grid');
    if (!vaultGrid) return;

    const vaultItems = JSON.parse(localStorage.getItem('between_us_vault_items') || '[]');
    if (vaultItems.length === 0) {
      vaultGrid.innerHTML = `
        <div class="vault-empty-state">
          <div class="vault-empty-icon">🔖</div>
          <h4 style="font-family:'Playfair Display', Georgia, serif; font-size:18px; color:#521319; margin:0 0 6px 0;">Your vault is waiting</h4>
          <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:14px; font-style:italic; color:#8E4A56; margin:0;">
            Any postcard, letter, or card you design will be automatically preserved here.
          </p>
        </div>
      `;
      return;
    }

    vaultGrid.innerHTML = vaultItems.map((item, idx) => {
      let iconHtml = '💌';
      if (item.type === 'bouquet') {
        iconHtml = `<img src="assets/medium_bouquet.png" style="width:100%; height:100%; object-fit:contain;" alt="Bouquet" />`;
      } else if (item.type === 'letter') {
        iconHtml = `<img src="assets/medium_letter.png" style="width:100%; height:100%; object-fit:contain;" alt="Letter" />`;
      } else if (item.type === 'card' || item.type === 'greeting-card') {
        iconHtml = `<img src="assets/medium_card.png" style="width:100%; height:100%; object-fit:contain;" alt="Card" />`;
      } else if (item.v === 'truck') {
        iconHtml = `<img src="assets/truck.png" style="width:100%; height:100%; object-fit:contain;" alt="Truck" />`;
      } else if (item.v === 'box') {
        const boxSrc = boxImages[item.bi || '1'] || 'assets/boxes/box1.jpg';
        iconHtml = `<img src="${boxSrc}" style="width:100%; height:100%; object-fit:contain; mix-blend-mode:multiply;" alt="Box" />`;
      } else {
        const envIndex = item.ei || '1';
        iconHtml = `<img src="assets/envelopes/env${envIndex}.jpg" style="width:100%; height:100%; object-fit:contain;" alt="Envelope" />`;
      }

      return `
        <div class="vault-item-card">
          <div class="vault-item-icon">
            ${iconHtml}
          </div>
          <div class="vault-item-info">
            <h5 class="vault-item-title">${escapeHtml(item.title || (item.type === 'bouquet' ? 'Botanical Bouquet' : (item.type === 'letter' ? 'Keepsake Letter' : (item.type === 'card' ? 'Greeting Card' : 'Handwritten Postcard'))))}</h5>
            <p class="vault-item-dedication">To: ${escapeHtml(item.to || 'Someone Special')} • From: ${escapeHtml(item.from || 'Me')}</p>
            <p class="vault-item-date">Saved on ${item.savedAt || item.date || 'Recently'}</p>
          </div>
          <button class="btn-vault-view" data-vault-idx="${idx}">View</button>
        </div>
      `;
    }).join('');

    // Attach click events to vault view buttons
    vaultGrid.querySelectorAll('.btn-vault-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.vaultIdx);
        const item = vaultItems[idx];
        if (item) {
          if (item.type === 'bouquet') {
            renderRecipientBouquetExperience(item);
          } else if (item.type === 'letter') {
            renderRecipientLetterExperience(item);
          } else if (item.type === 'card' || item.type === 'greeting-card') {
            renderRecipientCardExperience(item);
          } else {
            renderRecipientExperience(item);
          }
        }
      });
    });
  }

  // Hook Vault Room Rendering into navigation tabs
  const vaultNavTab = document.querySelector('.nav-tab[data-room="vault"]');
  if (vaultNavTab) {
    vaultNavTab.addEventListener('click', renderVaultItems);
  }

  // Check Recipient URL param on load
  checkUrlRecipientView();

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

  // URL Param direct deep-linking (e.g. ?nosplash=1&medium=bouquet&step=arrange)
  try {
    let rawQuery = window.location.search;
    if (!rawQuery && window.location.hash) {
      rawQuery = '?' + window.location.hash.replace(/^[#?]+/, '');
    } else if (!rawQuery && window.location.href.includes('?')) {
      rawQuery = window.location.href.slice(window.location.href.indexOf('?'));
    }
    const urlParams = new URLSearchParams(rawQuery);
    if (urlParams.has('nosplash') || window.location.href.includes('nosplash')) {
      if (splashScreen) splashScreen.style.display = 'none';
      if (appHeader) appHeader.style.display = 'flex';
      if (appStage) appStage.style.display = 'block';
      if (appBottomNav) appBottomNav.style.display = 'flex';
    }
    const paramMedium = urlParams.get('medium') || (window.location.href.includes('medium=bouquet') ? 'bouquet' : (window.location.href.includes('medium=letter') ? 'letter' : (window.location.href.includes('medium=card') ? 'card' : (window.location.href.includes('medium=greeting-card') ? 'greeting-card' : (window.location.href.includes('medium=postcard') ? 'postcard' : null)))));
    if (paramMedium && typeof selectMedium === 'function') {
      selectMedium(paramMedium);
    }
    const paramStep = urlParams.get('step') || urlParams.get('pstep') || urlParams.get('lstep') || urlParams.get('cstep');
    if (paramMedium === 'bouquet' && paramStep && typeof setBouquetStep === 'function') {
      setBouquetStep(paramStep);
    }
    if (paramMedium === 'letter' && paramStep && typeof setLetterStep === 'function') {
      const stepNum = parseInt(paramStep, 10);
      setLetterStep(stepNum);
    }
    if ((paramMedium === 'card' || paramMedium === 'greeting-card') && paramStep && typeof setCardStep === 'function') {
      const stepNum = parseInt(paramStep, 10);
      setCardStep(stepNum);
    }
    const paramCardTheme = urlParams.get('ctheme');
    if (paramCardTheme && state.greetingCard) {
      state.greetingCard.theme = paramCardTheme;
      if (cardCoverCanvas) cardCoverCanvas.className = `card-cover-canvas theme-${paramCardTheme}`;
      if (cardInsideBifold) cardInsideBifold.className = `card-inside-bifold theme-${paramCardTheme}`;
      document.querySelectorAll('.card-theme-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.cardTheme === paramCardTheme);
      });
    }
    if ((paramMedium === 'card' || paramMedium === 'greeting-card') && (urlParams.has('copen') || urlParams.has('revealed'))) {
      if (typeof openCardInPreview === 'function') openCardInPreview();
    }
    if (urlParams.has('demo_card') && state.greetingCard) {
      state.greetingCard.insideKeepsakes = [
        { id: 'pol_1', type: 'polaroid', src: 'assets/medium_letter.png', caption: 'Forever & Always', x: 8, y: 12, width: 135 },
        { id: 'fl_1', type: 'flower', name: 'Lily', file: 'lily.png', x: 45, y: 15, width: 95 },
        { id: 'vn_1', type: 'vinyl', title: 'Golden Hour (Acoustic)', x: 10, y: 55, width: 155 },
        { id: 'st_1', type: 'sticker', name: 'Pink Hearts', file: 'sticker_hearts_pink.png', x: 55, y: 64, width: 72 }
      ];
      if (typeof renderInsideKeepsakes === 'function') renderInsideKeepsakes();
      if (state.greetingCard.step === 4 && typeof renderCardRevealedDisplay === 'function') {
        renderCardRevealedDisplay();
      }
    }
    const paramTheme = urlParams.get('theme');
    if (paramTheme && state.letter) {
      state.letter.theme = paramTheme;
      if (letterSheet) letterSheet.className = `letter-sheet theme-${paramTheme}`;
      document.querySelectorAll('.letter-theme-circle-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.theme === paramTheme);
      });
    }
    const paramText = urlParams.get('text');
    if (paramText && letterTextarea) {
      letterTextarea.value = decodeURIComponent(paramText);
      state.letter.body = letterTextarea.value;
      if (typeof autoResizeLetterTextarea === 'function') autoResizeLetterTextarea();
    }
    if (urlParams.has('unfold') && state.letter && state.letter.step === 3) {
      if (typeof btnLetterOpenUnfold !== 'undefined' && btnLetterOpenUnfold) {
        btnLetterOpenUnfold.click();
      }
    }
    const paramEnv = urlParams.get('env');
    if (paramEnv && state.letter) {
      state.letter.envelope = paramEnv;
      document.querySelectorAll('#letter-panel-envelope .env-card-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.env === paramEnv);
      });
      if (typeof updateLetterEnvPreview === 'function') updateLetterEnvPreview();
    }
    const paramSeal = urlParams.get('seal');
    if (paramSeal && state.letter) {
      state.letter.seal = paramSeal;
      document.querySelectorAll('#letter-panel-envelope .seal-pick-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.seal === paramSeal);
      });
      if (typeof updateLetterEnvPreview === 'function') updateLetterEnvPreview();
    }
    if (paramMedium === 'postcard' && paramStep && typeof setPostcardStep === 'function') {
      const stepNum = parseInt(paramStep, 10);
      setPostcardStep(stepNum);
    }
    const paramVessel = urlParams.get('vessel');
    if (paramVessel) {
      state.vessel = paramVessel;
      document.querySelectorAll('.vessel-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.vessel === paramVessel);
      });
      if (typeof updateVesselLivePreview === 'function') updateVesselLivePreview();
      if (typeof renderStep3Preview === 'function') renderStep3Preview();
    }
    if (urlParams.has('revealed')) {
      const vesselDisplay = document.getElementById('step3-vessel-display');
      const revealSection = document.getElementById('step3-postcard-reveal');
      const toggleBtn = document.getElementById('btn-step3-toggle-open');
      if (vesselDisplay) vesselDisplay.style.display = 'none';
      if (revealSection) revealSection.style.display = 'block';
      if (toggleBtn) toggleBtn.textContent = 'Package Up ♡';
      if (typeof renderRevealedPostcardFace === 'function') renderRevealedPostcardFace();
    }
    if (urlParams.has('dispatch')) {
      const modal = document.getElementById('dispatch-modal');
      if (modal) modal.style.display = 'flex';
    }
    if (urlParams.has('unfold')) {
      if (typeof openBouquetUnfoldedNote === 'function') openBouquetUnfoldedNote();
    }
  } catch (err) {}

});
