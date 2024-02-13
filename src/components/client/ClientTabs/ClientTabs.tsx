import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

import style from './ClientTabs.module.scss';

import { TClientTabsProps, TTab, TTabs } from './@types';
import { staticApi } from '@stores';

export function ClientTabs(props: TClientTabsProps) {
  const { className, current } = props;

  const [tabs, setTabs] = useState({} as TTabs);

  const currentStep = useMemo(() => tabs[current], [current, tabs]);
  const preparedTabs = useMemo(
    () =>
      reduce(
        tabs,
        (accum, item) => {
          if (accum[item.index]) {
            return accum;
          }

          accum[item.index] = item;

          return accum;
        },
        [] as TTab[]
      ),
    [tabs]
  );

  useEffect(() => {
    const init = async () => {
      const tabs = (await staticApi.fetchStaticData({
        block: 'client-tabs',
        path: 'static',
      })) as TTabs;

      setTabs(tabs);
    };

    init();
  }, []);

  return (
    <ul className={classNames(className, style.tabs)}>
      {map(preparedTabs, (item, index) => (
        <li
          key={index}
          className={classNames(style.tab, {
            [style.currentTab]:
              item && currentStep ? currentStep.index == item.index : false,
          })}
        />
      ))}
    </ul>
  );
}
