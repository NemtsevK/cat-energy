import { setFormSuccess, setModal } from './utils.js';
import { REGEX, inputsOptions } from './const.js';

/**
 * Инициализация валидации
 */
function initValidation({ form, inputsElements, textElements, button }) {
  let enableButton = isEnableButton(inputsElements)

  inputsElements.forEach((inputElement) => {
    const inputOption = findInputOption(inputElement);
    const textElement = findTextElement(inputElement, textElements);

    if (getTypeInput(inputElement.type) === 'text') {
      inputElement.addEventListener('input', () => onElementInput(inputElement, inputOption, textElement, button));
    } else {
      inputElement.addEventListener('change', () => onElementChange(inputElement, inputOption, textElement, button));
    }
  });

  button.addEventListener('enable-button', () => {
    enableButton = isEnableButton(inputsElements)
  });

  form.addEventListener('submit', (event) => onFormSubmit(event, enableButton, inputsElements, textElements));
}

/**
 * проверка доступности кнопки
 * @param inputsElements:array
 */
function isEnableButton(inputsElements) {
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
  const type = findInputType(inputsElements, inputOption)

  if (getTypeInput(type) === 'text') {
    return (
      pattern.string.test(value)
      && (value.length <= max || max === null)
      && REGEX.test(value) === false
      && (value !== '' && required === false || required === true)
      || value === '' && required === false
    );
  } else {
    return required === false || required === true && value === true;
  }
}

/**
 * поиск значения элемента по id
 * @param inputsElements
 * @param inputOption
 * @return {string}
 */
function findInputValue(inputsElements, inputOption) {
  let value = false;

  inputsElements.forEach((inputElement) => {
    if (getTypeInput(inputElement.type) === 'text') {
      if (inputOption.id === inputElement.id) {
        value = inputElement.value;
      }
    } else {
      if (inputOption.name === inputElement.name && inputElement.checked === true) {
        value = inputElement.checked;
      }
    }
  });

  return value;
}

/**
 * поиск типа элемента по id
 * @param inputsElements
 * @param inputOption
 * @return {string}
 */
function findInputType(inputsElements, inputOption) {
  let type = ''

  inputsElements.forEach((inputElement) => {
    if (getTypeInput(inputElement.type) === 'text') {
      if (inputOption.id === inputElement.id) {
        type = inputElement.type;
      }
    } else {
      if (inputOption.name === inputElement.name) {
        type = inputElement.type;
      }
    }
  });

  return type;
}

/**
 * поиск информационного элемента по id
 * @param inputElement
 * @param textElements
 * @return {null}
 */
function findTextElement(inputElement, textElements) {
  let element = null;

  textElements.forEach((textElement) => {

    if (getTypeInput(inputElement.type) === 'text') {
      if (`${inputElement.id}-error` === textElement.id) {
        element = textElement;
      }
    } else {
      if (`${inputElement.name}-error` === textElement.id) {
        element = textElement;
      }
    }
  });

  return element;
}

/**
 * поиск опции полей ввода
 * @param inputElement
 * @return {{max: number, pattern: {string: RegExp, name: string}, id: string, required: boolean} | {name: string, type: string, required: boolean}}
 */
function findInputOption(inputElement) {
  if (getTypeInput(inputElement.type) === 'text') {
    return inputsOptions.find(({ id }) => inputElement.id === id);
  } else {
    return inputsOptions.find(({ name }) => inputElement.name === name);
  }
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

  if (textElement !== null) {
    if (isValid === true) {
      inputElement.classList.remove('form__input-text--error');
      textElement?.classList.remove('form__error-text--active');
    } else {
      inputElement.classList.add('form__input-text--error');
      textElement?.classList.add('form__error-text--active');
    }

    textElement.innerText = textError;
  }
}

/**
 *
 * @param inputElement
 * @param inputOption
 * @param textElement
 */
function setValidToggleField(inputElement, inputOption, textElement) {
  const nearElements = document.querySelectorAll(`input:checked[name="${inputElement.name}"]`);
  const { required } = inputOption;

  let textError = '';
  let isValid = true;

  if (nearElements.length === 0 && required === true) {
    textError = 'Должно быть выбрано';
    isValid = false;
  }

  if (textElement !== null) {
    if (isValid === true) {
      textElement?.classList.remove('form__error-toggle--active');
    } else {
      textElement?.classList.add('form__error-toggle--active');
    }

    textElement.innerText = textError;
  }
}

/**
 *
 * @param type
 * @return {string}
 */
function getTypeInput(type) {
  switch (type) {
    case 'text':
    case 'email':
    case 'textarea':
    case 'tel':
      return 'text'
    case 'radio':
    case 'checkbox':
      return 'toggle'
  }
}

function onFormSubmit(event, enableButton, inputsElements, textElements) {
  event.preventDefault();
  if (enableButton === true) {
    setFormSuccess();
  } else {
    inputsElements.forEach((inputElement) => {
      const inputOption = findInputOption(inputElement);
      const textElement = findTextElement(inputElement, textElements);

      if (getTypeInput(inputElement.type) === 'text') {
        setValidInputField(inputElement, inputOption, textElement);
      } else {
        setValidToggleField(inputElement, inputOption, textElement);
      }
    });
  }
}

function onElementInput(inputElement, inputOption, textElement, button) {
  setValidInputField(inputElement, inputOption, textElement);
  button.dispatchEvent(new Event('enable-button'));
}

function onElementChange(inputElement, inputOption, textElement, button) {
  setValidToggleField(inputElement, inputOption, textElement);
  button.dispatchEvent(new Event('enable-button'));
}

export { initValidation }
