import { throttle } from './utils.js';

const slider = document.querySelector('.slider');
const sliderInner = slider.querySelector('.slider__inner');
const sliderInput = slider.querySelector('.slider__control-input');
const beforeImage = slider.querySelector('.slider__before');
const afterImage = slider.querySelector('.slider__after');

/**
 * инициализация слайдера
 */
function initSlider() {
  if (slider === null) return null;

  const onSliderInput = (event) => setSlider(event.target);
  const onWindowsResize = throttle(() => setSlider(sliderInput), 500);

  setSlider(sliderInput);

  sliderInput.addEventListener('input', onSliderInput);
  window.addEventListener('resize', onWindowsResize);
}

/**
 * установка параметров для компонентов слайдера
 * @param target
 */
function setSlider(target) {

  const beforeWidth = (target.value / 100) * sliderInner.clientWidth;
  const afterWidth = ((100 - target.value) / 100) * sliderInner.clientWidth;
  const progress = 100 * Number(sliderInput.value) / (sliderInput.max - sliderInput.min);

  beforeImage.style.width = `${beforeWidth}px`;
  afterImage.style.width = `${afterWidth}px`;
  sliderInner.style.setProperty('--slider-progress', progress.toString());
}

export { initSlider }
