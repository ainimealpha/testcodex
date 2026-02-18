// script.js - FULL REVISED (restore full features + auto-filter gimmick + index-only theme)
(function(){
  'use strict';

  // Navigation helpers
  function goHome(){ window.location.href = "index.html"; }

  // IMPORTANT: Back on items page must always go to Home
  function goBack(){
    try {
      if(window.location.pathname.includes("items")) {
        window.location.href = "index.html";
      } else {
        window.history.back();
      }
    } catch(e){
      window.history.back();
    }
  }

  // Category theme mapping (used on items/detail pages)
  const CATEGORY_THEME = {
    CHARACTER: { bg: "linear-gradient(180deg,#ffe6e8,#ffd6da)", tagBg: "#ffd6da", accent: "#ff6b6b" },
    AREA:      { bg: "linear-gradient(180deg,#fff2e6,#ffd9b8)", tagBg: "#ffe6c7", accent: "#ff9f43" },
    PET:       { bg: "linear-gradient(180deg,#fffbe6,#fff4b2)", tagBg: "#fff5b2", accent: "#ffd54f" },
    MONSTER:   { bg: "linear-gradient(180deg,#f3e8ff,#e8d7ff)", tagBg: "#eadcff", accent: "#9b59b6" },
    MAGIC:     { bg: "linear-gradient(180deg,#e8f4ff,#d0ecff)", tagBg: "#d6efff", accent: "#4da6ff" },
    DEFAULT:   { bg: "linear-gradient(180deg,#fff9c4,#ffe082)", tagBg: "#fff3cd", accent: "#ffd54f" }
  };

  // Index (page 1) special dreamy theme (only for index)
  const INDEX_THEME = {
    bg: "linear-gradient(180deg,#0b1024 0%, #3b1164 40%, #6b2b9b 100%)",
    tagBg: "#b9a6ff",
    accent: "#ffd6fb"
  };

  // Safe fallback placeholder
  const FALLBACK = (typeof PLACEHOLDER !== 'undefined') ? PLACEHOLDER : "";

  // Find item by id across DATA
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

  // Apply category theme (for items/detail only)
  function applyCategoryTheme(catKey){
    const theme = (catKey && CATEGORY_THEME[catKey]) ? CATEGORY_THEME[catKey] : CATEGORY_THEME.DEFAULT;
    document.body.style.background = theme.bg;
    document.documentElement.style.setProperty('--tag-bg', theme.tagBg);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
  }

  // Apply index-only dreamy theme
  function applyIndexTheme(){
    document.body.style.background = INDEX_THEME.bg;
    document.documentElement.style.setProperty('--tag-bg', INDEX_THEME.tagBg);
    document.documentElement.style.setProperty('--accent-color', INDEX_THEME.accent);
  }

  function resetBodyBackground(){
    document.body.style.background = "";
    document.body.style.backgroundImage = "";
    document.body.style.backgroundSize = "";
    document.body.style.backgroundPosition = "";
    document.body.style.backgroundRepeat = "";
    document.body.style.backgroundAttachment = "";
    const ov = document.getElementById("detailOverlay");
    if(ov) ov.remove();
    const c = document.querySelector(".container");
    if(c){ c.style.position = ""; c.style.zIndex = ""; }
  }

  /* =========================
     PAGE 1: categories
  ========================= */
  function renderCategories(){
    resetBodyBackground();
    applyIndexTheme(); // index-only theme
    const container = document.getElementById("categoryContainer");
    if(!container) return;
    container.innerHTML = "";

    Object.keys(DATA).forEach(key => {
      const cat = DATA[key];
      const firstItem = (cat.items && cat.items[0]) ? cat.items[0] : null;
      const thumb = (firstItem && firstItem.images && firstItem.images.main) ? firstItem.images.main : FALLBACK;

      const card = document.createElement('div');
      card.className = "card cat-card small-card";
      card.tabIndex = 0;

      const img = document.createElement('img');
      img.src = thumb;
      img.alt = `${cat.title} preview`;
      img.loading = "lazy";
      card.appendChild(img);

      const h3 = document.createElement('h3');
      h3.textContent = cat.title || key;
      card.appendChild(h3);

      card.addEventListener('click', () => {
        localStorage.setItem("activeCategory", key);
        try {
          const si = document.getElementById("searchInput");
          if(si){ delete si.dataset.checkedTags; si.value = ""; }
        } catch(e){}
        window.location.href = "items.html";
      });
      card.addEventListener('keypress', (e) => { if(e.key === "Enter") card.click(); });

      container.appendChild(card);
    });
  }

  /* =========================
     PAGE 2: items + filters
  ========================= */
  function uniqueTagsForCategory(catKey){
    if(!DATA[catKey]) return [];
    const s = new Set();
    DATA[catKey].items.forEach(it => (it.tags||[]).forEach(t => s.add(t)));
    return Array.from(s);
  }

  function showChecklist(catKey){
    hideChecklist();
    const panel = document.createElement('div');
    panel.id = "checklistPanel";
    panel.className = "checklist-panel";

    const header = document.createElement('div');
    header.className = "checklist-header";
    const title = document.createElement('strong');
    title.textContent = "Filter tags";
    header.appendChild(title);
    const closeBtn = document.createElement('button');
    closeBtn.className = "closeChecklist";
    closeBtn.type = "button";
    closeBtn.textContent = "✕";
    closeBtn.addEventListener('click', hideChecklist);
    header.appendChild(closeBtn);
    panel.appendChild(header);

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
        const span = document.createElement('span');
        span.textContent = t;
        label.appendChild(input);
        label.appendChild(span);
        chips.appendChild(label);
      });
    }
    panel.appendChild(chips);

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
    }
  }

  function hideChecklist(){
    const panel = document.getElementById("checklistPanel");
    if(panel) panel.remove();
  }

  function applyChecklistFilters(){
    const panel = document.getElementById("checklistPanel");
    if(!panel) return;
    const checked = Array.from(panel.querySelectorAll('input[type="checkbox"]:checked')).map(i => i.value);
    const searchInput = document.getElementById("searchInput");
    if(searchInput) {
      searchInput.dataset.checkedTags = JSON.stringify(checked);
    }
    hideChecklist();
    // renderItems will read dataset.checkedTags
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
        if(panel) hideChecklist(); else showChecklist(catKey);
      });
      controls.appendChild(btn);
    }
    const si = document.getElementById("searchInput");
    if(!si){ btn.style.display = "none"; return; }
    btn.style.display = "inline-block";
  }

  function renderItems(){
    resetBodyBackground();
    const category = localStorage.getItem("activeCategory");
    if(!category || !DATA[category]) { goHome(); return; }
    applyCategoryTheme(category);

    const data = DATA[category];
    const title = document.getElementById("categoryTitle");
    if(title) title.textContent = data.title || category;

    const logo = document.getElementById("categoryLogo");
    if(logo){
      const firstItem = (data.items && data.items[0]) ? data.items[0] : null;
      logo.src = (firstItem && firstItem.images && firstItem.images.main) ? firstItem.images.main : FALLBACK;
    }

    const searchInput = document.getElementById("searchInput");
    const search = searchInput ? (searchInput.value || "").toLowerCase() : "";
    let checkedTags = [];
    if(searchInput && searchInput.dataset.checkedTags){
      try { checkedTags = JSON.parse(searchInput.dataset.checkedTags) || []; }
      catch(e){ checkedTags = []; }
    }

    // If there's an autoFilterTag set by detail page, open checklist, check it and apply automatically
    const autoTag = localStorage.getItem("autoFilterTag");
    if(autoTag){
      // show checklist, pre-check the input, then apply and exit (render will be called by applyChecklistFilters)
      showChecklist(category);
      const panel = document.getElementById("checklistPanel");
      if(panel){
        const input = panel.querySelector(`input[type="checkbox"][value="${autoTag}"]`);
        if(input) input.checked = true;
        // apply (this will call renderItems again with checkedTags set)
        applyChecklistFilters();
        // cleanup autoTag so this flow doesn't repeat
        localStorage.removeItem("autoFilterTag");
        return; // render will be done in applyChecklistFilters -> renderItems
      }
    }

    let items = (data.items||[]).filter(it => (it.name||"").toLowerCase().includes(search));
    if(checkedTags.length > 0){
      items = items.filter(it => (it.tags||[]).some(t => checkedTags.includes(t)));
    }

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
      div.className = "card item-card small-card";

      const thumb = (it.images && it.images.main) ? it.images.main : FALLBACK;
      const img = document.createElement('img');
      img.src = thumb;
      img.loading = "lazy";
      img.alt = it.name || "item";
      div.appendChild(img);

      const h3 = document.createElement('h3');
      h3.textContent = it.name || "";
      div.appendChild(h3);

      const p = document.createElement('p');
      p.textContent = it.desc || "";
      div.appendChild(p);

      div.addEventListener('click', () => {
        localStorage.setItem("selectedId", it.id);
        localStorage.setItem("activeCategory", category);
        window.location.href = "detail.html";
      });

      container.appendChild(div);
    });
  }

  /* =========================
     PAGE 3: detail (safe DOM creation + story)
     plus tag-click gimmick: set autoFilterTag + redirect
  ========================= */
  function ensureDetailOverlay(){
    let ov = document.getElementById("detailOverlay");
    if(!ov){
      ov = document.createElement("div");
      ov.id = "detailOverlay";
      document.body.appendChild(ov);
    }
    ov.style.position = "fixed";
    ov.style.top = "0";
    ov.style.left = "0";
    ov.style.right = "0";
    ov.style.bottom = "0";
    ov.style.background = "linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.95))";
    ov.style.pointerEvents = "none";
    ov.style.zIndex = "1";
    const c = document.querySelector(".container");
    if(c){ c.style.position = "relative"; c.style.zIndex = "2"; }
  }

  function renderDetail(){
    const container = document.getElementById("detailContainer");
    if(!container) return;
    const id = localStorage.getItem("selectedId");
    if(!id){ container.innerHTML = "<div class='card'><h3>Item not found</h3></div>"; return; }
    const selected = findItemById(id);
    if(!selected){ container.innerHTML = "<div class='card'><h3>Item not found</h3></div>"; return; }

    // find category
    let category = localStorage.getItem("activeCategory") || null;
    if(!category){
      Object.keys(DATA).some(k => {
        if(DATA[k].items.some(it => String(it.id) === String(id))){ category = k; return true; }
        return false;
      });
    }
    applyCategoryTheme(category);

    // MAIN wallpaper (if present)
    const wallpaperUrl = (selected.images && selected.images.main) ? selected.images.main : null;
    if(wallpaperUrl){
      document.body.style.backgroundImage = `url("${wallpaperUrl}")`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      resetBodyBackground();
      applyCategoryTheme(category);
    }

    ensureDetailOverlay();

    const mainImg = (selected.images && selected.images.main) ? selected.images.main : FALLBACK;
    const extras = (selected.images && Array.isArray(selected.images.extras)) ? selected.images.extras.slice(0,3) : [];
    const tags = (selected.tags || []).slice(0,10);

    // build detail DOM (safe)
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

    const h2 = document.createElement('h2');
    h2.textContent = selected.name || "";
    heroOverlay.appendChild(h2);

    const descP = document.createElement('p');
    descP.className = "hero-desc";
    descP.textContent = selected.desc || "";
    heroOverlay.appendChild(descP);

    const tagWrap = document.createElement('div');
    tagWrap.className = "item-tags";
    tags.forEach(t => {
      const sp = document.createElement('span');
      sp.className = "tag";
      sp.textContent = String(t).toUpperCase();
      // GIMMICK: klik tag -> buka items page, buka filters, apply tag
      sp.addEventListener('click', (ev) => {
        ev.stopPropagation();
        // ensure activeCategory set (so items page knows which category)
        if(category) localStorage.setItem("activeCategory", category);
        // set auto filter tag
        localStorage.setItem("autoFilterTag", t);
        // redirect to items page (items.js will open checklist and apply)
        window.location.href = "items.html";
      });
      tagWrap.appendChild(sp);
    });
    heroOverlay.appendChild(tagWrap);

    heroCard.appendChild(heroOverlay);
    wrapper.appendChild(heroCard);

    // ===== STORY SECTION =====
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

    // extras
    const extrasWrap = document.createElement('div');
    extrasWrap.className = "extras";
    extras.forEach((src, idx) => {
      const ex = document.createElement('div');
      ex.className = "extra-thumb";
      const im = document.createElement('img');
      im.src = src || FALLBACK;
      im.alt = `extra ${idx+1}`;
      im.addEventListener('click', () => openImageModal(src || FALLBACK));
      ex.appendChild(im);
      extrasWrap.appendChild(ex);
    });
    wrapper.appendChild(extrasWrap);

    container.appendChild(wrapper);
  }

  /* Modal preview (extras only) */
  function openImageModal(src){
    const modal = document.getElementById("imgModal");
    const img = document.getElementById("imgModalImg");
    if(!modal || !img) return;
    img.src = src || FALLBACK;
    modal.style.display = "flex";
    const closeBtn = document.getElementById("modalCloseBtn");
    if(closeBtn) closeBtn.focus();
    document.addEventListener("keydown", escModalHandler);
  }

  function closeImageModal(){
    const modal = document.getElementById("imgModal");
    if(modal) modal.style.display = "none";
    document.removeEventListener("keydown", escModalHandler);
  }

  function escModalHandler(e){
    if(e.key === "Escape") closeImageModal();
  }

  // click outside to close
  document.addEventListener("click", function(e){
    const modal = document.getElementById("imgModal");
    if(!modal || modal.style.display !== "flex") return;
    if(e.target === modal) closeImageModal();
  });

  // Document init
  document.addEventListener("DOMContentLoaded", function(){
    // Only index should use index theme and render categories
    if(window.location.pathname.includes("index") || window.location.pathname === "/" || window.location.pathname.endsWith("/")){
      renderCategories();
    } else {
      // Reset and let specific page renderers set their theme
      resetBodyBackground();
      renderCategories(); // harmless if not on index (renderCategories checks container)
    }

    if(window.location.pathname.includes("items")){
      const si = document.getElementById("searchInput");
      const activeCategory = localStorage.getItem("activeCategory");
      if(activeCategory) applyCategoryTheme(activeCategory);
      if(si){
        si.addEventListener("focus", () => manageChecklistToggle(localStorage.getItem("activeCategory")));
        si.addEventListener("input", () => renderItems());
        si.addEventListener("blur", () => setTimeout(()=>manageChecklistToggle(localStorage.getItem("activeCategory")), 150));
      }
      renderItems();
    }

    if(window.location.pathname.includes("detail")){
      renderDetail();
    }

    const modalClose = document.getElementById("modalCloseBtn");
    if(modalClose) modalClose.onclick = closeImageModal;
  });

  // expose helpers for inline use
  window.goHome = goHome;
  window.goBack = goBack;
  window.openImageModal = openImageModal;
  window.closeImageModal = closeImageModal;

})();
