import moment from 'moment';
import md5 from 'md5';
import each from 'lodash/each';
import isBoolean from 'lodash/isBoolean';
import isNumber from 'lodash/isNumber';
import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';
import map from 'lodash/map';

import { TJSON } from '@interfaces';
import { URIS } from '@routes';
import {
  PO_API_HOST,
  PO_API_PORT,
  PO_API,
  EVENT_PREFIXES,
} from '@src/constants';
import { isProd } from './environment';
import cfg from '@root/config.json';
import { TClientAddInfo, TClientPersonalInfo } from '@stores-types/userStore';

/**
 * @description Converts an object to a querystring
 * @param json JSON data to convert
 * @param encode Data encoding sign
 * @param symbol Beginning of the generated line
 * @type
 * json: TJSON,
 * encode?: boolean,
 * symbol?: string
 * @default
 * encode false
 * symbol '?'
 */
export function jsonToQueryString(
  json: TJSON,
  ...restProps: (boolean | string)[]
) {
  let encode = false;
  let symbol = '?';

  each(restProps, (item) => {
    switch (true) {
      case isBoolean(item):
        encode = item as boolean;

        break;
      case isString(item):
        symbol = item as string;

        break;
    }
  });

  return (
    symbol +
    map(json, (value: string, key: string) => {
      if (!value) {
        return false;
      }

      if (encode) {
        key = encodeURIComponent(key);
        value = encodeURIComponent(value);
      }

      return `${key}=${value}`;
    })
      .filter((value) => value)
      .join('&')
  );
}

function getUri(data?: (boolean | string)[]) {
  let port = '';
  let host = PO_API_HOST;

  each(data, (item) => {
    switch (true) {
      case isBoolean(item):
        port = PO_API_PORT;

        break;
      case isString(item):
        host = item as string;

        break;
    }
  });

  return port ? `${host}:${port}` : host;
}

export function makeStaticUri(uri: URIS, ...data: (boolean | string)[]) {
  return getUri(data) + PO_API + uri;
}

export function makeApiUri(...data: (boolean | string)[]) {
  return getUri(data) + PO_API;
}

export function makeUri(uri: URIS, ...data: (boolean | string)[]) {
  return getUri(data) + uri;
}

export function prefixedEvent(
  element: HTMLElement,
  animationType: string,
  callback: (element: HTMLElement) => void
) {
  each(EVENT_PREFIXES, (val: string, index: number, arr: string[]) => {
    if (!arr[index]) {
      animationType = animationType.toLowerCase();
    }

    element.addEventListener(val + animationType, () => {
      callback(element);
    });
  });

  return element;
}

export function getMD5(data: string) {
  if (!isProd) {
    return data;
  }

  return md5(data);
}

export function divideDigits(number: number) {
  return String(number).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
}

export function capitaliseFirstLetter(str: string) {
  /** Только первая буква первого слова большая */
  // return (str.charAt(0).toUpperCase() + str.substr(1));

  /** Все первые буквы, всех слов, большие
   * +удаление лишних пробелов между слов и всех пробелов по краям */
  return str
    .replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    })
    .replace(/\s+|\s+/g, ' ')
    .trim();
}

export function getSelectedData() {
  const selection = document.getSelection();
  let selectedData = { content: '', text: '' };

  if (selection && selection.anchorNode) {
    const {
      anchorNode: { textContent },
      anchorOffset,
      focusOffset,
    } = selection;
    if (textContent) {
      selectedData = {
        ...selectedData,
        content: textContent,
        text: textContent.slice(anchorOffset, focusOffset),
      };
    }
  }

  return selectedData;
}

export function getTextWidth(
  element: HTMLInputElement,
  ...restProps: (boolean | number)[]
) {
  let padding = true;
  let factor = 7.7;

  each(restProps, (item) => {
    switch (true) {
      case isBoolean(item):
        padding = item as boolean;
        break;
      case isNumber(item):
        factor = item as number;
        break;
    }
  });

  const lp = parseFloat(window.getComputedStyle(element).paddingLeft) || 0;
  const rp = parseFloat(window.getComputedStyle(element).paddingRight) || 0;
  const currentFontSize = parseFloat(window.getComputedStyle(element).fontSize);
  const size = (((element.value.length + 1) * currentFontSize) / 14) * factor;
  const width = size + (padding ? lp + rp : 0);

  return `${width}px`;
}

export function toFormat(data: number, ...restProps: (string | TJSON)[]) {
  let locale = cfg.defaultLocale;
  let options = {
    useGrouping: true,
    minimumFractionDigits: 2,
  };

  each(restProps, (item) => {
    switch (true) {
      case isString(item):
        locale = item as string;
        break;
      case isPlainObject(item):
        options = Object.assign({}, options, item);
        break;
    }
  });

  return new Intl.NumberFormat(locale, options).format(data);
}

export function toServerDateFormat(localFormat: string) {
  if (localFormat && new RegExp(cfg.birthDateFormat).test(localFormat)) {
    return moment(localFormat.split('.').reverse().join('-'))
      .utcOffset(0, true)
      .toDate();
    // .format(cfg.serverDateFormat);
  }

  return localFormat;
}

export function toLocalDateFormat(serverFormat: string) {
  if (serverFormat) {
    return moment(serverFormat).format(
      cfg.dateFormat.toUpperCase().replace(/\//g, '.')
    );
  }
}

export function prepareClientPersonalInfo(
  clientPersonalInfo: TClientPersonalInfo
) {
  return {
    ...clientPersonalInfo,
    birthDate: toServerDateFormat(clientPersonalInfo.birthDate as string),
  };
}

export function prepareClientAddInfo(clientAddInfo: TClientAddInfo) {
  return { ...clientAddInfo, ncome: clientAddInfo.income || 0 };
}

export function getUrlSlug(view: string) {
  let query = null;
  const pathname = view.replace(new RegExp(cfg.slug), (_match, p1) => {
    if (p1 && !isNumber(p1)) {
      query = { slug: p1 };
    }

    return '';
  });

  if (query) {
    return {
      routeUrl: {
        pathname: pathname + '[slug]',
        query,
      },
      routeAsPath: pathname,
    };
  }

  return { routeUrl: pathname };
}

/**
 *
 * @param date Строка в формате "day/mounth/year". Разделителями может учавствовать один из символов [/.-]
 * @returns Строка в формате year-mounth-day
 */
export function normalizeDate(date: string) {
  return date.split(/[/.-]/).reverse().join('-');
}

export function prepareExternalSessionID(data: string | null) {
  if (data) {
    return data.replace(/(\\?['"])(.+)\1/g, '$2');
  }

  return null;
}
