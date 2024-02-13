import { FINGER_PRINT_KEY } from '@src/constants';
import { isDev, root } from './environment';
import { stores } from '@stores';

const errorText =
  'Under Chrome’s Settings > Privacy > Content settings, you have the cookie setting set to to \\"Block sites from setting any data\\"\nThis checkbox is what is causing the exception.';

export async function setToLocalStorage(
  key: string,
  values: string
): Promise<void> {
  try {
    const storage = root().localStorage;

    if (storage) {
      storage.setItem(key, values);
    }
  } catch (err) {
    if (isDev) {
      console.log(errorText);
    }
  }
}

export function getFromLocalStorage(key: string) {
  try {
    const storage = root().localStorage;

    if (storage) {
      switch (key) {
        case FINGER_PRINT_KEY:
          /**Проверка на фингер принт, если его нет в сторе браузера, записываем в стор браузера с нашего приложения */
          return storage.getItem(key)
            ? storage.getItem(key)
            : (function () {
                setToLocalStorage(
                  key,
                  stores?.userStore.fingerprint?.visitorId as string
                );
                return storage.getItem(key);
              })();

        default:
          return storage.getItem(key);
      }
    }
  } catch (err) {
    if (isDev) {
      console.log(errorText);
    }
  }

  return null;
}

export function removeItemFromLocalStorage(key: string): void {
  try {
    const storage = root().localStorage;

    if (storage) {
      storage.removeItem(key);
    }
  } catch (err) {
    if (isDev) {
      console.log(errorText);
    }
  }
}

export function clearLocalStorage(): void {
  try {
    const storage = root().localStorage;

    if (storage) {
      window.localStorage.clear();
    }
  } catch (err) {
    if (isDev) {
      console.log(errorText);
    }
  }
}

export async function setToSessionStorage(
  key: string,
  values: string
): Promise<void> {
  try {
    const storage = root().sessionStorage;

    if (storage) {
      storage.setItem(key, values);
    }
  } catch (err) {
    if (isDev) {
      console.log(errorText);
    }
  }
}

export function getFromSessionStorage(key: string) {
  try {
    const storage = root().sessionStorage;

    if (storage) {
      return storage.getItem(key);
    }
  } catch (err) {
    if (isDev) {
      console.log(errorText);
    }
  }

  return null;
}

export function removeItemFromSessionStorage(key: string): void {
  try {
    const storage = root().sessionStorage;

    if (storage) {
      storage.removeItem(key);
    }
  } catch (err) {
    console.log(err);
  }
}

export function clearSessionStorage(): void {
  try {
    const storage = root().sessionStorage;

    if (storage) {
      storage.clear();
    }
  } catch (err) {
    console.log(err);
  }
}
