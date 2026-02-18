(function(){
'use strict';

function goHome(){ window.location.href="index.html"; }

function goBack(){
  if(window.location.pathname.includes("items")){
    window.location.href="index.html";
  }else{
    window.history.back();
  }
}

const CATEGORY_THEME={
  CHARACTER:{bg:"linear-gradient(180deg,#2c003e,#4a148c)",tagBg:"#ff6ec7",accent:"#ff6ec7"},
  AREA:{bg:"linear-gradient(180deg,#001f3f,#003366)",tagBg:"#00c3ff",accent:"#00c3ff"},
  PET:{bg:"linear-gradient(180deg,#3e2723,#5d4037)",tagBg:"#ffb74d",accent:"#ffb74d"},
  MONSTER:{bg:"linear-gradient(180deg,#1a001f,#3d0052)",tagBg:"#d500f9",accent:"#d500f9"},
  MAGIC:{bg:"linear-gradient(180deg,#001a33,#003366)",tagBg:"#4da6ff",accent:"#4da6ff"},
  DEFAULT:{bg:"linear-gradient(180deg,#111,#222)",tagBg:"#ffd54f",accent:"#ffd54f"}
};

const FALLBACK=(typeof PLACEHOLDER!=="undefined")?PLACEHOLDER:"";

function applyCategoryTheme(cat){
  const theme=CATEGORY_THEME[cat]||CATEGORY_THEME.DEFAULT;
  document.body.style.background=theme.bg;
  document.documentElement.style.setProperty("--tag-bg",theme.tagBg);
  document.documentElement.style.setProperty("--accent-color",theme.accent);

  const panel=document.getElementById("checklistPanel");
  if(panel){
    panel.style.background=theme.bg;
  }
}

function findItemById(id){
  let found=null;
  Object.keys(DATA).some(k=>{
    return DATA[k].items.some(it=>{
      if(String(it.id)===String(id)){found=it;return true;}
      return false;
    });
  });
  return found;
}

/* PAGE 1 */
function renderCategories(){
  const container=document.getElementById("categoryContainer");
  if(!container) return;
  container.innerHTML="";
  Object.keys(DATA).forEach(key=>{
    const cat=DATA[key];
    const firstItem=(cat.items&&cat.items[0])?cat.items[0]:null;
    const thumb=(firstItem&&firstItem.images&&firstItem.images.main)?firstItem.images.main:FALLBACK;

    const card=document.createElement("div");
    card.className="card small-card";

    const img=document.createElement("img");
    img.src=thumb;
    card.appendChild(img);

    const h3=document.createElement("h3");
    h3.textContent=cat.title;
    card.appendChild(h3);

    card.onclick=()=>{
      localStorage.setItem("activeCategory",key);
      window.location.href="items.html";
    };

    container.appendChild(card);
  });
}

/* PAGE 2 */
function renderItems(){
  const category=localStorage.getItem("activeCategory");
  if(!category||!DATA[category]){goHome();return;}
  applyCategoryTheme(category);

  const data=DATA[category];
  const title=document.getElementById("categoryTitle");
  if(title) title.textContent=data.title;

  const logo=document.getElementById("categoryLogo");
  if(logo){
    const firstItem=data.items[0];
    logo.src=(firstItem&&firstItem.images&&firstItem.images.main)?firstItem.images.main:FALLBACK;
  }

  const searchInput=document.getElementById("searchInput");
  const search=searchInput?searchInput.value.toLowerCase():"";
  let filterTag=localStorage.getItem("autoFilterTag");
  if(filterTag){
    searchInput.value="";
  }

  let items=data.items.filter(it=>it.name.toLowerCase().includes(search));

  if(filterTag){
    items=items.filter(it=>it.tags.includes(filterTag));
  }

  const container=document.getElementById("itemsContainer");
  container.innerHTML="";

  items.forEach(it=>{
    const div=document.createElement("div");
    div.className="card small-card";

    const img=document.createElement("img");
    img.src=it.images.main||FALLBACK;
    div.appendChild(img);

    const h3=document.createElement("h3");
    h3.textContent=it.name;
    div.appendChild(h3);

    const p=document.createElement("p");
    p.textContent=it.desc;
    div.appendChild(p);

    div.onclick=()=>{
      localStorage.setItem("selectedId",it.id);
      window.location.href="detail.html";
    };

    container.appendChild(div);
  });

  localStorage.removeItem("autoFilterTag");
}

/* PAGE 3 */
function renderDetail(){
  const container=document.getElementById("detailContainer");
  if(!container) return;
  const id=localStorage.getItem("selectedId");
  const selected=findItemById(id);
  if(!selected) return;

  let category=null;
  Object.keys(DATA).some(k=>{
    if(DATA[k].items.some(it=>it.id===id)){category=k;return true;}
    return false;
  });

  applyCategoryTheme(category);

  container.innerHTML="";

  const wrapper=document.createElement("div");
  wrapper.className="detail-wrapper";

  const hero=document.createElement("div");
  hero.className="hero-card";

  const img=document.createElement("img");
  img.src=selected.images.main||FALLBACK;
  img.className="hero-img";
  hero.appendChild(img);

  const overlay=document.createElement("div");
  overlay.className="hero-overlay";

  const h2=document.createElement("h2");
  h2.textContent=selected.name;
  overlay.appendChild(h2);

  const desc=document.createElement("p");
  desc.textContent=selected.desc;
  overlay.appendChild(desc);

  const tagWrap=document.createElement("div");
  tagWrap.className="item-tags";

  selected.tags.forEach(tag=>{
    const span=document.createElement("span");
    span.className="tag";
    span.textContent=tag.toUpperCase();
    span.onclick=()=>{
      localStorage.setItem("activeCategory",category);
      localStorage.setItem("autoFilterTag",tag);
      window.location.href="items.html";
    };
    tagWrap.appendChild(span);
  });

  overlay.appendChild(tagWrap);
  hero.appendChild(overlay);
  wrapper.appendChild(hero);

  container.appendChild(wrapper);
}

document.addEventListener("DOMContentLoaded",()=>{
  renderCategories();
  if(window.location.pathname.includes("items")) renderItems();
  if(window.location.pathname.includes("detail")) renderDetail();
});

window.goBack=goBack;
window.goHome=goHome;

})();
