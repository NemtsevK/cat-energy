const nav = document.querySelector('.nav');
const navToggle = nav.querySelector('.nav__toggle');
const mapIframe = document.querySelector('.location__map--nojs');

mapIframe?.classList.remove('location__map--nojs');
nav.classList.remove('nav--nojs');

const onNavToggleClick = () => {
  const isClosed = nav.classList.toggle('nav--closed');
  nav.classList.toggle('nav--opened');
  navToggle.setAttribute('aria-label', isClosed ? 'Открыть меню' : 'Закрыть меню');
}

navToggle.addEventListener('click', onNavToggleClick);
