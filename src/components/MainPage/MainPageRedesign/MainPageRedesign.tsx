import { inject } from 'mobx-react';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';

import { STORE_IDS } from '@stores';
import {
  WelcomeRedesign,
  WelcomeRd1,
  WelcomeRd2,
  WelcomeRd3,
  SeoInfo,
  HowDoItRedesign,
  HowItWorksRedesign,
  HowItWorksRd2,
  GetAppInfo,
} from '@components/sections';
import { GoalpageStartFrame } from '@components/GoalpageFrame/GoalpageFrame';
import { AccordionWidgetRedesign } from '@components/widgets/AccordionWidgetRedesign';
import { AccordionWidgetRd2 } from '@components/widgets/AccordionWidgetRd2';
import { TMainPageRedesignProps } from './@types';
import { STYLETYPE } from '@components/widgets/AccordionWidgetRedesign/@types';
import styles from './MainPageRedesign.module.scss';
import { FooterRedesign } from '@components/FooterRedesign';
import { ThemeProviderCtx } from '@context/ThemeProvider';
import { THEME_NAME } from '@context/ThemeProvider/ThemeProvider';
import classNames from 'classnames';
import { Anpc } from '@components/Anpc';
import { TagsCloudWidget } from '@components/widgets/TagsCloudWidget';

function MainPageRedesignComponent(props: TMainPageRedesignProps) {
  const {
    pageStore: { pageData },
    userStore,
    //loyaltyStore,
  } = props;

  const { themeName } = useContext(ThemeProviderCtx);

  const contentData = useMemo(() => {
    const data = {
      welcome: pageData.welcome,
      seoInfo: pageData.seoInfo,
      howDoIt: pageData.howDoIt,
      howItWorks: pageData.howItWorks,
      howItWorksRedesign2: pageData.howItWorksRedesign2,
      getAppInfo: pageData.getAppInfo,
      faqList: pageData.faqList,
      faqListRedesign2: pageData.faqListRedesign2,
      explanations: pageData.explanations,
      tagsCloud: pageData.tagsCloud,
      footer: pageData.footer,
    };

    // if (loyaltyStore.loyaltyEnabled) {
    //   data = {
    //     ...data,
    //     welcome: pageData.welcome_loyalty,
    //     howDoIt: pageData.howDoIt_loyalty,
    //   };
    // }

    return data;
  }, [
    pageData.welcome,
    pageData.seoInfo,
    pageData.howDoIt,
    pageData.howItWorks,
    pageData.howItWorksRedesign2,
    pageData.getAppInfo,
    pageData.faqList,
    pageData.faqListRedesign2,
    pageData.explanations,
    pageData.tagsCloud,
    pageData.footer,
  ]);

  const renderWelcome = useCallback(() => {
    switch (themeName) {
      case THEME_NAME.REDESIGN:
        return <WelcomeRedesign {...contentData.welcome} />;
      case THEME_NAME.REDESIGN_1:
        return <WelcomeRd1 {...contentData.welcome} />;
      case THEME_NAME.REDESIGN_2:
        return <WelcomeRd2 {...contentData.welcome} />;
      case THEME_NAME.REDESIGN_3:
        return <WelcomeRd3 {...contentData.welcome} />;
      default:
        // return <WelcomeRedesign {...contentData.welcome} />;
        // return <WelcomeRd1 {...contentData.welcome} />;
        // return <WelcomeRd2 {...contentData.welcome} />;
        return <WelcomeRd3 {...contentData.welcome} />;
    }
  }, [contentData.welcome, themeName]);

  const renderHowItWorks = useCallback(() => {
    switch (themeName) {
      case THEME_NAME.REDESIGN_2:
        return <HowItWorksRd2 {...contentData.howItWorksRedesign2} />;
      default:
        return <HowItWorksRedesign {...contentData.howItWorks} />;
    }
  }, [contentData.howItWorks, contentData.howItWorksRedesign2, themeName]);

  const renderFaqAccordion = useCallback(() => {
    switch (themeName) {
      case THEME_NAME.REDESIGN_2:
        return (
          <AccordionWidgetRd2
            data={contentData.faqListRedesign2}
            exclusive={false}
            fluid
          />
        );
      default:
        return (
          <AccordionWidgetRedesign
            data={contentData.faqList}
            exclusive={false}
            fluid
          />
        );
    }
  }, [contentData.faqList, contentData.faqListRedesign2, themeName]);

  useEffect(() => {
    userStore.getClientStep();
  });

  return (
    <>
      {/* <WelcomeRedesign {...contentData.welcome} /> */}
      {renderWelcome()}
      <SeoInfo {...contentData.seoInfo} />
      <HowDoItRedesign {...contentData.howDoIt} />
      {/* <HowItWorksRedesign {...contentData.howItWorks} /> */}
      {renderHowItWorks()}
      <GetAppInfo {...contentData.getAppInfo} />

      <section className={styles.faq}>
        <div className={styles.content}>
          <div className={styles.faqWrap}>
            {/* <AccordionWidgetRedesign
              data={contentData.faqList}
              exclusive={false}
              fluid
            /> */}
            {renderFaqAccordion()}
          </div>
        </div>
      </section>

      <section className={styles.explanations}>
        <div className={styles.content}>
          <AccordionWidgetRedesign
            data={contentData.explanations}
            styleType={STYLETYPE.TRANSPARENT}
            exclusive={false}
            fluid
          />
        </div>
      </section>

      <section className={styles.anpcContainer}>
        <Anpc />
      </section>

      <section className={styles.tagsCloudContainer}>
        <TagsCloudWidget tagsList={contentData.tagsCloud} />
      </section>

      <section className={styles.footer}>
        <FooterRedesign
          {...contentData.footer.normal}
          className={classNames(styles.footer, {
            [styles.footerfloatPanelGap]: [THEME_NAME.REDESIGN_1].includes(
              themeName
            ),
            [styles.footerfloatPanelGap3]: [THEME_NAME.REDESIGN_3].includes(
              themeName
            ),
          })}
        />
      </section>

      <GoalpageStartFrame />
    </>
  );
}

export const MainPageRedesign = inject(STORE_IDS.LOYALTY_STORE)(
  MainPageRedesignComponent
);
