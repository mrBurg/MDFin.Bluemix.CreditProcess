import React, { Fragment } from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Image from 'next/image';

import style from './HowItWorksRd2.module.scss';
import { THowItWorksRd2Props, TItem } from './@types';
import { WithTag } from '@components/hocs';
import { YoutubeWidget } from '@components/widgets/YoutubeWidget';
import { LoanButton } from '@components/LoanButton';

function HowItWorksRd2(props: THowItWorksRd2Props) {
  const { title, subtitle, youtubeID, items, footnote } = props;

  if (isEmpty(props)) return <></>;

  return (
    <section className={style.section}>
      <div className={style.content}>
        <WithTag>
          <h2 className={style.title}>{title}</h2>
          <h3 className={style.subtitle}>{subtitle}</h3>
        </WithTag>

        {youtubeID && (
          <YoutubeWidget videoId={youtubeID} className={style.youtubeWrap} />
        )}

        <div className={style.steps}>
          {map(items, (item: TItem, index: number) => (
            <Fragment key={index}>
              <div className={style.step}>
                <div className={style.stepIcon}>{'0' + (index + 1)}</div>
                <div className={style.stepText}>
                  {item.itemData}

                  {item.buttonLabel && (
                    <div className={style.loanButtonWrap}>
                      <LoanButton
                        className={style.loanButton}
                        label={item.buttonLabel}
                        idExt="HowItWorkRd2"
                        // location={LOCATION.DRAW}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className={style.arrow}>
                <Image
                  src={`/images/main-page/how-it-works/arrow-icon.svg`}
                  width={33}
                  height={16}
                  alt={'arrow-icon'}
                />
              </div>
            </Fragment>
          ))}
        </div>
        <p className={style.footnote}>{footnote}</p>
      </div>
    </section>
  );
}

export { HowItWorksRd2 };
