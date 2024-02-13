import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import map from 'lodash/map';

import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { WithDangerousHTML, WithTag } from '@components/hocs';
import { ProductSelector } from '@components/ProductSelector/ProductSelectorDefault';
import { Preloader } from '@components/Preloader';

import { PO_PROJECT_HOST } from '@src/constants';

import {
  SOCIAL_NETWORK,
  TContentItem,
  TPromoPageContent,
  TSectionItem,
  TShareType,
} from './@types';
import styles from './PromoPageContent.module.scss';
import { ButtonWidget, BUTTON_LAYOUT } from '@components/widgets/ButtonWidget';
import { WidgetRoles } from '@src/roles';
import { LOCATION } from '@components/LoanButton/LoanButton';

function PromoPageContent(props: TPromoPageContent) {
  const { pageTitle, imagePath, sections } = props;
  const { pathname } = useRouter();

  const renderContent = (content: TContentItem[]) => {
    return (
      <>
        {map(content, (contentItem: TContentItem, index: number) => {
          if (!contentItem) return null;

          return (
            <div key={index} className={styles.textBlock}>
              {contentItem.subTitle && (
                <h3 className={styles.subTitle}>{contentItem.subTitle}</h3>
              )}
              <WithDangerousHTML key={index}>
                <>{contentItem.text}</>
              </WithDangerousHTML>
            </div>
          );
        })}
      </>
    );
  };

  /** Рендер кнопки "поділитись в соцмережі"
   * @param buttonType - тип соціальної мережі
   */
  const renderShareButton = (buttonType: SOCIAL_NETWORK) => {
    const imageName = {
      facebook: 'facebook-yellow-icon',
      linkedin: 'linkedin-yellow-icon',
      twitter: 'twitter-yellow-icon',
      x: 'x-yellow-icon',
    } as TShareType;

    const sharedUrl = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${PO_PROJECT_HOST}${pathname}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${PO_PROJECT_HOST}${pathname}&text=${pageTitle}`,
      // twitter: `https://twitter.com/intent/tweet?url=${PO_PROJECT_HOST}${pathname}&text=${pageTitle}`,
      x: `https://twitter.com/share?url=${PO_PROJECT_HOST}${pathname}&text=${pageTitle}`,
    } as TShareType;

    /** Новий варіант: лінк відкривається у новому окремому вікні */
    return (
      <ButtonWidget
        id={`PromoPage-${buttonType}-${WidgetRoles.button}`}
        buttonLayout={BUTTON_LAYOUT.INLINE}
        className={styles.imgLink}
        onClick={() =>
          window.open(
            sharedUrl[buttonType],
            'new window',
            'width=800,height=600;'
          )
        }
      >
        <Image
          src={`/theme/icons/${imageName[buttonType]}.svg`}
          width={32}
          height={32}
          alt={imageName[buttonType]}
        />
      </ButtonWidget>
    );

    /** Страий варіант: лінк відкривається у новій вкладці */
    /* return (
      <LinkWidget
        href={sharedUrl[buttonType]}
        target={TARGET.BLANK}
        className={styles.imgLink}
      >
        <Image
          src={`/theme/icons/${imageName[buttonType]}.svg`}
          width={32}
          height={32}
          alt={imageName[buttonType]}
        />
      </LinkWidget>
    ); */
  };

  if (sections) {
    return (
      <WithPageContainer className={styles.pageContainer}>
        <div className={styles.contentContainer}>
          <div className={styles.banner}>
            <div className={styles.bannerContent}>
              <WithTag>
                <h1 className={styles.pageTitle}>{pageTitle}</h1>
              </WithTag>
              {imagePath && (
                <div className={styles.bannerImg}>
                  <Image
                    src={imagePath}
                    width={453}
                    height={460}
                    alt="background"
                    priority
                  />
                </div>
              )}
            </div>
            <div className={styles.productSelector}>
              <ProductSelector location={LOCATION.DRAW} />
            </div>
          </div>
          <>
            {map(sections, (sectionItem: TSectionItem, index: number) => {
              if (!sectionItem) return null;

              return (
                <section key={index} className={styles.section}>
                  {sectionItem.title && (
                    <WithTag>
                      <h2 className={styles.title}>{sectionItem.title}</h2>
                    </WithTag>
                  )}
                  {renderContent(sectionItem.content)}
                </section>
              );
            })}
          </>
          <hr className={styles.hr} />
          <div className={styles.shareContainer}>
            <span>Share</span>
            {renderShareButton(SOCIAL_NETWORK.FACEBOOK)}
            {renderShareButton(SOCIAL_NETWORK.LINKEDIN)}
            {renderShareButton(SOCIAL_NETWORK.X)}
          </div>
        </div>
      </WithPageContainer>
    );
  }
  return <Preloader />;
}

export { PromoPageContent };
