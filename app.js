// ==========================================================================
// A LITTLE SOMETHING, FROM ME TO YOU — INTERACTIVE ATELIER ENGINE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // State management
  const state = {
    activeRoom: 'studio',
    activeMedium: 'postcard',
    vessel: 'envelope',
    postcard: {
      orientation: 'portrait',
      color: '#FFFFFF',
      stamp: 'heart',
      title: 'A quiet morning title',
      caption: '',
      note: '',
      from: 'Saanvi',
      to: 'Kabir',
      flipped: false
    },
    letter: {
      paper: 'paper-cloud',
      ink: '#1A1A1A',
      from: 'Saanvi',
      to: 'Kabir',
      body: '',
      stickers: [],
      envelope: 'env-maroon',
      seal: 'gold'
    },
    bouquet: {
      selectedFlowers: ['Dahlia', "Baby's Breath", 'Lilac'],
      wrap: 'wrap-kraft',
      ribbon: 'ribbon-silk',
      letter: '',
      from: 'Saanvi',
      to: 'Kabir'
    },
    keepsakes: []
  };

  // ================= 1. GLOBAL NAVIGATION =================
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

  // ================= 2. STUDIO MEDIUM SELECTION =================
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
      const medium = card.dataset.medium;
      state.activeMedium = medium;

      mediumCards.forEach(c => c.classList.toggle('active', c === card));
      Object.keys(canvases).forEach(key => {
        if (canvases[key]) {
          canvases[key].style.display = key === medium ? 'block' : 'none';
        }
      });
    });
  });

  // ================= 3. POSTCARD ATELIER INTERACTIONS =================
  const postcardCard = document.getElementById('postcard-card');
  const btnFlipPostcard = document.getElementById('btn-flip-postcard');
  const postcardFrontFace = document.getElementById('postcard-front-face');
  const postcardWrapper = document.getElementById('postcard-container');
  const btnOrientPort = document.getElementById('btn-postcard-orient-port');
  const btnOrientLand = document.getElementById('btn-postcard-orient-land');
  const colorDots = document.querySelectorAll('.color-palette .color-dot');
  const stampBtns = document.querySelectorAll('.stamp-option-btn');
  const selectedStampDisplay = document.getElementById('selected-stamp-display');

  // Flip action
  if (btnFlipPostcard) {
    btnFlipPostcard.addEventListener('click', () => {
      state.postcard.flipped = !state.postcard.flipped;
      postcardCard.classList.toggle('flipped', state.postcard.flipped);
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

  // Front color palette (Strictly White, Cloud Dancer, Soft Cream Blush)
  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.toggle('active', d === dot));
      const color = dot.dataset.color;
      if (color) {
        state.postcard.color = color;
        postcardFrontFace.style.backgroundColor = color;
      }
    });
  });

  // Stamp selector (Heart, Flower, Smiley)
  const stampStyles = {
    heart: `<div class="postage-stamp stamp-heart"><span class="stamp-icon">❤️</span><span class="stamp-date">OCT 2026</span></div>`,
    flower: `<div class="postage-stamp stamp-flower"><span class="stamp-icon">🌸</span><span class="stamp-date">OCT 2026</span></div>`,
    smiley: `<div class="postage-stamp stamp-smiley"><span class="stamp-icon">🙂</span><span class="stamp-date">OCT 2026</span></div>`
  };

  stampBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stampBtns.forEach(b => b.classList.toggle('active', b === btn));
      const stampKey = btn.dataset.stamp;
      state.postcard.stamp = stampKey;
      if (selectedStampDisplay && stampStyles[stampKey]) {
        selectedStampDisplay.innerHTML = stampStyles[stampKey];
      }
    });
  });

  // Photo upload click simulation
  const cardPhotoSlot = document.getElementById('card-photo-slot');
  const uploadedImg = document.getElementById('postcard-uploaded-img');
  const photoPlaceholder = document.getElementById('photo-placeholder');

  const sampleBotanicals = [
    'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80'
  ];
  let photoIndex = 0;

  if (cardPhotoSlot) {
    cardPhotoSlot.addEventListener('click', () => {
      photoPlaceholder.style.display = 'none';
      uploadedImg.style.display = 'block';
      uploadedImg.src = sampleBotanicals[photoIndex % sampleBotanicals.length];
      photoIndex++;
    });
  }

  // ================= 4. LETTER ATELIER INTERACTIONS =================
  const letterPaperSelect = document.getElementById('letter-paper-select');
  const letterSheet = document.getElementById('letter-sheet');
  const inkDots = document.querySelectorAll('[data-ink]');
  const letterBody = document.getElementById('letter-body-input');
  const stickerPills = document.querySelectorAll('.sticker-pill');
  const placedStickersZone = document.getElementById('placed-stickers');
  const sealBtns = document.querySelectorAll('.seal-btn');

  if (letterPaperSelect && letterSheet) {
    letterPaperSelect.addEventListener('change', (e) => {
      letterSheet.className = `letter-sheet ${e.target.value}`;
    });
  }

  inkDots.forEach(dot => {
    dot.addEventListener('click', () => {
      inkDots.forEach(d => d.classList.toggle('active', d === dot));
      const inkColor = dot.dataset.ink;
      if (letterBody && inkColor) {
        letterBody.style.color = inkColor;
        state.letter.ink = inkColor;
      }
    });
  });

  stickerPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const stickerText = pill.innerText;
      state.letter.stickers.push(stickerText);
      const chip = document.createElement('span');
      chip.className = 'active-sticker-chip';
      chip.innerText = stickerText;
      placedStickersZone.appendChild(chip);
    });
  });

  sealBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sealBtns.forEach(b => b.classList.toggle('active', b === btn));
      state.letter.seal = btn.dataset.seal;
    });
  });

  // ================= 5. BOUQUET ATELIER INTERACTIONS =================
  const flowerItems = document.querySelectorAll('.flower-item');
  const stemsContainer = document.getElementById('bouquet-stems-container');
  const bouquetWrapSelect = document.getElementById('bouquet-wrap-select');
  const bouquetRibbonSelect = document.getElementById('bouquet-ribbon-select');
  const bouquetWrapRender = document.getElementById('bouquet-wrap-render');
  const bouquetRibbonRender = document.getElementById('bouquet-ribbon-render');

  flowerItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('selected');
      const flowerName = item.dataset.flower;
      
      const idx = state.bouquet.selectedFlowers.indexOf(flowerName);
      if (idx > -1) {
        state.bouquet.selectedFlowers.splice(idx, 1);
      } else {
        state.bouquet.selectedFlowers.push(flowerName);
      }

      // Re-render stem chips
      if (stemsContainer) {
        stemsContainer.innerHTML = '';
        state.bouquet.selectedFlowers.forEach(f => {
          const chip = document.createElement('span');
          chip.className = 'stem-chip';
          chip.innerText = `🌸 ${f}`;
          stemsContainer.appendChild(chip);
        });
      }
    });
  });

  if (bouquetWrapSelect && bouquetWrapRender) {
    bouquetWrapSelect.addEventListener('change', (e) => {
      bouquetWrapRender.className = `bouquet-wrap-render ${e.target.value}`;
    });
  }

  if (bouquetRibbonSelect && bouquetRibbonRender) {
    bouquetRibbonSelect.addEventListener('change', (e) => {
      bouquetRibbonRender.className = `bouquet-ribbon ${e.target.value}`;
      bouquetRibbonRender.innerText = `Ribbon: ${e.target.options[e.target.selectedIndex].text}`;
    });
  }

  // ================= 6. DELIVERY VESSEL & PACKAGING =================
  const vesselCards = document.querySelectorAll('.vessel-card');
  vesselCards.forEach(card => {
    card.addEventListener('click', () => {
      vesselCards.forEach(c => c.classList.toggle('active', c === card));
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        state.vessel = radio.value;
      }
    });
  });

  // ================= 7. DISPATCH GENTLY & UNWRAPPING MODAL =================
  const btnDispatch = document.getElementById('btn-dispatch-gift');
  const unwrapModal = document.getElementById('unwrap-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const vesselArt = document.getElementById('vessel-art');
  const vesselStage = document.getElementById('vessel-stage');
  const revealedStage = document.getElementById('revealed-stage');
  const btnSkipUnboxing = document.getElementById('btn-skip-unboxing');
  const revealedCardContainer = document.getElementById('revealed-card-container');
  const unwrapFromLabel = document.getElementById('unwrap-from-label');
  const unwrapToLabel = document.getElementById('unwrap-to-label');
  const shelfItemsGrid = document.getElementById('shelf-items-grid');

  const vesselIcons = {
    envelope: { icon: '✉️', title: 'Wax-Sealed Maroon Envelope', hint: 'Slide wax seal to open' },
    box: { icon: '🎁', title: 'Tied Keepsake Box', hint: 'Untie ribbon and lift lid' },
    truck: { icon: '🚚', title: 'Vintage Toy Truck', hint: 'Tap truck door to reveal your gift' }
  };

  if (btnDispatch) {
    btnDispatch.addEventListener('click', () => {
      // Setup unboxing modal
      const v = vesselIcons[state.vessel] || vesselIcons.envelope;
      vesselArt.innerHTML = `<span class="vessel-huge-icon">${v.icon}</span><p id="vessel-action-hint">${v.hint}</p>`;
      
      const fromVal = document.getElementById('postcard-from-input')?.value || 'Saanvi';
      const toVal = document.getElementById('postcard-to-input')?.value || 'Kabir';
      unwrapFromLabel.innerText = `From: ${fromVal}`;
      unwrapToLabel.innerText = `To: ${toVal}`;

      // Reset modal stages
      vesselStage.style.display = 'block';
      revealedStage.style.display = 'none';
      unwrapModal.style.display = 'flex';
    });
  }

  function revealGiftArtifact() {
    vesselStage.style.display = 'none';
    revealedStage.style.display = 'block';

    // Clone the active crafted object preview
    let previewHTML = '';
    const fromVal = document.getElementById('postcard-from-input')?.value || 'Saanvi';
    const titleVal = document.getElementById('postcard-title-input')?.value || 'A quiet morning thought';

    if (state.activeMedium === 'postcard') {
      previewHTML = `
        <div style="background:${state.postcard.color}; border:1px solid #DCD7CE; padding:16px; border-radius:4px;">
          <h3 style="font-family:'Playfair Display', serif; font-size:18px;">${titleVal}</h3>
          <p style="font-size:13px; color:#736B63; margin-top:4px;">"${document.getElementById('postcard-caption-input')?.value || 'Thinking of you as the light filtered through...'}"</p>
          <div style="margin-top:12px; border-top:1px dashed #DCD7CE; padding-top:8px; font-family:'Caveat', cursive; font-size:18px;">
            ${document.getElementById('postcard-note-input')?.value || 'Just a little something to brighten your day.'}
          </div>
          <div style="margin-top:8px; font-size:11px; color:#9C948B; display:flex; justify-content:space-between;">
            <span>From: ${fromVal}</span>
            <span>Stamp: ${state.postcard.stamp.toUpperCase()}</span>
          </div>
        </div>
      `;
    } else if (state.activeMedium === 'letter') {
      previewHTML = `
        <div style="background:#F0EEE9; border:1px solid #DCD7CE; padding:16px; border-radius:4px; font-family:'Caveat', cursive; font-size:20px; color:${state.letter.ink};">
          <p>${document.getElementById('letter-body-input')?.value || 'I saw something today that reminded me of you...'}</p>
          <div style="font-size:14px; margin-top:12px; font-family:'Plus Jakarta Sans', sans-serif; color:#736B63;">
            Envelope: Maroon with White Lace • Wax Seal: ${state.letter.seal.toUpperCase()}
          </div>
        </div>
      `;
    } else if (state.activeMedium === 'bouquet') {
      previewHTML = `
        <div style="background:#FAF7F0; border:1px solid #DCD7CE; padding:16px; border-radius:4px;">
          <h4 style="font-family:'Playfair Display', serif;">Botanical Bouquet: ${state.bouquet.selectedFlowers.join(', ')}</h4>
          <p style="font-size:12px; color:#736B63; margin:6px 0;">Hand-tied with ribbon and wrapped in kraft paper.</p>
          <div style="font-family:'Caveat', cursive; font-size:18px; color:#1A1A1A; margin-top:8px;">
            Florist Note: "${document.getElementById('bouquet-letter-input')?.value || 'A few quiet blossoms for your desk.'}"
          </div>
        </div>
      `;
    } else {
      previewHTML = `
        <div style="background:#FFFFFF; border:1px solid #DCD7CE; padding:16px; border-radius:4px;">
          <h4 style="font-family:'Playfair Display', serif;">Bi-fold Greeting Card</h4>
          <p style="font-family:'Caveat', cursive; font-size:18px; margin-top:6px;">"A quiet wish for you today."</p>
        </div>
      `;
    }

    revealedCardContainer.innerHTML = previewHTML;

    // Automatically add to Keepsake Shelf
    if (shelfItemsGrid) {
      const newCard = document.createElement('div');
      newCard.className = 'shelf-item-card';
      const vesselTitle = vesselIcons[state.vessel]?.title || 'Envelope';
      newCard.innerHTML = `
        <div class="item-tag-vessel">${vesselIcons[state.vessel]?.icon} Delivered via ${vesselTitle}</div>
        <div class="item-badge-type">${state.activeMedium.toUpperCase()}</div>
        <h4>${titleVal}</h4>
        <p class="item-snippet">Preserved freshly from today's studio session.</p>
        <div class="item-footer">
          <span>From: ${fromVal}</span>
          <span>Just now</span>
        </div>
      `;
      shelfItemsGrid.prepend(newCard);
    }
  }

  if (vesselArt) {
    vesselArt.addEventListener('click', revealGiftArtifact);
  }
  if (btnSkipUnboxing) {
    btnSkipUnboxing.addEventListener('click', revealGiftArtifact);
  }
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      unwrapModal.style.display = 'none';
    });
  }

  // ================= 8. KEEPSAKES SUB-TABS =================
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

  // Collaborative Action: Circle detail simulation
  const btnCircleDetail = document.getElementById('btn-circle-detail');
  if (btnCircleDetail) {
    btnCircleDetail.addEventListener('click', () => {
      alert('✏️ Marginalia Layer active: You can now draw or circle a detail without altering the original gift.');
    });
  }
});
