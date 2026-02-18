// script.js - Revisi: Page1 modal-only categories, Page2 item layout vertical (image,name,tags,rarity), Page3 rarity inline & mobile-friendly slider nav below
(function(){
  'use strict';

  const FALLBACK = (typeof PLACEHOLDER !== 'undefined') ? PLACEHOLDER : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3Crect width='100%25' height='100%25' fill='%23ffe9a8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23333333' font-family='Arial' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E";

  // Navigation helpers
  function goHome(){ window.location.href = "index.html"; }
  function goBackToHome(){ window.location.href = "index.html"; }
  function goToItemsPage(){ window.location.href = "items.html"; }

  window.goHome = goHome;
  window.goBackToHome = goBackToHome;
  window.goToItemsPage = goToItemsPage;

  const CATEGORY_THEME = {
    CHARACTER: { bg: "linear-gradient(180deg,#f7eef8,#ffeef6)", tagBg: "#ffd6da", accent: "#ff6b6b" },
    AREA:      { bg: "linear-gradient(180deg,#fff8f0,#fff0e6)", tagBg: "#ffe6c9", accent: "#ff9f43" },
    PET:       { bg: "linear-gradient(180deg,#fffdf5,#fff9e6)", tagBg: "#fff5b2", accent: "#ffd54f" },
    MONSTER:   { bg: "linear-gradient(180deg,#f3e8ff,#e8f0ff)", tagBg: "#eadcff", accent: "#9b59b6" },
    MAGIC:     { bg: "linear-gradient(180deg,#f0fbff,#e6f7ff)", tagBg: "#d6efff", accent: "#4da6ff" },
    DEFAULT:   { bg: "linear-gradient(180deg,#fff9c4,#ffe082)", tagBg: "#fff3cd", accent: "#ffd54f" }
  };

  function applyCategoryTheme(catKey){
    const theme = (catKey && CATEGORY_THEME[catKey]) ? CATEGORY_THEME[catKey] : CATEGORY_THEME.DEFAULT;
    document.body.style.background = theme.bg;
    document.documentElement.style.setProperty('--tag-bg', theme.tagBg);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
  }

  function findItemById(id){
    let found = null;
    Object.keys(DATA).some(catKey => {
      return DATA[catKey].items.some(it => {
        if(String(it.id) === String(id)){ found = it; return true; }
        return false;
      });
    });
    return found;
  }
  function findCategoryByItemId(id){
    let foundKey = null;
    Object.keys(DATA).some(catKey => {
      if(DATA[catKey].items.some(it => String(it.id) === String(id))){ foundKey = catKey; return true; }
      return false;
    });
    return foundKey;
  }

  // ---------- PAGE 1 ----------
  function buildCategoryCardForModal(key){
    const cat = DATA[key];
    const firstItem = (cat && cat.items && cat.items[0]) ? cat.items[0] : null;
    const thumb = (firstItem && firstItem.images && firstItem.images.main) ? firstItem.images.main : FALLBACK;
    const card = document.createElement('div');
    card.className = "card cat-card";
    card.tabIndex = 0;

    const img = document.createElement('img');
    img.src = thumb;
    img.alt = `${cat.title || key} preview`;
    img.loading = "lazy";
    img.style.borderRadius = "10px";
    img.style.width = "100%";
    img.style.height = "120px";
    img.style.objectFit = "cover";
    card.appendChild(img);

    const h3 = document.createElement('h3');
    h3.textContent = cat.title || key;
    card.appendChild(h3);

    card.addEventListener('click', () => {
      localStorage.setItem("activeCategory", key);
      closeCategoryModal();
      window.location.href = "items.html";
    });
    return card;
  }

  function openCategoryModal(){
    const modal = document.getElementById('categoryModal');
    if(!modal) return;
    const grid = document.getElementById('categoryGrid');
    if(grid){
      grid.innerHTML = "";
      Object.keys(DATA).forEach(key => {
        grid.appendChild(buildCategoryCardForModal(key));
      });
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(()=> {
      const first = modal.querySelector('.card');
      if(first) first.focus();
    },50);
  }
  function closeCategoryModal(){
    const modal = document.getElementById('categoryModal');
    if(!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // ---------- PAGE 2 ----------
  function uniqueTagsForCategory(catKey){
    if(!DATA[catKey]) return [];
    const s = new Set();
    DATA[catKey].items.forEach(it => (it.tags||[]).forEach(t => s.add(t)));
    return Array.from(s);
  }
  function uniqueRaritiesForCategory(catKey){
    return ["S","A","B","C","D"];
  }

  function showChecklist(catKey, preSelectedTags = [], preSelectedRarities = [], options = { showTitle: true }){
    hideChecklist();
    const panel = document.createElement('div');
    panel.id = "checklistPanel";
    panel.className = "checklist-panel";

    const header = document.createElement('div');
    header.className = "checklist-header";
    if(options.showTitle){
      const title = document.createElement('strong');
      title.textContent = "Filter tags & rarity";
      header.appendChild(title);
    }
    const closeBtn = document.createElement('button');
    closeBtn.className = "closeChecklist modern-close";
    closeBtn.type = "button";
    closeBtn.textContent = "✕";
    closeBtn.addEventListener('click', hideChecklist);
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // Tags section
    const tagsSection = document.createElement('div');
    tagsSection.className = "checklist-section";
    const tagLabel = document.createElement('div');
    tagLabel.className = "checklist-subtitle";
    tagLabel.style.fontSize = "15px";
    tagLabel.textContent = "Tags";
    tagsSection.appendChild(tagLabel);

    const chips = document.createElement('div');
    chips.className = "checklist-chips";
    const tags = uniqueTagsForCategory(catKey);
    if(tags.length === 0){
      const no = document.createElement('div');
      no.className = "checklist-empty";
      no.textContent = "No tags";
      chips.appendChild(no);
    } else {
      tags.forEach(t => {
        const label = document.createElement('label');
        label.className = "chip";
        const input = document.createElement('input');
        input.type = "checkbox";
        input.value = t;
        if(preSelectedTags && preSelectedTags.includes(t)) input.checked = true;
        const span = document.createElement('span');
        span.textContent = t;
        label.appendChild(input);
        label.appendChild(span);
        chips.appendChild(label);
      });
    }
    tagsSection.appendChild(chips);
    panel.appendChild(tagsSection);

    // Rarity section with spacing
    const raritySection = document.createElement('div');
    raritySection.className = "checklist-section";
    const rarityLabel = document.createElement('div');
    rarityLabel.className = "checklist-subtitle";
    rarityLabel.style.marginTop = "12px";
    rarityLabel.style.fontSize = "15px";
    rarityLabel.textContent = "Rarity";
    raritySection.appendChild(rarityLabel);

    const rarityChips = document.createElement('div');
    rarityChips.className = "checklist-chips rarity-chips-row";
    const order = ["S","A","B","C","D"];
    order.forEach(r => {
      const rx = document.createElement('label');
      rx.className = "chip rarity-chip";
      const input = document.createElement('input');
      input.type = "checkbox";
      input.value = r;
      if(preSelectedRarities && preSelectedRarities.includes(r)) input.checked = true;
      const span = document.createElement('span');
      span.textContent = r;
      rx.appendChild(input);
      rx.appendChild(span);
      rarityChips.appendChild(rx);
    });
    raritySection.appendChild(rarityChips);
    panel.appendChild(raritySection);

    const actions = document.createElement('div');
    actions.className = "checklist-actions";
    const apply = document.createElement('button');
    apply.type = "button";
    apply.className = "apply-btn";
    apply.textContent = "Apply";
    apply.addEventListener('click', applyChecklistFilters);
    actions.appendChild(apply);
    panel.appendChild(actions);

    const container = document.querySelector(".container");
    const itemsNode = document.getElementById("itemsContainer");
    if(container){
      if(itemsNode) container.insertBefore(panel, itemsNode);
      else container.appendChild(panel);
      apply.focus();
    }
  }

  function hideChecklist(){ const panel = document.getElementById("checklistPanel"); if(panel) panel.remove(); }

  function applyChecklistFilters(){
    const panel = document.getElementById("checklistPanel");
    if(!panel) return;
    const allChips = Array.from(panel.querySelectorAll('.chip input'));
    const tagsChecked = [];
    const rarityChecked = [];
    allChips.forEach(inp => {
      if(inp.checked){
        if(["S","A","B","C","D"].includes(inp.value)) rarityChecked.push(inp.value);
        else tagsChecked.push(inp.value);
      }
    });
    const searchInput = document.getElementById("searchInput");
    if(searchInput) { searchInput.dataset.checkedTags = JSON.stringify(tagsChecked); searchInput.dataset.checkedRarities = JSON.stringify(rarityChecked); }
    hideChecklist();
    renderItems();
  }

  function manageChecklistToggle(catKey){
    const controls = document.querySelector(".controls");
    if(!controls) return;
    let btn = document.getElementById("checklistToggleBtn");
    if(!btn){
      btn = document.createElement("button");
      btn.id = "checklistToggleBtn";
      btn.className = "checklist-toggle nav-btn";
      btn.type = "button";
      btn.textContent = "Filters";
      btn.addEventListener('click', () => {
        const panel = document.getElementById("checklistPanel");
        if(panel) hideChecklist(); else showChecklist(catKey, [], [], { showTitle: false });
      });
      controls.appendChild(btn);
    }
    const si = document.getElementById("searchInput");
    if(!si){ btn.style.display = "none"; return; }
    btn.style.display = "inline-block";
  }

  // Render items: VISUAL ORDER change here (image -> name -> tags -> rarity). Remove nickname/desc from list.
  function renderItems(){
    const category = localStorage.getItem("activeCategory");
    if(!category || !DATA[category]) { goHome(); return; }
    applyCategoryTheme(category);

    const data = DATA[category];
    const title = document.getElementById("categoryTitle");
    if(title) title.textContent = data.title || category;

    const logoWrap = document.getElementById("categoryLogoWrap");
    if(logoWrap){
      logoWrap.innerHTML = "";
      const firstItem = (data.items && data.items[0]) ? data.items[0] : null;
      const logoUrl = (firstItem && firstItem.images && firstItem.images.main) ? firstItem.images.main : FALLBACK;
      const logoImg = document.createElement('img');
      logoImg.src = logoUrl;
      logoImg.alt = `${data.title} logo`;
      logoImg.className = "category-small-logo";
      logoWrap.appendChild(logoImg);
    }

    const searchInput = document.getElementById("searchInput");
    const search = searchInput ? (searchInput.value || "").toLowerCase() : "";
    let checkedTags = [];
    let checkedRarities = [];
    if(searchInput && searchInput.dataset.checkedTags){
      try { checkedTags = JSON.parse(searchInput.dataset.checkedTags) || []; } catch(e){ checkedTags = []; }
    }
    if(searchInput && searchInput.dataset.checkedRarities){
      try { checkedRarities = JSON.parse(searchInput.dataset.checkedRarities) || []; } catch(e){ checkedRarities = []; }
    }

    let items = (data.items||[]).filter(it => (it.name||"").toLowerCase().includes(search) || (it.desc||"").toLowerCase().includes(search));
    if(checkedTags.length > 0) items = items.filter(it => (it.tags||[]).some(t => checkedTags.includes(t)));
    if(checkedRarities.length > 0) items = items.filter(it => checkedRarities.includes(it.rarity));

    const container = document.getElementById("itemsContainer");
    if(!container) return;
    container.innerHTML = "";
    manageChecklistToggle(category);

    if(items.length === 0){
      const card = document.createElement('div');
      card.className = "card";
      const p = document.createElement('p');
      p.className = "empty";
      p.textContent = "No items match your search.";
      card.appendChild(p);
      container.appendChild(card);
      return;
    }

    items.forEach(it => {
      const div = document.createElement("div");
      div.className = "card item-card small-card item-vertical";
      div.style.position = "relative";

      // IMAGE (top)
      const img = document.createElement('img');
      img.src = (it.images && it.images.main) ? it.images.main : FALLBACK;
      img.alt = it.name || "item";
      img.loading = "lazy";
      img.className = "item-card-img";
      div.appendChild(img);

      // NAME
      const h3 = document.createElement('h3');
      h3.textContent = it.name || "";
      h3.className = "item-name";
      div.appendChild(h3);

      // TAGS (small, horizontal, contained)
      const tagRow = document.createElement('div');
      tagRow.className = "item-tags-row";
      (it.tags || []).forEach(t => {
        const sp = document.createElement('span');
        sp.className = "item-tag-mini";
        sp.textContent = t;
        tagRow.appendChild(sp);
      });
      div.appendChild(tagRow);

      // RARITY (below tags)
      const rarityWrap = document.createElement('div');
      rarityWrap.className = "item-rarity-wrap";
      const raritySpan = document.createElement('span');
      raritySpan.className = "item-rarity";
      raritySpan.textContent = it.rarity || "";
      rarityWrap.appendChild(raritySpan);
      div.appendChild(rarityWrap);

      // click opens detail
      div.addEventListener('click', () => {
        localStorage.setItem("selectedId", it.id);
        localStorage.setItem("activeCategory", category);
        window.location.href = "detail.html";
      });

      container.appendChild(div);
    });
  }

  // ---------- PAGE 3 ----------
  function ensureDetailOverlay(){
    let ov = document.getElementById("detailOverlay");
    if(!ov){ ov = document.createElement("div"); ov.id = "detailOverlay"; document.body.appendChild(ov); }
    ov.style.position = "fixed"; ov.style.top = "0"; ov.style.left = "0"; ov.style.right = "0"; ov.style.bottom = "0";
    ov.style.background = "linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.95))";
    ov.style.pointerEvents = "none"; ov.style.zIndex = "1";
    const c = document.querySelector(".container");
    if(c){ c.style.position = "relative"; c.style.zIndex = "2"; }
  }

  // extras slider: circular, nav below images (mobile friendly)
  function createExtrasSlider(extras){
    const wrap = document.createElement('div');
    wrap.className = 'extras-slider-wrapper';

    const slider = document.createElement('div');
    slider.className = 'extras-slider';

    const arr = [extras[0]||FALLBACK, extras[1]||FALLBACK, extras[2]||FALLBACK];
    const len = arr.length;
    let activeIndex = 1;

    function render(){
      slider.innerHTML = "";
      const prevIndex = (activeIndex - 1 + len) % len;
      const nextIndex = (activeIndex + 1) % len;

      for(let idx=0; idx<len; idx++){
        const slot = document.createElement('div');
        slot.className = 'extras-slide';
        if(idx === activeIndex) slot.classList.add('active');
        if(idx === prevIndex || idx === nextIndex) slot.classList.add('side');
        const im = document.createElement('img');
        im.src = arr[idx] || FALLBACK;
        im.alt = `extra-${idx+1}`;
        im.loading = "lazy";
        if(idx === activeIndex){
          im.style.cursor = "pointer";
          im.addEventListener('click', () => openImageModal(arr[idx] || FALLBACK));
        } else {
          im.style.cursor = "pointer";
          im.addEventListener('click', () => { activeIndex = idx; render(); });
        }
        slot.appendChild(im);
        slider.appendChild(slot);
      }
    }

    // create nav container below slider (mobile friendly)
    const navWrap = document.createElement('div');
    navWrap.className = 'extras-nav-wrap';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'slider-nav prev-nav';
    prevBtn.type = 'button';
    prevBtn.innerHTML = '&#9664;';
    prevBtn.addEventListener('click', () => { activeIndex = (activeIndex - 1 + len) % len; render(); });

    const nextBtn = document.createElement('button');
    nextBtn.className = 'slider-nav next-nav';
    nextBtn.type = 'button';
    nextBtn.innerHTML = '&#9654;';
    nextBtn.addEventListener('click', () => { activeIndex = (activeIndex + 1) % len; render(); });

    navWrap.appendChild(prevBtn);
    navWrap.appendChild(nextBtn);

    wrap.appendChild(slider);
    wrap.appendChild(navWrap);

    render();
    return wrap;
  }

  function renderDetail(){
    const container = document.getElementById("detailContainer");
    if(!container) return;
    const id = localStorage.getItem("selectedId");
    if(!id){ container.innerHTML = "<div class='card'><h3>Item not found</h3></div>"; return; }
    const selected = findItemById(id);
    if(!selected){ container.innerHTML = "<div class='card'><h3>Item not found</h3></div>"; return; }

    let category = localStorage.getItem("activeCategory") || findCategoryByItemId(id);
    if(!category){ Object.keys(DATA).some(k => { if(DATA[k].items.some(it => String(it.id) === String(id))){ category = k; return true;} return false; }); }
    applyCategoryTheme(category);

    const wallpaperUrl = (selected.images && selected.images.main) ? selected.images.main : null;
    if(wallpaperUrl){
      document.body.style.backgroundImage = `url("${wallpaperUrl}")`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundAttachment = "fixed";
    } else { applyCategoryTheme(category); }

    ensureDetailOverlay();

    const mainImg = (selected.images && selected.images.main) ? selected.images.main : FALLBACK;
    const extras = (selected.images && Array.isArray(selected.images.extras)) ? selected.images.extras.slice(0,3) : [];

    container.innerHTML = "";
    const wrapper = document.createElement('div');
    wrapper.className = "detail-wrapper";

    const heroCard = document.createElement('div');
    heroCard.className = "detail-card hero-card";

    const heroImg = document.createElement('img');
    heroImg.className = "hero-img";
    heroImg.src = mainImg;
    heroImg.alt = selected.name || "hero";
    heroCard.appendChild(heroImg);

    const heroOverlay = document.createElement('div');
    heroOverlay.className = "hero-overlay";

    // Title row: name left, rarity right
    const titleRow = document.createElement('div');
    titleRow.className = 'detail-title-row';
    titleRow.style.display = 'flex';
    titleRow.style.justifyContent = 'space-between';
    titleRow.style.alignItems = 'center';
    titleRow.style.gap = '12px';

    const h2 = document.createElement('h2');
    h2.textContent = selected.name || "";
    h2.style.margin = 0;
    h2.style.fontSize = '18px';
    titleRow.appendChild(h2);

    const rarityRight = document.createElement('div');
    rarityRight.style.marginLeft = 'auto';
    const raritySpan = document.createElement('span');
    raritySpan.className = 'detail-rarity-inline';
    raritySpan.textContent = selected.rarity || "";
    raritySpan.style.fontWeight = '900';
    raritySpan.style.padding = '6px 10px';
    raritySpan.style.borderRadius = '8px';
    raritySpan.style.background = 'rgba(0,0,0,0.6)';
    raritySpan.style.color = '#fff';
    rarityRight.appendChild(raritySpan);
    titleRow.appendChild(rarityRight);

    heroOverlay.appendChild(titleRow);

    // description
    const descP = document.createElement('p');
    descP.className = "hero-desc";
    descP.textContent = selected.desc || "";
    heroOverlay.appendChild(descP);

    // tags under title/desc
    const tagWrap = document.createElement('div');
    tagWrap.className = "item-tags";
    (selected.tags||[]).forEach(t => {
      const sp = document.createElement('span');
      sp.className = "tag";
      sp.textContent = String(t).toUpperCase();
      sp.style.cursor = "pointer";
      sp.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const detailFilter = { tags: [t], rarities: [], category: category, autoApply: true };
        localStorage.setItem("detailFilter", JSON.stringify(detailFilter));
        localStorage.setItem("activeCategory", category);
        window.location.href = "items.html";
      });
      tagWrap.appendChild(sp);
    });
    heroOverlay.appendChild(tagWrap);

    heroCard.appendChild(heroOverlay);
    wrapper.appendChild(heroCard);

    if(selected.story && String(selected.story).trim().length > 0){
      const storyCard = document.createElement('div');
      storyCard.className = 'story-card';
      const storyTitle = document.createElement('h3');
      storyTitle.textContent = 'Story';
      storyCard.appendChild(storyTitle);
      const storyText = document.createElement('p');
      storyText.textContent = selected.story;
      storyCard.appendChild(storyText);
      wrapper.appendChild(storyCard);
    }

    // extras slider + nav below
    const extrasSliderNode = createExtrasSlider(extras);
    wrapper.appendChild(extrasSliderNode);

    container.appendChild(wrapper);
  }

  // modal preview
  function openImageModal(src){
    const modal = document.getElementById("imgModal");
    const img = document.getElementById("imgModalImg");
    if(!modal || !img) return;
    img.src = src || FALLBACK;
    modal.style.display = "flex";
    document.addEventListener("keydown", escModalHandler);
  }
  function closeImageModal(){ const modal = document.getElementById("imgModal"); if(modal) modal.style.display = "none"; document.removeEventListener("keydown", escModalHandler); }
  function escModalHandler(e){ if(e.key === "Escape") closeImageModal(); }

  document.addEventListener("click", function(e){
    const modal = document.getElementById("imgModal");
    if(!modal || modal.style.display !== "flex") return;
    if(e.target === modal) closeImageModal();
  });

  // ---------- INIT ----------
  document.addEventListener("DOMContentLoaded", function(){
    const startBtn = document.getElementById("startBtn");
    const categoryModal = document.getElementById("categoryModal");
    const modalClose = document.getElementById("modalClose");
    if(startBtn){ startBtn.addEventListener('click', (e) => { e.preventDefault(); openCategoryModal(); }); }
    if(modalClose){ modalClose.addEventListener('click', closeCategoryModal); }

    document.addEventListener('keydown', (e) => { if(e.key === "Escape"){ if(categoryModal && !categoryModal.classList.contains('hidden')) closeCategoryModal(); } });
    if(categoryModal){ categoryModal.addEventListener('click', (ev) => { if(ev.target === categoryModal) closeCategoryModal(); }); }

    if(window.location.pathname.includes("items")){
      const detailFilterRaw = localStorage.getItem("detailFilter");
      if(detailFilterRaw){
        try {
          const detailFilter = JSON.parse(detailFilterRaw);
          if(detailFilter && detailFilter.category){
            localStorage.setItem("activeCategory", detailFilter.category);
          }
        } catch(e){}
      }

      const si = document.getElementById("searchInput");
      const activeCategory = localStorage.getItem("activeCategory");
      if(activeCategory) applyCategoryTheme(activeCategory);

      if(si){
        si.addEventListener("focus", () => manageChecklistToggle(localStorage.getItem("activeCategory")));
        si.addEventListener("input", () => renderItems());
        si.addEventListener("blur", () => setTimeout(()=>manageChecklistToggle(localStorage.getItem("activeCategory")), 150));
      }

      if(detailFilterRaw){
        try {
          const detailFilter = JSON.parse(detailFilterRaw);
          const preTags = detailFilter.tags || [];
          const preRarities = detailFilter.rarities || [];
          const si2 = document.getElementById("searchInput");
          if(si2){
            si2.dataset.checkedTags = JSON.stringify(preTags);
            si2.dataset.checkedRarities = JSON.stringify(preRarities || []);
          }
          setTimeout(() => {
            showChecklist(localStorage.getItem("activeCategory"), preTags, preRarities, { showTitle: false });
            if(detailFilter.autoApply){
              setTimeout(()=> { applyChecklistFilters(); }, 300);
            }
          }, 200);
        } catch(e){}
        localStorage.removeItem("detailFilter");
      }

      renderItems();
    }

    if(window.location.pathname.includes("detail")){
      renderDetail();
    }

    const modalCloseBtn = document.getElementById("modalCloseBtn");
    if(modalCloseBtn) modalCloseBtn.onclick = closeImageModal;
  });

  // expose modal funcs
  window.openImageModal = openImageModal;
  window.closeImageModal = closeImageModal;

})();
