import React, { useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import Image from 'next/image';
import reduce from 'lodash/reduce';
import size from 'lodash/size';

import { WithTag } from '@components/hocs';
import { WithPageContainer } from '@components/hocs/WithPageContainer';

import { STORE_IDS } from '@stores';

import { ProductSelector } from '@components/ProductSelector/ProductSelectorDefault';

import styles from './BonusPromotionYear.module.scss';
import { TBlockItem, TBonusPromotionYear } from './@types';

import { LoanButton } from '@components/LoanButton';
import { LOCATION } from '@components/LoanButton/LoanButton';
import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';
import { WidgetRoles } from '@src/roles';
import { GetAttachment } from '@components/GetAttachment';
import { TJSON } from '@interfaces';
import { Anpc } from '@components/Anpc';

export function BonusPromotionYearComponent(props: TBonusPromotionYear) {
  const { welcome, howToGet, terms } = props;

  const renderTerms = useCallback(() => {
    if (terms) {
      const contentData = <div>{terms.text}</div>;

      if (size(terms.tags)) {
        return (
          <WithTag
            tags={reduce(
              terms.tags,
              (accum, item, index) => {
                accum[index] =
                  item.tagType == 'link' ? (
                    <LinkWidget
                      key={index}
                      id={`BonusPromotionYear-${item.type}-${WidgetRoles.link}`}
                      href={item.href}
                      className={styles.link}
                      target={TARGET.BLANK}
                    >
                      {item.label}
                    </LinkWidget>
                  ) : (
                    <GetAttachment
                      key={index}
                      attachmentType={item.type}
                      label={item.label}
                      className={styles.link}
                    />
                  );

                return accum;
              },
              {} as TJSON
            )}
          >
            {contentData}
          </WithTag>
        );
      }
    }
  }, [terms]);

  return (
    <>
      <div className={styles.welcome}>
        <div className={styles.welcomeBg} />
        <div className={styles.content}>
          <div className={styles.mainContent}>
            <WithTag>
              <h1 className={styles.mainText}>{welcome.title}</h1>
            </WithTag>
            <div className={styles.mainImage}>
              <Image
                src={'/images/promos/bonus-promotion-year/50-lei.png'}
                width={493}
                height={396}
                alt={'50 Lei image'}
              />
            </div>
            <div className={styles.img}>
              <Image
                src={'/images/promos/bonus-promotion-year/lady-2.png'}
                width={400}
                height={591}
                alt={'lady image'}
              />
            </div>
          </div>
          <div className={styles.productSelector}>
            <ProductSelector
              location={LOCATION.PROMOTION}
              className={styles.calc}
            />
          </div>
        </div>
      </div>
      <WithPageContainer className={styles.pageContainer}>
        <div className={styles.contentWrap}>
          <div className={styles.howToGet}>
            <div className={styles.head}>
              <div className={styles.title}>{howToGet.title}</div>
              <div className={styles.subTitle}>
                <div className={styles.subTitleBg}>
                  <div className={styles.subTitleBgImg}>
                    <Image
                      src={'/images/promos/bonus-promotion-year/dialog.png'}
                      alt="dialog-image"
                      width={550}
                      height={198}
                      priority
                      quality={100}
                    />
                  </div>
                </div>
                <WithTag>
                  <span>{`${howToGet.subTitle}`}</span>
                </WithTag>
              </div>
            </div>
            <ul className={styles.blocks}>
              {howToGet.blocks.map((block: TBlockItem, key: number) => {
                return (
                  <li key={key} className={styles.blockWrap}>
                    <div className={styles.blockTitle}>
                      <WithTag>
                        <span>{block.title}</span>
                      </WithTag>
                    </div>
                    <ul className={styles.blockItems}>
                      {block.items.map((item: string, index: number) => {
                        return (
                          <li key={index} className={styles.item}>
                            <div className={styles.itemImage}>{index + 1}.</div>

                            <div className={styles.itemText}>
                              <WithTag>
                                <p>{item}</p>
                              </WithTag>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <LoanButton
                      location={LOCATION.PROMOTION}
                      label={howToGet.loanButton}
                      className={styles.loanButton}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={styles.terms}>{renderTerms()}</div>
          <div className={styles.anpcContainer}>
            <Anpc />
          </div>
        </div>
      </WithPageContainer>
    </>
  );
}

export const BonusPromotionYear = inject(STORE_IDS.LOAN_STORE)(
  observer(BonusPromotionYearComponent)
);
