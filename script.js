// script.js - Revisi: kategori background di items, modern checklist header (Tags + X kanan),
// overlay tags only after Apply, start button size handled via CSS.
// Mobile-first behavior preserved.

(function(){
  'use strict';

  /* ===========================
     Safeguard / Globals
     =========================== */
  const FALLBACK = (typeof PLACEHOLDER !== 'undefined')
    ? PLACEHOLDER
    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3Crect width='100%25' height='100%25' fill='%23ffe9a8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23333333' font-family='Arial' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E";

  function hasData(){
    return (typeof DATA !== 'undefined') && (DATA && typeof DATA === 'object');
  }

  // Navigation helpers (exposed for inline onclick)
  function goHome(){ window.location.href = "index.html"; }
  function goBackToHome(){ window.location.href = "index.html"; }
  function goToItemsPage(){ window.location.href = "items.html"; }

  window.goHome = goHome;
  window.goBackToHome = goBackToHome;
  window.goToItemsPage = goToItemsPage;

  /* ===========================
     Theme constants (pastel gradients)
     =========================== */
  const CATEGORY_THEME = {
    CHARACTER: { tagBg: "#ffd6da", accent: "#ff6b6b", bg: "linear-gradient(180deg,#ffeef0,#ffd6da)" },
    MONSTER:   { tagBg: "#eadcff", accent: "#9b59b6", bg: "linear-gradient(180deg,#f3e8ff,#eadcff)" },
    PET:       { tagBg: "#fff5b2", accent: "#ffd54f", bg: "linear-gradient(180deg,#fff9e0,#fff5b2)" },
    AREA:      { tagBg: "#ffe6c9", accent: "#ff9f43", bg: "linear-gradient(180deg,#fff3e6,#ffe6c9)" },
    MAGIC:     { tagBg: "#d6efff", accent: "#4da6ff", bg: "linear-gradient(180deg,#e8f6ff,#d6efff)" },
    DEFAULT:   { tagBg: "#fff3cd", accent: "#ffd54f", bg: "linear-gradient(180deg,#fff9c4,#ffe082)" }
  };

  function applyCategoryTheme(catKey){
    const theme = (catKey && CATEGORY_THEME[catKey]) ? CATEGORY_THEME[catKey] : CATEGORY_THEME.DEFAULT;
    document.documentElement.style.setProperty('--tag-bg', theme.tagBg);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
    return theme;
  }

  /* ===========================
     Data helpers
     =========================== */
  function findItemById(id){
    if(!hasData()) return null;
    let found = null;
    Object.keys(DATA).some(cat => {
      (DATA[cat].items || []).some(it => {
        if(String(it.id) === String(id)){ found = it; return true; }
        return false;
      });
      return !!found;
    });
    return found;
  }

  /* ===========================
     Page 1: Category modal (3 columns)
     =========================== */
  function buildCategoryCardForModal(key){
    const cat = (hasData() && DATA[key]) ? DATA[key] : { title: key, items: [] };
    const first = (cat.items && cat.items[0]) ? cat.items[0] : null;
    const thumb = (first && first.images && first.images.main) ? first.images.main : FALLBACK;

    const card = document.createElement('div');
    card.className = "card cat-card modal-cat-card";
    card.tabIndex = 0;

    const img = document.createElement('img');
    img.src = thumb;
    img.alt = cat.title || key;
    img.loading = 'lazy';
    img.className = 'modal-cat-thumb';
    card.appendChild(img);

    const h = document.createElement('h3');
    h.textContent = cat.title || key;
    h.className = 'modal-cat-title';
    card.appendChild(h);

    card.addEventListener('click', () => {
      localStorage.setItem('activeCategory', key);
      closeCategoryModal();
      window.location.href = 'items.html';
    });
    card.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); } });

    return card;
  }

  function openCategoryModal(){
    const modal = document.getElementById('categoryModal'); if(!modal) return;
    const grid = document.getElementById('categoryGrid'); if(!grid) return;
    grid.innerHTML = "";
    if(!hasData()){
      const info = document.createElement('div'); info.textContent = "No categories available."; grid.appendChild(info);
    } else {
      Object.keys(DATA).forEach(k => grid.appendChild(buildCategoryCardForModal(k)));
    }
    modal.classList.remove('hidden');
    setTimeout(()=>{ const first = modal.querySelector('.modal-cat-card'); if(first) first.focus(); }, 40);
    document.body.style.overflow = 'hidden';
  }

  function closeCategoryModal(){
    const modal = document.getElementById('categoryModal'); if(!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    const startBtn = document.getElementById('startBtn'); if(startBtn) startBtn.focus();
  }

  /* ===========================
     Page 2: checklist & render items
     - overlay tags appear only after user APPLY
     - newer header layout: 'Tags' left and close X right (sejajar)
     =========================== */
  function uniqueTagsForCategory(catKey){
    if(!hasData() || !DATA[catKey]) return [];
    const s = new Set();
    (DATA[catKey].items || []).forEach(it => (it.tags||[]).forEach(t => s.add(t)));
    return Array.from(s);
  }

  function applyChecklistFilters(panel){
    if(!panel) return;
    const inputs = panel.querySelectorAll('.chip input');
    const tagsChecked = [], rarChecked = [];
    inputs.forEach(i => { if(i.checked){ if(['S','A','B','C','D'].includes(i.value)) rarChecked.push(i.value); else tagsChecked.push(i.value); }});

    const si = document.getElementById('searchInput');
    if(si){
      si.dataset.checkedTags = JSON.stringify(tagsChecked);
      si.dataset.checkedRarities = JSON.stringify(rarChecked);
    }

    // toggle overlay visibility on items grid
    const container = document.getElementById('itemsContainer');
    if(container){
      if(tagsChecked.length > 0 || rarChecked.length > 0) container.classList.add('filters-active');
      else container.classList.remove('filters-active');
    }

    hideChecklist();
    renderItems();
  }

  // showChecklist builds header with 'Tags' on left and '✕' on right (inline)
  function showChecklist(catKey, preTags = [], preRarities = [], options = { showTitle: true }){
    hideChecklist();
    const panel = document.createElement('div'); panel.id = 'checklistPanel'; panel.className = 'checklist-panel';

    // header row: Tags label (left) + close (right)
    const header = document.createElement('div'); header.className = 'checklist-header';
    const tagLabelRow = document.createElement('div'); tagLabelRow.className = 'checklist-title'; tagLabelRow.textContent = 'Tags';
    header.appendChild(tagLabelRow);
    const closeBtn = document.createElement('button'); closeBtn.className = 'modern-close'; closeBtn.type='button'; closeBtn.textContent='✕';
    closeBtn.addEventListener('click', hideChecklist);
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // Tags chips (under header)
    const tagRow = document.createElement('div'); tagRow.className = 'checklist-chips'; tagRow.style.marginTop = '8px';
    const tags = uniqueTagsForCategory(catKey);
    if(tags.length === 0){
      const none = document.createElement('div'); none.className = 'checklist-empty'; none.textContent = 'No tags'; tagRow.appendChild(none);
    } else {
      tags.forEach(t => {
        const lab = document.createElement('label'); lab.className = 'chip';
        const inp = document.createElement('input'); inp.type='checkbox'; inp.value = t;
        if(preTags.includes(t)) inp.checked = true;
        const sp = document.createElement('span'); sp.textContent = t;
        lab.appendChild(inp); lab.appendChild(sp); tagRow.appendChild(lab);
      });
    }
    panel.appendChild(tagRow);

    // Rarity label + chips (separate row with spacing)
    const rarLbl = document.createElement('div'); rarLbl.className='checklist-subtitle'; rarLbl.style.marginTop='12px'; rarLbl.textContent='Rarity';
    panel.appendChild(rarLbl);
    const rarRow = document.createElement('div'); rarRow.className='checklist-chips rarity-chips-row';
    ['S','A','B','C','D'].forEach(r => {
      const lab = document.createElement('label'); lab.className='chip rarity-chip';
      const inp = document.createElement('input'); inp.type='checkbox'; inp.value = r;
      if(preRarities.includes(r)) inp.checked = true;
      const sp = document.createElement('span'); sp.textContent = r;
      lab.appendChild(inp); lab.appendChild(sp); rarRow.appendChild(lab);
    });
    panel.appendChild(rarRow);

    // actions (Apply) with spacing
    const actions = document.createElement('div'); actions.className='checklist-actions';
    const applyBtn = document.createElement('button'); applyBtn.className='apply-btn'; applyBtn.type='button'; applyBtn.textContent='Apply';
    applyBtn.addEventListener('click', () => applyChecklistFilters(panel));
    actions.appendChild(applyBtn);
    panel.appendChild(actions);

    // insert
    const itemsNode = document.getElementById('itemsContainer'), container = document.querySelector('.container');
    if(itemsNode && container) container.insertBefore(panel, itemsNode);
    else if(container) container.appendChild(panel);

    setTimeout(()=> applyBtn.focus(), 40);
  }

  function hideChecklist(){ const p = document.getElementById('checklistPanel'); if(p) p.remove(); }

  function manageChecklistToggle(catKey, opts = { showTitle: false }){
    const controls = document.querySelector('.controls'); if(!controls) return;
    let btn = document.getElementById('checklistToggleBtn');
    if(!btn){
      btn = document.createElement('button'); btn.id='checklistToggleBtn'; btn.className='checklist-toggle'; btn.type='button';
      btn.textContent = 'Filters';
      btn.addEventListener('click', () => {
        const panel = document.getElementById('checklistPanel');
        if(panel) hideChecklist(); else showChecklist(catKey, [], [], opts);
      });
      controls.appendChild(btn);
    }
    btn.style.marginLeft = '8px';
  }

  /* ===========================
     Render items (3-col grid)
     - Page background set per category (pastel gradient)
     - overlay tags appear only when filters-active
     =========================== */
  function renderItems(){
    const category = localStorage.getItem('activeCategory');
    if(!category || !hasData() || !DATA[category]) { goHome(); return; }
    const theme = applyCategoryTheme(category);

    const data = DATA[category];
    const title = document.getElementById('categoryTitle'); if(title) title.textContent = data.title || category;

    // small logo
    const logoWrap = document.getElementById('categoryLogoWrap');
    if(logoWrap){
      logoWrap.innerHTML = '';
      const first = (data.items && data.items[0]) ? data.items[0] : null;
      const logoUrl = (first && first.images && first.images.main) ? first.images.main : FALLBACK;
      const logoImg = document.createElement('img'); logoImg.src = logoUrl; logoImg.alt = data.title || ''; logoImg.className = 'category-small-logo';
      logoWrap.appendChild(logoImg);
    }

    // determine filters
    const searchInput = document.getElementById('searchInput');
    const search = searchInput ? (searchInput.value || '').toLowerCase() : '';
    let checkedTags = [], checkedRarities = [];
    if(searchInput && searchInput.dataset.checkedTags){
      try { checkedTags = JSON.parse(searchInput.dataset.checkedTags) || []; } catch(e){ checkedTags = []; }
    }
    if(searchInput && searchInput.dataset.checkedRarities){
      try { checkedRarities = JSON.parse(searchInput.dataset.checkedRarities) || []; } catch(e){ checkedRarities = []; }
    }

    const filtersActive = (checkedTags.length > 0 || checkedRarities.length > 0);

    let items = (data.items || []).filter(it => {
      return (it.name||'').toLowerCase().includes(search) || (it.desc||'').toLowerCase().includes(search);
    });
    if(checkedTags.length > 0) items = items.filter(it => (it.tags||[]).some(t => checkedTags.includes(t)));
    if(checkedRarities.length > 0) items = items.filter(it => checkedRarities.includes(it.rarity));

    const container = document.getElementById('itemsContainer');
    if(!container) return;
    container.innerHTML = '';

    // toggle class for overlay visibility
    if(filtersActive) container.classList.add('filters-active'); else container.classList.remove('filters-active');

    manageChecklistToggle(category, { showTitle: false });

    if(items.length === 0){
      const empty = document.createElement('div'); empty.className = 'card'; empty.innerHTML = '<p class="empty">No items match your search.</p>';
      container.appendChild(empty); return;
    }

    items.forEach(it => {
      const card = document.createElement('div'); card.className = 'card item-card-grid';

      // thumb wrap
      const thumbWrap = document.createElement('div'); thumbWrap.className = 'thumb-wrap';
      const thumb = (it.images && it.images.main) ? it.images.main : FALLBACK;
      const img = document.createElement('img'); img.src = thumb; img.alt = it.name || ''; img.className = 'grid-thumb'; img.loading='lazy';
      thumbWrap.appendChild(img);

      // rarity badge
      const rarityBadge = document.createElement('span'); rarityBadge.className = 'rarity-badge'; rarityBadge.textContent = it.rarity || '';
      thumbWrap.appendChild(rarityBadge);

      // overlay tags (only inject when filters active)
      if(container.classList.contains('filters-active')){
        const overlay = document.createElement('div'); overlay.className = 'img-overlay-tags';
        (it.tags || []).slice(0,3).forEach(t => {
          const tagEl = document.createElement('span'); tagEl.className = 'overlay-tag'; tagEl.textContent = t.toUpperCase();
          overlay.appendChild(tagEl);
        });
        thumbWrap.appendChild(overlay);
      }

      card.appendChild(thumbWrap);

      // name below
      const h = document.createElement('h3'); h.className = 'grid-item-name'; h.textContent = it.name || '';
      card.appendChild(h);

      // click -> detail
      card.addEventListener('click', () => {
        localStorage.setItem('selectedId', it.id);
        localStorage.setItem('activeCategory', category);
        window.location.href = 'detail.html';
      });

      container.appendChild(card);
    });
  }

  /* ===========================
     Page 3: detail + extras slider
     =========================== */
  function createExtrasSlider(extras){
    const wrap = document.createElement('div'); wrap.className = 'extras-slider-wrapper';
    const slider = document.createElement('div'); slider.className = 'extras-slider';
    const arr = [extras[0]||FALLBACK, extras[1]||FALLBACK, extras[2]||FALLBACK];
    const len = arr.length || 1;
    let idx = 1 % len;

    function render(){
      slider.innerHTML = '';
      const prev = (idx - 1 + len) % len;
      const next = (idx + 1) % len;
      for(let i=0;i<len;i++){
        const slot = document.createElement('div'); slot.className = 'extras-slide';
        if(i === idx) slot.classList.add('active');
        if(i === prev || i === next) slot.classList.add('side');
        const im = document.createElement('img'); im.src = arr[i]; im.alt = `extra-${i+1}`; im.loading='lazy';
        if(i === idx){
          im.style.cursor = 'pointer';
          im.addEventListener('click', () => openImageModal(arr[i]));
        } else {
          im.style.cursor = 'pointer';
          im.addEventListener('click', () => { idx = i; render(); });
        }
        slot.appendChild(im); slider.appendChild(slot);
      }
    }

    const navWrap = document.createElement('div'); navWrap.className = 'extras-nav-wrap';
    const prevBtn = document.createElement('button'); prevBtn.className = 'slider-nav'; prevBtn.type='button'; prevBtn.innerHTML='&#9664;';
    const nextBtn = document.createElement('button'); nextBtn.className = 'slider-nav'; nextBtn.type='button'; nextBtn.innerHTML='&#9654;';
    prevBtn.addEventListener('click', () => { idx = (idx - 1 + len) % len; render(); });
    nextBtn.addEventListener('click', () => { idx = (idx + 1) % len; render(); });
    navWrap.appendChild(prevBtn); navWrap.appendChild(nextBtn);

    wrap.appendChild(slider); wrap.appendChild(navWrap);
    render();
    return wrap;
  }

  function renderDetail(){
    const container = document.getElementById('detailContainer'); if(!container) return;
    const id = localStorage.getItem('selectedId'); if(!id){ container.innerHTML = "<div class='card'><h3>Item not found</h3></div>"; return; }
    const selected = findItemById(id); if(!selected){ container.innerHTML = "<div class='card'><h3>Item not found</h3></div>"; return; }

    const category = localStorage.getItem('activeCategory') || null;
    const theme = applyCategoryTheme(category);
    // keep detail page background light but subtle (do not override heavy); set a faint gradient
    document.body.style.background = theme.bg;

    container.innerHTML = '';
    const wrapper = document.createElement('div'); wrapper.className = 'detail-wrapper';

    // hero
    const heroCard = document.createElement('div'); heroCard.className = 'hero-card';
    const heroImg = document.createElement('img'); heroImg.className = 'hero-img'; heroImg.src = (selected.images && selected.images.main) ? selected.images.main : FALLBACK; heroImg.alt = selected.name || '';
    heroCard.appendChild(heroImg);

    const heroOverlay = document.createElement('div'); heroOverlay.className = 'hero-overlay';
    const titleRow = document.createElement('div'); titleRow.className = 'detail-title-row';
    const h2 = document.createElement('h2'); h2.textContent = selected.name || '';
    titleRow.appendChild(h2);
    const raritySpan = document.createElement('span'); raritySpan.className='detail-rarity-inline'; raritySpan.textContent = selected.rarity || '';
    raritySpan.style.background = 'rgba(0,0,0,0.8)'; raritySpan.style.color='#fff'; raritySpan.style.padding='6px 12px'; raritySpan.style.borderRadius='8px'; raritySpan.style.fontWeight='900';
    titleRow.appendChild(raritySpan);
    heroOverlay.appendChild(titleRow);

    const desc = document.createElement('p'); desc.className='hero-desc'; desc.textContent = selected.desc || ''; heroOverlay.appendChild(desc);

    // tags
    const tagRow = document.createElement('div'); tagRow.className='detail-tag-row';
    (selected.tags || []).forEach(t => {
      const sp = document.createElement('span'); sp.className='tag'; sp.textContent = t.toUpperCase();
      sp.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const detailFilter = { tags: [t], rarities: [], category: category, autoApply: true };
        localStorage.setItem('detailFilter', JSON.stringify(detailFilter));
        if(category) localStorage.setItem('activeCategory', category);
        window.location.href = 'items.html';
      });
      tagRow.appendChild(sp);
    });
    heroOverlay.appendChild(tagRow);

    wrapper.appendChild(heroCard);
    wrapper.appendChild(heroOverlay);

    if(selected.story && String(selected.story).trim().length > 0){
      const story = document.createElement('div'); story.className = 'story-card';
      story.innerHTML = `<h3>Story</h3><p>${selected.story}</p>`;
      wrapper.appendChild(story);
    }

    // extras slider
    const extras = (selected.images && Array.isArray(selected.images.extras)) ? selected.images.extras.slice(0,3) : [];
    const sliderNode = createExtrasSlider(extras);
    wrapper.appendChild(sliderNode);

    container.appendChild(wrapper);
  }

  /* ===========================
     Modal helpers
     =========================== */
  function openImageModal(src){
    const modal = document.getElementById('imgModal'); const img = document.getElementById('imgModalImg');
    if(!modal || !img) return;
    img.src = src || FALLBACK;
    modal.style.display = 'flex';
    const closeBtn = modal.querySelector('.modal-close');
    if(closeBtn) closeBtn.focus();
    document.addEventListener('keydown', escHandler);
  }
  function closeImageModal(){ const modal = document.getElementById('imgModal'); if(modal) modal.style.display = 'none'; document.removeEventListener('keydown', escHandler); }
  function escHandler(e){ if(e.key === 'Escape') closeImageModal(); }
  document.addEventListener('click', (e) => {
    const m = document.getElementById('imgModal');
    if(!m || m.style.display !== 'flex') return;
    if(e.target === m) closeImageModal();
  });

  /* ===========================
     Init
     =========================== */
  document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const modalClose = document.getElementById('modalClose');
    const categoryModal = document.getElementById('categoryModal');

    if(startBtn) startBtn.addEventListener('click', (e) => { e.preventDefault(); openCategoryModal(); });
    if(modalClose) modalClose.addEventListener('click', closeCategoryModal);
    if(categoryModal) categoryModal.addEventListener('click', (ev) => { if(ev.target === categoryModal) closeCategoryModal(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && categoryModal && !categoryModal.classList.contains('hidden')) closeCategoryModal(); });

    // items page
    if(window.location.pathname.includes('items')){
      const detailFilterRaw = localStorage.getItem('detailFilter');
      if(detailFilterRaw){
        try {
          const detailFilter = JSON.parse(detailFilterRaw);
          if(detailFilter && detailFilter.category) localStorage.setItem('activeCategory', detailFilter.category);
        } catch(e){}
      }

      const si = document.getElementById('searchInput');
      const ac = localStorage.getItem('activeCategory');
      if(ac) {
        // apply category theme for preview
        const theme = applyCategoryTheme(ac);
        document.body.style.background = theme.bg;
      }

      if(si){
        si.addEventListener('focus', () => manageChecklistToggle(localStorage.getItem('activeCategory'), { showTitle: false }));
        si.addEventListener('input', () => renderItems());
      }

      if(detailFilterRaw){
        try {
          const detailFilter = JSON.parse(detailFilterRaw);
          const preTags = detailFilter.tags || []; const preRarities = detailFilter.rarities || [];
          const si2 = document.getElementById('searchInput');
          if(si2){ si2.dataset.checkedTags = JSON.stringify(preTags); si2.dataset.checkedRarities = JSON.stringify(preRarities || []); }
          setTimeout(()=>{ showChecklist(localStorage.getItem('activeCategory'), preTags, preRarities, { showTitle: false }); if(detailFilter.autoApply) setTimeout(()=> applyChecklistFilters(document.getElementById('checklistPanel')), 250); }, 200);
        } catch(e){}
        localStorage.removeItem('detailFilter');
      }

      renderItems();
    }

    // detail page
    if(window.location.pathname.includes('detail')){
      renderDetail();
    }

    const modalCloseBtn = document.getElementById('modalCloseBtn'); if(modalCloseBtn) modalCloseBtn.onclick = closeImageModal;
  });

  // expose quick helpers (debug)
  window.__AC = { renderItems, renderDetail, openCategoryModal, closeCategoryModal, showChecklist, hideChecklist };

})();
