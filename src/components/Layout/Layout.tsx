import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Router, useRouter } from 'next/router';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import style from './Layout.module.scss';

import { TLayoutContext, TLayoutProps } from './@types';
import { COOKIE, EVENT, SCRIPT_STRATEGY } from '@src/constants';
import { EGlobalEvent, ETrackingActions } from '@src/trackingConstants';
import {
  getCookie,
  getSelectedData,
  selectDelay,
  // useIsFirstRender,
} from '@utils';
import cfg from '@root/config.json';
import { WithLocale } from '@components/hocs';
import { Reminder } from '@components/Reminder';
import { TJSON } from '@interfaces';
import {
  CookiesRedesign,
  CookiesRd1,
  LoanFloatButton,
  ModalWindow,
} from '@components/popup';
import { AppBanner } from '@components/AppBanner';
import { GoalpageFrame } from '@components/GoalpageFrame';
import { LayoutProvider } from './LayoutContext';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import Script from 'next/script';
import { LayoutProviderCtx } from '@context/LayoutProvider';
import { MainPageProvider } from '@components/MainPage/MainPageDefault/MainPageContext';
import { TMainPageContext } from '@components/MainPage/MainPageDefault/@types';
import { HeaderRedesign } from '@components/Header/HeaderRedesign';
import { URLS, applicationPages } from '@routes';
import { ThemeProviderCtx } from '@context/ThemeProvider';
import { THEME_NAME } from '@context/ThemeProvider/ThemeProvider';
import { FooterRedesign } from '@components/FooterRedesign';
import {
  FOOTER_STATE,
  FOOTER_TYPE,
} from '@components/FooterRedesign/FooterRedesign';

