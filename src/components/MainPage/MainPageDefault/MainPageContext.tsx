import { createContext } from 'react';
import { TMainPageContext } from './@types';

export const MainPageCtx = createContext({} as TMainPageContext);
export const MainPageProvider = MainPageCtx.Provider;
export const MainPageConsumer = MainPageCtx.Consumer;
