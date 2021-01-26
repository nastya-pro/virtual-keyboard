const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    languageRu: false,
    soundOn: true,
    cursorPosition: 0,
    layout: 0
  },

  sounds: {
    en: new Audio('assets/en.wav'),
    ru: new Audio('assets/ru.wav'),
    backspace: new Audio('assets/backspace.wav'),
    caps: new Audio('assets/caps.wav'),
    close: new Audio('assets/close.wav'),
    enter: new Audio('assets/enter.wav'),
    language: new Audio('assets/language.wav'),
    shift: new Audio('assets/shift.wav'),
    space: new Audio('assets/space.wav'),
    arrow: new Audio('assets/arrow.wav'),
    sound: new Audio('assets/sound.wav')
  },

  keyMap: {
    "189": "-",
    "187": "=",
    "219": "[",
    "221": "]",
    "186": ";",
    "222": "'",
    "188": ",",
    "190": ".",
    "191": "/",
    "8": "backspace",
    "13": "enter",
    "32": "space",
    "37": "left",
    "39": "right"
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
      element.addEventListener("click", () => {
        this.saveCursorCurrentPosition(element)
      });
      element.addEventListener("keydown", (event) => this.keyDown(event));
      element.addEventListener("keyup", (event) => this.keyUp(event, element));
      element.addEventListener("input", (event) => {
        this.properties.value = event.target.value;
        this.saveCursorCurrentPosition(element)
      })
    });
  },

  keyDown(event) {
    if (event.keyCode >= 48 && event.keyCode <= 57 ||
      event.keyCode >= 65 && event.keyCode <= 90 ||
      event.keyCode >= 97 && event.keyCode <= 122) {
      this._highlightButton(event.keyCode, true);
    } else if (Object.keys(this.keyMap).includes(event.keyCode.toString())) {
      this._highlightButtonByName(this.keyMap[event.keyCode.toString()], true);
    } else if (event.keyCode === 16) {
      this._highlightButtonByName("shift", true);
      this._toggleShift(true);
      this._findKey("shift").classList.toggle("keyboard__key--active", true);
    } else if (event.keyCode === 20) {
      this._highlightButtonByName("caps", true);
      this._toggleCapsLock();
      this._findKey("caps").classList.toggle("keyboard__key--active", this.properties.capsLock);
    }
  },

  keyUp(event, element) {
    if (event.keyCode >= 48 && event.keyCode <= 57 ||
      event.keyCode >= 65 && event.keyCode <= 90 ||
      event.keyCode >= 97 && event.keyCode <= 122) {
      this._highlightButton(event.keyCode, false);
      this._saveCurrentValue(event.target.value, element)
    } else if (Object.keys(this.keyMap).includes(event.keyCode.toString())) {
      this._highlightButtonByName(this.keyMap[event.keyCode.toString()], false);
      this._saveCurrentValue(event.target.value, element)
    } else if (event.keyCode === 16) {
      this._highlightButtonByName("shift", false);
      this._toggleShift(false);
      this._findKey("shift").classList.toggle("keyboard__key--active", false);
    } else if (event.keyCode === 20) {
      this._highlightButtonByName("caps", false);
    }
  },

  _findKey(keyValue) {
    for (let i = 0; i <this.elements.keys.length; i++) {
      if(this.elements.keys[i].dataKey[0] === keyValue) {
        return this.elements.keys[i]
      }
    }
  },

  _saveCurrentValue(value, element) {
    this.properties.value = value;
    this.saveCursorCurrentPosition(element)
  },

  _highlightButton(code, isHighlighted) {
    this.elements.keys.forEach(key => {
      let keyValue = key.dataKey[0];
      if (keyValue.length === 1 && keyValue.toUpperCase().charCodeAt(0) === code) {
        key.classList.toggle("keyboard__key--light", isHighlighted);
      }
    });
  },

  _highlightButtonByName(keyName, isHighlighted) {
    this.elements.keys.forEach(key => {
      let keyValue = key.dataKey[0];
      if (keyValue === keyName) {
        key.classList.toggle("keyboard__key--light", isHighlighted);
      }
    });
  },

  saveCursorCurrentPosition(textArea) {
    this.properties.cursorPosition = textArea.selectionStart
  },

  setCursorInEnd() {
    this.properties.cursorPosition = this.properties.value.length + 1;
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayoutEnL = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
      "shift", "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
      "en", "sound", "space", "left", "right"
    ];

    const keyLayoutEnU = [
      "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "backspace",
      "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}",
      "caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\"", "enter",
      "shift", "done", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?",
      "en", "sound", "space", "left", "right"
    ];

    const keyLayoutRuL = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
      "shift", "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
      "ru", "sound", "space", "left", "right"
    ];

    const keyLayoutRuU = [
      "!", "\"", "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "backspace",
      "Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ",
      "caps", "Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", "enter",
      "shift", "done", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", ",",
      "ru", "sound", "space", "left", "right"
    ];

    const keyLayout = keyLayoutEnL.map((el, index) => [el, keyLayoutEnU[index], keyLayoutRuL[index], keyLayoutRuU[index]]);

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      keyElement.onmousedown = () => this.setFocusToTextAreaIfFocusLost();
      const insertLineBreak = ["backspace", "]", "enter", "/"].includes(key[0]);

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      keyElement.dataKey = key;

      switch (key[this.properties.layout]) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            this.properties.soundOn && this.sounds["backspace"].play();
            this.properties.value = this.properties.value.slice(0, this.properties.cursorPosition-1) + this.properties.value.slice(this.properties.cursorPosition);
            this.properties.cursorPosition--;
            this._triggerEvent("oninput");
          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            this.properties.soundOn && this.sounds["caps"].play();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case "shift":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("arrow_upward");

          keyElement.addEventListener("click", () => {
            this._toggleShift();
            this.properties.soundOn && this.sounds["shift"].play();
            keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
          });

          break;

        case "en":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = key[0];

          keyElement.addEventListener("click", () => {
            this._toggleLanguage();
            this.properties.soundOn && this.sounds["language"].play();
            keyElement.classList.toggle("keyboard__key--dark", this.properties.languageRu);
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this._addSymbol("\n");
            this.properties.soundOn && this.sounds["enter"].play();
            this._triggerEvent("oninput");
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this._addSymbol(" ");
            this.properties.soundOn && this.sounds["space"].play();
            this._triggerEvent("oninput");
          });

          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("keyboard_hide");

          keyElement.addEventListener("click", () => {
            this.close();
            this.properties.soundOn && this.sounds["close"].play();
            this._triggerEvent("onclose");
          });

          break;

        case "left":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("arrow_left");

          keyElement.addEventListener("click", () => {
            let position = this.properties.cursorPosition - 1;
            if(position >= 0 && position <= this.properties.value.length) {
              this.properties.cursorPosition = position
            }
            this.properties.soundOn && this.sounds["arrow"].play();
            this.refreshCursor();
          });

          break;

        case "right":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("arrow_right");

          keyElement.addEventListener("click", () => {
            let position = this.properties.cursorPosition + 1;
            if(position >= 0 && position <= this.properties.value.length) {
              this.properties.cursorPosition = position
            }
            this.properties.soundOn && this.sounds["arrow"].play();
            this.refreshCursor();
          });

          break;

        case "sound":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("volume_up");

            keyElement.addEventListener("click", () => {
              this.sounds["sound"].play();
              this._toggleSound();
              keyElement.classList.toggle("keyboard__key--dark", !this.properties.soundOn);
              keyElement.innerHTML = this.properties.soundOn ? createIconHTML("volume_up") : createIconHTML("volume_off");
            });

          break;

        default:
          keyElement.textContent = key[this.properties.layout].toLowerCase();

          keyElement.addEventListener("click", () => {
            let letter = this.properties.capsLock ? key[this.properties.layout].toUpperCase() : key[this.properties.layout].toLowerCase();
            this.properties.soundOn && this.sounds[this.properties.languageRu ? "ru" : "en"].play();
            this._addSymbol(letter);
            this._triggerEvent("oninput");
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _addSymbol(symbol) {
    this.properties.value = this.properties.value.slice(0, this.properties.cursorPosition) + symbol + this.properties.value.slice(this.properties.cursorPosition);
    this.properties.cursorPosition++;
  },

  setFocusToTextAreaIfFocusLost() {
    let textArea = document.querySelector(".use-keyboard-input");
    if (document.activeElement !== textArea) {
      textArea.focus();
      this.setCursorInEnd()
    }
    return false;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
    this.refreshCursor()
  },

  refreshCursor() {
    let input = document.querySelector(".use-keyboard-input");
    input.setSelectionRange(this.properties.cursorPosition, this.properties.cursorPosition);
  },

  _toggleSound(isOn) {
    this.properties.soundOn = isOn !== undefined ? isOn : !this.properties.soundOn;
  },

  _toggleCapsLock(isOn) {
    this.properties.capsLock = isOn !== undefined ? isOn : !this.properties.capsLock;
    this._setLayout()
  },

  _toggleShift(isOn) {
    this.properties.shift = isOn !== undefined ? isOn : !this.properties.shift;
    this._setLayout()
  },

  _toggleLanguage() {
    this.properties.languageRu = !this.properties.languageRu;
    this._setLayout()
  },

  _setLayout() {
    this.properties.layout = this.properties.languageRu * 2 + this.properties.shift;

    for (const keyElement of this.elements.keys) {
      if (keyElement.childElementCount === 0) {
        let value = keyElement.dataKey[this.properties.layout];
        keyElement.textContent = (this.properties.capsLock ^ this.properties.shift) ? value.toUpperCase() : value.toLowerCase();
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});