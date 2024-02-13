import isFunction from 'lodash/isFunction';
import { toJS } from 'mobx';

import { isDev, root } from './environment';
import { handleErrors } from './handleErrors';
import cssData from '@scss/service/constants.module.scss';

export * from './localStorage';
export * from './environment';
export * from './molders';
export * from './cookies';
export * from './gettext';
export * from './handleErrors';
export * from './validators';
export * from './browser';
export * from './geolocation';
export * from './hook';

console.toJS = (data: any, desc = ''): void => {
  try {
    throw new Error(`toJS stack ${desc}`.trim());
  } catch (err: any) {
    console.groupCollapsed(
      `%c${err.message}`,
      'background: #222; color: #bada55'
    );
    console.log(err);
    console.groupEnd();
    console.log(toJS(data));
  }
};

console.dev = (...data: unknown[]) => {
  if (isDev) {
    console.warn(...data);
  }
};

export function createMarkup(__html: string) {
  return { __html };
}

export const selectDelay = (() => {
  let counter = 0;

  return (callback: () => void, ms = 0) => {
    clearTimeout(counter);
    counter = window.setTimeout(callback, ms);
  };
})();

export const scrollDelay = (() => {
  let counter = 0;

  return (callback: () => void, ms = 0) => {
    clearTimeout(counter);
    counter = window.setTimeout(callback, ms);
  };
})();

export function stopScroll(data: boolean) {
  if (data) {
    return document.body.classList.add('no-scroll');
  }

  document.body.classList.remove('no-scroll');
}

root().px2em = (size: number, baseSize = 16) => {
  const result = Math.round((size / baseSize) * 100) / 100 + 'em';
  const copyToClipboardEvent = new Event('click');

  const clickHandler = () => {
    copyToClipboard(result);

    document.removeEventListener(copyToClipboardEvent.type, clickHandler);
  };

  document.addEventListener(copyToClipboardEvent.type, clickHandler);

  return result;
};

export function copyToClipboard(data: string) {
  const body = (top || self).document.getElementsByTagName('body')[0];
  const container = document.createElement('div');

  let animation = 0;
  let opacity = 1;

  const applyStyle = (element: HTMLElement, style: Record<string, unknown>) => {
    for (const i in style) {
      (element.style as unknown as Record<string, unknown>)[i] = style[i];
    }
  };

  const fadeIndication = () => {
    opacity -= 0.05;
    applyStyle(container, {
      opacity: String(opacity),
    });

    animation = requestAnimationFrame(fadeIndication);

    if (opacity <= 0) {
      cancelAnimationFrame(animation);
      container.remove();
    }
  };

  const addIndication = () => {
    console.log('Data copied to clipboard...');

    animation = requestAnimationFrame(fadeIndication);

    applyStyle(container, {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      position: 'fixed',
      left: '0',
      top: '0',
      color: '#383838',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.5em',
    });

    container.innerText = 'Copied to clipboard...';

    body.append(container);
  };

  switch (true) {
    case !!navigator.clipboard:
      navigator.clipboard
        .writeText(data)
        .then(() => addIndication())
        .catch((err) => handleErrors(err));
      break;
    case isFunction(document.execCommand) &&
      isFunction(document.queryCommandSupported) &&
      document.queryCommandSupported('copy'): {
      const textAreaClipboard = document.createElement('textarea');

      textAreaClipboard.value = data;
      textAreaClipboard.style.position = 'absolute';
      // textAreaClipboard.style.visibility = 'hidden';
      textAreaClipboard.style.opacity = '0';
      textAreaClipboard.style.zIndex = '-9999';
      textAreaClipboard.setAttribute('readonly', '');

      document.body.append(textAreaClipboard);

      textAreaClipboard.select();

      document.execCommand('copy');

      addIndication();

      document.body.removeChild(textAreaClipboard);

      break;
    }
    default:
      console.log('Copying to clipboard is not supported');
  }
}

export function isDomElement(obj: any) {
  try {
    return obj instanceof HTMLElement;
  } catch (err) {
    return (
      checkType(obj, {}) &&
      obj.nodeType === 1 &&
      checkType(obj.style, {}) &&
      checkType(obj.ownerDocument, {})
    );
  }
}

export function getTabIndex(data: number) {
  return data;
}

export function toRadian(degree: number) {
  return (degree * Math.PI) / 180;
}

export function toDegree(degree: number) {
  return (degree / Math.PI) * 180;
}

export function expectExecution(func: () => unknown, callback: () => unknown) {
  let count = 10;

  const njTimer: NodeJS.Timer = setInterval(() => {
    const data = func();

    if (data) {
      callback();

      clearInterval(njTimer);
    }

    if (!count) {
      return clearInterval(njTimer);
    }

    count--;
  }, 200);
}

export function showTime(message: string) {
  const toFormat = (data: number) => {
    if (data < 10) {
      return `0${data}`;
    }

    return data;
  };

  const date = new Date();
  const hours = toFormat(date.getHours());
  const minutes = toFormat(date.getMinutes());
  const seconds = toFormat(date.getSeconds());
  const milliseconds = toFormat(date.getMilliseconds());

  console.log(
    `%c${message} ${hours}:${minutes}:${seconds}.${milliseconds}`,
    `color: ${cssData.green}`
  );
}

export function checkType(data: unknown, type: unknown) {
  const typeToCheck = (() => {
    switch (true) {
      case typeof type == typeof true:
        return typeof true;
      case typeof type == typeof 0:
        return typeof 0;
      case typeof type == typeof '':
        return typeof '';
      case typeof type == typeof (() => ({})):
        return typeof (() => ({}));
      case typeof type == String(void 0):
        return String(void 0);
      case type === null:
        return String(null);
      case Array.isArray(type):
        return Array.name.toLowerCase();
      case type != null && typeof type == typeof {} && !Array.isArray(type):
        return typeof {};
    }
  })();

  switch (typeToCheck) {
    case typeof true:
      return typeof data == typeof true;
    case typeof 0:
      return typeof data == typeof 0;
    case typeof '':
      return typeof data == typeof '';
    case typeof (() => ({})):
      return typeof data == typeof (() => ({}));
    case String(void 0):
      return typeof data == String(void 0);
    case String(null):
      return data === null;
    case Array.name.toLowerCase():
      return Array.isArray(data);
    case typeof {}:
      return data != null && typeof data == typeof {} && !Array.isArray(data);
    default:
      return false;
  }
}

export function repeater(symbol: string, count = 10) {
  const res = [];

  for (let i = 0; i < count; i++) {
    res.push(symbol);
  }

  return res.join(' ');
}

export function endRender(symbol = ' ', count = 10) {
  const res = [];

  for (let i = 0; i < count; i++) {
    res.push(symbol);
  }

  console.log(`%c${res.join(' ')}`, 'background: black');
}
