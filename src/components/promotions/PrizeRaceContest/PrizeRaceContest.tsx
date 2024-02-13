import React, { useEffect, useMemo } from 'react';
import styles from './PrizeRaceContest.module.scss';
import Image from 'next/image';
import { LoanButton } from '@components/LoanButton';
import {
  TPrizeRaceContest,
  TPrizeRaceContestStore,
  THowToGetItem,
  THowToParticipateItem,
  TPrizeItem,
} from './@types';
import { WithDangerousHTML, WithTag } from '@components/hocs';
import classNames from 'classnames';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { inject, observer } from 'mobx-react';
import { STORE_IDS } from '@stores';
import { GetAttachment } from '@components/GetAttachment';
import { ATTACHMENT_TYPE } from '@src/constants';
import { Footer } from '@components/Footer';
import { YoutubeWidget } from '@components/widgets/YoutubeWidget';

export function PrizeRaceContestComponent(props: TPrizeRaceContest) {
  const {
    pageData,
    pageData: { copyright },
    loanStore,
  } = props as TPrizeRaceContestStore;

  const {
    loanData: { amount, term },
  } = loanStore;

  const svgTile = useMemo(
    () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 84.76 66.83"
        className={styles.svgTile}
      >
        <path
          fill="#E0F0E1"
          fillRule="evenodd"
          d="M51.39,65.59C40.28,68.23,5.28,66.46,0,62.2,21.53,33,52.92-.06,84.76,0,68.24,14,57.66,42.11,51.39,65.59Z"
        />
      </svg>
    ),
    []
  );

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
          <div className={styles.textBlock}>
            <div className={styles.promoTitle}>{pageData.promo.title}</div>
            <WithTag>
              <div className={styles.promoSubTitle}>
                {pageData.promo.subTitle}
              </div>
            </WithTag>
            {/* <div className={styles.buttonWrap}> */}
            <LoanButton
              location="Draw"
              label={pageData.promo.button}
              className={styles.promoButton}
            />
            {/* </div> */}
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
          <ul className={styles.howToParticipateList}>
            {pageData.howToParticipateList.map(
              (item: THowToParticipateItem, index: number) => {
                return (
                  <li key={index}>
                    <div
                      className={classNames({
                        [styles.arrow]: item.number != '4',
                      })}
                    >
                      <span className={styles.bigNumber}>{item.number}</span>
                    </div>
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

          <h2 className={classNames(styles.title, styles.howToGetTitle)}>
            {pageData.howToGet.title}
          </h2>
          <ul className={styles.howToGetList}>
            {pageData.howToGet.list.map(
              (item: THowToGetItem, index: number) => {
                return (
                  <li
                    key={index}
                    className={classNames(styles[`liIndex${[index]}`])}
                  >
                    <div
                      className={classNames(styles.bubble, styles[item.class])}
                    >
                      <WithDangerousHTML>
                        <p>{item.text}</p>
                      </WithDangerousHTML>
                      {svgTile}
                    </div>
                  </li>
                );
              }
            )}
          </ul>
          <div className={styles.scooterWrap}>
            {[1, 2, 3].map((index: number) => {
              return (
                <Image
                  src={'/images/prize-race-contest/scooter.png'}
                  alt={'scooter'}
                  width={102}
                  height={80}
                  key={index}
                />
              );
            })}
          </div>
          <div className={styles.subTitle}>{pageData.howToGet.subTitle}</div>
          <LoanButton
            location="Draw"
            label={pageData.howToGet.button}
            className={styles.loanButton}
          />
          <div className={styles.prizesWrap}>
            <div className={styles.prizesTextBlock}>
              <h3 className={classNames(styles.title)}>
                {pageData.prizes.title}
              </h3>
              <WithDangerousHTML>
                <span className={styles.prizesDescription}>
                  {pageData.prizes.description}
                </span>
              </WithDangerousHTML>
            </div>
            <ul className={styles.prizes}>
              {pageData.prizes.items.map((item: TPrizeItem, index: number) => {
                return (
                  <li key={index}>
                    <Image
                      src={item.imageUrl}
                      width={498}
                      height={577}
                      alt="prize"
                    />
                    <div className={styles.prizeTitle}>{item.title}</div>
                    <WithDangerousHTML>
                      <span className={styles.prizeDescr}>
                        {item.description}
                      </span>
                    </WithDangerousHTML>
                  </li>
                );
              })}
            </ul>
            <WithDangerousHTML>
              <span className={styles.prizesFootnote}>
                {pageData.prizes.footnote}
              </span>
            </WithDangerousHTML>
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
                  styles.winnerCellTitle,
                  styles.toUpperCase
                )}
              >
                {pageData.winners.count}
              </div>
              <div
                className={classNames(
                  styles.winnersDealNo,
                  styles.winnerCell,
                  styles.winnerCellTitle,
                  styles.toUpperCase
                )}
              >
                {pageData.winners.dealNo}
              </div>
              <div
                className={classNames(
                  styles.winnersName,
                  styles.winnerCell,
                  styles.winnerCellTitle,
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
                        styles.winnerCell,
                        styles.winnerCellTitle
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
                    ATTACHMENT_TYPE.PRIZE_RACE_CONTEST_TERMS_AND_CONDITIONS
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
        </div>
      </WithPageContainer>
      <div className={styles.footerWrap}>
        <Footer copyright={copyright.normal} className={styles.footer} />
      </div>
    </>
  );
}

export const PrizeRaceContest = inject(STORE_IDS.LOAN_STORE)(
  observer(PrizeRaceContestComponent)
);
