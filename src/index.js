import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import {
  cardTemplateForCountries,
  cardTemplateListForCountries,
} from './template-markup';

const refs = {
  searchBox: document.getElementById('search-box'),
  countryList: document.querySelector('ul.country-list'),
  countryInfo: document.querySelector('div.country-info'),
};
const DEBOUNCE_DELAY = 300;
refs.searchBox.addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function onCountryInput() {
  const countryName = String(refs.searchBox.value).trim();
  if (countryName === '') {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    return;
  }
  fetchCountries(countryName)
    .then(country => {
      if (country.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        return;
      }

      if (country.length === 1) {
        const createCardMarkup = country.map(state =>
          cardTemplateForCountries(state)
        );
        refs.countryInfo.innerHTML = createCardMarkup.join('');
        refs.countryList.innerHTML = '';
        return;
      }
      if (country.length <= 10) {
        const createListMarkup = country.map(state =>
          cardTemplateListForCountries(state)
        );
        refs.countryList.innerHTML = createListMarkup.join('');
        refs.countryInfo.innerHTML = '';
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      refs.countryInfo.innerHTML = '';
      refs.countryList.innerHTML = '';
      return error;
    });
}
