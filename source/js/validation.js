import { setFormSuccess, setModal } from './utils.js';
import { REGEX, inputsOptions } from './const.js';

/**
 * Инициализация валидации
 */
function initValidation({form, inputsElements, textElements, button}) {
  let enableButton = isEnableButton(inputsElements, inputsOptions)

  inputsElements.forEach((inputElement) => {
    const inputOption = findInputOption(inputElement);
    const textElement = findTextElement(inputElement, textElements);
    inputElement.addEventListener('input', () => onElementInput(inputElement, inputOption, textElement, button))
  });

  button.addEventListener('enable-button', () => {
    enableButton = isEnableButton(inputsElements, inputsOptions)
  });

  form.addEventListener('submit', (event) => onFormSubmit(event, enableButton, inputsElements, textElements));
}

/**
 *
 * @param inputElement
 * @param textElements
 * @return {null}
 */
function findTextElement(inputElement, textElements) {
  let element = null

  textElements.forEach((textElement) => {
    if (`${inputElement.id}-error` === textElement.id) {
      element = textElement;
    }
  });

  return element;
}

/**
 * поиск опции полей ввода
 * @param inputElement
 * @return {{max: number, pattern: {string: RegExp, name: string}, id: string, required: boolean}}
 */
function findInputOption(inputElement) {
  return inputsOptions.find((option) => inputElement.id === option.id);
}

/**
 * установка стилей для поля ввода и блока информации
 * @param inputElement
 * @param inputOption
 * @param textElement
 */
function setValidInputField(inputElement, inputOption, textElement) {
  let textError = '';
  let isValid = true;
  const inputValue = inputElement.value;
  const { required, max, pattern } = inputOption;

  if (inputValue === '' && inputOption.required === true) {
    textError = 'Поле обязательное для заполнения';
    isValid = false;
  } else if (inputValue.length > max && max !== null) {
    textError = `Количество символов должно быть не больше ${max}`;
    isValid = false;
  } else if (pattern !== null && pattern.string.test(inputValue) === false && (inputValue !== '' && required === false || required === true)) {
    // проверка на регулярное выражение
    textError = pattern.name;
    isValid = false;
  } else if (REGEX.test(inputValue)) {
    textError = 'Запрещены одни пробелы';
    isValid = false;
  }

  if(textElement !== null) {
    if (isValid === true) {
      inputElement.classList.remove('form-partner__input--error');
      textElement?.classList.remove('form-partner__text-error--active');
    } else {
      inputElement.classList.add('form-partner__input--error');
      textElement?.classList.add('form-partner__text-error--active');
    }

    textElement.innerText = textError;
  }
}

/**
 * проверка доступности кнопки
 * @param inputsElements:array
 * @param inputsOptions:array
 */
function isEnableButton(inputsElements, inputsOptions) {
  return inputsOptions.every((inputOption) => isValidInput(inputsElements, inputOption));
}

/**
 * проверка на валидность поля ввода
 * @param inputsElements
 * @param inputOption
 * @return {boolean|boolean}
 */
function isValidInput(inputsElements, inputOption) {
  const { required, max, pattern } = inputOption;
  const value = findInputValue(inputsElements, inputOption)

  return (
    pattern.string.test(value)
    && (value.length <= max || max === null)
    && REGEX.test(value) === false
    && (value !== '' && required === false || required === true)
    || value === '' && required === false
  );
}

/**
 * поиск значения элемента по id
 * @param inputsElements
 * @param inputOption
 * @return {string}
 */
function findInputValue(inputsElements, inputOption) {
  let value = ''

  inputsElements.forEach((inputElement) => {
    if (inputOption.id === inputElement.id) {
      value = inputElement.value;
    }
  });

  return value;
}

function onFormSubmit(event, enableButton, inputsElements, textElements) {
  event.preventDefault();
  if (enableButton === true) {
    setFormSuccess();
  } else {
    setModal('text');
    inputsElements.forEach((inputElement) => {
      const inputOption = findInputOption(inputElement);
      const textElement = findTextElement(inputElement, textElements);
      setValidInputField(inputElement, inputOption, textElement);
    })
  }
}

function onElementInput(inputElement, inputOption, textElement, button) {
  setValidInputField(inputElement, inputOption, textElement);
  button.dispatchEvent(new Event('enable-button'));
}

export { initValidation }
