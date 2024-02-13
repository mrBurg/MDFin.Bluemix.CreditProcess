import React, { useEffect } from 'react';
import styles from './HotSummerDraw.module.scss';
import Image from 'next/image';
import { LoanButton } from '@components/LoanButton';
import {
  THotSummerDraw,
  THotSummerDrawStore,
  THowToGetItem,
  THowToParticipateItem,
} from './@types';
import { WithDangerousHTML, WithTag } from '@components/hocs';
import classNames from 'classnames';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { inject, observer } from 'mobx-react';
import { STORE_IDS } from '@stores';
import { GetAttachment } from '@components/GetAttachment';
import { ATTACHMENT_TYPE } from '@src/constants';
import { YoutubeWidget } from '@components/widgets/YoutubeWidget';

export function HotSummerDrawComponent(props: THotSummerDraw) {
  const { pageData, loanStore } = props as THotSummerDrawStore;

  const {
    loanData: { amount, term },
  } = loanStore;

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
        <div className={styles.banner} />
      </div>
      <WithPageContainer>
        <div className={styles.summerWrap}>
          <h1 className={classNames(styles.title, styles.mainTitle)}>
            {pageData.promo.title}
          </h1>
          <LoanButton
            location="Draw"
            label={pageData.promo.button}
            className={styles.loanButton}
          />
          <ul className={styles.howToParticipateList}>
            {pageData.howToParticipateList.map(
              (item: THowToParticipateItem, index: number) => {
                return (
                  <li key={index}>
                    <div className={styles.participateImage}>
                      <Image
                        src={item.imageUrl}
                        width={264}
                        height={152}
                        alt="Card"
                        layout="fixed"
                      />
                    </div>
                    <span className={styles.bigNumber}>{item.number}</span>
                    <span className={styles.participateTitle}>
                      {item.title}
                    </span>
                    <WithDangerousHTML>
                      <span className={styles.participateDescription}>
                        {item.description}
                      </span>
                    </WithDangerousHTML>
                  </li>
                );
              }
            )}
          </ul>
          <WithDangerousHTML>
            <p className={styles.becomeMemberText}>
              {pageData.becomeMemberText}
            </p>
          </WithDangerousHTML>
          <h2 className={classNames(styles.title, styles.howToGetTitle)}>
            {pageData.howToGet.title}
          </h2>
          <ul className={styles.howToGetList}>
            {pageData.howToGet.list.map(
              (item: THowToGetItem, index: number) => {
                return (
                  <li key={index}>
                    <WithDangerousHTML>
                      <p>{item}</p>
                    </WithDangerousHTML>
                  </li>
                );
              }
            )}
          </ul>
          <LoanButton
            location="Draw"
            label={pageData.howToGet.button}
            className={styles.loanButton}
          />
          <div className={styles.prizesWrap}>
            <div className={styles.prizesImage}>
              <Image
                src={pageData.prizes.imageUrl}
                width={188}
                height={325}
                alt="Banner"
              />
            </div>
            <div className={styles.prizesTextBlock}>
              <h3 className={classNames(styles.title, styles.prizesTitle)}>
                {pageData.prizes.title}
              </h3>
              <WithDangerousHTML>
                <span className={styles.prizesDescription}>
                  {pageData.prizes.description}
                </span>
              </WithDangerousHTML>
            </div>
          </div>

          {pageData.youtubeID && (
            <YoutubeWidget
              videoId={pageData.youtubeID}
              className={styles.youtubeWrap}
            />
          )}

          <h3 className={classNames(styles.title, styles.winnerTitle)}>
            {pageData.winners.title}
          </h3>
          <ul className={styles.winnerList}>
            <li>
              <div
                className={classNames(
                  styles.winnersCount,
                  styles.winnerCell,
                  styles.toUpperCase
                )}
              >
                {pageData.winners.count}
              </div>
              <div
                className={classNames(
                  styles.winnersDealNo,
                  styles.winnerCell,
                  styles.toUpperCase
                )}
              >
                {pageData.winners.dealNo}
              </div>
              <div
                className={classNames(
                  styles.winnersName,
                  styles.winnerCell,
                  styles.toUpperCase
                )}
              >
                {pageData.winners.name}
              </div>
            </li>
            {pageData.usersWinners.map(
              (item: { name: string; dealNo: number }, index: number) => {
                return (
                  <li key={index}>
                    <div
                      className={classNames(
                        styles.winnersCount,
                        styles.winnerCell
                      )}
                    >
                      {index + 1}
                    </div>
                    <div
                      className={classNames(
                        styles.winnersDealNo,
                        styles.winnerCell
                      )}
                    >
                      {item.dealNo}
                    </div>
                    <div
                      className={classNames(
                        styles.winnersName,
                        styles.winnerCell
                      )}
                    >
                      {item.name}
                    </div>
                  </li>
                );
              }
            )}
          </ul>
          <WithTag
            tags={{
              terms_and_conditions: (
                <GetAttachment
                  attachmentType={
                    ATTACHMENT_TYPE.HOT_SUMMER_DRAW_TERMS_AND_CONDITIONS
                  }
                  label={pageData.tagsLabels.terms_and_conditions}
                  key={pageData.tagsLabels.terms_and_conditions}
                />
              ),
            }}
          >
            <span className={styles.termsTitle}>
              {pageData.termsAndConditions}
            </span>
          </WithTag>
          {/* <WithDangerousHTML>
            <span className={styles.termsTitle}>{pageData.termsTitle}</span>
          </WithDangerousHTML> */}
          <LoanButton
            location="Draw"
            label={pageData.loanButton}
            className={styles.loanButton}
          />
        </div>
      </WithPageContainer>
    </>
  );
}

export const HotSummerDraw = inject(STORE_IDS.LOAN_STORE)(
  observer(HotSummerDrawComponent)
);
