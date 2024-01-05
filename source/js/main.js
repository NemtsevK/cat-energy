const nav = document.querySelector('.nav');
const navToggle = nav.querySelector('.nav__toggle');
const mapIframe = document.querySelector('.location__map--nojs');

mapIframe.classList.remove('location__map--nojs');
nav.classList.remove('nav--nojs');

const onNavToggleClick = function () {
  if (nav.classList.contains('nav--closed')) {
    nav.classList.remove('nav--closed');
    nav.classList.add('nav--opened');
    navToggle.setAttribute('aria-label', 'Закрыть меню');
  } else {
    nav.classList.add('nav--closed');
    nav.classList.remove('nav--opened');
    navToggle.setAttribute('aria-label', 'Открыть меню');
  }
}

navToggle.addEventListener('click', onNavToggleClick);
