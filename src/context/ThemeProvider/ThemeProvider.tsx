import React, { createContext } from 'react';

import { TThemeProvider, TThemeProviderContext } from './@types';
import { useRouter } from 'next/router';

export const ThemeProviderCtx = createContext({} as TThemeProviderContext);

export enum THEME_NAME {
  MAIN = 'main',
  REDESIGN = 'redesign',
  REDESIGN_1 = 'redesign1',
  REDESIGN_2 = 'redesign2',
  REDESIGN_3 = 'redesign3',
  REDESIGN_3_1 = 'redesign3_1',
}

/** Визначаємо "тему" для А/В тестування */
function ThemeProviderComponent(props: TThemeProvider) {
  const { children } = props;
  const { query } = useRouter();

  const defineTheme = () => {
    switch (query.utm_content) {
      case THEME_NAME.REDESIGN:
        return THEME_NAME.REDESIGN;
      case THEME_NAME.REDESIGN_1:
        return THEME_NAME.REDESIGN_1;
      case THEME_NAME.REDESIGN_2:
        return THEME_NAME.REDESIGN_2;
      case THEME_NAME.REDESIGN_3:
      case THEME_NAME.REDESIGN_3_1:
        return THEME_NAME.REDESIGN_3;
    }

    return THEME_NAME.MAIN;
  };

  return (
    <ThemeProviderCtx.Provider
      value={{
        themeName: defineTheme(),
      }}
    >
      {children}
    </ThemeProviderCtx.Provider>
  );
}

export const ThemeProvider = ThemeProviderComponent;
