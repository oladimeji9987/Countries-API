const toggle = document.querySelector('.mode-toggle-text');
const rootElm = document.documentElement;
const grid = document.querySelector('.grid-container');
const input = document.querySelector('.search-bar');
const options = document.querySelector('.options');

const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

let localS = localStorage.getItem('theme'),
  themeToSet = localS;

if (!localS) {
  themeToSet = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function clear() {
  grid.innerHTML = '';
}

async function fetchCountries() {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const countries = await response.json();
  allCountries = countries;
  localStorage.setItem('allcountries', JSON.stringify(countries));
  return renderCountries(countries);
}

function renderCountries(countries) {
  clear();
  countries.forEach((country) => {
    const html = `<div class="card" data-country-id="${country.area}">
    <div class="card-top">
    <a class="card-link">
      <img src="${country.flags.png}" alt="Country flag">
      </div>
      <div class="card-btm">
        <h3>${country.name.common}</h1>
        <p class="card-info">Population: <span>${country.population}</span></p>
        <p class="card-info">Region: <span>${country.region}</span></p>
        <p class="card-info">Capital: <span>${country.capital}</span></p>
      </div>
    </a>
  </div>
  `;
    grid.insertAdjacentHTML('beforeend', html);
  });
}

options.addEventListener('change', (e) => {
  const region = e.target.value;
  if (region !== '---') {
    const searched = allCountries.filter((country) => {
      return country.region.toLowerCase() === region.toLowerCase();
    });
    console.log(searched);
    renderCountries(searched);
  } else {
    renderCountries(allCountries);
  }
});

function findMatch() {
  clear();
  const searchedCountries = allCountries.filter((country) => {
    return country.name.common
      .toLowerCase()
      .includes(input.value.toLowerCase());
  });
  renderCountries(searchedCountries);
}

input.addEventListener('input', debounce(findMatch, 500));

// renderCountries(matched);

document.addEventListener('DOMContentLoaded', fetchCountries);

grid.addEventListener('click', (e) => {
  if (e.target.classList.value !== 'grid-container') {
    console.log(e.target.classList.value);
    const id = parseInt(e.target.closest('.card').dataset.countryId);
    const clickedCountry = allCountries.filter((country) => {
      return country.area === id;
    });
    localStorage.setItem('country-details', JSON.stringify(clickedCountry));
    window.location = 'info.html';
  }
  return;
});

document.documentElement.setAttribute('data-theme', themeToSet);
themeToSet === 'light'
  ? (toggle.textContent = 'Dark Mode')
  : (toggle.textContent = 'Light Mode');

const switchTheme = () => {
  let dataTheme = rootElm.getAttribute('data-theme'),
    newTheme;

  newTheme = dataTheme === 'light' ? 'dark' : 'light';
  rootElm.setAttribute('data-theme', newTheme);

  if (newTheme === 'light') {
    toggle.textContent = 'Dark Mode';
  } else {
    toggle.textContent = 'Light Mode';
  }

  //set local storage item
  localStorage.setItem('theme', newTheme);
};

const button = document.querySelector('.mode-toggle');
button.addEventListener('click', switchTheme);