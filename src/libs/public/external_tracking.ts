type TJSON = Record<string | number, any>;

type fpResult = {
  components: TJSON;
} & Record<'visitorId' | 'version', string>;

/* type TExternalProps = {
  props: TTrackingProps;
}; */

type TTrackingProps = Partial<
  Record<'iframeName' | 'hostname' | 'iframeURL', string>
>;

// type TBrowserData = Partial<Record<'u' | 'fp' | 'sr' | 'url', string>>;

type IScriptElement = HTMLScriptElement | null;

type IScriptProps = {
  src: string;
  type?: string;
};

type TMessageEvent = {
  externalSessionID: string;
};

//@ts-ignore
class ET {
  private fpScriptURL = '';
  private apiURL = '';
  private fpKey = '';
  private sessionKey = '';
  private originHost = '';
  private fp: any;
  private script: IScriptElement;
  private scriptURLObject: URL;
  private scriptURLSearch: URLSearchParams;
  private iframeProps = {} as TTrackingProps;
  private scriptDataURL = '/po/api/config/list?key=po.partner.iframe';
  private externalErackingURL = '/po/api/external_tracking';
  private propParams = {
    writable: false,
    enumerable: false,
    configurable: false,
  };
  private noframe = false;
  private errorText =
    'Under Chrome\u2019s Settings > Privacy > Content settings, you have the cookie setting set to to \\"Block sites from setting any data\\"\nThis checkbox is what is causing the exception.';

  constructor() {
    Object.defineProperties(this, {
      fpScriptURL: {
        ...this.propParams,
        value: '/libs/fingerprintjs.js',
      },
      apiURL: {
        ...this.propParams,
        value: '/po/api/trackingapi',
      },
      fpKey: {
        ...this.propParams,
        value: 'b45i1.fp',
      },
      sessionKey: {
        ...this.propParams,
        value: 'b45i1.u',
      },
    });

    if (document.currentScript) {
      this.script = document.currentScript as HTMLScriptElement;
    } else {
      this.script = document.getElementById(
        'external_tracking'
      ) as HTMLScriptElement;

      if (!this.script) {
        this.script = document.querySelector(
          'script[src*="external_tracking.js"]'
        );
      }
    }

    Object.defineProperty(this, 'script', {
      ...this.propParams,
      value: this.script,
    });

    if (this.script) {
      this.scriptURLObject = new URL(this.script.src);
      this.scriptURLSearch = new URLSearchParams(this.scriptURLObject.search);

      Object.defineProperty(this, 'noframe', {
        ...this.propParams,
        value: !!this.scriptURLSearch.get('noframe'),
      });

      Object.defineProperty(this, 'originHost', {
        ...this.propParams,
        value: new URL(this.script.src).origin,
      });

      Object.defineProperty(this, 'scriptDataURL', {
        ...this.propParams,
        value: this.originHost + this.scriptDataURL,
      });

      fetch(this.scriptDataURL)
        .then((response) => response.json())
        .then((data) => {
          Object.defineProperty(this, 'iframeProps', {
            ...this.propParams,
            value: data,
          });

          return this.initTracking();
        })
        .catch((err) => console.log(err));
    } else {
      throw new Error('External tracking script not found');
    }
  }

  private appendScripts(props: IScriptProps, callBack: () => void) {
    const { src, type = 'text/javascript' } = props;
    const script = document.createElement('script');

    script.onload = () => {
      callBack();
    };
    script.setAttribute('type', type);
    script.setAttribute('src', src);

    document.getElementsByTagName('head')[0].append(script);
  }

  private generateFingerPrint(fp: any) {
    fp.get()
      .then((props: fpResult) => {
        this.setToStorage(this.fpKey, props.visitorId);

        if (this.noframe) {
          return this.getExternalSessionData();
        }

        return this.addFrame();
      })
      .catch((err: string) => console.log(err));
  }

  private initFingerprint() {
    this.fp
      .load()
      .then((fp: any) => this.generateFingerPrint(fp))
      .catch((err: any) => console.log(err));
  }

  private initTracking() {
    let fp = (window as any).FingerprintJS;

    if (fp && this.script) {
      Object.defineProperty(this, 'fp', {
        ...this.propParams,
        value: new URL(this.script.src).origin,
      });

      this.initFingerprint();
    } else {
      const fpOptions = { src: this.originHost + this.fpScriptURL };

      this.appendScripts(fpOptions, () => {
        fp = (window as any).FingerprintJS;

        this.fp = fp;
        this.initFingerprint();
      });
    }
  }

