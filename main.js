
function bases(){
  const inSub = location.pathname.includes('/projects/') || location.pathname.includes('/journal/');
  return {
    cfg: inSub ? '../config.json' : 'config.json',
    assets: inSub ? '../assets/' : 'assets/',
    projectsList: inSub ? '../projects/projects.json' : 'projects/projects.json',
    css: inSub ? '../styles.css' : 'styles.css'
  };
}
async function loadConfig(){
  const b = bases();
  const cfg = await fetch(b.cfg).then(r=>r.json());
  const title = document.querySelector('#site-title');
  const tagline = document.querySelector('#site-tagline');
  if(title) title.textContent = cfg.siteTitle;
  if(tagline) tagline.textContent = cfg.tagline;
  const lic = document.querySelector('#footer-license'); if(lic) lic.textContent = cfg.license;
  const upd = document.querySelector('#footer-updated'); if(upd) upd.textContent = 'Dernière mise à jour : ' + cfg.updatedAt;
}
async function loadProjects(containerId, limit){
  const b = bases();
  const list = await fetch(b.projectsList).then(r=>r.json());
  const container = document.getElementById(containerId);
  if(!container) return;
  const items = (limit?list.slice(0,limit):list);
  for(const p of items){
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <a href="${location.pathname.includes('/projects/')? '' : 'projects/'}${p.slug}.html">
        <img class="placeholder" src="${b.assets}${p.cover}" alt="${p.title}" loading="lazy" decoding="async" width="1200" height="675">
      </a>
      <h3 class="card-title"><a href="${location.pathname.includes('/projects/')? '' : 'projects/'}${p.slug}.html">${p.title}</a></h3>
      <div>${p.tags.map(t=>`<span class="badge">${t}</span>`).join(' ')}</div>
      <p><small class="muted">${p.year} · ${p.type}</small></p>
      <p>${p.short}</p>
    `;
    container.appendChild(el);
  }
}
function markCurrentNav(){
  const p = window.location.pathname; // ex: "/", "/projects/index.html", "/journal/"
  const links = Array.from(document.querySelectorAll('.nav a'));
  links.forEach(a => a.classList.remove('current'));

  const find = (testFn) => links.find(a => testFn(a.getAttribute('href')));

  let current;

  if (p.includes('/projects/')) {
    // Sur une page /projects/...
    // Sur la racine, le lien est "projects/index.html"
    // Sur une sous-page projets, le lien est "index.html"
    current = find(h => /(^|\/)projects\/(index\.html)?$/.test(h) || h === 'index.html');
  } else if (p.includes('/journal/')) {
    current = find(h => /(^|\/)journal\/(index\.html)?$/.test(h) || h === 'index.html');
  } else if (p.endsWith('about.html')) {
    current = find(h => h.endsWith('about.html'));
  } else if (p.endsWith('contact.html')) {
    current = find(h => h.endsWith('contact.html'));
  } else {
    // Accueil : "/" ou "/index.html"
    current = find(h => h === 'index.html' || h === './' || h === '/' );
  }

  if (current) current.classList.add('current');
}

window.addEventListener('DOMContentLoaded', ()=>{
  loadConfig();
  if(document.getElementById('featured')) loadProjects('featured', 20);
  markCurrentNav();
});

// Ensure new page starts at top
window.addEventListener('DOMContentLoaded', ()=>{
  if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
  window.scrollTo(0,0);
});
