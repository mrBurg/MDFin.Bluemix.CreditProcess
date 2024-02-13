import React, { createContext } from 'react';

import { HeaderRedesign } from './HeaderRedesign';

export const HeaderRedesignCtx = createContext({});
export const HeaderRedesignProvider = HeaderRedesignCtx.Provider;
export const HeaderRedesignConsumer = HeaderRedesignCtx.Consumer;

function HeaderRedesignContext() {
  return (
    <HeaderRedesignProvider value={{}}>
      <HeaderRedesign />
    </HeaderRedesignProvider>
  );
}

export { HeaderRedesignContext };
