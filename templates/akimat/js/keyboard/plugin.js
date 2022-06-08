/**
 * Virtual keyboard
 * @author Yshmeel (https://yshmeel.dev)
 * @description Virtual keyboard made with npm module **simple-keyboard** and extended for multi-language in fly
 */
const KEYBOARD_AVAILABLE_LANGUAGES = {
    russian: {
        keyboard: window.keyboard.layouts.russian,
        layoutName: 'russian',
        keyboardLabel: 'РУС',
        siteTag: 'ru'
    },
    kazakh: {
        keyboard: window.keyboard.layouts.kazakh,
        layoutName: 'kazakh',
        keyboardLabel: 'КАЗ',
        siteTag: 'kz'
    },
    english: {
        keyboard: window.keyboard.layouts.english,
        layoutName: 'english',
        keyboardLabel: 'ENG',
        siteTag: 'en'
    }
};

const KEYBOARD_TEXT_TYPE = 'text',
      KEYBOARD_NUMPAD_TYPE = 'numpad';

const KEYBOARD_CHANGE_EVENT = 'change',
      KEYBOARD_CLICK_EVENT = 'click';

const KEYBOARD_MOBILE_MODE = 'mobile',
      KEYBOARD_DESKTOP_MODE = 'desktop';

const KEYBOARD_DESKTOP_LAYOUT_KEY = 'layout',
      KEYBOARD_MOBILE_LAYOUT_KEY = 'mobileLayout';

const Keyboard = window.SimpleKeyboard.default;
const inputMask = window.SimpleKeyboardInputMask.default;

const LANG_BUTTON_TEXT = '{lang}',
    CAPS_BUTTON_TEXT = '{lock}',
    BACKSPACE_BUTTON_TEXT = '{bksp}',
    CLEAR_BUTTON_TEXT = '{clear}';

const getDefaultLanguage = () => {
    return Object.entries(KEYBOARD_AVAILABLE_LANGUAGES).find(
        ([_, params]) => params.siteTag === window.siteLanguage);
};

const getLanguageIndex = (language) => {
    return Object.keys(KEYBOARD_AVAILABLE_LANGUAGES).findIndex((l) => l === language);
};

const DISPLAY_ICONS = {
    [BACKSPACE_BUTTON_TEXT]: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">' +
        '<path d="M0 0h24v24H0z" fill="none"/>' +
        '<path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"/>' +
    '</svg>'
};

const getDisplayForLanguage = (language) => {
    return {
        ...language.keyboard.display,
        ...DISPLAY_ICONS,
        [LANG_BUTTON_TEXT]: language.keyboardLabel
    }
};


const isScrollable = (ele)  =>  {
    const hasScrollableContent = ele.scrollHeight > ele.clientHeight;

    const overflowYStyle = window.getComputedStyle(ele).overflowY;
    const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

    if(ele.classList.contains('wrapper')) return false;

    return hasScrollableContent && !isOverflowHidden;
};

const getScrollableParent = (ele) => {
    return !ele || ele === document.body
        ? document.body
        : isScrollable(ele)
            ? ele
            : getScrollableParent(ele.parentNode);
};

const LAYOUT_KEYS_BY_MODE = {
    'desktop': KEYBOARD_DESKTOP_LAYOUT_KEY,
    'mobile': KEYBOARD_MOBILE_LAYOUT_KEY
};

const virtualKeyboardContainerClassName = '.virtual-keyboard-container';
const isMobileDevice = /Mobi/i.test(window.navigator.userAgent)

