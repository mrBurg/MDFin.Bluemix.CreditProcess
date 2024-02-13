import React, { ReactElement, createContext, useState } from 'react';
import { Provider, enableStaticRendering } from 'mobx-react';
import { configure } from 'mobx';
import moment from 'moment';
import 'moment/locale/ro';
import axios from 'axios';

import 'react-datepicker/dist/react-datepicker.css';
import 'rc-slider/assets/index.css';
import '../src/scss/index.scss';

import { isServer } from '@utils';
import { TAppPageProps } from '@interfaces';
import { useStore } from '@stores';
import { Layout } from '@components/Layout';
import cfg from '@root/config.json';
import { AppProvider } from '@src/context/AppProvider';
import { LocaleProvider } from '@src/context/LocaleProvider';
import { DevTools } from '@components/developer';
import { LayoutProvider } from '@context/LayoutProvider';
import { ThemeProvider } from '@context/ThemeProvider';
// import { AuthProvider } from '@context/AuthProvider';

configure({ enforceActions: 'always' });
axios.defaults.withCredentials = true;
moment.locale(cfg.defaultLocale.split('-')[0]);

moment.updateLocale('ro', {
  monthsShort: [
    'Ian',
    'Feb',
    'Mar',
    'Apr',
    'Mai',
    'Iun',
    'Iul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
});

export const GlobalPopupContext = createContext((<></>) as any);

function App(props: TAppPageProps) {
  enableStaticRendering(isServer);

  const { pageProps, Component } = props;

  const [globalPopup, setGlobalPopup] = useState(
    null as unknown as ReactElement
  );

  const mobxStores = useStore({
    context: pageProps.context,
    pageData: pageProps.pageData,
  });

  return (
    <Provider {...mobxStores}>
      <LocaleProvider>
        <DevTools />
        <AppProvider>
          <ThemeProvider>
            <LayoutProvider template={pageProps.template}>
              {/* <AuthProvider> */}
              <GlobalPopupContext.Provider
                value={{ globalPopup, setGlobalPopup }}
              >
                <Layout
                  Component={Component}
                  template={props.pageProps.template}
                  {...mobxStores}
                />
                {globalPopup}
              </GlobalPopupContext.Provider>
              {/* </AuthProvider> */}
            </LayoutProvider>
          </ThemeProvider>
        </AppProvider>
      </LocaleProvider>
    </Provider>
  );
}

export default App;
