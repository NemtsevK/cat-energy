import { initMap, initMenu } from './utils.js'
import {initValidation} from './validation.js';

initMenu();
initMap();

const form = document.querySelector('#program');
const inputsElements = form.querySelectorAll('.form__input-text');
const textElements = form.querySelectorAll('.form__error-text');
const button = form.querySelector('.form__button');

initValidation({form, inputsElements, textElements, button});