function KeyboardPlugin() {
    const defaultLanguage = getDefaultLanguage();

    this.currentLanguage = {
        index: getLanguageIndex(defaultLanguage[0]),
        tag: defaultLanguage[0],
        params: defaultLanguage[1]
    };

    this.keyboardType = KEYBOARD_TEXT_TYPE;
    this.events = {};

    this.mode = window.outerWidth <= 992 || isMobileDevice ? KEYBOARD_MOBILE_MODE : KEYBOARD_DESKTOP_MODE;

    // Utils and events
    /**
     * Event that called when keyboard input has changed
     * @param input
     */
    const onKeyboardChange = (input) => {
        this.trigger(KEYBOARD_CHANGE_EVENT, input);
    };

    /**
     * Event that called when keyboard button has clicked
     * @param button
     */
    const onKeyboardButtonClick = (button) => {
        switch(button) {
            case LANG_BUTTON_TEXT:
                this.onClickChangeLanguageButton();
                break;
            case CAPS_BUTTON_TEXT:
                this.onClickCapsButton();
                break;
            case CLEAR_BUTTON_TEXT:
                this.onClickClear();
                break;
        }

        this.trigger(KEYBOARD_CLICK_EVENT, button);

        return true;
    };

    // Click handlers

    this.onClickChangeLanguageButton = () => {
        let index = this.currentLanguage.index;

        const languagesAsArray = Object.values(KEYBOARD_AVAILABLE_LANGUAGES);

        // If index more than available languages length, then reset to 0
        if((index + 1) > (languagesAsArray.length - 1)) {
            index = 0;
        } else {
            index++;
        }

        const nextLanguage = languagesAsArray[index];
        this.setLanguage(nextLanguage.layoutName);

        return true;
    };

    this.onClickCapsButton = () => {
        this.instance.setOptions({
            layoutName: this.instance.options.layoutName === "default" ? "shift" : "default"
        });
    };

    this.onClickClear = () => {
        this.instance.setInput('');
    }

    // Setters for keyboard instance

    /**
     * Set language in keyboard
     * @description This function changes layout in keyboard instance and set new data in `this.currentLanguage`
     * @param language
     */
    this.setLanguage = (language) => {
        this.currentLanguage = {
            index: getLanguageIndex(language),
            tag: language,
            params: KEYBOARD_AVAILABLE_LANGUAGES[language]
        };

        this.instance.setOptions({
            display: getDisplayForLanguage(this.currentLanguage.params),
            layout: this.currentLanguage.params.keyboard[LAYOUT_KEYS_BY_MODE[this.mode]]
        });
    };

    /**
     * Change type of keyboard
     * @param type - available types: text, numpad
     */
    this.setType = (type) => {
        if(this.keyboardType === type) return false;

        switch(type) {
            case KEYBOARD_TEXT_TYPE:
                this.instance.setOptions({
                    display: getDisplayForLanguage(this.currentLanguage.params),
                    layout: this.currentLanguage.params.keyboard[LAYOUT_KEYS_BY_MODE[this.mode]]
                });

                break;
            case KEYBOARD_NUMPAD_TYPE:
                this.instance.setOptions({
                    layout: window.keyboard.layouts.numpad[LAYOUT_KEYS_BY_MODE[this.mode]],
                    display: {
                        ...window.keyboard.layouts.numpad.display,
                        ...DISPLAY_ICONS
                    }
                });

                break;
        };

        this.keyboardType = type;
        return true;
    };

    this.setMode = (mode) => {
        if(this.mode === mode) return false;

        if(this.keyboardType !== KEYBOARD_NUMPAD_TYPE) {
            const useLayout = LAYOUT_KEYS_BY_MODE[mode];

            this.instance.setOptions({
                display: getDisplayForLanguage(this.currentLanguage.params),
                layout: this.currentLanguage.params.keyboard[useLayout]
            });
        }

        this.mode = mode;
    }

    // Events

    this.on = (event, handler) => {
        if(!this.events[event]) this.events[event] = [];
        this.events[event].push(handler);

        return true;
    };

    this.off = (event, handler) => {
        if(!this.events[event]) return false;
        this.events[event] = this.events[event].filter((v) => JSON.stringify(v) !== JSON.stringify(handler));

        return true;
    }

    this.trigger = (event, ...args) => {
        if(!this.events[event]) return false;
        this.events[event].forEach((v) => v(...args));
    };

    this.instance = new Keyboard(virtualKeyboardContainerClassName, {
        onChange: onKeyboardChange,
        onKeyPress: onKeyboardButtonClick,
        layout: this.currentLanguage.params.keyboard[LAYOUT_KEYS_BY_MODE[this.mode]],
        display: getDisplayForLanguage(this.currentLanguage.params),
        modules: [inputMask],
        inputClass: 'virtual-keyboard-input-field',
        disableCaretPositioning: true,
        inputMask: {
            "iin": {
                mask: '999999999999',
                regex: /^[0-9]+$/
            },
            "phone": {
                mask: '+7 (999) 999-9999',
                regex: /^[0-9]+$/
            }
        },
    });

    window.addEventListener('resize', () => {
        if(isMobileDevice) return false;

        if(window.outerWidth < 992) {
            this.setMode(KEYBOARD_MOBILE_MODE);
        } else {
            this.setMode(KEYBOARD_DESKTOP_MODE);
        }
    });

    return this;
}

