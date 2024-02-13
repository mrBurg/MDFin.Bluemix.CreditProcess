import React, { useEffect, useState } from 'react';
import { TJSON } from '@interfaces';

// import { fetchStaticData } from '@src/apis/StaticApi';
import style from './CovidMessage.module.scss';
import { WithDangerousHTML } from '@components/hocs';
import { staticApi } from '@stores';

/**
 * Использовался для вывода сообщения о COVID19, на странице application и deal.
 * Больше/пока не используется
 */
function CovidMessage() {
  const [data, setData] = useState({} as TJSON);
  useEffect(() => {
    const init = async () => {
      const staticData = await staticApi.fetchStaticData({
        block: 'covidMessage',
        path: 'static',
      });

      setData(staticData);
    };

    init();
  }, []);

  if (data) {
    return (
      <div className={style.covidMessage__holder}>
        <WithDangerousHTML>
          <div className={style.covidMessage__data}>{data.text}</div>
        </WithDangerousHTML>
      </div>
    );
  }
  return null;
}

export { CovidMessage };
