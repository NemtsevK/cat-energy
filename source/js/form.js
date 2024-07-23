import { initMap, initMenu } from './utils.js'
import {initValidation} from './validation.js';

initMenu();
initMap();

const form = document.querySelector('#program');
const inputsElements = form.querySelectorAll('.form__input-text, .form__input-checkbox, .form__input-radio');
const textElements = form.querySelectorAll('.form__error-text, .form__error-toggle');
const button = form.querySelector('.form__button');

initValidation({form, inputsElements, textElements, button});
