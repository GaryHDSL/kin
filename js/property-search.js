import { isSupabaseConfigured, supabase } from './supabase.js';

const menu = document.querySelector('.mobile-menu');
const nav = document.querySelector('.nav-links');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
document.getElementById('year').textContent = new Date().getFullYear();

let listingType = 'sale';
let cards = [...document.querySelectorAll('.property-card')];
const form = document.getElementById('propertySearch');
const grid = document.getElementById('propertyGrid');
const empty = document.getElementById('emptyState');
const count = document.getElementById('resultCount');
const money = value => new Intl.NumberFormat('en-ZA', { style:'currency', currency:'ZAR', maximumFractionDigits:0 }).format(Number(value || 0));
const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function createPropertyCard(property) {
  const location = [property.suburb, property.city].filter(Boolean).join(', ') || property.address || 'Location on request';
  const type = String(property.property_type || 'Property').replace(/\b\w/g, c => c.toUpperCase());
  const price = money(property.price);
  const photo = property.image_urls?.[0];
  const card = document.createElement('article');
  card.className = 'property-card';
  card.dataset.listing = property.listing_type;
  card.dataset.type = type;
  card.dataset.price = property.price || 0;
  card.dataset.location = location;
  card.dataset.bedrooms = property.bedrooms || 0;
  card.dataset.garden = (property.features || []).some(item => String(item).toLowerCase().includes('garden')) ? 'yes' : 'no';
  card.innerHTML = `
    <div class="property-photo" style="${photo ? `background-image:url('${safe(photo)}')` : ''}">
      <span class="listing-label">CORE WEBBER LISTING</span>
      <button class="save-property" type="button" aria-label="Sign in to save property">♡</button>
    </div>
    <div class="property-info">
      <div class="price">${safe(price)} ${property.listing_type === 'rent' ? '<small>/ month</small>' : ''}</div>
      <h3>${safe(property.title)}</h3><p class="address">${safe(location)}</p>
      <div class="features"><span>🛏 ${safe(property.bedrooms ?? '—')} beds</span><span>🛁 ${safe(property.bathrooms ?? '—')} baths</span><span>⌂ ${safe(type)}</span></div>
      <a href="client-login.html" class="card-link">ENQUIRE ABOUT THIS PROPERTY ↗</a>
    </div>`;
  return card;
}

async function loadPublishedProperties() {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { data, error } = await supabase.from('properties')
      .select('id,title,description,property_type,listing_type,price,currency,address,suburb,city,bedrooms,bathrooms,image_urls,features')
      .eq('status','published').order('created_at',{ascending:false});
    if (error) throw error;
    if (Array.isArray(data)) {
      cards.forEach(card => card.remove());
      cards = data.map(createPropertyCard);
      cards.forEach(card => grid.appendChild(card));
      document.querySelector('.demo-note').hidden = true;
      filterProperties();
    }
  } catch (error) {
    console.error('Could not load published Core Webber properties:', error);
    count.textContent = 'Property listings are temporarily unavailable';
  }
}

document.querySelectorAll('.search-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    listingType = tab.dataset.listing;
    document.querySelectorAll('.search-tab').forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    filterProperties();
  });
});

function filterProperties() {
  const location = document.getElementById('locationFilter').value.trim().toLowerCase();
  const type = document.getElementById('typeFilter').value;
  const min = Number(document.getElementById('minPrice').value || 0);
  const max = Number(document.getElementById('maxPrice').value || Infinity);
  const bedrooms = document.getElementById('bedroomFilter').checked;
  const garden = document.getElementById('gardenFilter').checked;
  let visible = cards.filter(card => {
    const price = Number(card.dataset.price);
    return card.dataset.listing === listingType &&
      (!location || card.dataset.location.toLowerCase().includes(location)) &&
      (!type || card.dataset.type.toLowerCase() === type.toLowerCase()) &&
      price >= min && price <= max &&
      (!bedrooms || Number(card.dataset.bedrooms) >= 3) &&
      (!garden || card.dataset.garden === 'yes');
  });
  const sort = document.getElementById('sortListings').value;
  if (sort === 'price-low') visible.sort((a,b) => Number(a.dataset.price)-Number(b.dataset.price));
  if (sort === 'price-high') visible.sort((a,b) => Number(b.dataset.price)-Number(a.dataset.price));
  cards.forEach(card => card.hidden = !visible.includes(card));
  visible.forEach(card => grid.appendChild(card));
  empty.hidden = visible.length !== 0;
  count.textContent = visible.length ? visible.length + (isSupabaseConfigured ? ' properties found' : ' illustrative demo properties') : 'No matching properties';
}
form.addEventListener('submit', event => { event.preventDefault(); filterProperties(); document.getElementById('listings').scrollIntoView({behavior:'smooth'}); });
['locationFilter','typeFilter','minPrice','maxPrice','bedroomFilter','gardenFilter','sortListings'].forEach(id => {
  document.getElementById(id).addEventListener('change', filterProperties);
});
document.getElementById('clearFilters').addEventListener('click', event => {
  event.preventDefault();
  form.reset();
  document.getElementById('sortListings').value = 'featured';
  listingType = 'sale';
  document.querySelectorAll('.search-tab').forEach(tab => {
    const active = tab.dataset.listing === 'sale';
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  filterProperties();
});
grid.addEventListener('click', event => {
  if (event.target.closest('.save-property')) window.location.href = 'client-login.html';
});
filterProperties();
loadPublishedProperties();