/**
 * функция, которая вызывает другую функцию, «пропуская» некоторые вызовы с определённой периодичностью.
 * @param callee - функция, которую надо вызывать
 * @param timeout - интервал в мс, с которым следует пропускать вызовы
 * @return {perform}
 */
function throttle(callee, timeout) {
  // Таймер будет определять, надо ли нам пропускать текущий вызов.
  let timer = null

  // Как результат возвращаем другую функцию.
  // Это нужно, чтобы мы могли не менять другие части кода,
  return function perform(...args) {
    // Если таймер есть, то функция уже была вызвана, и значит новый вызов следует пропустить.
    if (timer) return

    // Если таймера нет, значит мы можем вызвать функцию:
    timer = setTimeout(() => {
      // Аргументы передаём неизменными в функцию-аргумент:
      callee(...args)

      // По окончании очищаем таймер:
      clearTimeout(timer)
      timer = null
    }, timeout)
  }
}

/**
 * инициализация карты
 */
function initMap() {
  const mapIframe = document.querySelector('.location__map--nojs');
  mapIframe?.classList.remove('location__map--nojs');
}

/**
 * инициализация меню навигации
 */
function initMenu() {
  const page = document.querySelector('.page');
  const header = document.querySelector('.header');
  header.classList.remove('header--nojs');

  const nav = document.querySelector('.nav');
  const navToggle = header.querySelector('.header__toggle-nav');

  const onNavToggleClick = (event) => {
    const isClosed = nav.classList.toggle('nav--closed');
    page.classList.toggle('page--scroll-lock')
    nav.classList.toggle('nav--opened');
    event.currentTarget.classList.toggle('header__toggle-nav--active');
    navToggle.setAttribute('aria-label', isClosed ? 'Открыть меню' : 'Закрыть меню');
  }

  navToggle.addEventListener('click', onNavToggleClick);
}

async function setFormSuccess() {
  setModal('Данные успешно отправлены');
}

/**
 * добавить модальное окно
 * @param text
 */
function setModal(text) {
  const page = document.querySelector('.page');
  const modal = document.querySelector('.modal');
  const modalText = modal.querySelector('.modal__text')
  const buttonModal = modal.querySelector('.modal__button');

  const onButtonClick = () => {
    modal.close();
    page.classList.remove('page--scroll-lock');
  }

  const onModalClick = ({ currentTarget, target }) => {
    if (target === currentTarget) {
      currentTarget.close();
      page.classList.remove('page--scroll-lock');
    }
  }

  page.classList.add('page--scroll-lock');
  modal.showModal();
  modalText.innerText = text;

  modal.addEventListener('click', onModalClick);
  buttonModal.addEventListener('click', onButtonClick);
}

export { throttle, initMap, initMenu, setFormSuccess, setModal }
