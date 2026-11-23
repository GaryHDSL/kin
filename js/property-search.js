const menu = document.querySelector('.mobile-menu');
const nav = document.querySelector('.nav-links');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
document.getElementById('year').textContent = new Date().getFullYear();

let listingType = 'sale';
const cards = [...document.querySelectorAll('.property-card')];
const form = document.getElementById('propertySearch');
const grid = document.getElementById('propertyGrid');
const empty = document.getElementById('emptyState');
const count = document.getElementById('resultCount');

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
      (!type || card.dataset.type === type) &&
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
  count.textContent = visible.length ? visible.length + ' illustrative demo properties' : 'No matching demo properties';
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
document.querySelectorAll('.save-property').forEach(button => button.addEventListener('click', () => {
  window.location.href = 'client-login.html';
}));
filterProperties();