import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { TJSON } from '@interfaces';
import { staticApi } from '@stores';

import style from './DrawResult.module.scss';
import { WithTag } from '@components/hocs';
import { LinkWidget } from '@components/widgets/LinkWidget';
import { YoutubeWidget } from '@components/widgets/YoutubeWidget';

export function DrawResult() {
  const [staticData, setStaticData] = useState({} as TJSON);
  const [isRender, setIsRender] = useState(false);

  /** Get static data */
  useEffect(() => {
    const init = async () => {
      const pageData = await staticApi.fetchStaticData({
        block: 'draw-result-post',
        path: 'static',
      });

      setIsRender(
        !!pageData.drawResultPostEnabled && !!pageData.winnerYoutubeID
      );

      setStaticData(pageData);
    };

    init();
  }, []);

  if (isRender) {
    return (
      <section className={style.section}>
        <div className={style.content}>
          <WithTag>
            <span className={style.title}>{staticData.title}</span>
          </WithTag>
          <div className={style.winnerItem}>
            <YoutubeWidget
              videoId={staticData.winnerYoutubeID}
              className={style.youtubeWrap}
            />
            <div className={style.txtWrap}>
              <Image
                src={'/images/promos/hollydays-happy-draw/trophy.png'}
                width={47}
                height={47}
              />
              <WithTag>
                <span className={style.name}>{staticData.winnerName}</span>
              </WithTag>
              <WithTag>
                <span className={style.subTitle}>{staticData.subTitle}</span>
              </WithTag>
            </div>
          </div>
          <div className={style.footnote}>
            {staticData.footnote}
            <LinkWidget href={staticData.actionLink}>
              {staticData.action}
            </LinkWidget>
          </div>
        </div>
      </section>
    );
  }
  return null;
}