  private jsonToQueryString(
    json: TJSON,
    ...restProps: (boolean | string)[]
  ): string {
    let encode = true;
    let firstSymbol = '?';

    for (const i of restProps) {
      switch (typeof i) {
        case 'boolean':
          encode = i;

          break;
        case 'string':
          firstSymbol = i;

          break;
      }
    }

    return (
      firstSymbol +
      Object.entries(json)
        .map((item) => {
          let [key, val] = item;

          if (!val) {
            return val;
          }

          if (encode) {
            key = encodeURIComponent(key);
            val = encodeURIComponent(val);
          }

          return `${key}=${val}`;
        })
        .filter((value) => value)
        .join('&')
    );
  }

  private setToStorage(key: string, data: string): void {
    try {
      const storage = globalThis.localStorage;

      if (storage) {
        storage.setItem(key, this.removeQuotes(data));
      }
    } catch (err) {
      console.log(this.errorText);
    }
  }

  private getFromStorage(key: string): string | null {
    try {
      const storage = globalThis.localStorage;

      if (storage) {
        const result = storage.getItem(key);

        if (result) {
          return this.removeQuotes(result);
        }
      }
    } catch (err) {
      console.log(this.errorText);
    }

    return null;
  }

  private addFrame() {
    const frameStyle = {
      width: '0px',
      height: '0px',
      opacity: '0',
      zIndex: '-1',
      position: 'absolute',
      backgroundColor: '#fff',
    };
    const { hostname, iframeURL, iframeName } = this.iframeProps;

    window.addEventListener('getPartnerIframe', () => {
      const ifrm: HTMLIFrameElement = document.createElement('iframe');

      if (hostname && iframeURL) {
        if (iframeName) {
          ifrm.setAttribute('id', iframeName);
        }

        ifrm.setAttribute('src', hostname + iframeURL + '.html');

        for (const item of Object.entries(frameStyle)) {
          const [key, value] = item;

          ifrm.style[key as unknown as number] = value;
        }

        ifrm.onload = () => {
          const messageHandler = (event: MessageEvent<TMessageEvent>) => {
            const { externalSessionID } = event.data;

            if (externalSessionID) {
              this.setToStorage(this.sessionKey, externalSessionID);
              this.sendEvent('partner_enter', externalSessionID);

              window.removeEventListener('message', messageHandler);
              // ifrm.parentNode.removeChild(ifrm);
            }
          };

          window.addEventListener('message', messageHandler);

          if (ifrm.contentWindow) {
            ifrm.contentWindow.postMessage(window.location.origin, '*');
          }
        };

        document.body.prepend(ifrm);
      }
    });

    window.dispatchEvent(new Event('getPartnerIframe'));
  }

  /* private prepareExternalSessionID(data: string | null) {
    if (data) {
      return data.replace(/(\\?['"])(.+)\1/g, '$2');
    }

    return null;
  } */

  private removeQuotes(data: string) {
    return data.replace(/['"]/g, '');
  }

  private sendEvent(eventName: string, externalSessionID: string) {
    const trackingData = {
      action: 'events',
      content: null,
      current_wiz_step: '',
      e: eventName,
      // external_session_id: this.prepareExternalSessionID(externalSessionID),
      external_session_id: this.removeQuotes(externalSessionID),
      fp: this.getFromStorage(this.fpKey),
      session_id: 'fromLead',
      sr: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      target: null,
      target_id: null,
      u: this.getFromStorage(this.sessionKey),
      url: window.location.href,
    };

    const query: string =
      this.originHost + this.apiURL + this.jsonToQueryString(trackingData);

    try {
      document.createElement('img').setAttribute('src', query);
    } catch (error) {
      console.log(error);
    }
  }

  private getExternalSessionData() {
    const externalSession = this.getFromStorage(this.sessionKey);
    let requestData = {
      new_id: 1,
      uuid: this.getFromStorage(this.fpKey),
    } as TJSON;

    if (externalSession) {
      requestData = {
        u: this.getFromStorage(this.sessionKey),
        fp: this.getFromStorage(this.fpKey),
      };
    }

    fetch(this.externalErackingURL + this.jsonToQueryString(requestData))
      .then((data) => data.json())
      .then((respond) => {
        if (respond.external_session_id) {
          this.setToStorage(this.sessionKey, respond.external_session_id);
        }

        return;
      })
      .catch((err) => console.log(err));
  }
}

//@ts-ignore
const et: ET = new ET();
