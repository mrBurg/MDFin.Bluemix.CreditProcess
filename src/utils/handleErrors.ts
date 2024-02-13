import each from 'lodash/each';
import isPlainObject from 'lodash/isPlainObject';
import noop from 'lodash/noop';

import { URLS } from '@routes';
import { STATUS } from '@src/constants';
import { THandleErrors } from './@types';
import { isServer } from '@utils';
import { TJSON } from '@interfaces';

export async function handleErrors(err: any, callback = noop): THandleErrors {
  if (err.response) {
    const { status } = err.response;

    switch (status) {
      case STATUS.NOT_AUTHORIZED:
        console.log(
          `Not authorized. Required to update token: ${STATUS.NOT_AUTHORIZED}`
        );

        return { view: URLS.SIGN_IN };
      case STATUS.BAD_REQUEST:
        console.log(`Bad request: ${STATUS.BAD_REQUEST}`);

        return false;
    }
  }

  console.log(err.message);

  callback();
}

export function errorsFormatter(
  message: string,
  props?: Record<'URL' | 'host', string> & { params: TJSON }
) {
  let result = '\n\x1b[92m########';

  result += `\n\x1b[92m#\x1b[0m\x1b[91m ${message}\x1b[0m`;

  each(props, (item, key) => {
    result += `\n\x1b[92m# \x1b[94m${key}\x1b[0m: ${
      isPlainObject(item) ? JSON.stringify(item) : item
    }\x1b[0m`;
  });

  result += '\n\x1b[92m########\x1b[0m';

  if (isServer) {
    console.log(result);
  }
}