function LayoutComponent(props: TLayoutProps) {
  const { Component, ...restProps } = props;
  const { pageStore, trackingStore, userStore, loyaltyStore, loanStore } =
    restProps;
  const { cookiesPrivacy } = pageStore;

  const needCheck = useRef(true);

  const ninjaPost = useRef(true);

  const {
    hasBackground,
    showLoanButton,
    showReminder,
    reminderTimeout,
    reminderTemplate,
    footerType,
    showPromo,
    hasHeader,
  } = useContext(LayoutProviderCtx);

  // const isFirstRender = useIsFirstRender();
  const appBannerCookie = useMemo(() => getCookie(COOKIE.APP_BANNER), []);

  // const [uuid, setUuid] = useState('');
  const [reminder, setReminder] = useState<ReactElement | null>(null);
  const [loyaltyCallback, setLoyaltyCallback] = useState(null as any);
  const [notify, setNotify] = useState([] as string | string[]);
  const [hasProductSelector, setProductSelector] = useState(false);

  /**Переменная для блюра */
  const [blur, setBlur] = useState(false);

  const { themeName } = useContext(ThemeProviderCtx);
  const { pathname } = useRouter();
  const isRedesign = pathname.includes('/redesign');

  const renderReminder = useMemo(() => {
    if (showReminder) {
      return (
        <Reminder
          reminderTimeout={reminderTimeout}
          reminderTemplate={reminderTemplate}
          showPromo={showPromo}
        />
      );
    }

    return null;
  }, [reminderTemplate, reminderTimeout, showPromo, showReminder]);

  /** Тут визначається тип Хідера (дефолтний/спрощений/редизайн/редизайн-1 і т.д.) */
  const renderHeader = useCallback(() => {
    if (!hasHeader) return null;

    return <HeaderRedesign />;
  }, [hasHeader]);

  /**
   * @todo тут має визначатись тип Футера (дефолтний/спрощений/редизайн/редизайн-1 і т.д.)
   */
  const renderFooter = useCallback(() => {
    if (footerType == Boolean(FOOTER_STATE.NO_FOOTER)) {
      return null;
    }

    const defineFooterType = () => {
      switch (true) {
        case footerType == Boolean(FOOTER_STATE.COPYRIGHT):
          return FOOTER_TYPE.LESS;
        // case loyaltyStore.loyaltyEnabled:
        //   return FOOTER_TYPE.LOYALTY;
        default:
          return FOOTER_TYPE.NORMAL;
      }
    };

    return (
      <FooterRedesign
        footerType={defineFooterType()}
        className={classNames({
          [style.footerfloatPanelGap]: showLoanButton || pathname == '/',
        })}
      />
    );
  }, [footerType, pathname, showLoanButton /* loyaltyStore.loyaltyEnabled */]);

  const renderLoanFloatButton = useCallback(
    () => showLoanButton && <LoanFloatButton />,
    [showLoanButton]
  );

  const renderAppBanner = useCallback(
    () =>
      !appBannerCookie &&
      userStore.device?.android() &&
      !~navigator.userAgent.toLowerCase().search('appname/1.0') &&
      !~window.location.href.search('utm_source=android_app') &&
      ![...applicationPages, URLS.phoneverify, URLS.redesign].includes(
        pathname
      ) && <AppBanner />,
    [appBannerCookie, pathname, userStore.device]
  );

  const renderCookiesPrivacy = useCallback(() => {
    if (cookiesPrivacy) {
      switch (themeName) {
        case THEME_NAME.REDESIGN:
        case THEME_NAME.REDESIGN_2:
        case THEME_NAME.REDESIGN_3:
          return <CookiesRedesign pageStore={pageStore} />;
        case THEME_NAME.REDESIGN_1:
          return <CookiesRd1 pageStore={pageStore} />;
        default:
          return <CookiesRd1 pageStore={pageStore} />;
      }
    }
  }, [cookiesPrivacy, pageStore, themeName]);

  const renderComponent = useCallback(
    () => (
      <div className={style.container}>
        <MainPageProvider
          value={
            {
              hasProductSelector,
              setProductSelector,
            } as TMainPageContext
          }
        >
          <Component {...(restProps as TJSON)} />
        </MainPageProvider>
      </div>
    ),
    [Component, hasProductSelector, restProps]
  );

  const renderGoalpageFrame = useCallback(() => {
    if (userStore.pageFrame) {
      return <GoalpageFrame />;
    }
  }, [userStore.pageFrame]);

  const getNotifyItems = useCallback(async () => {
    if (userStore.userLoggedIn) {
      await loanStore.getNotify();

      if (size(loanStore.cabinetNotify)) {
        const notifications = reduce(
          loanStore.cabinetNotify,
          (accum, item) => {
            if (item.text) {
              accum.push(item.text);
            }

            return accum;
          },
          [] as string[]
        );

        if (size(notifications)) {
          setNotify(notifications);
        }
      }
    }
  }, [loanStore, userStore.userLoggedIn]);

  const closeModalWindow = useCallback(() => {
    setNotify([]);

    //Через 0.5 секунди, отримати-показати наступну нотифікацію, якщо така є.
    setTimeout(getNotifyItems, cfg.notificationDelay);
    // loanStore.confirmDisplay();
  }, [getNotifyItems /* loanStore */]);

  const renderNotify = useCallback(() => {
    if (size(notify)) {
      return (
        <ModalWindow
          textData={notify}
          declineHandler={closeModalWindow}
          confirmDisplay={() => loanStore.confirmDisplay()}
        />
      );
    }
  }, [closeModalWindow, loanStore, notify]);

  const renderNinjaScript = useCallback(() => {
    if (pageStore.ninjaEnabled) {
      return (
        <Script
          src={'https://static.mydataninja.com/ninja.js'}
          strategy={SCRIPT_STRATEGY.AFTER_INTERACTIVE}
          onLoad={() => pageStore.initNinja()}
        />
      );
    }
  }, [pageStore]);

  useEffect(() => {
    if (userStore.fingerprint && userStore.device) {
      if (!getCookie(COOKIE.COOKIES_ACCESS)) {
        pageStore.getCookiesPrivacy();
      }

      userStore.fetchWithAuth(async () => {
        if (needCheck.current) {
          needCheck.current = false;
          await userStore.updateUserState();
          await getNotifyItems();
          await pageStore.getLibrapayState();
          await pageStore.getNinjaState();
          setLoyaltyCallback(() => () => loyaltyStore.getLoyaltyState());
          setReminder(renderReminder);
          needCheck.current = true;
        }
      }, false);
    }
  }, [
    getNotifyItems,
    loyaltyStore,
    pageStore,
    renderReminder,
    trackingStore,
    userStore,
    userStore.device,
    userStore.fingerprint,
    userStore.isCabinet,
  ]);

  useEffect(() => {
    const routerChangeHandler = async (url: string) => {
      trackingStore.sendSessionInfo(ETrackingActions.COMMON);
      trackingStore.sendPageInfo(ETrackingActions.PAGES);

      await userStore.updateUserState();
      await getNotifyItems();

      if (loyaltyCallback) {
        loyaltyCallback();
      }

      console.log(`Page changed to ${url}`);
    };

    Router.events.on(EVENT.CHANGE_COMPLETE, routerChangeHandler);

    window.onscroll = () => trackingStore.updateDataOnScroll();
    window.onbeforeunload = () => trackingStore.updateDataBeforeUnload();

    document[EGlobalEvent.SELECTION_CHANGE] = (event) =>
      selectDelay(() => {
        const { content, text } = getSelectedData();

        trackingStore.sendEvent(EGlobalEvent.SELECT_START, {
          target: event.target,
          content,
          text,
        });
      }, 500);

    return () => {
      Router.events.off(EVENT.CHANGE_COMPLETE, routerChangeHandler);
    };
  }, [getNotifyItems, loyaltyCallback, trackingStore, userStore]);

  useEffect(() => {
    loyaltyStore.getLoyaltyState();
  }, [loyaltyStore]);

  useEffect(() => {
    if (pageStore.nj && ninjaPost.current) {
      pageStore.generateNinjaLead();
      ninjaPost.current = false;
    }
  });

  return (
    <LayoutProvider value={{ blur, setBlur } as TLayoutContext}>
      <div
        className={classNames(style.app, {
          // [style.appButton]: showLoanButton,
          // [style.appButtonRedesign]: showLoanButton && isRedesign,
          [style.fontFira]: isRedesign,
        })}
      >
        <WithLocale>
          {renderCookiesPrivacy()}
          {renderAppBanner()}
          {renderHeader()}
          <main
            className={classNames(style.main, {
              [style.background]: hasBackground,
            })}
          >
            {renderComponent()}
          </main>
          {renderFooter()}
          {renderLoanFloatButton()}
          {reminder}
          {renderGoalpageFrame()}
          {renderNotify()}
        </WithLocale>
      </div>
      {renderNinjaScript()}
    </LayoutProvider>
  );
}

export const Layout = observer(LayoutComponent);
