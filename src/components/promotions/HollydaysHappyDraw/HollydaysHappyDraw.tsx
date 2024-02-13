import React, { useCallback, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Image from 'next/image';

import {
  THollydaysHappyDraw,
  THollydaysHappyDrawStore,
  TListItem,
} from './@types';

import { WithTag } from '@components/hocs';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { GetAttachment } from '@components/GetAttachment';
import { LoanButton } from '@components/LoanButton';
import { Footer } from '@components/Footer';

import { ATTACHMENT_TYPE } from '@src/constants';
import { STORE_IDS } from '@stores';

import styles from './HollydaysHappyDraw.module.scss';
import { YoutubeWidget } from '@components/widgets/YoutubeWidget';

export function HollydaysHappyDrawComponent(props: THollydaysHappyDraw) {
  const {
    pageData,
    pageData: { copyright },
    loanStore,
  } = props as THollydaysHappyDrawStore;

  const {
    loanData: { amount, term },
  } = loanStore;

  const renderPostPromo = useCallback(() => {
    if (!pageData.postPromo) return;

    const { winnerYoutubeID, title } = pageData.postPromo;
    const isRender = !!winnerYoutubeID;

    if (isRender) {
      return (
        <div className={styles.postpromo}>
          <div className={styles.imgWrap}>
            <div className={styles.image} />
          </div>

          <div className={styles.txtWrap}>
            <WithTag>
              <span className={styles.title}>{title}</span>
            </WithTag>
          </div>

          {winnerYoutubeID && (
            <YoutubeWidget
              videoId={winnerYoutubeID}
              className={styles.youtubeWrap}
            />
          )}
        </div>
      );
    }
  }, [pageData.postPromo]);

  useEffect(() => {
    const checkAmooutTerm = async () => {
      if (amount == 0 || term == 0) {
        await loanStore.getCalculatorParams();
      }
    };

    checkAmooutTerm();
  }, [amount, loanStore, term]);

  return (
    <>
      <div className={styles.bannerWrap}>
        <div className={styles.banner}>
          <div className={styles.bow}>
            <Image
              src={'/images/promos/hollydays-happy-draw/bow.png'}
              alt={'prize'}
              width={401}
              height={284}
            />
          </div>
          <div className={styles.imageBlock}>
            <Image
              src={'/images/promos/hollydays-happy-draw/car-shtender.png'}
              alt={'prize'}
              width={473}
              height={427}
            />
          </div>
          <div className={styles.textBlock}>
            <WithTag>
              <div className={styles.promoHeader}>{pageData.promo.header}</div>
              <div className={styles.promoTitle}>{pageData.promo.title}</div>
              <div className={styles.promoBody}>{pageData.promo.body}</div>
            </WithTag>
            <LoanButton
              location="Draw"
              label={pageData.promo.button}
              className={styles.promoButton}
            />
            <WithTag>
              <div className={styles.promoFootnote}>
                {pageData.promo.footnote}
              </div>
            </WithTag>
          </div>
        </div>
      </div>

      <WithPageContainer className={styles.pageContainer}>
        <div className={styles.contentWrap}>
          <div className={styles.note}>{pageData.note}</div>
          <div className={styles.prize}>
            <WithTag>
              <div className={styles.prizeText}>{pageData.prize}</div>
            </WithTag>
            <div className={styles.prizeImage}>
              <Image
                src={'/images/promos/hollydays-happy-draw/car-side.png'}
                alt={'prize'}
                width={403}
                height={357}
              />
            </div>
          </div>

          <div className={styles.howToGet}>
            <h2 className={styles.title}>{pageData.howToGet.title}</h2>

            <ul className={styles.howToGetList}>
              {pageData.howToGet.items.map((item: string, index: number) => {
                return (
                  <li key={index} className={styles.itemWrap}>
                    <div className={styles.item}>
                      <div className={styles.itemImage}>{index + 1}.</div>

                      <div className={styles.itemText}>
                        <WithTag>
                          <p>{item}</p>
                        </WithTag>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className={styles.footnote}>
              <WithTag>
                <span>{pageData.howToGet.footnote}</span>
              </WithTag>
              <div className={styles.bow}>
                <Image
                  src={'/images/promos/hollydays-happy-draw/bow.png'}
                  alt={'bow'}
                  width={279}
                  height={222}
                  className={styles.bowTransform}
                />
              </div>
            </div>

            <div className={styles.description}>
              <div className={styles.descriptionImage}>
                <Image
                  src={pageData.howToGet.description.imageUrl}
                  alt={'calendar'}
                  width={406}
                  height={284}
                />
              </div>

              <WithTag>
                <div className={styles.descriptionText}>
                  {pageData.howToGet.description.description}
                </div>
              </WithTag>
            </div>
          </div>

          <div className={styles.terms}>
            <h2 className={styles.title}>{pageData.terms.title}</h2>

            <ul /* className={styles.termsList} */>
              {pageData.terms.items.map((item: TListItem, index: number) => {
                return (
                  <li key={index} /* className={styles.termsItemWrap} */>
                    {/* <div className={styles.termsItem}> */}
                    {/* <div className={styles.termsItemImage}> */}
                    <Image src={item.imageUrl} width={262} height={231} />
                    {/* </div> */}

                    <WithTag>
                      <div className={styles.termsItemText}>
                        {item.description}
                      </div>
                    </WithTag>
                    {/* </div> */}
                  </li>
                );
              })}
            </ul>

            <div className={styles.footnote}>
              <WithTag>
                <span>{pageData.terms.footnote}</span>
              </WithTag>
            </div>

            <LoanButton
              location="Draw"
              label={pageData.loanButton}
              className={styles.loanButton}
            />

            <div className={styles.subTitle}>{pageData.terms.subTitle}</div>
          </div>

          {pageData.youtubeID && (
            <YoutubeWidget
              videoId={pageData.youtubeID}
              className={styles.youtubeWrap}
            />
          )}

          <WithTag>
            <h2 className={styles.winnerTitle}>{pageData.winners.title}</h2>
          </WithTag>

          <div className={styles.winner}>
            {!pageData.winners.userWinner && (
              <Image
                src={'/images/promos/hollydays-happy-draw/winner-wanted.png'}
                width={606}
                height={493}
              />
            )}
            {pageData.winners.userWinner && (
              <div className={styles.winnerWrap}>
                <div className={styles.winnerItem}>
                  <div className={styles.imgBlock}>
                    <Image
                      src={
                        '/images/promos/hollydays-happy-draw/car-confetti.png'
                      }
                      width={369}
                      height={328}
                    />
                  </div>
                  <div className={styles.txtBlock}>
                    <Image
                      src={'/images/promos/hollydays-happy-draw/trophy.png'}
                      width={56}
                      height={56}
                    />
                    <WithTag>
                      <div className={styles.text}>
                        {pageData.winners.userWinner}
                      </div>
                    </WithTag>
                  </div>
                </div>
              </div>
            )}
          </div>

          {renderPostPromo()}

          <WithTag
            tags={{
              terms_and_conditions: (
                <GetAttachment
                  attachmentType={
                    ATTACHMENT_TYPE.HOLLYDAYS_HAPPY_DRAW_TERMS_AND_CONDITIONS
                  }
                  label={pageData.termsAndConditions.tagLabel}
                  key={pageData.termsAndConditions.tagLabel}
                />
              ),
            }}
          >
            <span className={styles.termsTitle}>
              {pageData.termsAndConditions.label}
            </span>
          </WithTag>

          <LoanButton
            location="Draw"
            label={pageData.loanButton}
            className={styles.loanButton}
          />
          <div className={styles.footerWrap}>
            <Footer copyright={copyright.normal} className={styles.footer} />
          </div>
        </div>
      </WithPageContainer>
    </>
  );
}

export const HollydaysHappyDraw = inject(STORE_IDS.LOAN_STORE)(
  observer(HollydaysHappyDrawComponent)
);
