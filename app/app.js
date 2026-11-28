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
      theme: 'gingham-pressed',
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
      paperTone: 'vanilla',
      borderStyle: 'classic',
      stickerTarget: 'inside',
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
    if (window.isRecipientMode) return;
    if (!splashScreen || splashScreen.dataset.opened === 'true') return;
    splashScreen.dataset.opened = 'true';
    splashScreen.style.opacity = '0';
    splashScreen.style.transform = 'scale(1.02)';
    setTimeout(() => {
      if (window.isRecipientMode) return;
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
    return (typeof updateActiveDispatchUrl === 'function') 
      ? updateActiveDispatchUrl(state.letter.to ? 'for-' + state.letter.to : 'for-you')
      : window.location.href;
  }

  function openLetterDispatchModal() {
    if (typeof openUnifiedDispatchModal === 'function') {
      openUnifiedDispatchModal('letter');
    }
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
    return (typeof updateActiveDispatchUrl === 'function') 
      ? updateActiveDispatchUrl(state.bouquet.noteTo ? 'for-' + state.bouquet.noteTo : 'for-you')
      : window.location.href;
  }

  function openBouquetDispatchModal() {
    if (typeof openUnifiedDispatchModal === 'function') {
      openUnifiedDispatchModal('bouquet');
    }
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

  // Segmented Switcher & Stage Elements
  const cardViewSegmentedWrapper = document.getElementById('card-view-segmented-wrapper');
  const cardViewSegmentedToggle = document.getElementById('card-view-segmented-toggle');
  const btnCardToggleCover = document.getElementById('btn-card-toggle-cover');
  const btnCardToggleInside = document.getElementById('btn-card-toggle-inside');

  // Step Panels
  const cardPanelCover = document.getElementById('card-panel-cover');
  const cardPanelInside = document.getElementById('card-panel-inside');
  const cardPanelDelivery = document.getElementById('card-panel-delivery');
  const cardPanelPreview = document.getElementById('card-panel-preview');

  // Step 1: Cover Elements
  const cardCoverCanvas = document.getElementById('card-cover-canvas');
  const cardCoverOuterFrame = document.getElementById('card-cover-outer-frame');
  const cardCoverElementsLayer = document.getElementById('card-cover-elements-layer');
  const cardThemeBtns = document.querySelectorAll('.card-theme-btn');
  const btnThemePrev = document.getElementById('btn-theme-prev');
  const btnThemeNext = document.getElementById('btn-theme-next');
  const cardThemeCounter = document.getElementById('card-theme-counter');
  const cardCoverPhotoInput = document.getElementById('card-cover-photo-input');
  const btnCardAddCoverPhoto = document.getElementById('btn-card-add-cover-photo');
  const btnCardAddCoverText = document.getElementById('btn-card-add-cover-text');
  const btnCardAddCoverSticker = document.getElementById('btn-card-add-cover-sticker');
  const cardFontSelect = document.getElementById('card-font-select');
  const btnCardFontMinus = document.getElementById('btn-card-font-minus');
  const btnCardFontPlus = document.getElementById('btn-card-font-plus');
  const btnCardToStep2 = document.getElementById('btn-card-to-step2');

  // Step 2: Inside Elements
  const cardInsideBifold = document.getElementById('card-inside-bifold');
  const cardInsideItemsOverlay = document.getElementById('card-inside-items-overlay');
  const btnInsidePrev = document.getElementById('btn-inside-prev');
  const btnInsideNext = document.getElementById('btn-inside-next');
  const cardInsideCounter = document.getElementById('card-inside-counter');
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

  const cardPaperBtns = document.querySelectorAll('.card-paper-btn');
  const cardBorderOptionBtns = document.querySelectorAll('.card-border-option-btn');

  const cardFlowersPopup = document.getElementById('card-flowers-popup');
  const cardFlowersPopupGrid = document.getElementById('card-flowers-popup-grid');
  const btnCloseFlowerPopup = document.getElementById('btn-close-flower-popup');
  const btnFlowerScrollLeft = document.getElementById('btn-flower-scroll-left');
  const btnFlowerScrollRight = document.getElementById('btn-flower-scroll-right');

  const cardStickersPopup = document.getElementById('card-stickers-popup');
  const cardStickersPopupGrid = document.getElementById('card-stickers-popup-grid');
  const btnCloseStickerPopup = document.getElementById('btn-close-sticker-popup');

  const cardVinylSongModal = document.getElementById('card-vinyl-song-modal');
  const btnCloseVinylModal = document.getElementById('btn-close-vinyl-modal');
  const vinylPresetsList = document.getElementById('vinyl-presets-list');
  const vinylCustomTitleInput = document.getElementById('vinyl-custom-title-input');
  const vinylCustomDedicationInput = document.getElementById('vinyl-custom-dedication-input');
  const vinylAudioFileInput = document.getElementById('vinyl-audio-file-input');
  const btnConfirmVinylSong = document.getElementById('btn-confirm-vinyl-song');

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

  // 30 User Curated Verified Real Audio Tracks (Playable Apple Music Streams)
  const CURATED_VINYL_TRACKS = [
    {
      num: 1,
      id: 'die-with-a-smile',
      title: 'Die With A Smile',
      artist: 'Lady Gaga & Bruno Mars',
      album: 'Die With A Smile - Single',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/11/ae/f2/11aef294-f57c-bab9-c9fc-529162984e62/24UMGIM85348.rgb.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/07/6a/99/076a99ed-b946-431b-6f1f-54fa187ca5bd/mzaf_8102882277995122875.plus.aac.p.m4a'
    },
    {
      num: 2,
      id: 'here-with-me',
      title: 'Here With Me',
      artist: 'd4vd',
      album: 'Petals to Thorns',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d6/83/1a/d6831a94-4e8f-5b23-df44-a313eb358257/23UMGIM33457.rgb.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bf/a3/6d/bfa36d9c-8e41-e05f-8a2b-970c9b21c695/mzaf_9987737564511061938.plus.aac.p.m4a'
    },
    {
      num: 3,
      id: 'i-said-i-love-you-first',
      title: 'I Said I Love You First',
      artist: 'Selena Gomez & benny blanco',
      album: 'I Said I Love You First',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/23/05/65/23056516-0ba3-97d6-b1be-55e5d1bd209b/25UMGIM10095.rgb.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9e/47/e9/9e47e910-33d3-5e8e-da70-bb95f4912147/mzaf_15783254037702249248.plus.aac.p.m4a'
    },
    {
      num: 4,
      id: 'glue-song',
      title: 'Glue Song (feat. Clairo)',
      artist: 'beabadoobee',
      album: 'Glue Song (feat. Clairo) - Single',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/84/07/1d/84071d8e-2877-6068-9025-db2ee93c83c7/196922429125_Cover.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8d/13/0e/8d130e3e-b49b-15d7-9443-97aa50439e57/mzaf_16213972116878709749.plus.aac.p.m4a'
    },
    {
      num: 5,
      id: 'lover',
      title: 'Lover',
      artist: 'Taylor Swift',
      album: 'Lover',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3d/ab/493dab54-f920-9043-6181-80993b8116c9/19UMGIM53909.rgb.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e0/db/47/e0db47b0-7f70-0631-0414-cd4777d2fb3e/mzaf_6362891154838442638.plus.aac.p.m4a'
    },
    {
      num: 6,
      id: 'cant-help-falling-in-love',
      title: "Can't Help Falling in Love",
      artist: 'Elvis Presley',
      album: 'The Essential Elvis Presley',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3e/63/93/3e6393fb-5fe2-1ef4-1c0d-6452919a351c/828768904824.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/11/23/69/112369f6-6645-e9ec-8019-e06e3efb160d/mzaf_14601922769880394709.plus.aac.p.m4a'
    },
    {
      num: 7,
      id: 'count-on-me',
      title: 'Count on Me',
      artist: 'Bruno Mars',
      album: 'Doo-Wops & Hooligans',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/52/b1/45/52b1452b-229e-78db-231b-7b43fa0077cc/075679956491.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5e/92/52/5e9252df-60a0-1125-a172-b815aba4d091/mzaf_2590488776063542214.plus.aac.p.m4a'
    },
    {
      num: 8,
      id: 'ill-be-there-for-you',
      title: "I'll Be There for You",
      artist: 'The Rembrandts',
      album: 'The Rembrandts: L.P.',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/10/b0/d0/10b0d0fd-008c-b493-b9e2-ac579eb87393/mzi.unizvawf.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d1/e4/9e/d1e49e0b-ff45-ed0e-fa77-5b6e9a5a7ecd/mzaf_10467587259594931193.plus.aac.p.m4a'
    },
    {
      num: 9,
      id: 'perfect',
      title: 'Perfect',
      artist: 'Ed Sheeran',
      album: '÷ (Deluxe)',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c7/ba/bc/c7babc66-f598-aaa6-bcf6-307281795817/mzaf_16337361235117168274.plus.aac.p.m4a'
    },
    {
      num: 10,
      id: 'yellow',
      title: 'Yellow',
      artist: 'Coldplay',
      album: 'Parachutes',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/93/8c/f5938c49-964c-31d1-4b33-78b634f71fb7/190295978075.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/66/f3/1a/66f31a76-a6ed-cb4c-f353-23310a7ae9a8/mzaf_10593596652344378873.plus.aac.p.m4a'
    },
    {
      num: 11,
      id: 'iris',
      title: 'Iris',
      artist: 'Goo Goo Dolls',
      album: 'Dizzy Up the Girl',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2c/13/18/2c131801-00af-58b1-3cc2-13abf4ad5416/093624919162.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/60/17/35/60173512-3d5c-1d6f-549e-d8ddafa93e07/mzaf_5281658494050788067.plus.aac.p.m4a'
    },
    {
      num: 12,
      id: 'photograph',
      title: 'Photograph',
      artist: 'Ed Sheeran',
      album: 'x (Wembley Edition)',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2d/36/f9/2d36f9a7-2c3e-ce0f-7fb6-036feecb221f/825646974450.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/4f/6a/114f6ad0-165c-1e3c-8fbd-df4707d7ae26/mzaf_12480083080052535279.plus.aac.p.m4a'
    },
    {
      num: 13,
      id: 'adore-you',
      title: 'Adore You',
      artist: 'Harry Styles',
      album: 'Fine Line',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2b/c4/c9/2bc4c9d4-3bc6-ab13-3f71-df0b89b173de/886448022213.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/fe/16/73/fe1673d4-ebd7-91b8-f770-b5e7dae1808c/mzaf_907220311258391060.plus.aac.p.m4a'
    },
    {
      num: 14,
      id: 'you-me',
      title: 'you+me=<3',
      artist: 'Olivia Rodrigo',
      album: 'you seem pretty sad for a girl so in love',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b9/92/51/b9925128-dac6-2cef-5674-d5ebbe1a4e83/26UMGIM75556.rgb.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/70/fc/38/70fc381b-1b14-28a3-34a4-050588d2dc46/mzaf_9301241217597877382.plus.aac.p.m4a'
    },
    {
      num: 15,
      id: 'invisible-string',
      title: 'invisible string',
      artist: 'Taylor Swift',
      album: 'folklore',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/7c/04/ba/7c04ba17-2ff8-21b3-0ac0-7d141f86e924/20UMGIM64216.rgb.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f4/14/80/f4148046-efae-5a04-0325-0b4f736756fb/mzaf_1042587197761373143.plus.aac.p.m4a'
    },
    {
      num: 16,
      id: 'enchanted',
      title: 'Enchanted',
      artist: 'Taylor Swift',
      album: 'Speak Now',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d4/23/57/d423579f-24f7-5c82-ed10-fbfd21ceef25/10UMDIM00487.rgb.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/74/3c/e9/743ce91a-fa0d-1b7a-8558-85c4004022d2/mzaf_16021923754792372642.plus.aac.p.m4a'
    },
    {
      num: 17,
      id: 'loml',
      title: 'loml',
      artist: 'Taylor Swift',
      album: 'THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a3/8a/8d/a38a8de5-ae11-154c-dca5-221e6549caee/24UMGIM44778.rgb.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b5/d0/e6/b5d0e6df-7280-7392-9203-7cbbb108b22e/mzaf_5532732726143458150.plus.aac.p.m4a'
    },
    {
      num: 18,
      id: 'actually-romantic',
      title: 'Actually Romantic',
      artist: 'Taylor Swift',
      album: 'The Life of a Showgirl',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/30/0c/5a/300c5a57-d3be-a170-f880-f63380ca6312/25UM1IM19577.rgb.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/12/b3/3f/12b33f79-9cd8-8aef-3ab9-a9df241058bd/mzaf_9797782389776903083.plus.aac.p.m4a'
    },
    {
      num: 19,
      id: 'a-sky-full-of-stars',
      title: 'A Sky Full of Stars',
      artist: 'Coldplay',
      album: 'Ghost Stories',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/60/90/ad/6090adc3-8863-861d-afcc-23c55c6fe5da/dj.vmtulfyu.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f1/24/d0/f124d058-5d43-73ca-79e4-36f5eb42b172/mzaf_12358370529108063354.plus.aac.p.m4a'
    },
    {
      num: 20,
      id: 'feelslikeimfallinginlove',
      title: 'feelslikeimfallinginlove',
      artist: 'Coldplay',
      album: 'Moon Music',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/af/3c/0f/af3c0fe2-1c4f-8499-67a8-14a8e41fdbf8/5021732410535.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/24/b6/b4/24b6b452-f1d3-1641-96d7-a6cf75de81c1/mzaf_4877748280762124077.plus.aac.p.m4a'
    },
    {
      num: 21,
      id: 'something-just-like-this',
      title: 'Something Just Like This',
      artist: 'The Chainsmokers & Coldplay',
      album: 'Memories...Do Not Open',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9d/56/6f/9d566f55-5253-bed6-5c31-df952dae649d/886446379289.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/64/7f/96/647f9601-aa94-3599-6c73-0143510b8b92/mzaf_13538528720942742126.plus.aac.p.m4a'
    },
    {
      num: 22,
      id: 'paris',
      title: 'Paris',
      artist: 'The Chainsmokers',
      album: 'Memories...Do Not Open',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9d/56/6f/9d566f55-5253-bed6-5c31-df952dae649d/886446379289.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1f/da/a7/1fdaa7c3-9af3-bd5f-9048-406a31e21c1d/mzaf_14744732617925969794.plus.aac.p.m4a'
    },
    {
      num: 23,
      id: 'you-and-i',
      title: 'You & I',
      artist: 'One Direction',
      album: 'Midnight Memories (Deluxe Edition)',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/66/75/88/6675882c-3685-2b6b-f9de-c6d3e06602b5/dj.fuklqvvg.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c2/e8/e0/c2e8e031-0855-c419-39d5-408f0c0069b1/mzaf_1784843304112430882.plus.aac.p.m4a'
    },
    {
      num: 24,
      id: 'close-to-you',
      title: 'Close to You',
      artist: 'Gracie Abrams',
      album: 'The Secret of Us',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/52/9a/a7/529aa76f-5d60-cd81-9eb0-0eb521de861d/24UMGIM43968.rgb.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4d/63/ec/4d63ec08-5018-2f90-4095-db0961ec292f/mzaf_4896725712962603390.plus.aac.p.m4a'
    },
    {
      num: 25,
      id: 'about-you',
      title: 'About You',
      artist: 'The 1975',
      album: 'Being Funny In A Foreign Language',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1f/c7/98/1fc7988e-0a39-5724-1390-e45246250e24/198704825934_Cover.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d0/8c/64/d08c6440-e727-10ab-589c-e36d5afea47e/mzaf_15879604028025493401.plus.aac.p.m4a'
    },
    {
      num: 26,
      id: 'ribs',
      title: 'Ribs',
      artist: 'Lorde',
      album: 'Pure Heroine',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/96/a5/09/96a50916-169b-724c-b722-b8c474406352/13UAAIM68691.rgb.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/13/8c/1a/138c1a93-5fdf-f1a3-c288-c0fd8d7c8d2f/mzaf_12940840614985303434.plus.aac.p.m4a'
    },
    {
      num: 27,
      id: 'moonlight',
      title: 'Moonlight',
      artist: 'Ariana Grande',
      album: 'Dangerous Woman',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/fc/38/e6/fc38e60e-02f5-882d-689b-f8f40f842a3e/16UMGIM12432.rgb.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/be/f1/a7/bef1a709-50c7-6464-a5df-066d557b5d7a/mzaf_6336835299570766981.plus.aac.p.m4a'
    },
    {
      num: 28,
      id: 'i-like-me-better',
      title: 'i like me better',
      artist: 'Lauv',
      album: 'I met you when I was 18. (the playlist)',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5c/3d/e5/5c3de510-1123-0da6-9531-318d9597159c/5056167107347_Cover.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/12/49/cc/1249cc81-a570-f4fe-ad01-c9d9fddf5601/mzaf_10704657862018478118.plus.aac.p.m4a'
    },
    {
      num: 29,
      id: 'just-the-way-you-are',
      title: 'Just the Way You Are',
      artist: 'Billy Joel',
      album: 'The Essential Billy Joel',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f0/7a/54/f07a54ab-3ebc-6813-e515-86200b8138fc/dj.uthntyfe.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/12/d2/c9/12d2c929-e387-ccbd-6678-c85075024db0/mzaf_15566485760020786632.plus.aac.p.m4a'
    },
    {
      num: 30,
      id: 'sailor-song',
      title: 'Sailor Song',
      artist: 'Gigi Perez',
      album: 'Sailor Song - Single',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/25/d4/96/25d49699-acc0-401f-a7cc-d7697339a474/24UM1IM03751.rgb.jpg/100x100bb.jpg',
      audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6d/fe/18/6dfe184e-7612-f171-0356-0b7a84112e9a/mzaf_9760607751711758843.plus.aac.p.m4a'
    }
  ];

  const VERIFIED_TRENDING_TRACKS = CURATED_VINYL_TRACKS;

  // Active Audio Controller for Vinyl Player & Audition Previews
  let mainVinylAudio = null;
  let auditionAudio = null;
  let currentlyAuditioningUrl = null;
  let vinylIsPlaying = false;

  async function searchAppleMusicTracks(query) {
    if (!query || !query.trim()) return [];
    try {
      const resp = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query.trim())}&media=music&entity=song&limit=10`);
      if (!resp.ok) return [];
      const data = await resp.json();
      return (data.results || []).map(r => ({
        id: String(r.trackId),
        title: r.trackName,
        artist: r.artistName,
        album: r.collectionName,
        artwork: r.artworkUrl100 || r.artworkUrl60,
        audioSrc: r.previewUrl
      }));
    } catch (err) {
      console.warn('Music search error:', err);
      return [];
    }
  }

  function toggleAuditionSong(audioSrc, btnEl) {
    if (!audioSrc) return;
    if (auditionAudio && currentlyAuditioningUrl === audioSrc && !auditionAudio.paused) {
      auditionAudio.pause();
      if (btnEl) {
        btnEl.innerHTML = '▶';
        btnEl.classList.remove('is-playing');
      }
      return;
    }
    if (auditionAudio) {
      auditionAudio.pause();
    }
    stopVinylAudio();

    auditionAudio = new Audio(audioSrc);
    currentlyAuditioningUrl = audioSrc;
    document.querySelectorAll('.btn-audition-play').forEach(b => {
      b.innerHTML = '▶';
      b.classList.remove('is-playing');
    });
    if (btnEl) {
      btnEl.innerHTML = '⏸';
      btnEl.classList.add('is-playing');
    }

    auditionAudio.play().catch(e => console.warn('Audition play prevented:', e));
    auditionAudio.onended = () => {
      if (btnEl) {
        btnEl.innerHTML = '▶';
        btnEl.classList.remove('is-playing');
      }
      currentlyAuditioningUrl = null;
    };
  }

  function startVinylAudio(customItem = null) {
    const vinylItem = customItem || (state.greetingCard.insideKeepsakes || []).find(i => i.type === 'vinyl');
    if (!vinylItem) return;

    if (auditionAudio) {
      auditionAudio.pause();
      document.querySelectorAll('.btn-audition-play').forEach(b => {
        b.innerHTML = '▶';
        b.classList.remove('is-playing');
      });
    }

    const audioUrl = vinylItem.audioSrc || (VERIFIED_TRENDING_TRACKS[0] && VERIFIED_TRENDING_TRACKS[0].audioSrc);
    if (!audioUrl) return;

    if (!mainVinylAudio || mainVinylAudio.src !== audioUrl) {
      if (mainVinylAudio) mainVinylAudio.pause();
      mainVinylAudio = new Audio(audioUrl);
      mainVinylAudio.loop = true;
    }

    mainVinylAudio.play().then(() => {
      vinylIsPlaying = true;
      document.querySelectorAll('.vinyl-disc-widget, .vinyl-player-widget').forEach(el => el.classList.add('is-playing'));
      document.querySelectorAll('.vinyl-disc-play-btn, .vinyl-play-btn').forEach(btn => {
        btn.innerHTML = '⏸';
        btn.title = 'Pause Record';
      });
    }).catch(err => {
      console.warn('Playback error:', err);
    });
  }

  function stopVinylAudio() {
    vinylIsPlaying = false;
    if (mainVinylAudio) {
      mainVinylAudio.pause();
    }
    document.querySelectorAll('.vinyl-disc-widget, .vinyl-player-widget').forEach(el => el.classList.remove('is-playing'));
    document.querySelectorAll('.vinyl-disc-play-btn, .vinyl-play-btn').forEach(btn => {
      btn.innerHTML = '▶';
      btn.title = 'Play Record';
    });
  }

  function toggleVinylAudio(item = null) {
    if (vinylIsPlaying) {
      stopVinylAudio();
    } else {
      startVinylAudio(item);
    }
  }

  // Active Selected Item on Cover for Font / Style manipulation
  let activeSelectedCoverItem = null;

  const CARD_THEMES_ORDER = [
    'gingham-pressed',
    'stardust-wildflowers',
    'dolce-vita',
    'royal-lotus',
    'denim-embroidery',
    'burgundy-arch',
    'plumeria-bows',
    'periwinkle-stripes',
    'midnight-celestial'
  ];

  function updateThemeCounters() {
    const currTheme = state.greetingCard.theme || 'gingham-pressed';
    const idx = Math.max(0, CARD_THEMES_ORDER.indexOf(currTheme));
    const counterText = `• 0${idx + 1}/09 •`;
    if (cardThemeCounter) cardThemeCounter.textContent = counterText;
    if (cardInsideCounter) cardInsideCounter.textContent = counterText;
  }

  function applyCardTheme(theme) {
    state.greetingCard.theme = theme;
    updateThemeCounters();

    cardThemeBtns.forEach(b => b.classList.toggle('active', b.dataset.cardTheme === theme));

    const border = state.greetingCard.borderStyle || 'classic';
    const paper = state.greetingCard.paperTone || 'vanilla';

    if (cardCoverCanvas) {
      cardCoverCanvas.className = `card-cover-canvas theme-${theme}`;
    }
    if (cardCoverOuterFrame) {
      cardCoverOuterFrame.className = `card-cover-outer-frame border-${border}`;
    }
    if (cardInsideBifold) {
      cardInsideBifold.className = `card-inside-bifold theme-${theme} paper-${paper} border-${border}`;
    }
  }

  function cycleCardTheme(direction) {
    const currTheme = state.greetingCard.theme || 'gingham-pressed';
    let idx = CARD_THEMES_ORDER.indexOf(currTheme);
    if (idx === -1) idx = 0;
    const nextIdx = (idx + direction + CARD_THEMES_ORDER.length) % CARD_THEMES_ORDER.length;
    applyCardTheme(CARD_THEMES_ORDER[nextIdx]);
  }

  // Stepper Controller
  function setCardStep(stepNum) {
    state.greetingCard.step = stepNum;

    // Update Segmented Switcher (Visible on Steps 1 & 2)
    if (cardViewSegmentedWrapper) {
      cardViewSegmentedWrapper.style.display = (stepNum === 1 || stepNum === 2) ? 'flex' : 'none';
    }
    if (btnCardToggleCover) btnCardToggleCover.classList.toggle('active', stepNum === 1);
    if (btnCardToggleInside) btnCardToggleInside.classList.toggle('active', stepNum === 2);

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

    updateThemeCounters();

    if (stepNum === 1) {
      renderCoverElements();
    } else if (stepNum === 2) {
      applyCardTheme(state.greetingCard.theme || 'gingham-pressed');
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

  // Segmented Switcher Click Handlers
  if (btnCardToggleCover) btnCardToggleCover.addEventListener('click', () => setCardStep(1));
  if (btnCardToggleInside) btnCardToggleInside.addEventListener('click', () => setCardStep(2));

  // Carousel Arrow Handlers
  if (btnThemePrev) btnThemePrev.addEventListener('click', () => cycleCardTheme(-1));
  if (btnThemeNext) btnThemeNext.addEventListener('click', () => cycleCardTheme(1));
  if (btnInsidePrev) btnInsidePrev.addEventListener('click', () => cycleCardTheme(-1));
  if (btnInsideNext) btnInsideNext.addEventListener('click', () => cycleCardTheme(1));

  if (btnCardToStep2) btnCardToStep2.addEventListener('click', () => setCardStep(2));
  if (btnCardBackToStep1) btnCardBackToStep1.addEventListener('click', () => setCardStep(1));
  if (btnCardToStep3) btnCardToStep3.addEventListener('click', () => setCardStep(3));
  if (btnCardBackToStep2) btnCardBackToStep2.addEventListener('click', () => setCardStep(2));
  if (btnCardToStep4) btnCardToStep4.addEventListener('click', () => setCardStep(4));
  if (btnCardBackToStep3) btnCardBackToStep3.addEventListener('click', () => setCardStep(3));

  // --- Step 1: Design Cover Logic ---
  cardThemeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyCardTheme(btn.dataset.cardTheme);
    });
  });

  // Paper & Border Options Handlers
  cardPaperBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cardPaperBtns.forEach(b => b.classList.toggle('active', b === btn));
      state.greetingCard.paperTone = btn.dataset.paper || 'vanilla';
      applyCardTheme(state.greetingCard.theme || 'gingham-pressed');
    });
  });

  cardBorderOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cardBorderOptionBtns.forEach(b => b.classList.toggle('active', b === btn));
      state.greetingCard.borderStyle = btn.dataset.border || 'classic';
      applyCardTheme(state.greetingCard.theme || 'gingham-pressed');
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

  if (btnCardAddCoverSticker && cardStickersPopup) {
    btnCardAddCoverSticker.addEventListener('click', () => {
      state.greetingCard.stickerTarget = 'cover';
      populateCardStickersPopup();
      cardStickersPopup.style.display = 'block';
      if (cardStickersPopupGrid) cardStickersPopupGrid.scrollTop = 0;
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
      itemEl.style.transform = `rotate(${item.rotation || 0}deg)`;
      if (item.width) {
        itemEl.style.width = typeof item.width === 'number' ? item.width + 'px' : item.width;
      }

      if (item.type === 'photo') {
        itemEl.innerHTML = `
          <button class="btn-item-delete" title="Delete">×</button>
          <div class="card-rotate-handle" title="Drag to rotate">↻</div>
          <div class="card-drag-handle" title="Drag to move">✥ Move</div>
          <img src="${item.src}" class="card-cover-photo-img" style="width:100%; height:auto; border-radius:6px; display:block; pointer-events:none;" />
          <div class="card-resize-handle" title="Drag to resize"></div>
        `;
      } else if (item.type === 'sticker') {
        itemEl.innerHTML = `
          <button class="btn-item-delete" title="Delete">×</button>
          <div class="card-rotate-handle" title="Drag to rotate">↻</div>
          <div class="card-drag-handle" title="Drag to move">✥ Move</div>
          <img src="assets/stickers/${item.file}" class="card-cover-sticker-img" style="width:100%; height:auto; display:block; pointer-events:none; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.18));" />
          <div class="card-resize-handle" title="Drag to resize"></div>
        `;
      } else {
        itemEl.innerHTML = `
          <button class="btn-item-delete" title="Delete">×</button>
          <div class="card-rotate-handle" title="Drag to rotate">↻</div>
          <div class="card-drag-handle" title="Drag to move">✥ Move</div>
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
            x: 8,
            y: 12,
            width: 140,
            rotation: 0
          });
          renderInsideKeepsakes();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 15 Flowers Popup (Compact Horizontal Scroll Strip with 4-5 visible at once)
  function populateCardFlowersPopup() {
    if (!cardFlowersPopupGrid) return;
    cardFlowersPopupGrid.innerHTML = '';
    CARD_FLOWERS.forEach(fl => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'flower-popup-item';
      btn.setAttribute('title', `Add ${fl.name}`);
      btn.innerHTML = `
        <div class="flower-popup-thumb-wrap">
          <img src="assets/flowers/${fl.file}" alt="${fl.name}" class="flower-popup-thumb" loading="lazy" />
        </div>
        <span class="flower-popup-name">${fl.name}</span>
      `;
      btn.addEventListener('click', () => {
        state.greetingCard.insideKeepsakes.push({
          id: 'flower_' + Date.now(),
          type: 'flower',
          name: fl.name,
          file: fl.file,
          x: 18,
          y: 20,
          width: 95,
          rotation: 0
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
      if (cardFlowersPopupGrid) cardFlowersPopupGrid.scrollLeft = 0;
    });
  }
  if (btnCloseFlowerPopup && cardFlowersPopup) {
    btnCloseFlowerPopup.addEventListener('click', () => {
      cardFlowersPopup.style.display = 'none';
    });
  }
  if (btnFlowerScrollLeft && cardFlowersPopupGrid) {
    btnFlowerScrollLeft.addEventListener('click', () => {
      cardFlowersPopupGrid.scrollBy({ left: -160, behavior: 'smooth' });
    });
  }
  if (btnFlowerScrollRight && cardFlowersPopupGrid) {
    btnFlowerScrollRight.addEventListener('click', () => {
      cardFlowersPopupGrid.scrollBy({ left: 160, behavior: 'smooth' });
    });
  }
  if (cardFlowersPopupGrid) {
    cardFlowersPopupGrid.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        cardFlowersPopupGrid.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  // 15 Stickers Popup (Compact Horizontal Scroll Strip with 4-5 visible at once)
  function populateCardStickersPopup() {
    if (!cardStickersPopupGrid) return;
    cardStickersPopupGrid.innerHTML = '';
    CARD_STICKERS.forEach(stk => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sticker-popup-item';
      btn.setAttribute('title', `Add ${stk.name}`);
      btn.innerHTML = `
        <div class="sticker-popup-thumb-wrap">
          <img src="assets/stickers/${stk.file}" alt="${stk.name}" class="sticker-popup-thumb" loading="lazy" />
        </div>
        <span class="sticker-popup-name">${stk.name}</span>
      `;
      btn.addEventListener('click', () => {
        if (state.greetingCard.stickerTarget === 'cover') {
          state.greetingCard.coverElements.push({
            id: 'sticker_' + Date.now(),
            type: 'sticker',
            name: stk.name,
            file: stk.file,
            x: 35,
            y: 40,
            width: 70,
            rotation: 0
          });
          if (cardStickersPopup) cardStickersPopup.style.display = 'none';
          renderCoverElements();
        } else {
          state.greetingCard.insideKeepsakes.push({
            id: 'sticker_' + Date.now(),
            type: 'sticker',
            name: stk.name,
            file: stk.file,
            x: 42,
            y: 35,
            width: 75,
            rotation: 0
          });
          if (cardStickersPopup) cardStickersPopup.style.display = 'none';
          renderInsideKeepsakes();
        }
      });
      cardStickersPopupGrid.appendChild(btn);
    });
  }

  if (btnCardAddSticker && cardStickersPopup) {
    btnCardAddSticker.addEventListener('click', () => {
      state.greetingCard.stickerTarget = 'inside';
      populateCardStickersPopup();
      cardStickersPopup.style.display = 'block';
      if (cardStickersPopupGrid) cardStickersPopupGrid.scrollTop = 0;
    });
  }
  if (btnCloseStickerPopup && cardStickersPopup) {
    btnCloseStickerPopup.addEventListener('click', () => {
      cardStickersPopup.style.display = 'none';
    });
  }

  // Connect Real Music to Vinyl Record
  let activeSelectedSong = {
    id: VERIFIED_TRENDING_TRACKS[0].id,
    title: VERIFIED_TRENDING_TRACKS[0].title,
    artist: VERIFIED_TRENDING_TRACKS[0].artist,
    album: VERIFIED_TRENDING_TRACKS[0].album,
    artwork: VERIFIED_TRENDING_TRACKS[0].artwork,
    audioSrc: VERIFIED_TRENDING_TRACKS[0].audioSrc
  };
  let editingVinylId = null;

  // Cache modal elements
  const vinylCuratedSongsList = document.getElementById('vinyl-curated-songs-list');
  const vinylTabBtns = document.querySelectorAll('.vinyl-tab-btn');
  const vinylTabPanels = document.querySelectorAll('.vinyl-tab-panel');
  const vinylMusicSearchInput = document.getElementById('vinyl-music-search-input');
  const btnVinylMusicSearch = document.getElementById('btn-vinyl-music-search');
  const vinylSearchResults = document.getElementById('vinyl-search-results');
  const vinylQuickTags = document.querySelectorAll('.vinyl-tag');
  const vinylTrendingList = document.getElementById('vinyl-trending-list');
  const vinylUploadDropzone = document.getElementById('vinyl-upload-dropzone');
  const btnVinylBrowseFile = document.getElementById('btn-vinyl-browse-file');
  const vinylUploadStatus = document.getElementById('vinyl-upload-status');
  const vinylSelectedCard = document.getElementById('vinyl-selected-card');
  const vinylSelectedArt = document.getElementById('vinyl-selected-art');
  const vinylSelectedTitle = document.getElementById('vinyl-selected-title');
  const vinylSelectedArtist = document.getElementById('vinyl-selected-artist');
  const btnAuditionSelected = document.getElementById('btn-audition-selected');

  function updateSelectedSongUI(song) {
    if (!song) return;
    activeSelectedSong = { ...song };
    if (vinylSelectedArt) vinylSelectedArt.src = song.artwork || 'assets/medium_letter.png';
    if (vinylSelectedTitle) vinylSelectedTitle.textContent = song.title || 'Selected Track';
    if (vinylSelectedArtist) vinylSelectedArtist.textContent = song.artist || 'Live Music Stream';

    document.querySelectorAll('.vinyl-music-item').forEach(el => {
      el.classList.toggle('active', el.dataset.songId === song.id || el.dataset.audioSrc === song.audioSrc);
    });
  }

  function renderCuratedTracksList() {
    const listEl = vinylCuratedSongsList || vinylTrendingList;
    if (!listEl) return;
    listEl.innerHTML = '';
    CURATED_VINYL_TRACKS.forEach(trk => {
      const itemEl = document.createElement('div');
      itemEl.className = 'vinyl-music-item' + (activeSelectedSong.id === trk.id ? ' active' : '');
      itemEl.dataset.songId = trk.id;
      itemEl.dataset.audioSrc = trk.audioSrc;
      itemEl.innerHTML = `
        <span class="vinyl-song-num">${trk.num}.</span>
        <img src="${trk.artwork}" alt="${escapeHtml(trk.title)}" class="vinyl-music-art" />
        <div class="vinyl-music-info">
          <div class="vinyl-music-title">${escapeHtml(trk.title)}</div>
          <div class="vinyl-music-artist">${escapeHtml(trk.artist)}</div>
        </div>
        <div class="vinyl-music-actions">
          <button type="button" class="btn-audition-play" title="Listen preview">▶</button>
          <button type="button" class="btn-choose-song">Select</button>
        </div>
      `;
      const auditionBtn = itemEl.querySelector('.btn-audition-play');
      auditionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAuditionSong(trk.audioSrc, auditionBtn);
      });
      const chooseBtn = itemEl.querySelector('.btn-choose-song');
      chooseBtn.addEventListener('click', () => {
        updateSelectedSongUI(trk);
      });
      itemEl.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-audition-play')) {
          updateSelectedSongUI(trk);
        }
      });
      listEl.appendChild(itemEl);
    });
  }

  function renderTrendingTracksList() {
    renderCuratedTracksList();
  }

  function renderSearchResults(tracks) {
    if (!vinylSearchResults) return;
    vinylSearchResults.innerHTML = '';
    if (!tracks || tracks.length === 0) {
      vinylSearchResults.innerHTML = `
        <div class="vinyl-search-empty-state">
          <div class="empty-state-icon">🔍</div>
          <p>No songs found. Try typing another song title, artist, or band!</p>
        </div>
      `;
      return;
    }

    tracks.forEach(trk => {
      const itemEl = document.createElement('div');
      itemEl.className = 'vinyl-music-item' + (activeSelectedSong.id === trk.id ? ' active' : '');
      itemEl.dataset.songId = trk.id;
      itemEl.dataset.audioSrc = trk.audioSrc;
      itemEl.innerHTML = `
        <img src="${trk.artwork || 'assets/medium_letter.png'}" alt="${trk.title}" class="vinyl-music-art" />
        <div class="vinyl-music-info">
          <div class="vinyl-music-title">${escapeHtml(trk.title)}</div>
          <div class="vinyl-music-artist">${escapeHtml(trk.artist)} ${trk.album ? `• <em>${escapeHtml(trk.album)}</em>` : ''}</div>
        </div>
        <div class="vinyl-music-actions">
          <button type="button" class="btn-audition-play" title="Listen preview">▶</button>
          <button type="button" class="btn-choose-song">Select</button>
        </div>
      `;
      const auditionBtn = itemEl.querySelector('.btn-audition-play');
      auditionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAuditionSong(trk.audioSrc, auditionBtn);
      });
      const chooseBtn = itemEl.querySelector('.btn-choose-song');
      chooseBtn.addEventListener('click', () => {
        updateSelectedSongUI(trk);
      });
      itemEl.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-audition-play')) {
          updateSelectedSongUI(trk);
        }
      });
      vinylSearchResults.appendChild(itemEl);
    });
  }

  async function performMusicSearch(query) {
    if (!vinylSearchResults) return;
    if (!query || !query.trim()) {
      vinylSearchResults.innerHTML = `
        <div class="vinyl-search-empty-state">
          <div class="empty-state-icon">🎧</div>
          <p>Type any song or artist above to connect live audio to your vinyl record!</p>
        </div>
      `;
      return;
    }
    vinylSearchResults.innerHTML = `
      <div class="vinyl-search-empty-state">
        <div class="empty-state-icon">⏳</div>
        <p>Connecting to music catalog for "${escapeHtml(query)}"...</p>
      </div>
    `;
    const results = await searchAppleMusicTracks(query);
    renderSearchResults(results);
  }

  // Audition for Selected Track
  if (btnAuditionSelected) {
    btnAuditionSelected.addEventListener('click', () => {
      if (activeSelectedSong && activeSelectedSong.audioSrc) {
        toggleAuditionSong(activeSelectedSong.audioSrc, btnAuditionSelected);
      }
    });
  }

  // Tab switching
  vinylTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.vtab;
      vinylTabBtns.forEach(b => b.classList.toggle('active', b === btn));
      vinylTabPanels.forEach(p => {
        p.style.display = p.id === `vinyl-panel-${tab}` ? 'flex' : 'none';
      });
    });
  });

  // Search input listeners
  if (btnVinylMusicSearch && vinylMusicSearchInput) {
    btnVinylMusicSearch.addEventListener('click', () => {
      performMusicSearch(vinylMusicSearchInput.value);
    });
    vinylMusicSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        performMusicSearch(vinylMusicSearchInput.value);
      }
    });
  }

  // Quick suggestion tags
  vinylQuickTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const q = tag.dataset.query;
      if (vinylMusicSearchInput) vinylMusicSearchInput.value = q;
      performMusicSearch(q);
    });
  });

  // File upload
  if (btnVinylBrowseFile && vinylAudioFileInput) {
    btnVinylBrowseFile.addEventListener('click', () => vinylAudioFileInput.click());
  }
  if (vinylAudioFileInput) {
    vinylAudioFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const songObj = {
            id: 'upload_' + Date.now(),
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: 'Personal Audio File',
            album: 'Custom Upload',
            artwork: 'assets/medium_letter.png',
            audioSrc: evt.target.result
          };
          updateSelectedSongUI(songObj);
          if (vinylUploadStatus) {
            vinylUploadStatus.textContent = `✓ Loaded: ${file.name}`;
            vinylUploadStatus.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  function openVinylSongModal(existingVinyl = null) {
    if (!cardVinylSongModal) return;
    editingVinylId = existingVinyl ? existingVinyl.id : null;

    if (existingVinyl) {
      updateSelectedSongUI({
        id: existingVinyl.songId || 'custom',
        title: existingVinyl.trackName || existingVinyl.title || 'Selected Track',
        artist: existingVinyl.artistName || '',
        album: existingVinyl.album || '',
        artwork: existingVinyl.artworkUrl || 'assets/medium_letter.png',
        audioSrc: existingVinyl.audioSrc || VERIFIED_TRENDING_TRACKS[0].audioSrc
      });
    } else {
      updateSelectedSongUI(VERIFIED_TRENDING_TRACKS[0]);
    }

    if (vinylCustomDedicationInput) {
      vinylCustomDedicationInput.value = (existingVinyl && existingVinyl.dedication) || ('For ' + (state.greetingCard.insideTo || 'Kabir'));
    }

    renderTrendingTracksList();
    cardVinylSongModal.style.display = 'block';
  }

  function closeVinylSongModal() {
    if (cardVinylSongModal) cardVinylSongModal.style.display = 'none';
    if (auditionAudio) {
      auditionAudio.pause();
      document.querySelectorAll('.btn-audition-play').forEach(b => {
        b.innerHTML = '▶';
        b.classList.remove('is-playing');
      });
    }
    editingVinylId = null;
  }

  if (btnCloseVinylModal) {
    btnCloseVinylModal.addEventListener('click', closeVinylSongModal);
  }

  if (btnConfirmVinylSong) {
    btnConfirmVinylSong.addEventListener('click', () => {
      const finalDedication = (vinylCustomDedicationInput && vinylCustomDedicationInput.value.trim()) || ('For ' + (state.greetingCard.insideTo || 'Kabir'));
      const finalTitle = activeSelectedSong.title + (activeSelectedSong.artist ? ` - ${activeSelectedSong.artist}` : '');

      if (editingVinylId) {
        const item = state.greetingCard.insideKeepsakes.find(i => i.id === editingVinylId);
        if (item) {
          item.songId = activeSelectedSong.id;
          item.title = finalTitle;
          item.trackName = activeSelectedSong.title;
          item.artistName = activeSelectedSong.artist;
          item.artworkUrl = activeSelectedSong.artwork;
          item.audioSrc = activeSelectedSong.audioSrc;
          item.dedication = finalDedication;
        }
      } else {
        const hasVinyl = state.greetingCard.insideKeepsakes.some(i => i.type === 'vinyl');
        if (hasVinyl) {
          showAtelierToast('Vinyl record is already placed on your card ♡');
          closeVinylSongModal();
          return;
        }
        state.greetingCard.insideKeepsakes.push({
          id: 'vinyl_' + Date.now(),
          type: 'vinyl',
          songId: activeSelectedSong.id,
          title: finalTitle,
          trackName: activeSelectedSong.title,
          artistName: activeSelectedSong.artist,
          artworkUrl: activeSelectedSong.artwork,
          audioSrc: activeSelectedSong.audioSrc,
          dedication: finalDedication,
          x: 10,
          y: 35,
          width: 140,
          rotation: 0
        });
      }
      closeVinylSongModal();
      renderInsideKeepsakes();
      startVinylAudio();
    });
  }

  if (btnCardAddVinyl) {
    btnCardAddVinyl.addEventListener('click', () => {
      const existing = state.greetingCard.insideKeepsakes.find(i => i.type === 'vinyl');
      openVinylSongModal(existing || null);
    });
  }

  function renderInsideKeepsakes() {
    if (!cardInsideItemsOverlay) return;
    cardInsideItemsOverlay.innerHTML = '';

    (state.greetingCard.insideKeepsakes || []).forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'card-placed-item';
      itemEl.dataset.id = item.id;
      itemEl.style.left = item.x + '%';
      itemEl.style.top = item.y + '%';
      itemEl.style.transform = `rotate(${item.rotation || 0}deg)`;
      if (item.width) {
        itemEl.style.width = typeof item.width === 'number' ? item.width + 'px' : item.width;
      }

      if (item.type === 'polaroid') {
        itemEl.innerHTML = `
          <button class="btn-item-delete" title="Delete">×</button>
          <div class="card-rotate-handle" title="Drag to rotate">↻</div>
          <div class="card-drag-handle" title="Drag to move">✥ Move</div>
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
          <div class="card-rotate-handle" title="Drag to rotate">↻</div>
          <div class="card-drag-handle" title="Drag to move">✥ Move</div>
          <img src="assets/flowers/${item.file}" class="placed-flower-img" alt="${item.name}" style="width:100%; height:auto; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.12)); pointer-events:none;" />
          <div class="card-resize-handle" title="Drag to resize"></div>
        `;
      } else if (item.type === 'vinyl') {
        itemEl.innerHTML = `
          <button class="btn-item-delete" title="Delete">×</button>
          <div class="card-rotate-handle" title="Drag to rotate">↻</div>
          <div class="card-drag-handle" title="Drag to move">✥ Move</div>
          <div class="vinyl-disc-widget ${vinylIsPlaying ? 'is-playing' : ''}">
            <div class="vinyl-disc-disc-wrap" title="Tap to ${vinylIsPlaying ? 'pause' : 'play'}">
              <img src="assets/vinyl_disc_pretty.png" class="placed-vinyl-disc" alt="Vinyl Record" />
              <button type="button" class="vinyl-disc-play-btn" title="${vinylIsPlaying ? 'Pause Record' : 'Play Record'}">${vinylIsPlaying ? '⏸' : '▶'}</button>
            </div>
            <div class="vinyl-floating-track-tag" title="Click to change song">
              <span class="vinyl-tag-music-icon">🎵</span>
              <span class="vinyl-tag-text">${escapeHtml(item.title || 'Die With A Smile - Lady Gaga & Bruno Mars')}</span>
            </div>
          </div>
          <div class="card-resize-handle" title="Drag to resize"></div>
        `;

        const discWrap = itemEl.querySelector('.vinyl-disc-disc-wrap');
        if (discWrap) {
          discWrap.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleVinylAudio(item);
          });
        }

        const trackTag = itemEl.querySelector('.vinyl-floating-track-tag');
        if (trackTag) {
          trackTag.addEventListener('click', (e) => {
            e.stopPropagation();
            openVinylSongModal(item);
          });
        }
      } else if (item.type === 'sticker') {
        itemEl.innerHTML = `
          <button class="btn-item-delete" title="Delete">×</button>
          <div class="card-rotate-handle" title="Drag to rotate">↻</div>
          <div class="card-drag-handle" title="Drag to move">✥ Move</div>
          <img src="assets/stickers/${item.file}" class="placed-sticker-img" alt="${item.name}" style="width:100%; height:auto; filter:drop-shadow(0 3px 8px rgba(0,0,0,0.18)); pointer-events:none;" />
          <div class="card-resize-handle" title="Drag to resize"></div>
        `;
      }

      attachItemInteractions(
        itemEl,
        item,
        cardInsideItemsOverlay,
        () => {},
        () => {
          if (item.type === 'vinyl' && vinylIsPlaying) {
            stopVinylAudio();
          }
          state.greetingCard.insideKeepsakes = state.greetingCard.insideKeepsakes.filter(i => i.id !== item.id);
          renderInsideKeepsakes();
        }
      );

      cardInsideItemsOverlay.appendChild(itemEl);
    });
  }

  // Generalized Interaction Engine: Dragging, Resizing, Rotating & Deleting
  function attachItemInteractions(itemEl, itemData, parentContainer, onUpdate, onDelete) {
    if (!itemEl || !itemData || !parentContainer) return;

    // Delete
    const deleteBtn = itemEl.querySelector('.btn-item-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onDelete();
      });
    }

    // Vinyl audio toggle
    const vinylBtn = itemEl.querySelector('.vinyl-play-btn, .vinyl-disc-play-btn');
    if (vinylBtn) {
      vinylBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleVinylAudio(itemData);
      });
    }

    // Selection
    itemEl.addEventListener('click', (e) => {
      if (e.target.closest('.btn-item-delete') || 
          e.target.closest('.vinyl-play-btn') || 
          e.target.closest('.vinyl-disc-play-btn') || 
          e.target.closest('.vinyl-disc-disc-wrap') || 
          e.target.closest('.vinyl-floating-track-tag') || 
          e.target.closest('.vinyl-track-info')) return;
      parentContainer.querySelectorAll('.card-placed-item').forEach(el => el.classList.remove('is-selected'));
      itemEl.classList.add('is-selected');
      activeSelectedCoverItem = itemData;
      if (itemData.type === 'text') {
        if (cardFontSelect) cardFontSelect.value = itemData.fontFamily || "'Caveat', cursive";
      }
    });

    // 1. Rotation Interaction (card-rotate-handle)
    const rotateHandle = itemEl.querySelector('.card-rotate-handle');
    if (rotateHandle) {
      let isRotating = false;
      let centerX = 0;
      let centerY = 0;

      rotateHandle.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        isRotating = true;
        const rect = itemEl.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
        try { rotateHandle.setPointerCapture(e.pointerId); } catch (err) {}
      });

      rotateHandle.addEventListener('pointermove', (e) => {
        if (!isRotating) return;
        const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let deg = Math.round((rad * 180 / Math.PI) + 90);
        while (deg < 0) deg += 360;
        deg = deg % 360;
        itemData.rotation = deg;
        itemEl.style.transform = `rotate(${deg}deg)`;
      });

      const onRotateEnd = (e) => {
        if (!isRotating) return;
        isRotating = false;
        try { rotateHandle.releasePointerCapture(e.pointerId); } catch (err) {}
        onUpdate();
      };
      rotateHandle.addEventListener('pointerup', onRotateEnd);
      rotateHandle.addEventListener('pointercancel', onRotateEnd);
    }

    // 2. Resize Interaction (card-resize-handle)
    const resizeHandle = itemEl.querySelector('.card-resize-handle') || itemEl.querySelector('.item-resize-handle');
    if (resizeHandle) {
      let isResizing = false;
      let startX = 0;
      let startW = 0;
      let cachedParentW = 300;

      resizeHandle.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        isResizing = true;
        startX = e.clientX;
        startW = itemEl.offsetWidth;
        cachedParentW = parentContainer.offsetWidth || 300;
        try { resizeHandle.setPointerCapture(e.pointerId); } catch (err) {}
      });

      resizeHandle.addEventListener('pointermove', (e) => {
        if (!isResizing) return;
        const deltaX = e.clientX - startX;
        const newW = Math.max(45, Math.min(cachedParentW * 0.95, startW + deltaX));
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

    // 3. Smooth Drag Interaction (Handle or Item body)
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialLeftPx = 0;
    let initialTopPx = 0;
    let cachedParentRect = null;
    let cachedItemW = 0;
    let cachedItemH = 0;
    let dragRaf = null;

    const startDrag = (e) => {
      if (e.target.closest('.btn-item-delete') || 
          e.target.closest('.card-resize-handle') || 
          e.target.closest('.item-resize-handle') || 
          e.target.closest('.card-rotate-handle') || 
          e.target.closest('.vinyl-play-btn') || 
          e.target.closest('.vinyl-disc-play-btn') || 
          (!e.target.closest('.card-drag-handle') && (e.target.closest('.vinyl-disc-disc-wrap') || e.target.closest('.vinyl-floating-track-tag'))) || 
          e.target.closest('.vinyl-track-info')) {
        return;
      }

      // If user is actively typing in contenteditable, don't drag unless clicking the drag handle
      if (e.target.getAttribute('contenteditable') === 'true' && !e.target.closest('.card-drag-handle')) {
        return;
      }

      e.preventDefault();
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      initialLeftPx = itemEl.offsetLeft;
      initialTopPx = itemEl.offsetTop;
      cachedParentRect = parentContainer.getBoundingClientRect();
      cachedItemW = itemEl.offsetWidth;
      cachedItemH = itemEl.offsetHeight;

      itemEl.classList.add('is-dragging');
      const captureTarget = e.target.closest('.card-drag-handle') || itemEl;
      try { captureTarget.setPointerCapture(e.pointerId); } catch (err) {}
    };

    itemEl.addEventListener('pointerdown', startDrag);

    const dragHandle = itemEl.querySelector('.card-drag-handle');
    if (dragHandle) {
      dragHandle.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        startDrag(e);
      });
    }

    const onPointerMove = (e) => {
      if (!isDragging || !cachedParentRect) return;
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;

      if (dragRaf) cancelAnimationFrame(dragRaf);
      dragRaf = requestAnimationFrame(() => {
        const isInsideOverlay = (parentContainer.id === 'card-inside-items-overlay');
        let minLeft = 0;
        let maxLeft = cachedParentRect.width - cachedItemW;

        if (isInsideOverlay) {
          if (itemData.type !== 'sticker') {
            // Constrain Polaroid, Flower, Vinyl to left panel only (0% to ~48%)
            maxLeft = Math.max(0, cachedParentRect.width * 0.48 - cachedItemW);
          } else {
            // Stickers can go anywhere on both left and right sides
            maxLeft = Math.max(0, cachedParentRect.width - cachedItemW);
          }
        }

        const newLeftPx = Math.max(minLeft, Math.min(maxLeft, initialLeftPx + deltaX));
        const newTopPx = Math.max(0, Math.min(cachedParentRect.height - Math.min(cachedItemH, 40), initialTopPx + deltaY));

        itemData.x = parseFloat(((newLeftPx / cachedParentRect.width) * 100).toFixed(2));
        itemData.y = parseFloat(((newTopPx / cachedParentRect.height) * 100).toFixed(2));

        itemEl.style.left = itemData.x + '%';
        itemEl.style.top = itemData.y + '%';
      });
    };

    itemEl.addEventListener('pointermove', onPointerMove);

    const onDragEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      if (dragRaf) cancelAnimationFrame(dragRaf);
      itemEl.classList.remove('is-dragging');
      try { (e.target.closest('.card-drag-handle') || itemEl).releasePointerCapture(e.pointerId); } catch (err) {}
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
    const theme = state.greetingCard.theme || 'gingham-pressed';

    if (face === 'inside') {
      if (cardFlipLabel) cardFlipLabel.textContent = 'View Cover';
      let keepsakesHtml = '';
      (state.greetingCard.insideKeepsakes || []).forEach(item => {
        if (item.type === 'polaroid') {
          keepsakesHtml += `
            <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width || 130}px; transform: rotate(${item.rotation || 0}deg); pointer-events:auto;">
              <div class="placed-polaroid-frame">
                <div class="polaroid-pin"></div>
                <img src="${item.src}" class="polaroid-photo" alt="Memory" />
                <div class="polaroid-caption">${escapeHtml(item.caption || 'Cherished Memory')}</div>
              </div>
            </div>
          `;
        } else if (item.type === 'flower') {
          keepsakesHtml += `
            <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width || 90}px; transform: rotate(${item.rotation || 0}deg); pointer-events:auto;">
              <img src="assets/flowers/${item.file}" class="placed-flower-img" alt="${item.name}" style="width:100%; height:auto; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.12)); pointer-events:none;" />
            </div>
          `;
        } else if (item.type === 'vinyl') {
          keepsakesHtml += `
            <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width || 140}px; transform: rotate(${item.rotation || 0}deg); pointer-events:auto;">
              <div class="vinyl-disc-widget ${vinylIsPlaying ? 'is-playing' : ''}">
                <div class="vinyl-disc-disc-wrap" title="Tap to ${vinylIsPlaying ? 'pause' : 'play'}">
                  <img src="assets/vinyl_disc_pretty.png" class="placed-vinyl-disc" alt="Vinyl Record" />
                  <button type="button" class="vinyl-disc-play-btn" title="${vinylIsPlaying ? 'Pause Record' : 'Play Record'}">${vinylIsPlaying ? '⏸' : '▶'}</button>
                </div>
                <div class="vinyl-floating-track-tag">
                  <span class="vinyl-tag-music-icon">🎵</span>
                  <span class="vinyl-tag-text">${escapeHtml(item.title || 'Die With A Smile - Lady Gaga & Bruno Mars')}</span>
                </div>
              </div>
            </div>
          `;
        } else if (item.type === 'sticker') {
          keepsakesHtml += `
            <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width || 70}px; transform: rotate(${item.rotation || 0}deg); pointer-events:auto;">
              <img src="assets/stickers/${item.file}" class="placed-sticker-img" alt="${item.name}" style="width:100%; height:auto; filter:drop-shadow(0 3px 8px rgba(0,0,0,0.18)); pointer-events:none;" />
            </div>
          `;
        }
      });

      cardRevealDisplay.innerHTML = `
        <div class="card-inside-bifold theme-${theme}" style="margin:0 auto; box-shadow:0 12px 32px rgba(82, 19, 25, 0.18); position:relative;">
          <div class="inside-left-panel">
            <div class="panel-watermark-label">Memories &amp; Keepsakes</div>
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
          <div class="card-inside-items-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:10;">
            ${keepsakesHtml}
          </div>
        </div>
      `;

      cardRevealDisplay.querySelectorAll('.vinyl-disc-disc-wrap, .vinyl-disc-play-btn, .vinyl-play-btn').forEach(btn => {
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
            <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width ? (typeof item.width === 'number' ? item.width + 'px' : item.width) : '55%'}; transform: rotate(${item.rotation || 0}deg);">
              <img src="${item.src}" class="card-cover-photo-img" style="width:100%; height:auto; border-radius:6px; display:block;" />
            </div>
          `;
        } else if (item.type === 'text') {
          coverItemsHtml += `
            <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.width ? (typeof item.width === 'number' ? item.width + 'px' : item.width) : '60%'}; transform: rotate(${item.rotation || 0}deg);">
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
        theme: state.greetingCard.theme || 'gingham-pressed',
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
    return (typeof updateActiveDispatchUrl === 'function')
      ? updateActiveDispatchUrl(state.greetingCard.insideTo ? 'for-' + state.greetingCard.insideTo : 'for-you')
      : window.location.href;
  }

  function openCardDispatchModal() {
    if (typeof openUnifiedDispatchModal === 'function') {
      openUnifiedDispatchModal('card');
    }
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

  // ================= UNIFIED DISPATCH & SHORT URL SYSTEM =================
  let currentDispatchType = 'card';
  const dispatchCustomSlugInput = document.getElementById('dispatch-custom-slug');
  const dispatchSlugPrefix = document.getElementById('dispatch-slug-prefix');
  const btnDispatchWhatsApp = document.getElementById('btn-dispatch-whatsapp');

  function toBase64Url(str) {
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  function fromBase64Url(str) {
    let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    return decodeURIComponent(escape(atob(b64)));
  }

  function sanitizeSlug(slug) {
    return (slug || 'for-you')
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'for-you';
  }

  function getBaseShareUrl() {
    return window.location.origin + window.location.pathname;
  }

  function getCompactCardPayload(slug) {
    const ks = (state.greetingCard.insideKeepsakes || []).map(k => {
      if (k.type === 'vinyl') {
        return { t: 'v', id: k.id || 'track_1', sid: k.songId || (k.id && !k.id.startsWith('track_') ? k.id : null), tit: k.title, src: k.audioSrc, x: Math.round(k.x), y: Math.round(k.y) };
      }
      if (k.type === 'flower') {
        return { t: 'f', f: k.file, n: k.name, x: Math.round(k.x), y: Math.round(k.y), w: Math.round(k.width || 90), r: Math.round(k.rotation || 0) };
      }
      if (k.type === 'sticker') {
        return { t: 's', f: k.file, n: k.name, x: Math.round(k.x), y: Math.round(k.y), w: Math.round(k.width || 70), r: Math.round(k.rotation || 0) };
      }
      if (k.type === 'polaroid') {
        return { t: 'p', src: k.src, cap: k.caption, x: Math.round(k.x), y: Math.round(k.y), w: Math.round(k.width || 130), r: Math.round(k.rotation || 0) };
      }
      return k;
    });

    const cv = (state.greetingCard.coverElements || []).map(c => {
      if (c.type === 'text') {
        return { t: 'tx', txt: c.text, ff: c.fontFamily, sz: c.fontSize, x: Math.round(c.x), y: Math.round(c.y) };
      }
      if (c.type === 'photo') {
        return { t: 'ph', src: c.src, x: Math.round(c.x), y: Math.round(c.y), w: c.width };
      }
      return c;
    });

    return {
      t: 'c',
      slg: slug,
      to: state.greetingCard.insideTo || 'You',
      fr: state.greetingCard.insideFrom || 'Someone Special',
      m: state.greetingCard.insideBody || '',
      th: state.greetingCard.theme || 'gingham-pressed',
      ff: state.greetingCard.insideFontFamily || "'Caveat', cursive",
      fs: state.greetingCard.insideFontSize || 19,
      v: state.greetingCard.vessel || 'envelope',
      env: state.greetingCard.envelope || 'dusty-blue',
      sl: state.greetingCard.seal || 'gold-celestial',
      bi: state.greetingCard.boxIndex || '1',
      ks: ks,
      cv: cv,
      d: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  }

  function getCompactLetterPayload(slug) {
    const toVal = state.letter.to || (letterToInput ? letterToInput.value : 'Kabir');
    const fromVal = state.letter.from || (letterFromInput ? letterFromInput.value : 'Saanvi');
    const bodyVal = state.letter.body || (letterTextarea ? letterTextarea.value : '');

    return {
      t: 'l',
      slg: slug,
      to: toVal,
      fr: fromVal,
      m: bodyVal,
      th: state.letter.theme,
      fs: state.letter.fontSize,
      ff: state.letter.fontFamily,
      env: state.letter.envelope,
      sl: state.letter.seal,
      stk: state.letter.stickers,
      d: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  }

  function getCompactBouquetPayload(slug) {
    const toVal = bouquetToInput ? bouquetToInput.value : state.bouquet.noteTo;
    const fromVal = bouquetFromInput ? bouquetFromInput.value : state.bouquet.noteFrom;
    const bodyVal = bouquetNoteBody ? bouquetNoteBody.value : state.bouquet.noteBody;

    return {
      t: 'b',
      slg: slug,
      fl: state.bouquet.flowers.map(f => ({ f: f.flower, file: f.file })),
      gr: state.bouquet.greenery,
      sd: state.bouquet.shuffleSeed,
      th: state.bouquet.noteTheme || 'cream',
      to: toVal,
      fr: fromVal,
      m: bodyVal,
      d: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  }

  function getCompactPostcardPayload(slug) {
    const payload = getPostcardStatePayload();
    return {
      t: 'p',
      slg: slug,
      to: payload.to,
      fr: payload.from,
      m: payload.body,
      th: payload.stampTheme,
      stmp: payload.stamps,
      v: payload.vessel,
      env: payload.envIndex,
      bi: payload.boxIndex,
      d: payload.date
    };
  }

  function openUnifiedDispatchModal(mediumType) {
    currentDispatchType = mediumType || 'card';
    if (!dispatchModal) return;

    const iconEl = document.getElementById('dispatch-badge-icon');
    const titleEl = document.getElementById('dispatch-modal-title');
    const subEl = document.getElementById('dispatch-modal-sub');

    let toName = 'you';
    if (currentDispatchType === 'card') {
      if (iconEl) iconEl.textContent = '💌';
      if (titleEl) titleEl.textContent = 'Dispatch Your Greeting Card';
      if (subEl) subEl.textContent = 'Share your personalized card and keepsakes.';
      toName = state.greetingCard.insideTo || 'you';
    } else if (currentDispatchType === 'letter') {
      if (iconEl) iconEl.textContent = '📜';
      if (titleEl) titleEl.textContent = 'Dispatch Your Sealed Letter';
      if (subEl) subEl.textContent = 'Share your handwritten letter with someone special.';
      toName = state.letter.to || (letterToInput ? letterToInput.value : 'you');
    } else if (currentDispatchType === 'bouquet') {
      if (iconEl) iconEl.textContent = '🌸';
      if (titleEl) titleEl.textContent = 'Dispatch Your Botanical Bouquet';
      if (subEl) subEl.textContent = 'Share your handpicked bouquet and heartfelt note.';
      toName = state.bouquet.noteTo || (bouquetToInput ? bouquetToInput.value : 'you');
    } else {
      if (iconEl) iconEl.textContent = '💌';
      if (titleEl) titleEl.textContent = 'Dispatch Your Postcard';
      if (subEl) subEl.textContent = 'Share your thoughtful gift with someone special.';
      toName = state.to || 'you';
    }

    const initialSlug = sanitizeSlug('for-' + toName);
    if (dispatchCustomSlugInput) {
      dispatchCustomSlugInput.value = initialSlug;
    }
    if (dispatchSlugPrefix) {
      const host = window.location.hostname || 'betweenus.love';
      dispatchSlugPrefix.textContent = host + '/#';
    }

    updateActiveDispatchUrl(initialSlug);
    dispatchModal.style.display = 'flex';
  }

  function updateActiveDispatchUrl(slug) {
    const cleanSlug = sanitizeSlug(slug);
    let payload = null;
    if (currentDispatchType === 'card') {
      payload = getCompactCardPayload(cleanSlug);
    } else if (currentDispatchType === 'letter') {
      payload = getCompactLetterPayload(cleanSlug);
    } else if (currentDispatchType === 'bouquet') {
      payload = getCompactBouquetPayload(cleanSlug);
    } else {
      payload = getCompactPostcardPayload(cleanSlug);
    }

    try {
      localStorage.setItem('between_us_card_' + cleanSlug, JSON.stringify(payload));
      localStorage.setItem('between_us_latest_share', JSON.stringify(payload));
    } catch (e) {}

    const jsonStr = JSON.stringify(payload);
    const compactData = toBase64Url(jsonStr);
    const base = getBaseShareUrl();
    const finalUrl = `${base}#c=${encodeURIComponent(cleanSlug)}&d=${compactData}`;

    if (dispatchUrlInput) {
      dispatchUrlInput.value = finalUrl;
    }
    return finalUrl;
  }

  if (dispatchCustomSlugInput) {
    dispatchCustomSlugInput.addEventListener('input', (e) => {
      const slugVal = e.target.value.trim();
      updateActiveDispatchUrl(slugVal);
    });
  }

  function generateShareableUrl() {
    return updateActiveDispatchUrl(state.to ? 'for-' + state.to : 'for-you');
  }

  if (btnStep3Dispatch) {
    btnStep3Dispatch.addEventListener('click', () => {
      openUnifiedDispatchModal('postcard');
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
    const shareUrl = dispatchUrlInput?.value || updateActiveDispatchUrl(dispatchCustomSlugInput?.value || 'for-you');
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

  if (btnDispatchWhatsApp) {
    btnDispatchWhatsApp.addEventListener('click', () => {
      const shareUrl = dispatchUrlInput?.value || updateActiveDispatchUrl(dispatchCustomSlugInput?.value || 'for-you');
      let toName = '';
      if (currentDispatchType === 'card') toName = state.greetingCard.insideTo;
      else if (currentDispatchType === 'letter') toName = state.letter.to;
      else if (currentDispatchType === 'bouquet') toName = state.bouquet.noteTo;
      else toName = state.to;

      const forWhom = toName ? `for ${toName}` : 'for you';
      const msg = `A little handwritten gift ${forWhom} on Between Us ♡\nOpen your card: ${shareUrl}`;
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    });
  }

  if (btnDispatchSendFriends) {
    btnDispatchSendFriends.addEventListener('click', () => {
      const shareUrl = dispatchUrlInput?.value || updateActiveDispatchUrl(dispatchCustomSlugInput?.value || 'for-you');
      if (navigator.share) {
        navigator.share({
          title: 'A Little Something, from Me to You',
          text: 'I made a special handwritten gift for you on Between Us ♡',
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
    const text = encodeURIComponent('I made a special handwritten gift for you on Between Us ♡ ' + url);
    const waUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(waUrl, '_blank');
  }

  // ================= RECIPIENT PUBLIC EXPERIENCE =================
  let recipientPostcardFlipped = false;

  function checkUrlRecipientView() {
    try {
      const rawSearch = window.location.search || '';
      const rawHash = window.location.hash || '';

      let hasRecipientParam = false;
      let slug = '';
      let dataParam = '';
      let cardParam = '';
      let letterParam = '';
      let bouquetParam = '';

      if (rawSearch) {
        const sp = new URLSearchParams(rawSearch);
        if (sp.has('c')) { hasRecipientParam = true; slug = sp.get('c'); }
        if (sp.has('d')) { hasRecipientParam = true; dataParam = sp.get('d'); }
        if (sp.has('card')) { hasRecipientParam = true; cardParam = sp.get('card'); }
        if (sp.has('letter')) { hasRecipientParam = true; letterParam = sp.get('letter'); }
        if (sp.has('bouquet')) { hasRecipientParam = true; bouquetParam = sp.get('bouquet'); }
      }

      if (rawHash) {
        const hashClean = rawHash.replace(/^[#?]+/, '');
        const hp = new URLSearchParams(hashClean);
        if (hp.has('c')) { hasRecipientParam = true; slug = hp.get('c'); }
        if (hp.has('d')) { hasRecipientParam = true; dataParam = hp.get('d'); }
        if (hp.has('card')) { hasRecipientParam = true; cardParam = hp.get('card'); }
        if (hp.has('letter')) { hasRecipientParam = true; letterParam = hp.get('letter'); }
        if (hp.has('bouquet')) { hasRecipientParam = true; bouquetParam = hp.get('bouquet'); }

        if (!hasRecipientParam && (hashClean.startsWith('for-') || hashClean.includes('card') || hashClean.includes('gift'))) {
          hasRecipientParam = true;
          slug = hashClean;
        }
      }

      if (!hasRecipientParam) return;

      // Lock into Recipient Presentation Mode!
      window.isRecipientMode = true;

      // Immediately hide app editor studio, header, splash screen, and bottom navigation
      if (splashScreen) splashScreen.style.display = 'none';
      if (appHeader) appHeader.style.display = 'none';
      if (appStage) appStage.style.display = 'none';
      if (appBottomNav) appBottomNav.style.display = 'none';

      const recipientStage = document.getElementById('recipient-stage');
      if (recipientStage) recipientStage.style.display = 'flex';

      let itemData = null;

      // 1. Decode compact URL-safe base64 payload
      if (dataParam) {
        try {
          const jsonStr = fromBase64Url(dataParam);
          itemData = JSON.parse(jsonStr);
        } catch (e) {
          console.warn('Could not parse compact payload:', e);
        }
      }

      // 2. Lookup by slug in localStorage
      if (!itemData && slug) {
        try {
          const cached = localStorage.getItem('between_us_card_' + slug);
          if (cached) itemData = JSON.parse(cached);
        } catch (e) {}
      }

      // 3. Fallback to legacy atob params
      if (!itemData && cardParam) {
        try {
          const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(cardParam))));
          itemData = JSON.parse(jsonStr);
        } catch (e) {}
      }
      if (!itemData && letterParam) {
        try {
          const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(letterParam))));
          itemData = JSON.parse(jsonStr);
        } catch (e) {}
      }
      if (!itemData && bouquetParam) {
        try {
          const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(bouquetParam))));
          itemData = JSON.parse(jsonStr);
        } catch (e) {}
      }

      // 4. Default fallback from slug if no payload provided
      if (!itemData && slug) {
        const cleanName = slug.replace(/^for-/, '').replace(/-/g, ' ');
        const nameCap = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        itemData = {
          t: 'c',
          to: nameCap,
          fr: 'Someone who loves you',
          m: `Thinking of you always...\n\nEvery moment between us is a memory I hold close to my heart ♡`,
          th: 'gingham-pressed',
          v: 'envelope',
          env: 'dusty-blue',
          sl: 'gold-celestial',
          ks: [
            { type: 'vinyl', id: 'track_1', title: 'Die With A Smile - Lady Gaga & Bruno Mars', x: 20, y: 32 },
            { type: 'flower', file: 'peony.png', name: 'Peony', x: 22, y: 72, width: 85, rotation: 12 }
          ],
          cv: []
        };
      }

      if (!itemData) return;

      const type = itemData.t || itemData.type || 'c';
      if (type === 'c' || type === 'card' || type === 'greeting-card') {
        renderRecipientCardInUnifiedStage(itemData);
      } else if (type === 'l' || type === 'letter') {
        renderRecipientLetterInUnifiedStage(itemData);
      } else if (type === 'b' || type === 'bouquet') {
        renderRecipientBouquetExperience(itemData);
      } else {
        renderRecipientExperience(itemData);
      }
    } catch (err) {
      console.warn('Recipient URL parse error:', err);
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

  function renderRecipientLetterInUnifiedStage(data) {
    window.renderRecipientLetterExperience = renderRecipientLetterInUnifiedStage;
    if (splashScreen) splashScreen.style.display = 'none';
    if (appHeader) appHeader.style.display = 'none';
    if (appStage) appStage.style.display = 'none';
    if (appBottomNav) appBottomNav.style.display = 'none';

    const recipientStage = document.getElementById('recipient-stage');
    if (!recipientStage) return;
    recipientStage.style.display = 'flex';

    const toVal = data.to || 'You';
    const fromVal = data.fr || data.from || 'Someone Special';
    const bodyVal = data.m || data.body || '';
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
      'charcoal': '#333333',
      'dusty-blue': '#7D95A8'
    };
    const sealColors = {
      'gold': '#C5A059',
      'cream': '#EFECE6',
      'maroon': '#6B202A',
      'celestial': '#C5A059'
    };

    const headingEl = document.getElementById('recipient-dedication-heading');
    const fromToEl = document.getElementById('recipient-from-to-text');
    if (headingEl) headingEl.textContent = 'A sealed letter for you ♡';
    if (fromToEl) fromToEl.textContent = `From ${fromVal} to ${toVal}`;

    const postcardWrap = document.getElementById('recipient-postcard-wrap');
    const bouquetWrap = document.getElementById('recipient-bouquet-wrap');
    const bifoldCardWrap = document.getElementById('recipient-bifold-card-wrap');
    const letterWrap = document.getElementById('recipient-letter-wrap');
    if (postcardWrap) postcardWrap.style.display = 'none';
    if (bouquetWrap) bouquetWrap.style.display = 'none';
    if (bifoldCardWrap) bifoldCardWrap.style.display = 'none';

    const vesselStage = document.getElementById('recipient-vessel-stage');
    const vesselArt = document.getElementById('recipient-vessel-art');
    const btnOpen = document.getElementById('btn-recipient-open');

    if (vesselStage) vesselStage.style.display = 'block';
    if (letterWrap) letterWrap.style.display = 'none';

    if (vesselArt) {
      vesselArt.innerHTML = `
        <div class="letter-sealed-envelope" style="width:240px; height:155px; margin:0 auto; box-shadow:0 10px 25px rgba(40,20,25,0.18); cursor:pointer;">
          <div class="sealed-env-body" style="background:${envColors[envVal] || '#5C1D24'};">
            <div class="sealed-env-flap"></div>
            <div class="sealed-wax-seal" style="background:${sealColors[sealVal] || '#C5A059'};"></div>
            <div class="sealed-env-label" style="font-family:'Caveat', cursive; font-size:17px; color:rgba(255,255,255,0.92); text-shadow:0 1px 3px rgba(0,0,0,0.5); text-align:center; padding-top:80px;">For ${escapeHtml(toVal)}</div>
          </div>
        </div>
      `;
    }

    const contentArea = document.getElementById('recip-letter-content-area');
    function revealLetter() {
      if (vesselStage) vesselStage.style.display = 'none';
      if (letterWrap) letterWrap.style.display = 'block';
      if (contentArea) {
        let stkHtml = stickersVal.map(st => `
          <div style="position: absolute; left: ${st.left}; top: ${st.top}; pointer-events: none;">
            <img src="${st.src}" style="max-width: 78px; max-height: 78px; object-fit: contain; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.22));" />
          </div>
        `).join('');

        contentArea.innerHTML = `
          <div class="letter-paper theme-${themeVal}" style="position: relative; margin: 0 auto; box-shadow: 0 10px 28px rgba(82, 19, 25, 0.14); min-height: 280px; padding: 24px 20px; border-radius: 8px;">
            <div style="font-family: ${fontVal}; font-size: ${sizeVal}px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; color: #521319;">
              ${escapeHtml(bodyVal)}
            </div>
            ${stkHtml}
          </div>
        `;
      }
    }

    if (btnOpen) btnOpen.onclick = revealLetter;
    if (vesselArt) vesselArt.onclick = revealLetter;

    const btnSaveVault = document.getElementById('btn-recipient-save-vault');
    if (btnSaveVault) {
      btnSaveVault.onclick = () => {
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
          btnSaveVault.textContent = '✓ Preserved in Your Keepsake Shelf';
          showToast('Letter tucked into your Keepsake Shelf! ♡');
        } catch (e) {}
      };
    }

    const btnMakeOwn = document.getElementById('btn-recipient-create');
    if (btnMakeOwn) {
      btnMakeOwn.textContent = '✨ Write Your Own Letter';
      btnMakeOwn.onclick = () => {
        const stage = document.getElementById('recipient-stage');
        if (stage) stage.style.display = 'none';
        if (appHeader) appHeader.style.display = 'flex';
        if (appStage) appStage.style.display = 'block';
        if (appBottomNav) appBottomNav.style.display = 'flex';
        window.isRecipientMode = false;
        selectMedium('letter');
      };
    }
  }
  function renderRecipientLetterExperience(data) {
    renderRecipientLetterInUnifiedStage(data);
  }
  window.renderRecipientLetterExperience = renderRecipientLetterExperience;

  function renderRecipientCardInUnifiedStage(data) {
    const toVal = data.to || 'You';
    const fromVal = data.fr || data.from || 'Someone Special';
    const bodyVal = data.m || data.body || '';
    const themeVal = data.th || data.theme || 'gingham-pressed';
    const fontVal = data.ff || data.fontFamily || "'Caveat', cursive";
    const sizeVal = data.fs || data.fontSize || 19;
    const vesselVal = data.v || data.vessel || 'envelope';
    const envVal = data.env || data.envelope || 'dusty-blue';
    const sealVal = data.sl || data.seal || 'gold-celestial';
    const boxIdx = data.bi || data.boxIndex || '1';
    const keepsakesVal = data.ks || data.insideKeepsakes || [];
    const coverElementsVal = data.cv || data.coverElements || [];

    // Update Dedication
    const headingEl = document.getElementById('recipient-dedication-heading');
    const fromToEl = document.getElementById('recipient-from-to-text');
    if (headingEl) headingEl.textContent = 'A handwritten card for you ♡';
    if (fromToEl) fromToEl.textContent = `From ${fromVal} to ${toVal}`;

    // Hide other medium wraps
    const postcardWrap = document.getElementById('recipient-postcard-wrap');
    const bouquetWrap = document.getElementById('recipient-bouquet-wrap');
    const letterWrap = document.getElementById('recipient-letter-wrap');
    const bifoldCardWrap = document.getElementById('recipient-bifold-card-wrap');
    if (postcardWrap) postcardWrap.style.display = 'none';
    if (bouquetWrap) bouquetWrap.style.display = 'none';
    if (letterWrap) letterWrap.style.display = 'none';

    // Vessel Setup
    const vesselStage = document.getElementById('recipient-vessel-stage');
    const vesselArt = document.getElementById('recipient-vessel-art');
    const btnOpen = document.getElementById('btn-recipient-open');

    if (vesselStage) vesselStage.style.display = 'block';
    if (bifoldCardWrap) bifoldCardWrap.style.display = 'none';

    if (vesselArt) {
      if (vesselVal === 'envelope') {
        const envSrc = CARD_ENVELOPE_MAP[envVal] || 'assets/letter/envelopes/env_dusty_blue.jpg';
        const sealSrc = CARD_SEAL_MAP[sealVal] || 'assets/letter/seals/seal_gold_celestial.png';
        vesselArt.innerHTML = `
          <div class="card-envelope-arriving-package" style="position:relative; width:240px; height:160px; margin:0 auto; cursor:pointer;">
            <img src="${envSrc}" style="width:100%; height:100%; object-fit:cover; border-radius:10px; box-shadow:0 12px 28px rgba(82,19,25,0.18);" alt="Envelope" />
            <img src="${sealSrc}" class="sealed-wax-seal" style="position:absolute; left:50%; top:54%; transform:translate(-50%, -50%); width:76px; height:76px; object-fit:contain; filter:drop-shadow(0 5px 12px rgba(0,0,0,0.36));" alt="Wax Seal" />
            <div style="position:absolute; bottom:14px; left:0; width:100%; text-align:center; font-family:'Caveat', cursive; font-size:18px; color:rgba(255,255,255,0.92); text-shadow:0 1px 3px rgba(0,0,0,0.5);">For ${escapeHtml(toVal)}</div>
          </div>
        `;
      } else if (vesselVal === 'box') {
        const boxSrc = boxImages[boxIdx] || 'assets/boxes/box1.jpg';
        vesselArt.innerHTML = `
          <div style="position:relative; width:170px; height:170px; margin:0 auto; cursor:pointer;">
            <img src="${boxSrc}" style="width:100%; height:100%; object-fit:contain; mix-blend-mode:multiply; filter:drop-shadow(0 10px 22px rgba(82,19,25,0.18));" alt="Gift Box" />
          </div>
        `;
      } else {
        vesselArt.innerHTML = `
          <div style="position:relative; width:230px; margin:0 auto; cursor:pointer; display:flex; flex-direction:column; align-items:center;">
            <img src="assets/truck.png" style="width:100%; height:auto; object-fit:contain; filter:drop-shadow(0 8px 20px rgba(82,19,25,0.15));" alt="Delivery Truck" />
            <p style="margin-top:8px; font-family:'Playfair Display', Georgia, serif; color:#521319; font-size:14px; font-weight:600;">Special Delivery Truck</p>
          </div>
        `;
      }
    }

    let recipFace = 'inside';
    const contentArea = document.getElementById('recip-card-content-area');
    const flipBtn = document.getElementById('btn-recip-card-flip');
    const flipText = document.getElementById('recip-flip-text');

    function renderRecipCard() {
      if (!contentArea) return;
      if (recipFace === 'inside') {
        if (flipText) flipText.textContent = 'View Cover';
        let ksHtml = '';
        keepsakesVal.forEach(item => {
          const itType = item.type || item.t;
          if (itType === 'polaroid' || itType === 'p') {
            ksHtml += `
              <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.w || item.width || 130}px; transform: rotate(${item.r || item.rotation || 0}deg); pointer-events:auto;">
                <div class="placed-polaroid-frame">
                  <div class="polaroid-pin"></div>
                  <img src="${item.src}" class="polaroid-photo" alt="Memory" />
                  <div class="polaroid-caption">${escapeHtml(item.caption || item.cap || 'Cherished Memory')}</div>
                </div>
              </div>
            `;
          } else if (itType === 'flower' || itType === 'f') {
            const flowerFile = item.file || item.f || 'peony.png';
            ksHtml += `
              <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.w || item.width || 90}px; transform: rotate(${item.r || item.rotation || 0}deg); pointer-events:auto;">
                <img src="assets/flowers/${flowerFile}" class="placed-flower-img" alt="${item.name || item.n || 'Flower'}" style="width:100%; height:auto; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.12)); pointer-events:none;" />
              </div>
            `;
          } else if (itType === 'vinyl' || itType === 'v') {
            let trackTitle = item.title || item.tit || 'Die With A Smile - Lady Gaga & Bruno Mars';
            let matchedTrack = CURATED_VINYL_TRACKS.find(t => t.id === item.sid || t.audioSrc === item.src);
            if (!matchedTrack && trackTitle) {
              matchedTrack = CURATED_VINYL_TRACKS.find(t => trackTitle.toLowerCase().includes(t.title.toLowerCase()));
            }
            if (matchedTrack) {
              item.audioSrc = matchedTrack.audioSrc;
              trackTitle = matchedTrack.title + (matchedTrack.artist ? ` - ${matchedTrack.artist}` : '');
            }
            ksHtml += `
              <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.w || item.width || 140}px; transform: rotate(${item.r || item.rotation || 0}deg); pointer-events:auto;">
                <div class="vinyl-disc-widget ${vinylIsPlaying ? 'is-playing' : ''}">
                  <div class="vinyl-disc-disc-wrap" title="Tap to ${vinylIsPlaying ? 'pause' : 'play'}">
                    <img src="assets/vinyl_disc_pretty.png" class="placed-vinyl-disc" alt="Vinyl Record" />
                    <button type="button" class="vinyl-disc-play-btn" data-item-id="${item.id}" title="${vinylIsPlaying ? 'Pause Record' : 'Play Record'}">${vinylIsPlaying ? '⏸' : '▶'}</button>
                  </div>
                  <div class="vinyl-floating-track-tag">
                    <span class="vinyl-tag-music-icon">🎵</span>
                    <span class="vinyl-tag-text">${escapeHtml(trackTitle)}</span>
                  </div>
                </div>
              </div>
            `;
          } else if (itType === 'sticker' || itType === 's') {
            const stkFile = item.file || item.f || 'cherub_kiss.png';
            ksHtml += `
              <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.w || item.width || 70}px; transform: rotate(${item.r || item.rotation || 0}deg); pointer-events:auto;">
                <img src="assets/stickers/${stkFile}" class="placed-sticker-img" alt="${item.name || item.n || 'Sticker'}" style="width:100%; height:auto; filter:drop-shadow(0 3px 8px rgba(0,0,0,0.18)); pointer-events:none;" />
              </div>
            `;
          }
        });

        contentArea.innerHTML = `
          <div class="card-inside-bifold theme-${themeVal}" style="margin:0 auto; box-shadow:0 12px 32px rgba(82, 19, 25, 0.18); position:relative;">
            <div class="inside-left-panel">
              <div class="panel-watermark-label">Memories &amp; Keepsakes</div>
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
            <div class="card-inside-items-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:10;">
              ${ksHtml}
            </div>
          </div>
        `;

        contentArea.querySelectorAll('.vinyl-disc-disc-wrap, .vinyl-disc-play-btn, .vinyl-play-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const itm = keepsakesVal.find(k => (k.type === 'vinyl' || k.t === 'v'));
            toggleVinylAudio(itm || null);
          });
        });
      } else {
        if (flipText) flipText.textContent = 'View Inside';
        let cvHtml = '';
        coverElementsVal.forEach(item => {
          const itType = item.type || item.t;
          if (itType === 'photo' || itType === 'ph') {
            cvHtml += `
              <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.w || item.width || '55%'}; transform: rotate(${item.r || item.rotation || 0}deg);">
                <img src="${item.src}" class="card-cover-photo-img" style="width:100%; height:auto; border-radius:6px; display:block;" />
              </div>
            `;
          } else if (itType === 'text' || itType === 'tx') {
            cvHtml += `
              <div class="card-placed-item static" style="left:${item.x}%; top:${item.y}%; width:${item.w || item.width || '60%'}; transform: rotate(${item.r || item.rotation || 0}deg);">
                <div class="card-item-content card-text-content" style="font-family:${item.ff || item.fontFamily || "'Caveat', cursive"}; font-size:${item.sz || item.fontSize || 24}px; text-align:center;">
                  ${escapeHtml(item.txt || item.text || '')}
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

    function revealCard() {
      if (vesselStage) vesselStage.style.display = 'none';
      if (bifoldCardWrap) bifoldCardWrap.style.display = 'block';
      renderRecipCard();
    }

    if (btnOpen) {
      btnOpen.onclick = revealCard;
    }
    if (vesselArt) {
      vesselArt.onclick = revealCard;
    }

    if (flipBtn) {
      flipBtn.onclick = () => {
        recipFace = recipFace === 'inside' ? 'cover' : 'inside';
        renderRecipCard();
      };
    }

    // Save to Vault
    const btnSaveVault = document.getElementById('btn-recipient-save-vault');
    if (btnSaveVault) {
      btnSaveVault.onclick = () => {
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
          btnSaveVault.textContent = '✓ Preserved in Your Keepsake Shelf';
          showToast('Card tucked into your Keepsake Shelf! ♡');
        } catch (e) {
          console.error(e);
        }
      };
    }

    // Create Own Card / Open in Studio
    const btnMakeOwn = document.getElementById('btn-recipient-create');
    if (btnMakeOwn) {
      btnMakeOwn.textContent = '✨ Make Your Own Card';
      btnMakeOwn.onclick = () => {
        const stage = document.getElementById('recipient-stage');
        if (stage) stage.style.display = 'none';
        if (appHeader) appHeader.style.display = 'flex';
        if (appStage) appStage.style.display = 'block';
        if (appBottomNav) appBottomNav.style.display = 'flex';
        window.isRecipientMode = false;
        selectMedium('greeting-card');
      };
    }
  }

  function renderRecipientCardExperience(data) {
    renderRecipientCardInUnifiedStage(data);
  }
  window.renderRecipientCardExperience = renderRecipientCardExperience;

  function bindModalCloser(closeBtnId, modalId) {
    const btn = document.getElementById(closeBtnId);
    if (btn) {
      btn.addEventListener('click', () => {
        const m = document.getElementById(modalId);
        if (m) m.style.display = 'none';
      });
    }
  }

  // ==========================================================================
  // COMPLETE VAULT ENGINE (My Drafts, Sent Creations, Search & Sort)
  // ==========================================================================
  const DEFAULT_VAULT_ITEMS = [
    {
      id: 'vault_1',
      type: 'card',
      status: 'sent',
      title: 'Autumn Love Note',
      to: 'Kabir',
      from: 'Saanvi',
      date: 'Nov 14, 2026',
      theme: 'gingham-pressed',
      fontFamily: "'Caveat', cursive",
      fontSize: 20,
      body: 'Every moment with you feels like poetry. Happy Anniversary! ♡',
      song: {
        id: 'sailor-song',
        trackName: 'Sailor Song',
        artistName: 'Gigi Perez'
      },
      savedAt: 'Nov 14, 2026'
    },
    {
      id: 'vault_2',
      type: 'bouquet',
      status: 'draft',
      title: 'Pastel Wildflower Arrangement',
      to: 'Kabir',
      from: 'Saanvi',
      date: 'Nov 20, 2026',
      wrap: 'lace',
      stems: ['peony', 'hydrangea', 'eucalyptus'],
      body: 'A little floral reminder that you are loved today.',
      savedAt: '2 days ago'
    },
    {
      id: 'vault_3',
      type: 'postcard',
      status: 'sent',
      title: 'Hawa Mahal Morning',
      to: 'Kabir',
      from: 'Saanvi',
      date: 'Sep 24, 2026',
      theme: 'candy',
      body: 'Thinking of you as the pigeons took flight over the pink walls...',
      savedAt: 'Sep 24, 2026'
    },
    {
      id: 'vault_4',
      type: 'letter',
      status: 'saved',
      title: 'Midnight Musings',
      to: 'Kabir',
      from: 'Saanvi',
      date: 'Oct 06, 2026',
      theme: 'parchment',
      body: 'It is quiet tonight, and my thoughts naturally wandered right back to you.',
      savedAt: 'Oct 06, 2026'
    }
  ];

  function getVaultItems() {
    try {
      const stored = localStorage.getItem('between_us_vault_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem('between_us_vault_items', JSON.stringify(DEFAULT_VAULT_ITEMS));
      return DEFAULT_VAULT_ITEMS;
    } catch (e) {
      return DEFAULT_VAULT_ITEMS;
    }
  }

  function saveVaultItems(items) {
    try {
      localStorage.setItem('between_us_vault_items', JSON.stringify(items));
    } catch (e) {}
  }

  let currentVaultFilter = 'all';
  let currentVaultSearch = '';
  let currentVaultSort = 'latest';
  let activeVaultMenuIdx = null;

  function renderVaultItems() {
    const vaultGrid = document.getElementById('vault-items-grid');
    const emptyState = document.getElementById('vault-empty-state');
    if (!vaultGrid) return;

    const allItems = getVaultItems();

    // Update Counts on Segmented Buttons
    const countAll = allItems.length;
    const countDraft = allItems.filter(i => (i.status || 'saved') === 'draft').length;
    const countSent = allItems.filter(i => (i.status || 'saved') === 'sent').length;
    const countSaved = allItems.filter(i => (i.status || 'saved') === 'saved').length;

    const elCountAll = document.getElementById('vault-count-all');
    const elCountDraft = document.getElementById('vault-count-draft');
    const elCountSent = document.getElementById('vault-count-sent');
    const elCountSaved = document.getElementById('vault-count-saved');

    if (elCountAll) elCountAll.textContent = countAll;
    if (elCountDraft) elCountDraft.textContent = countDraft;
    if (elCountSent) elCountSent.textContent = countSent;
    if (elCountSaved) elCountSaved.textContent = countSaved;

    // Filter Items
    let filtered = allItems.slice();
    if (currentVaultFilter !== 'all') {
      filtered = filtered.filter(i => (i.status || 'saved') === currentVaultFilter);
    }

    // Search Query
    if (currentVaultSearch.trim()) {
      const q = currentVaultSearch.toLowerCase().trim();
      filtered = filtered.filter(i =>
        (i.title || '').toLowerCase().includes(q) ||
        (i.to || '').toLowerCase().includes(q) ||
        (i.body || '').toLowerCase().includes(q) ||
        (i.from || '').toLowerCase().includes(q)
      );
    }

    // Sort Items
    if (currentVaultSort === 'latest') {
      // Keep natural reverse chronological
    } else if (currentVaultSort === 'oldest') {
      filtered.reverse();
    } else if (currentVaultSort === 'title') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (currentVaultSort === 'recipient') {
      filtered.sort((a, b) => (a.to || '').localeCompare(b.to || ''));
    }

    if (filtered.length === 0) {
      vaultGrid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    vaultGrid.innerHTML = filtered.map((item) => {
      const realIdx = allItems.findIndex(x => x.id === item.id);
      const idx = realIdx !== -1 ? realIdx : 0;
      const st = item.status || 'saved';

      let mediumBadge = '💌 Greeting Card';
      let thumbIcon = '💌';
      if (item.type === 'bouquet') {
        mediumBadge = '💐 Bouquet';
        thumbIcon = '💐';
      } else if (item.type === 'letter') {
        mediumBadge = '✉️ Letter';
        thumbIcon = '✉️';
      } else if (item.type === 'postcard') {
        mediumBadge = '🖼 Postcard';
        thumbIcon = '🖼';
      }

      const statusLabels = { draft: 'Draft', sent: 'Sent', saved: 'Saved' };

      return `
        <div class="vault-item-card" data-vault-idx="${idx}">
          <div class="vault-card-topbar">
            <span class="vault-type-badge">${escapeHtml(mediumBadge)}</span>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="vault-status-badge status-${escapeHtml(st)}">${statusLabels[st] || 'Saved'}</span>
              <button type="button" class="btn-vault-dots-menu" data-vault-idx="${idx}" title="Options">⋮</button>
            </div>
          </div>

          <div class="vault-card-thumb-slot">
            <span class="vault-thumb-icon">${thumbIcon}</span>
          </div>

          <div class="vault-card-details">
            <h4 class="vault-card-title">${escapeHtml(item.title || 'Untitled Creation')}</h4>
            <p class="vault-card-dedication">To: ${escapeHtml(item.to || 'Someone Special')} • From: ${escapeHtml(item.from || 'Me')}</p>
            <p class="vault-card-date">Preserved: ${escapeHtml(item.savedAt || item.date || 'Recently')}</p>
          </div>

          <div class="vault-card-actions-row">
            <button type="button" class="btn-vault-resume" data-vault-idx="${idx}">
              <span>✏️</span>
              <span>${st === 'draft' ? 'Resume Draft' : 'Edit in Studio'}</span>
            </button>
            <button type="button" class="btn-vault-revisit-quick" data-vault-idx="${idx}">
              <span>👁</span>
              <span>Revisit</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Wire Card Buttons
    vaultGrid.querySelectorAll('.btn-vault-resume').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.vaultIdx);
        resumeVaultItemInStudio(allItems[idx]);
      });
    });

    vaultGrid.querySelectorAll('.btn-vault-revisit-quick').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.vaultIdx);
        revisitVaultItem(allItems[idx]);
      });
    });

    vaultGrid.querySelectorAll('.btn-vault-dots-menu').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.vaultIdx);
        openVaultOptionsMenu(idx);
      });
    });
  }

  // Resume / Load Vault Item in Studio
  function resumeVaultItemInStudio(item) {
    if (!item) return;

    // Switch to Studio Tab
    const studioTab = document.querySelector('.nav-tab[data-room="studio"]');
    if (studioTab) studioTab.click();

    if (item.type === 'bouquet') {
      selectMedium('bouquet');
      if (item.to) {
        const toInp = document.getElementById('bouquet-to-input');
        if (toInp) toInp.value = item.to;
      }
    } else if (item.type === 'letter') {
      selectMedium('letter');
      if (item.body && letterTextarea) {
        letterTextarea.value = item.body;
        if (state.letter) state.letter.body = item.body;
      }
      if (item.to) {
        const toInp = document.getElementById('letter-to-input');
        if (toInp) toInp.value = item.to;
      }
    } else if (item.type === 'postcard') {
      selectMedium('postcard');
      if (item.body) {
        const backMsg = document.getElementById('postcard-back-message');
        if (backMsg) backMsg.value = item.body;
      }
      if (item.to) {
        const toInp = document.getElementById('postcard-to-input');
        if (toInp) toInp.value = item.to;
      }
    } else {
      selectMedium('greeting-card');
      if (item.body) {
        const cardMsg = document.getElementById('card-note-message');
        if (cardMsg) cardMsg.value = item.body;
      }
      if (item.to) {
        const toInp = document.getElementById('card-to-input');
        if (toInp) toInp.value = item.to;
      }
    }

    showToast(`Loaded "${item.title || 'Creation'}" into Studio! You can edit and dispatch.`);
  }

  // Revisit Vault Item
  function revisitVaultItem(item) {
    if (!item) return;
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

  // Vault Options Menu
  function openVaultOptionsMenu(idx) {
    activeVaultMenuIdx = idx;
    const items = getVaultItems();
    const item = items[idx];
    if (!item) return;

    const modal = document.getElementById('modal-vault-options');
    const titleEl = document.getElementById('vault-options-item-title');
    if (titleEl) titleEl.textContent = item.title || 'Creation Options';

    if (modal) modal.style.display = 'flex';
  }

  // Wire Options Menu Rows
  const optRevisit = document.getElementById('opt-vault-revisit');
  if (optRevisit) {
    optRevisit.addEventListener('click', () => {
      document.getElementById('modal-vault-options').style.display = 'none';
      const items = getVaultItems();
      if (activeVaultMenuIdx !== null) revisitVaultItem(items[activeVaultMenuIdx]);
    });
  }

  const optEdit = document.getElementById('opt-vault-edit');
  if (optEdit) {
    optEdit.addEventListener('click', () => {
      document.getElementById('modal-vault-options').style.display = 'none';
      const items = getVaultItems();
      if (activeVaultMenuIdx !== null) resumeVaultItemInStudio(items[activeVaultMenuIdx]);
    });
  }

  const optDuplicate = document.getElementById('opt-vault-duplicate');
  if (optDuplicate) {
    optDuplicate.addEventListener('click', () => {
      document.getElementById('modal-vault-options').style.display = 'none';
      const items = getVaultItems();
      if (activeVaultMenuIdx === null) return;
      const orig = items[activeVaultMenuIdx];
      const copy = JSON.parse(JSON.stringify(orig));
      copy.id = 'vault_' + Date.now();
      copy.title = 'Copy of ' + (orig.title || 'Creation');
      copy.status = 'draft';
      copy.savedAt = 'Just now';
      items.unshift(copy);
      saveVaultItems(items);
      renderVaultItems();
      showToast('Duplicated as new draft in your Vault! ♡');
    });
  }

  const optRename = document.getElementById('opt-vault-rename');
  if (optRename) {
    optRename.addEventListener('click', () => {
      document.getElementById('modal-vault-options').style.display = 'none';
      const items = getVaultItems();
      if (activeVaultMenuIdx === null) return;
      const orig = items[activeVaultMenuIdx];
      const renameModal = document.getElementById('modal-vault-rename');
      const renameInput = document.getElementById('vault-rename-input');
      if (renameInput) renameInput.value = orig.title || '';
      if (renameModal) renameModal.style.display = 'flex';
    });
  }

  const formVaultRename = document.getElementById('form-vault-rename');
  if (formVaultRename) {
    formVaultRename.addEventListener('submit', (e) => {
      e.preventDefault();
      const newTitle = document.getElementById('vault-rename-input')?.value.trim();
      if (!newTitle) return;
      const items = getVaultItems();
      if (activeVaultMenuIdx !== null && items[activeVaultMenuIdx]) {
        items[activeVaultMenuIdx].title = newTitle;
        saveVaultItems(items);
        renderVaultItems();
        document.getElementById('modal-vault-rename').style.display = 'none';
        showToast('Creation renamed to "' + newTitle + '"! ♡');
      }
    });
  }

  const optShare = document.getElementById('opt-vault-share');
  if (optShare) {
    optShare.addEventListener('click', () => {
      document.getElementById('modal-vault-options').style.display = 'none';
      const items = getVaultItems();
      if (activeVaultMenuIdx === null) return;
      const it = items[activeVaultMenuIdx];
      const shareUrl = `https://betweenus.love/#c=${encodeURIComponent((it.title || 'gift').toLowerCase().replace(/\s+/g, '-'))}&d=vault`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Shareable link copied to clipboard!');
      }).catch(() => {
        showToast('Link: ' + shareUrl);
      });
    });
  }

  const optDelete = document.getElementById('opt-vault-delete');
  if (optDelete) {
    optDelete.addEventListener('click', () => {
      document.getElementById('modal-vault-options').style.display = 'none';
      const items = getVaultItems();
      if (activeVaultMenuIdx === null) return;
      const it = items[activeVaultMenuIdx];
      if (confirm(`Are you sure you want to delete "${it.title || 'this creation'}" from your Vault?`)) {
        items.splice(activeVaultMenuIdx, 1);
        saveVaultItems(items);
        renderVaultItems();
        showToast('Creation deleted from your Vault.');
      }
    });
  }

  // Segmented Tab Buttons Filter
  document.querySelectorAll('#vault-tabs-segmented .vault-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#vault-tabs-segmented .vault-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      currentVaultFilter = btn.dataset.vaultFilter || 'all';
      renderVaultItems();
    });
  });

  // Search Input Filter
  const vaultSearchInp = document.getElementById('vault-search-input');
  if (vaultSearchInp) {
    vaultSearchInp.addEventListener('input', () => {
      currentVaultSearch = vaultSearchInp.value;
      renderVaultItems();
    });
  }

  // Sort Dropdown Filter
  const vaultSortSel = document.getElementById('vault-sort-select');
  if (vaultSortSel) {
    vaultSortSel.addEventListener('change', () => {
      currentVaultSort = vaultSortSel.value;
      renderVaultItems();
    });
  }

  // FAB: + New Creation -> Studio
  const btnVaultFab = document.getElementById('btn-vault-fab');
  if (btnVaultFab) {
    btnVaultFab.addEventListener('click', () => {
      const studioTab = document.querySelector('.nav-tab[data-room="studio"]');
      if (studioTab) studioTab.click();
    });
  }

  const btnVaultEmptyStart = document.getElementById('btn-vault-empty-start');
  if (btnVaultEmptyStart) {
    btnVaultEmptyStart.addEventListener('click', () => {
      const studioTab = document.querySelector('.nav-tab[data-room="studio"]');
      if (studioTab) studioTab.click();
    });
  }

  // Modal Closers for Vault
  bindModalCloser('btn-close-vault-options', 'modal-vault-options');
  bindModalCloser('btn-close-vault-rename', 'modal-vault-rename');
  bindModalCloser('btn-cancel-vault-rename', 'modal-vault-rename');

  // Hook Vault Room Rendering into navigation tabs
  const vaultNavTab = document.querySelector('.nav-tab[data-room="vault"]');
  if (vaultNavTab) {
    vaultNavTab.addEventListener('click', renderVaultItems);
  }
  window.renderVaultItems = renderVaultItems;

  // Check Recipient URL param on load
  window.openUnifiedDispatchModal = openUnifiedDispatchModal;
  window.renderRecipientCardInUnifiedStage = renderRecipientCardInUnifiedStage;
  window.renderRecipientLetterInUnifiedStage = renderRecipientLetterInUnifiedStage;
  window.checkUrlRecipientView = checkUrlRecipientView;
  window.openVinylSongModal = openVinylSongModal;
  window.CURATED_VINYL_TRACKS = CURATED_VINYL_TRACKS;
  checkUrlRecipientView();

  // ==========================================================================
  // COMPLETE KEEPSAKES ENGINE (Our Keepsakes & My Keepsakes)
  // ==========================================================================
  const KEEPSAKE_KEYS = {
    SCRAPBOOKS: 'between_us_shared_scrapbooks',
    COLLECTIONS: 'between_us_personal_collections',
    ITEMS: 'between_us_personal_keepsakes'
  };

  const DEFAULT_SCRAPBOOKS = [
    {
      id: 'scrap_1',
      title: 'Me & Kabir ♡',
      partner: 'Kabir',
      theme: 'gingham',
      date: 'Oct 2026',
      updatedText: '2 hours ago',
      pages: [
        {
          pageNumber: 1,
          left: {
            type: 'polaroid',
            src: 'assets/medium_card.png',
            caption: 'Our autumn walk in the rose garden',
            rotation: -2
          },
          right: {
            type: 'note',
            author: 'Kabir',
            text: 'Remember when we sat on that stone bench until it got dark? You told me you wanted to freeze time. Me too.',
            date: 'Oct 14, 2026'
          }
        },
        {
          pageNumber: 2,
          left: {
            type: 'vinyl',
            songId: 'die-with-a-smile',
            trackName: 'Die With A Smile',
            artistName: 'Lady Gaga & Bruno Mars',
            audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/07/6a/99/076a99ed-b946-431b-6f1f-54fa187ca5bd/mzaf_8102882277995122875.plus.aac.p.m4a',
            artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/11/ae/f2/11aef294-f57c-bab9-c9fc-529162984e62/24UMGIM85348.rgb.jpg/100x100bb.jpg',
            note: 'Saanvi: Still my favourite track we listened to in the car.'
          },
          right: {
            type: 'photo_note',
            src: 'assets/medium_letter.png',
            caption: 'Coffee stain on our napkin sketch',
            author: 'Saanvi',
            text: 'Never threw away that receipt.',
            date: 'Oct 18, 2026'
          }
        },
        {
          pageNumber: 3,
          left: {
            type: 'flower',
            flowerName: 'Wild Rose',
            author: 'Kabir',
            caption: 'Picked from outside your window'
          },
          right: {
            type: 'note',
            author: 'Saanvi',
            text: 'Fourteen little memories and counting. Let us keep adding to this book forever.',
            date: 'Nov 2, 2026'
          }
        }
      ]
    },
    {
      id: 'scrap_2',
      title: 'The Spain Trip',
      partner: 'Kabir',
      theme: 'lemon',
      date: 'Aug 2026',
      updatedText: 'Aug 28, 2026',
      pages: [
        {
          pageNumber: 1,
          left: {
            type: 'polaroid',
            src: 'assets/medium_card.png',
            caption: 'Plaza Mayor in the afternoon sunshine',
            rotation: 1
          },
          right: {
            type: 'note',
            author: 'Kabir',
            text: 'The best churros and chocolate in the world.',
            date: 'Aug 22, 2026'
          }
        }
      ]
    },
    {
      id: 'scrap_3',
      title: 'Studio Days',
      partner: 'Kabir',
      theme: 'toile',
      date: 'Sep 2026',
      updatedText: 'Sep 19, 2026',
      pages: [
        {
          pageNumber: 1,
          left: {
            type: 'polaroid',
            src: 'assets/medium_letter.png',
            caption: 'Late night desk sketches',
            rotation: -1
          },
          right: {
            type: 'note',
            author: 'Saanvi',
            text: 'Cups of tea going cold while we made things together.',
            date: 'Sep 15, 2026'
          }
        }
      ]
    }
  ];

  const DEFAULT_COLLECTIONS = [
    {
      id: 'coll_received',
      title: 'Received From Others',
      subtitle: 'Gifts and cards sent to you',
      motif: '💌',
      theme: 'blush'
    },
    {
      id: 'coll_saved',
      title: 'Saved by Me',
      subtitle: 'Personal favourites held close',
      motif: '🔖',
      theme: 'sage'
    },
    {
      id: 'coll_occasions',
      title: 'Special Occasions',
      subtitle: 'Anniversaries, birthdays & moments',
      motif: '🕯',
      theme: 'burgundy'
    },
    {
      id: 'coll_letters',
      title: 'Letters & Notes',
      subtitle: 'Words to revisit on quiet days',
      motif: '✉️',
      theme: 'cream'
    }
  ];

  const DEFAULT_PERSONAL_KEEPSAKES = [
    {
      id: 'keep_1',
      collectionId: 'coll_received',
      type: 'card',
      title: 'A Little Something For You',
      from: 'Kabir',
      to: 'Saanvi',
      date: 'Nov 14, 2026',
      badge: '💌 Greeting Card',
      summary: 'Handmade card with pressed hydrangea and Taylor Swift vinyl'
    },
    {
      id: 'keep_2',
      collectionId: 'coll_received',
      type: 'postcard',
      title: 'Hawa Mahal Morning',
      from: 'Kabir',
      to: 'Saanvi',
      date: 'Sep 24, 2026',
      badge: '🖼 Postcard',
      summary: '"Thinking of you as the pigeons took flight over the pink walls..."'
    },
    {
      id: 'keep_3',
      collectionId: 'coll_received',
      type: 'bouquet',
      title: 'Wildflower & Peony Bouquet',
      from: 'Kabir',
      to: 'Saanvi',
      date: 'Oct 02, 2026',
      badge: '💐 Bouquet',
      summary: 'Blush peonies, eucalyptus, and a sealed note.'
    },
    {
      id: 'keep_4',
      collectionId: 'coll_letters',
      type: 'letter',
      title: 'A Quiet Apology & Tea',
      from: 'Kabir',
      to: 'Saanvi',
      date: 'Sep 28, 2026',
      badge: '✉️ Letter',
      summary: '"I\'m sorry about yesterday. Let\'s sit quietly with our tea tonight."'
    },
    {
      id: 'keep_5',
      collectionId: 'coll_saved',
      type: 'quick',
      subType: 'photo',
      title: 'First Sunset by the Lake',
      from: 'Saanvi',
      date: 'Aug 10, 2026',
      badge: '🖼 Polaroid Photo',
      summary: 'Taped photo with the orange and lavender sky.'
    },
    {
      id: 'keep_6',
      collectionId: 'coll_occasions',
      type: 'quick',
      subType: 'song',
      title: 'Lover – Taylor Swift',
      from: 'Kabir & Saanvi',
      date: 'Oct 14, 2026',
      badge: '🎵 Vinyl Song',
      summary: 'Our song added during the anniversary dinner.'
    }
  ];

  function getSharedScrapbooks() {
    try {
      const data = localStorage.getItem(KEEPSAKE_KEYS.SCRAPBOOKS);
      return data ? JSON.parse(data) : DEFAULT_SCRAPBOOKS;
    } catch (e) {
      return DEFAULT_SCRAPBOOKS;
    }
  }

  function saveSharedScrapbooks(scrapbooks) {
    try {
      localStorage.setItem(KEEPSAKE_KEYS.SCRAPBOOKS, JSON.stringify(scrapbooks));
    } catch (e) {}
  }

  function getPersonalCollections() {
    try {
      const data = localStorage.getItem(KEEPSAKE_KEYS.COLLECTIONS);
      return data ? JSON.parse(data) : DEFAULT_COLLECTIONS;
    } catch (e) {
      return DEFAULT_COLLECTIONS;
    }
  }

  function savePersonalCollections(colls) {
    try {
      localStorage.setItem(KEEPSAKE_KEYS.COLLECTIONS, JSON.stringify(colls));
    } catch (e) {}
  }

  function getPersonalKeepsakes() {
    try {
      const data = localStorage.getItem(KEEPSAKE_KEYS.ITEMS);
      return data ? JSON.parse(data) : DEFAULT_PERSONAL_KEEPSAKES;
    } catch (e) {
      return DEFAULT_PERSONAL_KEEPSAKES;
    }
  }

  function savePersonalKeepsakes(items) {
    try {
      localStorage.setItem(KEEPSAKE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {}
  }

  let activeScrapbookAudio = null;
  let activeScrapbookDisc = null;

  function stopScrapbookAudio() {
    if (activeScrapbookAudio) {
      activeScrapbookAudio.pause();
      activeScrapbookAudio.currentTime = 0;
      activeScrapbookAudio = null;
    }
    if (activeScrapbookDisc) {
      activeScrapbookDisc.classList.remove('spinning');
      activeScrapbookDisc = null;
    }
  }

  function renderSharedScrapbooks() {
    const container = document.getElementById('scrapbooks-container');
    if (!container) return;
    const scrapbooks = getSharedScrapbooks();

    let html = scrapbooks.map(sb => {
      const count = (sb.pages ? sb.pages.length * 2 : 6);
      return `
        <div class="scrapbook-cover-card cover-${escapeHtml(sb.theme || 'gingham')}" data-scrapbook-id="${escapeHtml(sb.id)}">
          <div class="scrapbook-ribbon"></div>
          <div class="scrapbook-label-plate">
            <h4 class="scrapbook-card-title">${escapeHtml(sb.title)}</h4>
            <span class="scrapbook-card-collab">With ${escapeHtml(sb.partner || 'Someone Special')}</span>
          </div>
          <div class="scrapbook-bottom-badge">
            <span>${count} kept moments</span>
            <span>${escapeHtml(sb.updatedText || 'Recently')}</span>
          </div>
        </div>
      `;
    }).join('');

    html += `
      <div class="scrapbook-new-card" id="btn-card-create-scrapbook">
        <div class="new-card-plus">+</div>
        <span class="new-card-label">New Shared Scrapbook</span>
      </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.scrapbook-cover-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.scrapbookId;
        openScrapbookViewer(id);
      });
    });

    const newBtn = document.getElementById('btn-card-create-scrapbook');
    if (newBtn) {
      newBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-create-scrapbook');
        if (modal) modal.style.display = 'flex';
      });
    }
  }

  function renderPersonalCollections() {
    const container = document.getElementById('collections-container');
    if (!container) return;
    const collections = getPersonalCollections();
    const items = getPersonalKeepsakes();

    let html = collections.map(col => {
      const count = items.filter(it => it.collectionId === col.id).length;
      return `
        <div class="pocket-folder-card folder-${escapeHtml(col.theme || 'blush')}" data-collection-id="${escapeHtml(col.id)}">
          <div class="pocket-peek-slip">${escapeHtml(col.motif || '🔖')}</div>
          <div class="pocket-folder-body">
            <h4 class="pocket-folder-title">${escapeHtml(col.title)}</h4>
            <p class="pocket-folder-sub">${escapeHtml(col.subtitle || '')}</p>
            <span class="pocket-count-pill">${count} item${count === 1 ? '' : 's'}</span>
          </div>
        </div>
      `;
    }).join('');

    html += `
      <div class="pocket-new-card" id="btn-card-create-collection">
        <div class="new-card-plus">+</div>
        <span class="new-card-label">New Collection</span>
      </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.pocket-folder-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.collectionId;
        openCollectionViewer(id);
      });
    });

    const newBtn = document.getElementById('btn-card-create-collection');
    if (newBtn) {
      newBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-create-collection');
        if (modal) modal.style.display = 'flex';
      });
    }
  }

  let currentScrapbook = null;
  let currentSpreadIdx = 0;

  function openScrapbookViewer(scrapbookId) {
    stopScrapbookAudio();
    const scrapbooks = getSharedScrapbooks();
    currentScrapbook = scrapbooks.find(s => s.id === scrapbookId) || scrapbooks[0];
    currentSpreadIdx = 0;

    const modal = document.getElementById('modal-scrapbook-viewer');
    const titleEl = document.getElementById('scrapbook-viewer-title');
    const subEl = document.getElementById('scrapbook-viewer-sub');

    if (titleEl) titleEl.textContent = currentScrapbook.title;
    if (subEl) subEl.textContent = `Shared with ${currentScrapbook.partner || 'Someone Special'} • ${(currentScrapbook.pages ? currentScrapbook.pages.length * 2 : 6)} kept memories`;

    renderScrapbookSpread();

    if (modal) modal.style.display = 'flex';
  }

  function renderScrapbookSpread() {
    if (!currentScrapbook || !currentScrapbook.pages || currentScrapbook.pages.length === 0) return;
    const pageData = currentScrapbook.pages[currentSpreadIdx] || currentScrapbook.pages[0];
    const leftEl = document.getElementById('scrapbook-page-left');
    const rightEl = document.getElementById('scrapbook-page-right');
    const indicatorEl = document.getElementById('scrapbook-page-indicator');

    if (indicatorEl) {
      indicatorEl.textContent = `Page ${currentSpreadIdx + 1} of ${currentScrapbook.pages.length}`;
    }

    if (leftEl) leftEl.innerHTML = renderPageSlot(pageData.left);
    if (rightEl) rightEl.innerHTML = renderPageSlot(pageData.right);

    // Wire up vinyl click in scrapbook spread if present
    const disc = document.querySelector('.scrapbook-vinyl-disc');
    if (disc) {
      disc.addEventListener('click', () => {
        const audioSrc = disc.dataset.audioSrc;
        if (!audioSrc) return;
        if (activeScrapbookAudio && !activeScrapbookAudio.paused) {
          stopScrapbookAudio();
        } else {
          stopScrapbookAudio();
          activeScrapbookAudio = new Audio(audioSrc);
          activeScrapbookDisc = disc;
          disc.classList.add('spinning');
          activeScrapbookAudio.play().catch(e => console.log('Audio autoplay prevented'));
          activeScrapbookAudio.onended = () => {
            disc.classList.remove('spinning');
            activeScrapbookAudio = null;
            activeScrapbookDisc = null;
          };
        }
      });
    }
  }

  function renderPageSlot(slot) {
    if (!slot) return '<div class="scrapbook-empty-slot"></div>';
    if (slot.type === 'polaroid') {
      return `
        <div class="scrapbook-polaroid" style="transform: rotate(${slot.rotation || 0}deg);">
          <img src="${escapeHtml(slot.src || 'assets/medium_card.png')}" alt="Memory" class="scrapbook-polaroid-img" />
          <p class="scrapbook-polaroid-caption">${escapeHtml(slot.caption || 'Captured moment')}</p>
        </div>
      `;
    } else if (slot.type === 'note') {
      return `
        <div class="scrapbook-note-card">
          <div class="scrapbook-note-author">
            <span>✍️ ${escapeHtml(slot.author || 'Me')}</span>
            <span style="font-weight:normal; color:#87585F; margin-left:auto;">${escapeHtml(slot.date || '')}</span>
          </div>
          <p class="scrapbook-note-text">"${escapeHtml(slot.text || '')}"</p>
        </div>
      `;
    } else if (slot.type === 'vinyl') {
      return `
        <div class="scrapbook-vinyl-widget">
          <div class="scrapbook-vinyl-disc" data-audio-src="${escapeHtml(slot.audioSrc || '')}" title="Click to Play / Pause Song">
            <div class="scrapbook-vinyl-label"></div>
          </div>
          <div class="scrapbook-vinyl-info">
            <p class="scrapbook-vinyl-track">🎵 ${escapeHtml(slot.trackName || 'Our Song')}</p>
            <p class="scrapbook-vinyl-artist">${escapeHtml(slot.artistName || 'Artist')}</p>
            <small style="color:#C97384; font-size:9.5px;">${escapeHtml(slot.note || 'Tap vinyl disc to play')}</small>
          </div>
        </div>
      `;
    } else if (slot.type === 'photo_note') {
      return `
        <div class="scrapbook-polaroid" style="transform: rotate(-1deg);">
          <img src="${escapeHtml(slot.src || 'assets/medium_letter.png')}" alt="Memory" class="scrapbook-polaroid-img" style="height:110px;" />
          <p class="scrapbook-polaroid-caption" style="font-weight:600;">${escapeHtml(slot.caption || '')}</p>
          <p style="font-size:10.5px; color:#521319; margin:4px 0 0; font-style:italic;">"${escapeHtml(slot.text || '')}"</p>
        </div>
      `;
    } else if (slot.type === 'flower') {
      return `
        <div class="scrapbook-note-card" style="background:#FFF9F6; border-color:#F1CAD3;">
          <div class="scrapbook-note-author">
            <span>🌸 Pressed ${escapeHtml(slot.flowerName || 'Flower')}</span>
            <span style="font-weight:normal; color:#87585F; margin-left:auto;">From ${escapeHtml(slot.author || 'Someone')}</span>
          </div>
          <div style="font-size:28px; text-align:center; padding:10px 0;">🌺</div>
          <p class="scrapbook-note-text" style="text-align:center;">"${escapeHtml(slot.caption || 'A flower kept forever')}"</p>
        </div>
      `;
    }
    return '';
  }

  // Invite Link
  const btnScrapbookInvite = document.getElementById('btn-scrapbook-invite');
  if (btnScrapbookInvite) {
    btnScrapbookInvite.addEventListener('click', () => {
      const inviteUrl = `https://betweenus.love/scrapbook/invite?id=${currentScrapbook ? currentScrapbook.id : 'scrap_1'}`;
      navigator.clipboard.writeText(inviteUrl).then(() => {
        showToast('Invite link copied! Send it to your favourite person to contribute.');
      }).catch(() => {
        showToast('Invite link: ' + inviteUrl);
      });
    });
  }

  // Prev / Next Page Spread
  const btnPrevPage = document.getElementById('btn-scrapbook-prev-page');
  const btnNextPage = document.getElementById('btn-scrapbook-next-page');
  if (btnPrevPage) {
    btnPrevPage.addEventListener('click', () => {
      if (!currentScrapbook || !currentScrapbook.pages) return;
      if (currentSpreadIdx > 0) {
        currentSpreadIdx--;
        stopScrapbookAudio();
        renderScrapbookSpread();
      }
    });
  }
  if (btnNextPage) {
    btnNextPage.addEventListener('click', () => {
      if (!currentScrapbook || !currentScrapbook.pages) return;
      if (currentSpreadIdx < currentScrapbook.pages.length - 1) {
        currentSpreadIdx++;
        stopScrapbookAudio();
        renderScrapbookSpread();
      }
    });
  }

  // Close scrapbook viewer
  const btnCloseScrapbook = document.getElementById('btn-close-scrapbook-viewer');
  if (btnCloseScrapbook) {
    btnCloseScrapbook.addEventListener('click', () => {
      stopScrapbookAudio();
      const modal = document.getElementById('modal-scrapbook-viewer');
      if (modal) modal.style.display = 'none';
    });
  }

  // Add Memory Modal Open
  const btnAddMemory = document.getElementById('btn-scrapbook-add-memory');
  if (btnAddMemory) {
    btnAddMemory.addEventListener('click', () => {
      const modal = document.getElementById('modal-add-scrapbook-memory');
      if (!modal) return;
      const songSelect = document.getElementById('memory-song-select');
      if (songSelect && songSelect.children.length === 0 && window.CURATED_VINYL_TRACKS) {
        songSelect.innerHTML = window.CURATED_VINYL_TRACKS.map(t => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.num)}. ${escapeHtml(t.trackName)} — ${escapeHtml(t.artistName)}</option>`).join('');
      }
      modal.style.display = 'flex';
    });
  }

  // Form Add Memory Submit
  const formAddMemory = document.getElementById('form-add-scrapbook-memory');
  if (formAddMemory) {
    formAddMemory.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentScrapbook) return;
      const activeTypeBtn = document.querySelector('#memory-type-selector .type-pill-btn.active');
      const memType = activeTypeBtn ? activeTypeBtn.dataset.type : 'note';
      const author = document.getElementById('memory-input-author')?.value || 'Saanvi';
      const caption = document.getElementById('memory-input-caption')?.value || 'A sweet memory';

      let newSlot = null;
      if (memType === 'note') {
        newSlot = {
          type: 'note',
          author: author,
          text: caption,
          date: 'Just now'
        };
      } else if (memType === 'song') {
        const songId = document.getElementById('memory-song-select')?.value;
        const song = (window.CURATED_VINYL_TRACKS || []).find(s => s.id === songId) || (window.CURATED_VINYL_TRACKS || [])[0];
        newSlot = {
          type: 'vinyl',
          songId: song.id,
          trackName: song.trackName,
          artistName: song.artistName,
          audioSrc: song.audioSrc,
          note: `${author}: ${caption}`
        };
      } else if (memType === 'photo') {
        newSlot = {
          type: 'polaroid',
          src: 'assets/medium_card.png',
          caption: caption,
          rotation: Math.floor(Math.random() * 5) - 2
        };
      } else if (memType === 'flower') {
        const activeFlBtn = document.querySelector('#memory-flower-picker .flower-opt-btn.active');
        const flName = activeFlBtn ? activeFlBtn.textContent.trim() : 'Wild Rose';
        newSlot = {
          type: 'flower',
          flowerName: flName,
          author: author,
          caption: caption
        };
      }

      if (!currentScrapbook.pages) currentScrapbook.pages = [];
      currentScrapbook.pages.push({
        pageNumber: currentScrapbook.pages.length + 1,
        left: newSlot,
        right: {
          type: 'note',
          author: author === 'Saanvi' ? (currentScrapbook.partner || 'Kabir') : 'Saanvi',
          text: 'Pinned to our scrapbook ♡',
          date: 'Today'
        }
      });

      const scrapbooks = getSharedScrapbooks();
      const idx = scrapbooks.findIndex(s => s.id === currentScrapbook.id);
      if (idx !== -1) scrapbooks[idx] = currentScrapbook;
      saveSharedScrapbooks(scrapbooks);

      currentSpreadIdx = currentScrapbook.pages.length - 1;
      renderScrapbookSpread();
      renderSharedScrapbooks();

      document.getElementById('modal-add-scrapbook-memory').style.display = 'none';
      showToast('Memory pinned to your shared scrapbook! ♡');
    });
  }

  // Form Create Scrapbook Submit
  const formCreateScrapbook = document.getElementById('form-create-scrapbook');
  if (formCreateScrapbook) {
    formCreateScrapbook.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('scrapbook-input-title')?.value.trim();
      const partner = document.getElementById('scrapbook-input-partner')?.value.trim() || 'Someone Special';
      const activeThemeBtn = document.querySelector('#scrapbook-cover-picker .cover-opt-btn.active');
      const theme = activeThemeBtn ? activeThemeBtn.dataset.coverTheme : 'gingham';

      if (!title) return;

      const newBook = {
        id: 'scrap_' + Date.now(),
        title: title,
        partner: partner,
        theme: theme,
        date: 'Today',
        updatedText: 'Just now',
        pages: [
          {
            pageNumber: 1,
            left: {
              type: 'polaroid',
              src: 'assets/medium_card.png',
              caption: 'First page of our story',
              rotation: -1
            },
            right: {
              type: 'note',
              author: 'Saanvi',
              text: 'Every story begins somewhere. This one is ours.',
              date: 'Today'
            }
          }
        ]
      };

      const scrapbooks = getSharedScrapbooks();
      scrapbooks.unshift(newBook);
      saveSharedScrapbooks(scrapbooks);
      renderSharedScrapbooks();

      document.getElementById('modal-create-scrapbook').style.display = 'none';
      showToast('Shared scrapbook created! Invite ' + partner + ' to add memories.');
      openScrapbookViewer(newBook.id);
    });
  }

  // Collection Viewer
  let activeViewingCollectionId = null;
  let activeViewingFilter = 'all';

  function openCollectionViewer(collId) {
    activeViewingCollectionId = collId;
    activeViewingFilter = 'all';
    const collections = getPersonalCollections();
    const coll = collections.find(c => c.id === collId) || collections[0];

    const modal = document.getElementById('modal-collection-viewer');
    const iconEl = document.getElementById('coll-viewer-icon');
    const titleEl = document.getElementById('coll-viewer-title');

    if (iconEl) iconEl.textContent = coll.motif || '🔖';
    if (titleEl) titleEl.textContent = coll.title;

    renderCollectionItemsGrid();

    if (modal) modal.style.display = 'flex';
  }

  function renderCollectionItemsGrid() {
    const grid = document.getElementById('coll-items-grid');
    if (!grid) return;
    const allItems = getPersonalKeepsakes();
    let filtered = allItems.filter(it => it.collectionId === activeViewingCollectionId);

    if (activeViewingFilter !== 'all') {
      filtered = filtered.filter(it => it.type === activeViewingFilter || (it.type === 'quick' && activeViewingFilter === 'quick'));
    }

    const subEl = document.getElementById('coll-viewer-sub');
    if (subEl) subEl.textContent = `${filtered.length} saved keepsakes • Private collection`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 36px 16px; color: #87585F;">
          <div style="font-size: 32px; margin-bottom: 8px;">💌</div>
          <h4 style="font-family:'Playfair Display',serif; color:#521319; margin: 0 0 4px;">Nothing here yet</h4>
          <p style="font-size: 12px; margin: 0;">Preserve cards, letters, and memories into this pocket folder.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(it => `
      <div class="collection-item-card" data-item-id="${escapeHtml(it.id)}">
        <span class="collection-item-badge">${escapeHtml(it.badge || 'Keepsake')}</span>
        <h4 class="collection-item-title">${escapeHtml(it.title)}</h4>
        <p class="collection-item-sub">From: ${escapeHtml(it.from || 'Someone')} • ${escapeHtml(it.date || '')}</p>
        <p style="font-size: 11px; color: #521319; margin: 0; font-style: italic;">${escapeHtml(it.summary || '')}</p>
      </div>
    `).join('');

    grid.querySelectorAll('.collection-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.itemId;
        const item = allItems.find(i => i.id === id);
        if (item) {
          if (item.type === 'card' && typeof renderRecipientCardExperience === 'function') {
            renderRecipientCardExperience(item);
          } else if (item.type === 'letter' && typeof renderRecipientLetterExperience === 'function') {
            renderRecipientLetterExperience(item);
          } else if (item.type === 'bouquet' && typeof renderRecipientBouquetExperience === 'function') {
            renderRecipientBouquetExperience(item);
          } else if (typeof renderRecipientExperience === 'function') {
            renderRecipientExperience(item);
          } else {
            showToast(`Viewing keepsake: ${item.title}`);
          }
        }
      });
    });
  }

  const collFilterBtns = document.querySelectorAll('.coll-filter-btn');
  collFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      collFilterBtns.forEach(b => b.classList.toggle('active', b === btn));
      activeViewingFilter = btn.dataset.filter;
      renderCollectionItemsGrid();
    });
  });

  const btnCollQuickAdd = document.getElementById('btn-coll-quick-add');
  if (btnCollQuickAdd) {
    btnCollQuickAdd.addEventListener('click', () => {
      openQuickAddModal('note');
    });
  }

  // Create Collection Form Submit
  const formCreateColl = document.getElementById('form-create-collection');
  if (formCreateColl) {
    formCreateColl.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('coll-input-title')?.value.trim();
      const activeThemeBtn = document.querySelector('#coll-theme-picker .folder-theme-opt.active');
      const theme = activeThemeBtn ? activeThemeBtn.dataset.folderTheme : 'blush';
      const activeMotifBtn = document.querySelector('#coll-motif-picker .motif-opt-btn.active');
      const motif = activeMotifBtn ? activeMotifBtn.dataset.motif : '🔖';

      if (!title) return;

      const newColl = {
        id: 'coll_' + Date.now(),
        title: title,
        subtitle: 'Personal collection',
        motif: motif,
        theme: theme
      };

      const colls = getPersonalCollections();
      colls.push(newColl);
      savePersonalCollections(colls);
      renderPersonalCollections();

      document.getElementById('modal-create-collection').style.display = 'none';
      showToast('New collection folder created! ♡');
    });
  }

  // Quick Add Modal & Submit
  function openQuickAddModal(type) {
    const modal = document.getElementById('modal-quick-add');
    if (!modal) return;

    const badge = document.getElementById('quick-add-badge-icon');
    const heading = document.getElementById('quick-add-heading');

    const icons = { photo: '🖼', song: '🎵', note: '📝', sticker: '🌸', memory: '♡' };
    const titles = { photo: 'Quick Add Photo', song: 'Quick Add Song', note: 'Quick Add Note', sticker: 'Quick Add Sticker', memory: 'Quick Add Memory' };

    if (badge) badge.textContent = icons[type] || '✨';
    if (heading) heading.textContent = titles[type] || 'Quick Add to My Keepsakes';

    const collSelect = document.getElementById('quick-add-target-coll');
    if (collSelect) {
      const colls = getPersonalCollections();
      collSelect.innerHTML = colls.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.motif)} ${escapeHtml(c.title)}</option>`).join('');
    }

    const songSelect = document.getElementById('quick-add-song-select');
    if (songSelect && songSelect.children.length === 0 && window.CURATED_VINYL_TRACKS) {
      songSelect.innerHTML = window.CURATED_VINYL_TRACKS.map(t => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.num)}. ${escapeHtml(t.trackName)} — ${escapeHtml(t.artistName)}</option>`).join('');
    }

    document.getElementById('quick-field-note').style.display = (type === 'note' || type === 'memory') ? 'block' : 'none';
    document.getElementById('quick-field-song').style.display = (type === 'song') ? 'block' : 'none';
    document.getElementById('quick-field-photo').style.display = (type === 'photo') ? 'block' : 'none';
    document.getElementById('quick-field-sticker').style.display = (type === 'sticker') ? 'block' : 'none';

    modal.dataset.quickType = type;
    modal.style.display = 'flex';
  }

  const formQuickAdd = document.getElementById('form-quick-add');
  if (formQuickAdd) {
    formQuickAdd.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = document.getElementById('modal-quick-add');
      const type = modal ? modal.dataset.quickType || 'note' : 'note';
      const targetCollId = document.getElementById('quick-add-target-coll')?.value || 'coll_saved';
      const title = document.getElementById('quick-add-title')?.value.trim() || 'Saved Moment';

      let summary = '';
      if (type === 'note' || type === 'memory') {
        summary = document.getElementById('quick-add-note-text')?.value.trim() || 'A handwritten memory';
      } else if (type === 'song') {
        const songId = document.getElementById('quick-add-song-select')?.value;
        const song = (window.CURATED_VINYL_TRACKS || []).find(s => s.id === songId) || (window.CURATED_VINYL_TRACKS || [])[0];
        summary = `${song.trackName} — ${song.artistName}`;
      } else if (type === 'photo') {
        summary = 'Polaroid photo memory';
      } else if (type === 'sticker') {
        summary = 'Decorative sticker preserved';
      }

      const badges = { photo: '🖼 Polaroid Photo', song: '🎵 Vinyl Song', note: '📝 Personal Note', sticker: '🌸 Sticker', memory: '♡ Memory' };

      const newItem = {
        id: 'keep_' + Date.now(),
        collectionId: targetCollId,
        type: 'quick',
        subType: type,
        title: title,
        from: 'Saanvi',
        date: 'Today',
        badge: badges[type] || '🔖 Keepsake',
        summary: summary
      };

      const items = getPersonalKeepsakes();
      items.unshift(newItem);
      savePersonalKeepsakes(items);

      renderPersonalCollections();
      if (modal) modal.style.display = 'none';
      showToast('Saved to My Keepsakes! ♡');
    });
  }

  // Hero Card Clicks
  const heroOurKeepsakes = document.getElementById('hero-our-keepsakes');
  const heroMyKeepsakes = document.getElementById('hero-my-keepsakes');
  const sectionOurKeepsakes = document.getElementById('section-our-keepsakes');
  const sectionMyKeepsakes = document.getElementById('section-my-keepsakes');

  if (heroOurKeepsakes && sectionOurKeepsakes) {
    heroOurKeepsakes.addEventListener('click', () => {
      heroOurKeepsakes.classList.add('active');
      if (heroMyKeepsakes) heroMyKeepsakes.classList.remove('active');
      sectionOurKeepsakes.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (heroMyKeepsakes && sectionMyKeepsakes) {
    heroMyKeepsakes.addEventListener('click', () => {
      heroMyKeepsakes.classList.add('active');
      if (heroOurKeepsakes) heroOurKeepsakes.classList.remove('active');
      sectionMyKeepsakes.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Action Buttons
  const btnCreateScrapbook = document.getElementById('btn-create-scrapbook');
  if (btnCreateScrapbook) {
    btnCreateScrapbook.addEventListener('click', () => {
      const modal = document.getElementById('modal-create-scrapbook');
      if (modal) modal.style.display = 'flex';
    });
  }
  const btnCreateCollection = document.getElementById('btn-create-collection');
  if (btnCreateCollection) {
    btnCreateCollection.addEventListener('click', () => {
      const modal = document.getElementById('modal-create-collection');
      if (modal) modal.style.display = 'flex';
    });
  }

  // Quick Add Pills
  document.querySelectorAll('.quick-add-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      openQuickAddModal(pill.dataset.quick);
    });
  });

  bindModalCloser('btn-close-create-scrapbook', 'modal-create-scrapbook');
  bindModalCloser('btn-cancel-create-scrapbook', 'modal-create-scrapbook');
  bindModalCloser('btn-close-add-memory', 'modal-add-scrapbook-memory');
  bindModalCloser('btn-cancel-add-memory', 'modal-add-scrapbook-memory');
  bindModalCloser('btn-close-collection-viewer', 'modal-collection-viewer');
  bindModalCloser('btn-close-create-coll', 'modal-create-collection');
  bindModalCloser('btn-cancel-create-coll', 'modal-create-collection');
  bindModalCloser('btn-close-quick-add', 'modal-quick-add');
  bindModalCloser('btn-cancel-quick-add', 'modal-quick-add');

  // Option Picker Toggles
  const bindChoiceGroup = (selector) => {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.toggle('active', b === btn));
      });
    });
  };
  bindChoiceGroup('#scrapbook-cover-picker .cover-opt-btn');
  bindChoiceGroup('#coll-theme-picker .folder-theme-opt');
  bindChoiceGroup('#coll-motif-picker .motif-opt-btn');
  bindChoiceGroup('#memory-flower-picker .flower-opt-btn');
  bindChoiceGroup('#quick-sticker-picker .sticker-choice-btn');

  // Memory Type Selector in Add Memory Modal
  document.querySelectorAll('#memory-type-selector .type-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#memory-type-selector .type-pill-btn').forEach(b => b.classList.toggle('active', b === btn));
      const t = btn.dataset.type;
      const grpCaption = document.getElementById('grp-memory-caption');
      const grpSong = document.getElementById('grp-memory-song');
      const grpPhoto = document.getElementById('grp-memory-photo');
      const grpFlower = document.getElementById('grp-memory-flower');
      if (grpCaption) grpCaption.style.display = 'block';
      if (grpSong) grpSong.style.display = (t === 'song') ? 'block' : 'none';
      if (grpPhoto) grpPhoto.style.display = (t === 'photo') ? 'block' : 'none';
      if (grpFlower) grpFlower.style.display = (t === 'flower') ? 'block' : 'none';
    });
  });

  // Global renderKeepsakesRoom
  function renderKeepsakesRoom() {
    renderSharedScrapbooks();
    renderPersonalCollections();
  }
  window.renderKeepsakesRoom = renderKeepsakesRoom;

  const keepsakesNavTab = document.querySelector('.nav-tab[data-room="keepsakes"]');
  if (keepsakesNavTab) {
    keepsakesNavTab.addEventListener('click', renderKeepsakesRoom);
  }

  // ==========================================================================
  // COMPLETE PROFILE ENGINE (My Profile, My People, Notifications, Privacy, Help)
  // ==========================================================================
  const PROFILE_KEYS = {
    USER: 'between_us_auth_user',
    CONTACTS: 'between_us_contacts',
    NOTIFS: 'between_us_notifications',
    NOTIF_PREFS: 'between_us_notif_prefs',
    TICKETS: 'between_us_support_tickets',
    LINKS: 'between_us_shared_links'
  };

  const DEFAULT_USER = {
    name: 'Saanvi',
    email: 'saanvi@gmail.com',
    bio: 'Making little somethings for the people I love ♡',
    avatar: 'S',
    loggedIn: true
  };

  const DEFAULT_NOTIFICATIONS = [
    {
      id: 'notif_welcome',
      type: 'incoming',
      title: 'Welcome to A Little Something ♡',
      body: 'Your creative space is all set. You can craft postcards, letters, bouquets, and greeting cards anytime.',
      timeText: 'Just now',
      unread: true
    },
    {
      id: 'notif_people_tip',
      type: 'reminder',
      title: 'Add your favourite people',
      body: 'Save names in My People to quickly dedicate creations and remember birthdays.',
      timeText: '1 hour ago',
      unread: true
    }
  ];

  function getProfileUser() {
    try {
      const data = localStorage.getItem(PROFILE_KEYS.USER);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return { ...DEFAULT_USER };
  }

  function saveProfileUser(u) {
    localStorage.setItem(PROFILE_KEYS.USER, JSON.stringify(u));
    updateProfileUI();
  }

  function getContactsList() {
    try {
      const data = localStorage.getItem(PROFILE_KEYS.CONTACTS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return []; // Starts empty per user requirement
  }

  function saveContactsList(list) {
    localStorage.setItem(PROFILE_KEYS.CONTACTS, JSON.stringify(list));
    renderMyPeople();
  }

  function getNotificationsList() {
    try {
      const data = localStorage.getItem(PROFILE_KEYS.NOTIFS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return DEFAULT_NOTIFICATIONS;
  }

  function saveNotificationsList(list) {
    localStorage.setItem(PROFILE_KEYS.NOTIFS, JSON.stringify(list));
    updateNotifBadge();
    renderNotifications();
  }

  function getSharedLinksList() {
    try {
      const data = localStorage.getItem(PROFILE_KEYS.LINKS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [
      {
        id: 'link_demo_1',
        title: 'Autumn Postcard for Kabir',
        recipient: 'Kabir',
        date: 'Oct 6, 2026',
        url: 'https://betweenus.love/#for-kabir',
        revoked: false
      }
    ];
  }

  function saveSharedLinksList(links) {
    localStorage.setItem(PROFILE_KEYS.LINKS, JSON.stringify(links));
  }

  // Record link in shared links when dispatching
  function recordSharedLink(title, recipient, url) {
    const links = getSharedLinksList();
    links.unshift({
      id: 'link_' + Date.now(),
      title: title || 'A Little Something Gift',
      recipient: recipient || 'Friend',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      url: url,
      revoked: false
    });
    saveSharedLinksList(links);
  }
  window.recordSharedLink = recordSharedLink;

  // Update Profile Hub & Global Elements
  function updateProfileUI() {
    const user = getProfileUser();
    const avatarEl = document.getElementById('profile-avatar-display');
    const nameEl = document.getElementById('profile-name-display');
    const emailEl = document.getElementById('profile-email-display');
    const bioEl = document.getElementById('profile-bio-display');
    const sessionStatusEl = document.getElementById('profile-session-status');
    const contactNameInp = document.getElementById('contact-name');
    const contactEmailInp = document.getElementById('contact-email');
    const privacyEmailSub = document.getElementById('privacy-current-email-sub');

    if (avatarEl) avatarEl.textContent = user.avatar || user.name.charAt(0).toUpperCase();
    if (nameEl) nameEl.textContent = user.name || 'Saanvi';
    if (emailEl) emailEl.textContent = user.email || 'saanvi@gmail.com';
    if (bioEl) {
      const cleanBio = (user.bio || '').replace(/^["']+|["']+$/g, '');
      bioEl.textContent = cleanBio ? `"${cleanBio}"` : '';
    }
    if (sessionStatusEl) {
      sessionStatusEl.textContent = user.loggedIn ? `Logged in as ${user.name}` : 'Not signed in';
    }
    if (contactNameInp) contactNameInp.value = user.name || '';
    if (contactEmailInp) contactEmailInp.value = user.email || '';
    if (privacyEmailSub) privacyEmailSub.textContent = `Current: ${user.email}`;

    // Update Studio FROM inputs with active profile user name
    const postcardFrom = document.getElementById('postcard-from-input');
    if (postcardFrom) postcardFrom.value = user.name;
    const letterFrom = document.getElementById('letter-from-input');
    if (letterFrom) letterFrom.value = user.name;
    const bouquetFrom = document.getElementById('bouquet-from-input');
    if (bouquetFrom) bouquetFrom.value = user.name;
    const cardInsideFrom = document.getElementById('card-inside-from-input');
    if (cardInsideFrom) cardInsideFrom.value = user.name;

    updateNotifBadge();
  }

  function updateNotifBadge() {
    const notifs = getNotificationsList();
    const hasUnread = notifs.some(n => n.unread);
    const dot = document.getElementById('notifications-unread-dot');
    if (dot) dot.style.display = hasUnread ? 'block' : 'none';
  }

  // Navigation between Profile Hub and Subpages
  function showProfileHub() {
    const hub = document.getElementById('profile-hub-view');
    if (hub) hub.style.display = 'block';
    document.querySelectorAll('.profile-subpage').forEach(sp => sp.style.display = 'none');
  }

  function showProfileSubpage(subpageKey) {
    const hub = document.getElementById('profile-hub-view');
    if (hub) hub.style.display = 'none';
    document.querySelectorAll('.profile-subpage').forEach(sp => sp.style.display = 'none');

    const targetSubpage = document.getElementById(`subpage-${subpageKey}`);
    if (targetSubpage) {
      targetSubpage.style.display = 'flex';
      if (subpageKey === 'my-people') renderMyPeople();
      if (subpageKey === 'notifications') renderNotifications();
      if (subpageKey === 'privacy') updateProfileUI();
      if (subpageKey === 'help') {
        const firstTab = document.querySelector('.help-tab-btn[data-help-tab="faqs"]');
        if (firstTab) firstTab.click();
      }
    }
  }

  // Back button in all subpages
  document.querySelectorAll('.btn-subpage-back').forEach(btn => {
    btn.addEventListener('click', () => {
      showProfileHub();
    });
  });

  // Hub Menu Card Click Listeners
  const menuPeople = document.getElementById('menu-my-people');
  if (menuPeople) menuPeople.addEventListener('click', () => showProfileSubpage('my-people'));

  const menuNotifs = document.getElementById('menu-notifications');
  if (menuNotifs) menuNotifs.addEventListener('click', () => showProfileSubpage('notifications'));

  const menuPrivacy = document.getElementById('menu-privacy');
  if (menuPrivacy) menuPrivacy.addEventListener('click', () => showProfileSubpage('privacy'));

  const menuHelp = document.getElementById('menu-help');
  if (menuHelp) menuHelp.addEventListener('click', () => showProfileSubpage('help'));

  // Switch Account / Sign In button
  const btnSwitchAccount = document.getElementById('btn-profile-switch-account');
  if (btnSwitchAccount) {
    btnSwitchAccount.addEventListener('click', () => {
      const modal = document.getElementById('auth-modal');
      if (modal) modal.style.display = 'flex';
    });
  }

  // ================= 1. MY PROFILE: EDIT PROFILE MODAL =================
  const btnOpenEditProfile = document.getElementById('btn-open-edit-profile');
  const modalEditProfile = document.getElementById('modal-edit-profile');
  const formEditProfile = document.getElementById('form-edit-profile');
  let selectedAvatarVal = 'S';

  if (btnOpenEditProfile && modalEditProfile) {
    btnOpenEditProfile.addEventListener('click', () => {
      const user = getProfileUser();
      const nameInp = document.getElementById('edit-profile-name');
      const emailInp = document.getElementById('edit-profile-email');
      const bioInp = document.getElementById('edit-profile-bio');

      if (nameInp) nameInp.value = user.name || '';
      if (emailInp) emailInp.value = user.email || '';
      if (bioInp) bioInp.value = (user.bio || '').replace(/^"|"$/g, '');

      selectedAvatarVal = user.avatar || user.name.charAt(0).toUpperCase();
      document.querySelectorAll('#edit-avatar-choices .avatar-choice-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.avatarVal === selectedAvatarVal);
      });

      modalEditProfile.style.display = 'flex';
    });
  }

  document.querySelectorAll('#edit-avatar-choices .avatar-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedAvatarVal = btn.dataset.avatarVal;
      document.querySelectorAll('#edit-avatar-choices .avatar-choice-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  if (formEditProfile) {
    formEditProfile.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInp = document.getElementById('edit-profile-name');
      const emailInp = document.getElementById('edit-profile-email');
      const bioInp = document.getElementById('edit-profile-bio');

      const user = getProfileUser();
      user.name = (nameInp ? nameInp.value.trim() : user.name) || 'Saanvi';
      user.email = (emailInp ? emailInp.value.trim() : user.email) || 'saanvi@gmail.com';
      user.bio = bioInp ? bioInp.value.trim() : user.bio;
      user.avatar = selectedAvatarVal || user.name.charAt(0).toUpperCase();

      saveProfileUser(user);
      if (modalEditProfile) modalEditProfile.style.display = 'none';
      if (typeof showToast === 'function') showToast('Profile updated ♡');
    });
  }

  // ================= 2. MY PEOPLE ADDRESS BOOK ENGINE =================
  let currentPeopleFilter = 'all';
  let currentPeopleSearch = '';

  const peopleSearchInput = document.getElementById('people-search-input');
  if (peopleSearchInput) {
    peopleSearchInput.addEventListener('input', (e) => {
      currentPeopleSearch = e.target.value.toLowerCase().trim();
      renderMyPeople();
    });
  }

  document.querySelectorAll('#people-filter-pills .people-pill-btn').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#people-filter-pills .people-pill-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentPeopleFilter = pill.dataset.peopleFilter;
      renderMyPeople();
    });
  });

  function renderMyPeople() {
    const container = document.getElementById('people-contacts-list');
    const emptyState = document.getElementById('people-empty-state');
    if (!container) return;

    const contacts = getContactsList();

    let filtered = contacts.filter(c => {
      if (currentPeopleFilter === 'fav' && !c.isFav) return false;
      if (currentPeopleFilter === 'bday' && !c.birthday) return false;
      if (currentPeopleSearch) {
        const nMatch = (c.name || '').toLowerCase().includes(currentPeopleSearch);
        const eMatch = (c.email || '').toLowerCase().includes(currentPeopleSearch);
        const rMatch = (c.relationship || '').toLowerCase().includes(currentPeopleSearch);
        if (!nMatch && !eMatch && !rMatch) return false;
      }
      return true;
    });

    if (contacts.length === 0 || filtered.length === 0) {
      container.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      if (emptyState) {
        const emptyH4 = emptyState.querySelector('h4');
        const emptyP = emptyState.querySelector('p');
        if (contacts.length === 0) {
          if (emptyH4) emptyH4.textContent = 'No saved people yet';
          if (emptyP) emptyP.textContent = 'Add someone special to quickly select them when creating cards, letters and bouquets.';
        } else {
          if (emptyH4) emptyH4.textContent = 'No matching contacts found';
          if (emptyP) emptyP.textContent = 'Try clearing your search or filter pills.';
        }
      }
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'grid';
    container.innerHTML = '';

    filtered.forEach(person => {
      const card = document.createElement('div');
      card.className = 'contact-card';

      const initial = person.name ? person.name.charAt(0).toUpperCase() : '?';
      const bdayDisplay = person.birthday ? `🎂 ${formatBday(person.birthday)}` : '';

      card.innerHTML = `
        <div class="contact-main-row">
          <div class="contact-avatar">${initial}</div>
          <div class="contact-info">
            <div class="contact-name-row">
              <h4 class="contact-name">${escapeHtml(person.name)}</h4>
              <span class="contact-rel-badge">${escapeHtml(person.relationship || 'Friend')}</span>
            </div>
            ${person.email ? `<p class="contact-email">${escapeHtml(person.email)}</p>` : ''}
          </div>
        </div>
        ${bdayDisplay || person.notes ? `
          <div class="contact-details-row">
            ${bdayDisplay ? `<span class="contact-bday-pill">${bdayDisplay}</span>` : ''}
            ${person.notes ? `<span class="contact-notes-pill">"${escapeHtml(person.notes)}"</span>` : ''}
          </div>
        ` : ''}
        <div class="contact-actions-row">
          <button type="button" class="btn-contact-action star ${person.isFav ? 'active' : ''}" data-person-id="${person.id}" title="${person.isFav ? 'Unstar' : 'Star as Favourite'}">
            ${person.isFav ? '★' : '☆'}
          </button>
          <button type="button" class="btn-contact-action edit" data-person-id="${person.id}" title="Edit contact">
            ✏️
          </button>
          <button type="button" class="btn-contact-action delete" data-person-id="${person.id}" title="Delete contact">
            🗑️
          </button>
        </div>
      `;

      // Star toggle
      const starBtn = card.querySelector('.btn-contact-action.star');
      if (starBtn) {
        starBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleFavoritePerson(person.id);
        });
      }

      // Edit contact
      const editBtn = card.querySelector('.btn-contact-action.edit');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openEditPersonModal(person);
        });
      }

      // Delete contact
      const delBtn = card.querySelector('.btn-contact-action.delete');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deletePerson(person.id);
        });
      }

      container.appendChild(card);
    });
  }

  function formatBday(dateStr) {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch (e) {}
    return dateStr;
  }

  function toggleFavoritePerson(id) {
    const list = getContactsList();
    const target = list.find(c => c.id === id);
    if (target) {
      target.isFav = !target.isFav;
      saveContactsList(list);
    }
  }

  function deletePerson(id) {
    let list = getContactsList();
    list = list.filter(c => c.id !== id);
    saveContactsList(list);
    if (typeof showToast === 'function') showToast('Contact removed');
  }

  // Add / Edit Person Modal
  const modalAddPerson = document.getElementById('modal-add-person');
  const formAddPerson = document.getElementById('form-add-person');
  const btnAddPerson = document.getElementById('btn-add-person');
  const btnPeopleEmptyAdd = document.getElementById('btn-people-empty-add');
  const btnDeletePerson = document.getElementById('btn-delete-person');

  function openAddPersonModal() {
    if (!modalAddPerson) return;
    const titleEl = document.getElementById('person-modal-title');
    const subEl = document.getElementById('person-modal-sub');
    const idInput = document.getElementById('person-edit-id');
    const nameInput = document.getElementById('person-name-input');
    const emailInput = document.getElementById('person-email-input');
    const relSelect = document.getElementById('person-rel-select');
    const bdayInput = document.getElementById('person-bday-input');
    const notesInput = document.getElementById('person-notes-input');
    const favCheckbox = document.getElementById('person-fav-checkbox');

    if (titleEl) titleEl.textContent = 'Add to My People';
    if (subEl) subEl.textContent = 'Save recipient details for quick and thoughtful gifting.';
    if (idInput) idInput.value = '';
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (relSelect) relSelect.value = 'Friend';
    if (bdayInput) bdayInput.value = '';
    if (notesInput) notesInput.value = '';
    if (favCheckbox) favCheckbox.checked = false;
    if (btnDeletePerson) btnDeletePerson.style.display = 'none';

    modalAddPerson.style.display = 'flex';
  }

  function openEditPersonModal(person) {
    if (!modalAddPerson) return;
    const titleEl = document.getElementById('person-modal-title');
    const subEl = document.getElementById('person-modal-sub');
    const idInput = document.getElementById('person-edit-id');
    const nameInput = document.getElementById('person-name-input');
    const emailInput = document.getElementById('person-email-input');
    const relSelect = document.getElementById('person-rel-select');
    const bdayInput = document.getElementById('person-bday-input');
    const notesInput = document.getElementById('person-notes-input');
    const favCheckbox = document.getElementById('person-fav-checkbox');

    if (titleEl) titleEl.textContent = 'Edit Person';
    if (subEl) subEl.textContent = 'Update recipient details and preferences.';
    if (idInput) idInput.value = person.id;
    if (nameInput) nameInput.value = person.name || '';
    if (emailInput) emailInput.value = person.email || '';
    if (relSelect) relSelect.value = person.relationship || 'Friend';
    if (bdayInput) bdayInput.value = person.birthday || '';
    if (notesInput) notesInput.value = person.notes || '';
    if (favCheckbox) favCheckbox.checked = !!person.isFav;
    if (btnDeletePerson) btnDeletePerson.style.display = 'inline-block';

    modalAddPerson.style.display = 'flex';
  }

  if (btnAddPerson) btnAddPerson.addEventListener('click', openAddPersonModal);
  if (btnPeopleEmptyAdd) btnPeopleEmptyAdd.addEventListener('click', openAddPersonModal);

  if (btnDeletePerson) {
    btnDeletePerson.addEventListener('click', () => {
      const idInput = document.getElementById('person-edit-id');
      if (idInput && idInput.value) {
        deletePerson(idInput.value);
        if (modalAddPerson) modalAddPerson.style.display = 'none';
      }
    });
  }

  if (formAddPerson) {
    formAddPerson.addEventListener('submit', (e) => {
      e.preventDefault();
      const idInput = document.getElementById('person-edit-id');
      const nameInput = document.getElementById('person-name-input');
      const emailInput = document.getElementById('person-email-input');
      const relSelect = document.getElementById('person-rel-select');
      const bdayInput = document.getElementById('person-bday-input');
      const notesInput = document.getElementById('person-notes-input');
      const favCheckbox = document.getElementById('person-fav-checkbox');

      const name = nameInput ? nameInput.value.trim() : '';
      if (!name) return;

      const editId = idInput ? idInput.value : '';
      const list = getContactsList();

      if (editId) {
        const item = list.find(c => c.id === editId);
        if (item) {
          item.name = name;
          item.email = emailInput ? emailInput.value.trim() : '';
          item.relationship = relSelect ? relSelect.value : 'Friend';
          item.birthday = bdayInput ? bdayInput.value : '';
          item.notes = notesInput ? notesInput.value.trim() : '';
          item.isFav = favCheckbox ? favCheckbox.checked : false;
        }
      } else {
        list.unshift({
          id: 'contact_' + Date.now(),
          name: name,
          email: emailInput ? emailInput.value.trim() : '',
          relationship: relSelect ? relSelect.value : 'Friend',
          birthday: bdayInput ? bdayInput.value : '',
          notes: notesInput ? notesInput.value.trim() : '',
          isFav: favCheckbox ? favCheckbox.checked : false,
          createdAt: new Date().toISOString()
        });
      }

      saveContactsList(list);
      if (modalAddPerson) modalAddPerson.style.display = 'none';
      if (typeof showToast === 'function') showToast(`Saved ${name} to My People ♡`);
    });
  }

  // ================= 3. STUDIO INTEGRATION: RECIPIENT PICKER =================
  let activeRecipientTargetId = null;
  const modalPickerPeople = document.getElementById('modal-picker-people');
  const pickerPeopleSearch = document.getElementById('picker-people-search');
  const btnPickerAddNew = document.getElementById('btn-picker-add-new');

  function openRecipientPicker(targetInputId) {
    activeRecipientTargetId = targetInputId;
    if (modalPickerPeople) {
      if (pickerPeopleSearch) pickerPeopleSearch.value = '';
      renderPeoplePickerList();
      modalPickerPeople.style.display = 'flex';
    }
  }

  function renderPeoplePickerList() {
    const listContainer = document.getElementById('picker-people-list');
    const emptyState = document.getElementById('picker-empty-state');
    if (!listContainer) return;

    const query = pickerPeopleSearch ? pickerPeopleSearch.value.toLowerCase().trim() : '';
    const contacts = getContactsList();
    const filtered = contacts.filter(c => {
      if (!query) return true;
      return (c.name || '').toLowerCase().includes(query) || (c.email || '').toLowerCase().includes(query);
    });

    if (contacts.length === 0 || filtered.length === 0) {
      listContainer.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    listContainer.style.display = 'flex';
    listContainer.innerHTML = '';

    filtered.forEach(person => {
      const row = document.createElement('div');
      row.className = 'picker-person-row';
      const initial = person.name ? person.name.charAt(0).toUpperCase() : '?';

      row.innerHTML = `
        <div class="picker-row-info">
          <div class="picker-row-avatar">${initial}</div>
          <div class="picker-row-text">
            <div class="picker-row-name">${escapeHtml(person.name)} ${person.isFav ? '★' : ''}</div>
            <div class="picker-row-sub">${escapeHtml(person.relationship || 'Friend')} ${person.email ? `• ${escapeHtml(person.email)}` : ''}</div>
          </div>
        </div>
        <button type="button" class="btn-select-pill">Select</button>
      `;

      row.addEventListener('click', () => {
        if (activeRecipientTargetId) {
          const inp = document.getElementById(activeRecipientTargetId);
          if (inp) {
            inp.value = person.name;
            inp.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
        if (modalPickerPeople) modalPickerPeople.style.display = 'none';
        if (typeof showToast === 'function') showToast(`Selected ${person.name} ♡`);
      });

      listContainer.appendChild(row);
    });
  }

  if (pickerPeopleSearch) {
    pickerPeopleSearch.addEventListener('input', renderPeoplePickerList);
  }

  if (btnPickerAddNew) {
    btnPickerAddNew.addEventListener('click', () => {
      if (modalPickerPeople) modalPickerPeople.style.display = 'none';
      openAddPersonModal();
    });
  }

  // Attach listener to all Studio picker buttons
  document.querySelectorAll('.btn-picker-person').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.recipientTarget;
      openRecipientPicker(targetId);
    });
  });

  // ================= 4. NOTIFICATIONS STREAM & PREFERENCES =================
  let currentNotifFilter = 'all';

  document.querySelectorAll('#notif-filter-pills .notif-pill-btn').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#notif-filter-pills .notif-pill-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentNotifFilter = pill.dataset.notifFilter;
      renderNotifications();
    });
  });

  function renderNotifications() {
    const stream = document.getElementById('notifications-stream');
    if (!stream) return;

    const notifs = getNotificationsList();
    const filtered = notifs.filter(n => {
      if (currentNotifFilter === 'all') return true;
      return n.type === currentNotifFilter;
    });

    if (filtered.length === 0) {
      stream.innerHTML = `
        <div style="text-align:center; padding: 30px 14px; background: #FFFDFD; border: 1px dashed #EBDAD5; border-radius: 14px; color: #7E4D57; font-size: 13px;">
          🌿 No notifications to display right now.
        </div>
      `;
      return;
    }

    stream.innerHTML = '';
    filtered.forEach(notif => {
      const card = document.createElement('div');
      card.className = `notif-card ${notif.unread ? 'unread' : ''}`;

      let icon = '💌';
      if (notif.type === 'creation') icon = '✨';
      if (notif.type === 'reminder') icon = '🔔';
      if (notif.type === 'incoming') icon = '🌸';

      card.innerHTML = `
        <div class="notif-icon-circle">${icon}</div>
        <div class="notif-content">
          <div class="notif-title-row">
            <h5 class="notif-title">${escapeHtml(notif.title)}</h5>
            <span class="notif-time">${escapeHtml(notif.timeText || 'Today')}</span>
          </div>
          <p class="notif-body">${escapeHtml(notif.body)}</p>
        </div>
        ${notif.unread ? '<span class="notif-unread-dot"></span>' : ''}
      `;

      card.addEventListener('click', () => {
        if (notif.unread) {
          notif.unread = false;
          saveNotificationsList(notifs);
        }
      });

      stream.appendChild(card);
    });
  }

  const btnClearNotifs = document.getElementById('btn-clear-notifications');
  if (btnClearNotifs) {
    btnClearNotifs.addEventListener('click', () => {
      saveNotificationsList([]);
      if (typeof showToast === 'function') showToast('Notifications cleared');
    });
  }

  // Notification Preferences toggles
  const prefCreations = document.getElementById('pref-creations');
  const prefIncoming = document.getElementById('pref-incoming');
  const prefReminders = document.getElementById('pref-reminders');

  try {
    const savedPrefs = JSON.parse(localStorage.getItem(PROFILE_KEYS.NOTIF_PREFS) || '{}');
    if (prefCreations && typeof savedPrefs.creations === 'boolean') prefCreations.checked = savedPrefs.creations;
    if (prefIncoming && typeof savedPrefs.incoming === 'boolean') prefIncoming.checked = savedPrefs.incoming;
    if (prefReminders && typeof savedPrefs.reminders === 'boolean') prefReminders.checked = savedPrefs.reminders;
  } catch (e) {}

  [prefCreations, prefIncoming, prefReminders].forEach(inp => {
    if (inp) {
      inp.addEventListener('change', () => {
        const prefs = {
          creations: prefCreations ? prefCreations.checked : true,
          incoming: prefIncoming ? prefIncoming.checked : true,
          reminders: prefReminders ? prefReminders.checked : true
        };
        localStorage.setItem(PROFILE_KEYS.NOTIF_PREFS, JSON.stringify(prefs));
        if (typeof showToast === 'function') showToast('Preferences updated');
      });
    }
  });

  // ================= 5. PRIVACY & ACCOUNT MANAGEMENT =================
  const btnOpenChangePwd = document.getElementById('btn-open-change-password');
  const modalChangePwd = document.getElementById('modal-change-password');
  const formChangePwd = document.getElementById('form-change-password');

  if (btnOpenChangePwd && modalChangePwd) {
    btnOpenChangePwd.addEventListener('click', () => {
      if (formChangePwd) formChangePwd.reset();
      modalChangePwd.style.display = 'flex';
    });
  }

  if (formChangePwd) {
    formChangePwd.addEventListener('submit', (e) => {
      e.preventDefault();
      const pCurrent = document.getElementById('pwd-current').value;
      const pNew = document.getElementById('pwd-new').value;
      const pConfirm = document.getElementById('pwd-confirm').value;

      if (!pCurrent) {
        alert('Please enter your current password.');
        return;
      }
      if (pNew.length < 6) {
        alert('New password must be at least 6 characters long.');
        return;
      }
      if (pNew !== pConfirm) {
        alert('New passwords do not match. Please re-enter.');
        return;
      }

      if (modalChangePwd) modalChangePwd.style.display = 'none';
      if (typeof showToast === 'function') showToast('Password updated successfully ♡');
    });
  }

  const btnOpenUpdateEmail = document.getElementById('btn-open-update-email');
  const modalUpdateEmail = document.getElementById('modal-update-email');
  const formUpdateEmail = document.getElementById('form-update-email');

  if (btnOpenUpdateEmail && modalUpdateEmail) {
    btnOpenUpdateEmail.addEventListener('click', () => {
      const user = getProfileUser();
      const emailInput = document.getElementById('email-new');
      const pwdInput = document.getElementById('email-pwd-confirm');
      if (emailInput) emailInput.value = user.email || '';
      if (pwdInput) pwdInput.value = '';
      modalUpdateEmail.style.display = 'flex';
    });
  }

  if (formUpdateEmail) {
    formUpdateEmail.addEventListener('submit', (e) => {
      e.preventDefault();
      const newEmail = document.getElementById('email-new').value.trim();
      const pwdConfirm = document.getElementById('email-pwd-confirm').value;

      if (!newEmail || !newEmail.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }
      if (!pwdConfirm) {
        alert('Please confirm with your current password.');
        return;
      }

      const user = getProfileUser();
      user.email = newEmail;
      saveProfileUser(user);

      if (modalUpdateEmail) modalUpdateEmail.style.display = 'none';
      if (typeof showToast === 'function') showToast('Email updated to ' + newEmail);
    });
  }

  // Manage Shared Links Modal
  const btnManageLinks = document.getElementById('btn-manage-shared-links');
  const modalManageLinks = document.getElementById('modal-manage-links');

  function renderSharedLinks() {
    const container = document.getElementById('shared-links-container');
    if (!container) return;

    const links = getSharedLinksList();
    if (links.length === 0) {
      container.innerHTML = `<p style="text-align:center; padding: 20px; color:#7E4D57;">No links created yet.</p>`;
      return;
    }

    container.innerHTML = '';
    links.forEach(item => {
      const row = document.createElement('div');
      row.className = `shared-link-row ${item.revoked ? 'revoked' : ''}`;
      row.innerHTML = `
        <div class="shared-link-meta">
          <h5 class="shared-link-title">${escapeHtml(item.title)} ${item.revoked ? '<span style="color:#B32638; font-size:11px;">(Revoked)</span>' : ''}</h5>
          <p class="shared-link-details">For: ${escapeHtml(item.recipient || 'Kabir')} • ${escapeHtml(item.date)}</p>
          <small style="color:#925864; font-family:monospace; font-size:10px;">${escapeHtml(item.url)}</small>
        </div>
        ${!item.revoked ? `<button type="button" class="btn-revoke-link" data-link-id="${item.id}">Revoke</button>` : '<span style="font-size:11px; color:#9E747D;">Deactivated</span>'}
      `;

      const revBtn = row.querySelector('.btn-revoke-link');
      if (revBtn) {
        revBtn.addEventListener('click', () => {
          item.revoked = true;
          saveSharedLinksList(links);
          renderSharedLinks();
          if (typeof showToast === 'function') showToast('Shared link revoked');
        });
      }

      container.appendChild(row);
    });
  }

  if (btnManageLinks && modalManageLinks) {
    btnManageLinks.addEventListener('click', () => {
      renderSharedLinks();
      modalManageLinks.style.display = 'flex';
    });
  }

  // Log Out & Delete Account
  const btnLogout = document.getElementById('btn-account-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      const user = getProfileUser();
      user.loggedIn = false;
      saveProfileUser(user);
      if (typeof showToast === 'function') showToast('Logged out of ' + user.name);
    });
  }

  const btnDeleteAccount = document.getElementById('btn-account-delete');
  const modalDeleteAccount = document.getElementById('modal-delete-account');
  const btnConfirmDelete = document.getElementById('btn-confirm-delete-account');

  if (btnDeleteAccount && modalDeleteAccount) {
    btnDeleteAccount.addEventListener('click', () => {
      modalDeleteAccount.style.display = 'flex';
    });
  }

  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener('click', () => {
      localStorage.removeItem(PROFILE_KEYS.USER);
      localStorage.removeItem(PROFILE_KEYS.CONTACTS);
      localStorage.removeItem(PROFILE_KEYS.NOTIFS);
      localStorage.removeItem(PROFILE_KEYS.TICKETS);
      localStorage.removeItem(PROFILE_KEYS.LINKS);
      updateProfileUI();
      renderMyPeople();
      if (modalDeleteAccount) modalDeleteAccount.style.display = 'none';
      showProfileHub();
      if (typeof showToast === 'function') showToast('Account deleted. Fresh session started.');
    });
  }

  // ================= 6. HELP & SUPPORT ENGINE (13 FAQS & CONTACT FORM) =================
  document.querySelectorAll('#help-section-switcher .help-tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('#help-section-switcher .help-tab-btn').forEach(t => t.classList.remove('active'));
      tabBtn.classList.add('active');

      const tabKey = tabBtn.dataset.helpTab;
      document.querySelectorAll('.help-tab-pane').forEach(pane => {
        pane.style.display = (pane.id === `pane-help-${tabKey}`) ? 'block' : 'none';
      });
    });
  });

  // FAQs Accordions
  document.querySelectorAll('#faqs-accordion-list .faq-question-btn').forEach(qBtn => {
    qBtn.addEventListener('click', () => {
      const parentItem = qBtn.closest('.faq-item');
      if (parentItem) {
        parentItem.classList.toggle('active');
      }
    });
  });

  // Contact Support Form
  const formContact = document.getElementById('form-contact-support');
  if (formContact) {
    formContact.addEventListener('submit', (e) => {
      e.preventDefault();
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value.trim();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;

      if (!message) {
        alert('Please write your message before sending.');
        return;
      }

      // Generate authentic ticket reference: TICK-XXXXX
      const ticketRef = 'TICK-' + Math.floor(10000 + Math.random() * 90000);

      // Save ticket
      try {
        const tickets = JSON.parse(localStorage.getItem(PROFILE_KEYS.TICKETS) || '[]');
        tickets.unshift({
          ref: ticketRef,
          name: name,
          email: email,
          subject: subject,
          message: message,
          date: new Date().toISOString()
        });
        localStorage.setItem(PROFILE_KEYS.TICKETS, JSON.stringify(tickets));
      } catch (err) {}

      // Render confirmation receipt
      const card = formContact.closest('.contact-support-form-card');
      if (card) {
        card.innerHTML = `
          <div class="contact-card-header">
            <span style="font-size:32px;">💌</span>
            <h4>Message Received!</h4>
            <p>Thank you, ${escapeHtml(name)}. We have received your note and will be in touch shortly.</p>
          </div>
          <div class="support-ticket-receipt">
            <small style="color:#7E4D57; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Ticket Reference</small><br>
            <span class="ticket-number">${ticketRef}</span>
            <p style="font-size:12px; color:#6F454E; margin:6px 0 0 0;">
              A confirmation has been recorded for <strong>${escapeHtml(email)}</strong>. Our team typically replies within 24 hours.
            </p>
          </div>
          <div style="text-align:center; margin-top:20px;">
            <button type="button" class="btn-secondary" id="btn-reset-support-card">Send Another Message</button>
          </div>
        `;

        const resetBtn = card.querySelector('#btn-reset-support-card');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            showProfileSubpage('help');
          });
        }
      }

      if (typeof showToast === 'function') showToast(`Ticket ${ticketRef} submitted ♡`);
    });
  }

  // ================= 7. AUTH SIGN IN / SIGN UP MODAL =================
  const authModal = document.getElementById('auth-modal');
  const formAuth = document.getElementById('form-auth');
  const tabAuthSignIn = document.getElementById('tab-auth-signin');
  const tabAuthSignUp = document.getElementById('tab-auth-signup');
  const groupAuthName = document.getElementById('group-auth-name');
  const authModalTitle = document.getElementById('auth-modal-title');
  const authModalSub = document.getElementById('auth-modal-sub');
  const btnSubmitAuth = document.getElementById('btn-submit-auth');
  let authMode = 'signin';

  if (tabAuthSignIn && tabAuthSignUp) {
    tabAuthSignIn.addEventListener('click', () => {
      authMode = 'signin';
      tabAuthSignIn.classList.add('active');
      tabAuthSignUp.classList.remove('active');
      if (groupAuthName) groupAuthName.style.display = 'none';
      if (authModalTitle) authModalTitle.textContent = 'Sign In';
      if (authModalSub) authModalSub.textContent = 'Welcome back to A Little Something.';
      if (btnSubmitAuth) btnSubmitAuth.textContent = 'Sign In ♡';
    });

    tabAuthSignUp.addEventListener('click', () => {
      authMode = 'signup';
      tabAuthSignUp.classList.add('active');
      tabAuthSignIn.classList.remove('active');
      if (groupAuthName) groupAuthName.style.display = 'block';
      if (authModalTitle) authModalTitle.textContent = 'Create Account';
      if (authModalSub) authModalSub.textContent = 'Join A Little Something to preserve memories.';
      if (btnSubmitAuth) btnSubmitAuth.textContent = 'Create Account ♡';
    });
  }

  if (formAuth) {
    formAuth.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email-input').value.trim();
      const pwd = document.getElementById('auth-pwd-input').value;
      const name = document.getElementById('auth-name-input') ? document.getElementById('auth-name-input').value.trim() : '';

      if (!email || !pwd) return;

      const user = getProfileUser();
      user.email = email;
      user.loggedIn = true;
      if (authMode === 'signup' && name) {
        user.name = name;
        user.avatar = name.charAt(0).toUpperCase();
      }
      saveProfileUser(user);

      if (authModal) authModal.style.display = 'none';
      if (typeof showToast === 'function') showToast(`Welcome, ${user.name} ♡`);
    });
  }

  // Bind All Profile Modals Closers
  bindModalCloser('btn-close-edit-profile', 'modal-edit-profile');
  bindModalCloser('btn-cancel-edit-profile', 'modal-edit-profile');
  bindModalCloser('btn-close-add-person', 'modal-add-person');
  bindModalCloser('btn-cancel-add-person', 'modal-add-person');
  bindModalCloser('btn-close-picker-people', 'modal-picker-people');
  bindModalCloser('btn-close-change-pwd', 'modal-change-password');
  bindModalCloser('btn-cancel-change-pwd', 'modal-change-password');
  bindModalCloser('btn-close-update-email', 'modal-update-email');
  bindModalCloser('btn-cancel-update-email', 'modal-update-email');
  bindModalCloser('btn-close-manage-links', 'modal-manage-links');
  bindModalCloser('btn-done-manage-links', 'modal-manage-links');
  bindModalCloser('btn-close-delete-account', 'modal-delete-account');
  bindModalCloser('btn-cancel-delete-account', 'modal-delete-account');
  bindModalCloser('btn-close-auth-modal', 'auth-modal');
  bindModalCloser('btn-cancel-auth', 'auth-modal');

  // Hook Profile Navigation Tab
  const profileNavTab = document.querySelector('.nav-tab[data-room="profile"]');
  if (profileNavTab) {
    profileNavTab.addEventListener('click', () => {
      showProfileHub();
      updateProfileUI();
    });
  }

  // Initialize Profile UI on boot
  updateProfileUI();
  window.updateProfileUI = updateProfileUI;
  window.showProfileSubpage = showProfileSubpage;
  window.showProfileHub = showProfileHub;
  window.renderMyPeople = renderMyPeople;
  window.renderNotifications = renderNotifications;

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
      const cvCover = document.getElementById('card-cover-canvas');
      const cvInside = document.getElementById('card-inside-bifold');
      if (cvCover) cvCover.className = `card-cover-canvas theme-${paramCardTheme}`;
      if (cvInside) cvInside.className = `card-inside-bifold theme-${paramCardTheme}`;
      document.querySelectorAll('.card-theme-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.cardTheme === paramCardTheme);
      });
    }
    if ((paramMedium === 'card' || paramMedium === 'greeting-card') && (urlParams.has('copen') || urlParams.has('revealed'))) {
      if (typeof openCardInPreview === 'function') openCardInPreview();
    }
    if (urlParams.has('demo_card') && state.greetingCard) {
      state.greetingCard.insideKeepsakes = [
        { id: 'pol_1', type: 'polaroid', src: 'assets/medium_letter.png', caption: 'Forever & Always', x: 6, y: 8, width: 130, rotation: -4 },
        { id: 'fl_1', type: 'flower', name: 'Lily', file: 'lily.png', x: 22, y: 14, width: 90, rotation: 8 },
        {
          id: 'vn_1',
          type: 'vinyl',
          songId: 'die-with-a-smile',
          title: 'Die With A Smile - Lady Gaga & Bruno Mars',
          trackName: 'Die With A Smile',
          artistName: 'Lady Gaga & Bruno Mars',
          artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/11/ae/f2/11aef294-f57c-bab9-c9fc-529162984e62/24UMGIM85348.rgb.jpg/100x100bb.jpg',
          audioSrc: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/07/6a/99/076a99ed-b946-431b-6f1f-54fa187ca5bd/mzaf_8102882277995122875.plus.aac.p.m4a',
          dedication: 'For Kabir',
          x: 6,
          y: 48,
          width: 140,
          rotation: 0
        },
        { id: 'st_1', type: 'sticker', name: 'Pink Hearts', file: 'sticker_hearts_pink.png', x: 68, y: 64, width: 72, rotation: -12 }
      ];
      if (typeof renderInsideKeepsakes === 'function') renderInsideKeepsakes();
      if (state.greetingCard.step === 4 && typeof renderCardRevealedDisplay === 'function') {
        renderCardRevealedDisplay();
      }
    }
    if (urlParams.has('open_flowers')) {
      const btnFl = document.getElementById('btn-card-add-flower');
      if (btnFl) btnFl.click();
    }
    if (urlParams.has('open_stickers')) {
      const btnStk = document.getElementById('btn-card-add-sticker');
      if (btnStk) btnStk.click();
    }
    if (urlParams.has('open_vinyl')) {
      const btnVn = document.getElementById('btn-card-add-vinyl');
      if (btnVn) btnVn.click();
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
    if (urlParams.get('room') === 'keepsakes' || urlParams.has('keepsakes')) {
      const keepsakesTab = document.querySelector('.nav-tab[data-room="keepsakes"]');
      if (keepsakesTab) keepsakesTab.click();
    }
    if (urlParams.has('open_scrapbook')) {
      const scrapId = urlParams.get('open_scrapbook') || 'scrap_1';
      openScrapbookViewer(scrapId);
    }
    if (urlParams.has('open_collection')) {
      const collId = urlParams.get('open_collection') || 'coll_received';
      openCollectionViewer(collId);
    }
    if (urlParams.get('room') === 'vault' || urlParams.has('vault')) {
      const vaultTab = document.querySelector('.nav-tab[data-room="vault"]');
      if (vaultTab) vaultTab.click();
    }
    if (urlParams.get('room') === 'profile' || urlParams.has('profile')) {
      const profileTab = document.querySelector('.nav-tab[data-room="profile"]');
      if (profileTab) profileTab.click();
      const sub = urlParams.get('profile_subpage') || urlParams.get('subpage');
      if (sub && typeof showProfileSubpage === 'function') {
        showProfileSubpage(sub);
      }
    }
  } catch (err) {}

});
