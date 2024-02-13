import React, { useState, useEffect } from 'react';
import { withRouter } from 'next/router';

import { EVENT } from '@src/constants';
import { isDevice } from '@utils';
import { MobileMenu } from './MobileMenu';
import { DesktopMenu } from './DesktopMenu';

function MainMenuComponent() {
  const [isMob, setIsMob] = useState(isDevice());
  const [menu, setMenu] = useState(<></>); //useState(<DesktopMenu />);

  useEffect(() => {
    setMenu(isMob ? <MobileMenu /> : <DesktopMenu />);
  }, [isMob]);

  useEffect(() => {
    const detectDeviceType = () => {
      setIsMob(isDevice());
    };

    window.addEventListener(EVENT.RESIZE, detectDeviceType);

    return () => window.removeEventListener(EVENT.RESIZE, detectDeviceType);
  }, []);

  return menu;
}

export const MainMenu = withRouter(MainMenuComponent);
