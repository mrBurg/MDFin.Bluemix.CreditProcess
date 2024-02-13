import now from 'lodash/now';
import reduce from 'lodash/reduce';

import { TEvents } from '@components/hocs/WithTracking/@types';
import { TJSON } from '@interfaces';
import { URIS } from '@routes';
import { TrackingApi } from '@src/apis';
import { EXTERNAL_SESSION_KEY } from '@src/constants';
import {
  EUIEvents,
  ETouchEvents,
  ETrackingActions,
} from '@src/trackingConstants';
import {
  getFromLocalStorage,
  setToLocalStorage,
  makeApiUri,
  jsonToQueryString,
  isDev,
  handleErrors,
  Browser,
  getGeolocation,
  isDomElement,
  prepareExternalSessionID,
} from '@utils';
import { UserStore } from './UserStore';

export class TrackingStore {
  public externalSessionID: null | string = null;
  private isScrolled_bottom = false;
  private isScrolled = false;
  private isFinished = false;

  constructor(private trackingApi: TrackingApi, private userStore: UserStore) {}

  private scrollDelay = (() => {
    let counter = 0;

    return (callback: () => void, ms = 0) => {
      clearTimeout(counter);
      counter = window.setTimeout(callback, ms);
    };
  })();

  public async getExternalSessionData(): Promise<void | string> {
    this.sendSessionInfo(ETrackingActions.COMMON);
    this.sendPageInfo(ETrackingActions.PAGES);

    const externalSession = getFromLocalStorage(EXTERNAL_SESSION_KEY);

    if (this.externalSessionID || externalSession) {
      this.externalSessionID = this.externalSessionID || externalSession;

      try {
        await this.trackingApi.initExternalTracking({
          u: this.externalSessionID,
          uuid: this.userStore.visitorId,
        });
      } catch (err) {
        handleErrors(err);
      }

      return this.updateLocalStorage();
    }

    try {
      const externalSessionData = await this.trackingApi.initExternalTracking({
        new_id: 1,
        uuid: this.userStore.visitorId,
      });

      if (externalSessionData) {
        const { external_session_id } = externalSessionData;

        if (external_session_id) {
          this.externalSessionID = external_session_id;

          this.updateLocalStorage();
        }
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  public updateDataOnScroll(): void {
    this.isScrolled =
      window.innerHeight + window.scrollY >= document.body.offsetHeight;
    this.isScrolled_bottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;

    this.scrollDelay(() => {
      this.sendEvent(EUIEvents.SCROLL);
    }, 500);
  }

  public updateDataBeforeUnload(): void {
    this.isFinished = true;

    this.sendPageInfo(ETrackingActions.PAGES);
  }

  private makeRequest(eventType: TEvents, trackingData: TJSON) {
    try {
      const uriData = `${makeApiUri()}${
        URIS.EXTERNAL_TRACKING_API
      }${jsonToQueryString(trackingData, true)}`;

      document.createElement('img').setAttribute('src', uriData);
    } catch (err) {
      handleErrors(err);
    }
  }

  public async sendSessionInfo(eventType: TEvents): Promise<void> {
    const browser = new Browser();
    const { device, fingerprint, visitorId, session_id } = this.userStore;

    if (device) {
      const data = {
        JSESSIONID: session_id,
        user_agent: navigator.userAgent,
        browser_id: browser.fullname,
        os: device.os,
        ismobile: device.mobile(),
        add_info: JSON.stringify({
          browser: browser.name,
          os: device.os,
          mobile: device.mobile(),
          touch:
            ETouchEvents.TOUCH_START.toLowerCase() in document.documentElement,
          tablet: device.tablet(),
        }),
        gps: JSON.stringify(getGeolocation()),
        referrer: document.referrer || window.location.href,
        fp: null,
        fp_components: null,
        fp2: visitorId,
        fp2_comp: JSON.stringify(fingerprint?.components),
        action: eventType,
      };

      if (!isDev) {
        this.makeRequest(eventType, data);
      }
    }
  }

  public async sendPageInfo(eventType: TEvents): Promise<void> {
    const data = {
      referrer: document.referrer || window.location.href,
      action: eventType,
      url: window.location.href,
      page_link: window.location.origin,
      is_scrolled_bottom: this.isScrolled_bottom,
      is_scrolled: this.isScrolled,
      is_finished: this.isFinished,
      session_page_info_id: 0,
    };

    if (!isDev) {
      this.makeRequest(eventType, data);
    }
  }

  public async sendEvent(eventType: TEvents, eventData?: TJSON): Promise<void> {
    const { visitorId, session_id } = this.userStore;

    const data = {
      ...reduce(
        eventData,
        (accum, item, key) => {
          accum[key] = isDomElement(item) ? item.outerHTML : item;

          return accum;
        },
        {} as TJSON
      ),
      u: prepareExternalSessionID(this.externalSessionID),
      action: ETrackingActions.EVENTS,
      fp: visitorId,
      sr: this.trackingApi.getScreen,
      url: window.location.href,
      e: eventType,
      ts: now(),
      session_id,
    };

    if (!isDev) {
      this.makeRequest(eventType, data);
    }
  }

  updateLocalStorage() {
    if (this.externalSessionID) {
      setToLocalStorage(EXTERNAL_SESSION_KEY, this.externalSessionID);
    }
  }
}