// Input handlers
const VIRTUAL_KEYBOARD_TYPE_ATTRIBUTE_NAME = 'data-virtual-keyboard-type';

jQuery(document).ready(function () {
    if(!window.isKioskDevice()) return false;

    const $virtualKeyboard = jQuery('.virtual-keyboard'),
          $virtualKeyboardWrapper = jQuery('.virtual-keyboard-wrapper'),
          $virtualKeyboardInput = jQuery('.virtual-keyboard-input-field');

    const $virtualKeyboardAcceptButton = $virtualKeyboard.find('.accept-button'),
          $virtualKeyboardCancelButton = $virtualKeyboard.find('.cancel-button');

    const keyboardInstance = new KeyboardPlugin();

    const setKeyboardInput = ($input) => {
        $virtualKeyboardInput.attr('placeholder', $input.attr('placeholder'));
        $virtualKeyboardInput.val($input.val());

        $virtualKeyboardInput.focus();
    };

    const showVirtualKeyboard = (input) => {
        if(!$virtualKeyboard.is(":visible")) {
            $virtualKeyboard.fadeIn(300);
            $virtualKeyboardWrapper.show();
        }

        setKeyboardInput(input);
    };

    const hideVirtualKeyboard = () => {
        $virtualKeyboard.fadeOut(300);
        $virtualKeyboardWrapper.slideUp(300);
    };

    window.keyboard = {
        ...window.keyboard,
        ...keyboardInstance,
    };

    const $inputs = jQuery('input[type="text"], textarea');
    let focusedInput = null;

    $virtualKeyboardAcceptButton.click(function() {
        if(!focusedInput) return false;

        focusedInput.val($virtualKeyboardInput.val());
        hideVirtualKeyboard();
    });

    $virtualKeyboardCancelButton.click(function() {
        focusedInput = null;
        hideVirtualKeyboard();
    });

    $inputs.focusin(function() {
        if(!jQuery(this).is($virtualKeyboardInput)) {
            focusedInput = jQuery(this);

            keyboardInstance.instance.setOptions({
                inputName: focusedInput.attr('data-type') || 'default'
            });

            keyboardInstance.instance.setInput(focusedInput.val(), focusedInput.attr('data-type'));

            switch(jQuery(this).attr(VIRTUAL_KEYBOARD_TYPE_ATTRIBUTE_NAME)) {
                case 'number':
                    keyboardInstance.setType(KEYBOARD_NUMPAD_TYPE);
                    $virtualKeyboard.attr('data-type', KEYBOARD_NUMPAD_TYPE);
                    break;
                default:
                    keyboardInstance.setType(KEYBOARD_TEXT_TYPE);
                    $virtualKeyboard.attr('data-type', KEYBOARD_TEXT_TYPE);

                    break;
            }

            $virtualKeyboardInput.inputmask('remove');

            if(!!focusedInput.attr('data-mask')) {
                $virtualKeyboardInput.inputmask(focusedInput.attr('data-mask'));
            }

            showVirtualKeyboard(focusedInput);
        }
    });

    $virtualKeyboardInput.on('keyup', function(e) {
        e.preventDefault();
        return false;
    });

    $virtualKeyboardInput.on('keydown', function(e) {
        e.preventDefault();
        return false;
    });

    keyboardInstance.on('change', (value) => {
        if(!focusedInput) return false;
        $virtualKeyboardInput[0].value = value;
    });
});

window.keyboard.AVAILABLE_LANGUAGES = KEYBOARD_AVAILABLE_LANGUAGES;
window.keyboard.getDefaultLanguage = getDefaultLanguage;