import React, { useCallback } from 'react';

import style from './DevTools.module.scss';

import { isDev, isProd } from '@utils';
import { ENVIRONMENT } from '@src/constants';
import { DeveloperMenu } from '../DeveloperMenu';

/**
 * @description Инструменты разработчика. Отображение текущей среды разработки и дополнительного меню.
 */
function DevTools() {
  const renderEnvironmentInfo = useCallback(
    () => !isProd && <h1 className={style.environmentInfo}>{ENVIRONMENT}</h1>,
    []
  );

  const renderDeveloperMenu = useCallback(() => isDev && <DeveloperMenu />, []);

  return (
    <>
      {renderEnvironmentInfo()}
      {renderDeveloperMenu()}
    </>
  );
}

export { DevTools };
