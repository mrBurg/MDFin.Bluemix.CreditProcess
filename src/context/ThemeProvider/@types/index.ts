import { THEME_NAME } from '../ThemeProvider';

export type TThemeProviderContext = {
  themeName: THEME_NAME;
  // setThemeName: Dispatch<SetStateAction<THEME_NAME>>;
};

export type TThemeProvider = {
  children: any;
};
