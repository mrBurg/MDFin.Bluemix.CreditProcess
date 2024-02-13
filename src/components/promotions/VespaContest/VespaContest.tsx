import React, { useCallback, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import Image from 'next/image';

import { TVespaContest, TVespaContestStore, THowToGetItem } from './@types';

import { WithTag } from '@components/hocs';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { GetAttachment } from '@components/GetAttachment';
import { LoanButton } from '@components/LoanButton';
import { Footer } from '@components/Footer';

import { ATTACHMENT_TYPE } from '@src/constants';
import { STORE_IDS } from '@stores';

import styles from './VespaContest.module.scss';
import { YoutubeWidget } from '@components/widgets/YoutubeWidget';

function VespaContestComponent(props: TVespaContest) {
  const { pageData, loanStore } = props as TVespaContestStore;

  const {
    loanData: { amount, term },
  } = loanStore;

  const renderWinner = useCallback(() => {
    if (pageData.userWinner) {
      return (
        <WithTag>
          <div>{pageData.userWinner}</div>
        </WithTag>
      );
    }

    return <span className={styles.questionMark}>?</span>;
  }, [pageData.userWinner]);

  const renderPostPromo = useCallback(() => {
    const { winnerYoutubeID, imageUrl1, imageUrl2, subTitle } =
      pageData.winners;
    const isRender = !!winnerYoutubeID && !!imageUrl1 && !!imageUrl2;

    if (isRender) {
      return (
        <div className={styles.postpromo}>
          <div className={styles.imgWrap}>
            <Image src={imageUrl1} width={624} height={416} />
            <Image src={imageUrl2} width={624} height={416} />
          </div>
          <div className={styles.txtWrap}>
            <Image
              src={'/images/vespa-contest/trophy.png'}
              width={46}
              height={46}
            />

            <WithTag>
              <span className={styles.subTitle}>{subTitle}</span>
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
  }, [pageData.winners]);

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
          <div className={styles.imageBlock}>
            <Image
              src={'/images/vespa-contest/vespa_promo.png'}
              alt={'prize'}
              width={619}
              height={611}
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
          <div className={styles.prize}>
            <WithTag>
              <div className={styles.prizeText}>{pageData.prize}</div>
            </WithTag>
            <div className={styles.prizeImage}>
              <Image
                src={'/images/vespa-contest/vespa.png'}
                alt={'prize'}
                width={427}
                height={457}
              />
            </div>
          </div>

          <div className={styles.howToGet}>
            <h2 className={styles.title}>{pageData.howToGet.title}</h2>
            <ul className={styles.descriptionList}>
              {pageData.howToGet.descriptionList.map(
                (item: THowToGetItem, index: number) => (
                  <li key={index} className={styles.descriptionWrap}>
                    <div className={styles.description}>
                      <div className={styles.descriptionImage}>
                        <Image src={item.imageUrl} width={250} height={230} />
                      </div>

                      <WithTag>
                        <div className={styles.descriptionText}>
                          {item.description}
                        </div>
                      </WithTag>
                    </div>
                  </li>
                )
              )}
            </ul>

            <ul className={styles.howToGetList}>
              {pageData.howToGet.items.map(
                (item: THowToGetItem, index: number) => (
                  <li key={index} className={styles.itemWrap}>
                    <div className={styles.item}>
                      <div className={styles.itemImage}>
                        <Image src={item.imageUrl} width={132} height={132} />
                      </div>

                      <div className={styles.itemText}>
                        <WithTag>
                          <p>{item.description}</p>
                        </WithTag>
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>

            <WithTag>
              <h2 className={classNames(styles.title, styles.footnote)}>
                {pageData.howToGet.footnote}
              </h2>
            </WithTag>

            <LoanButton
              location="Draw"
              label={pageData.loanButton}
              className={classNames(styles.loanButton, styles.buttonWrap)}
            />
          </div>

          <div className={styles.applyNow}>
            <div className={styles.applyNowText}>{pageData.applyNow}</div>
            <div className={styles.applyNowImage}>
              <Image
                src={'/images/vespa-contest/girl.png'}
                width={498}
                height={356}
              />
            </div>
          </div>

          {pageData.youtubeID && (
            <YoutubeWidget
              videoId={pageData.youtubeID}
              className={styles.youtubeWrap}
            />
          )}

          <WithTag>
            <h2 className={classNames(styles.title, styles.winnerTitle)}>
              {pageData.winners.title}
            </h2>
          </WithTag>

          <div className={styles.winner}>
            <div className={styles.winnerText}>{renderWinner()}</div>
          </div>

          {renderPostPromo()}

          <WithTag
            tags={{
              terms_and_conditions: (
                <GetAttachment
                  attachmentType={
                    ATTACHMENT_TYPE.VESPA_CONTEST_TERMS_AND_CONDITIONS
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
            <Footer
              copyright={pageData.copyright.normal}
              className={styles.footer}
            />
          </div>
        </div>
      </WithPageContainer>
    </>
  );
}

export const VespaContest = inject(STORE_IDS.LOAN_STORE)(
  observer(VespaContestComponent)
);
