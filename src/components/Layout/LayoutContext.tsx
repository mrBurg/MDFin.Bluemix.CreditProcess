import { createContext } from 'react';
import { TLayoutContext } from './@types';

export const LayoutCtx = createContext({} as TLayoutContext);
export const LayoutProvider = LayoutCtx.Provider;
export const LayoutConsumer = LayoutCtx.Consumer;
