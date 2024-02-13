import React, { useContext, useEffect, useMemo } from 'react';
import { inject } from 'mobx-react';

import { STORE_IDS } from '@stores';
import {
  Welcome,
  SeoInfo,
  HowDoItRedesign,
  HowItWorksRedesign,
  GetAppInfo,
  Faq,
} from '@components/sections';
import { AccordionWidgetRedesign } from '@components/widgets/AccordionWidgetRedesign';
import { STYLETYPE } from '@components/widgets/AccordionWidgetRedesign/@types';
import { GoalpageStartFrame } from '@components/GoalpageFrame/GoalpageFrame';
import { MainPageCtx } from './MainPageContext';
import { Anpc } from '@components/Anpc';

import { TMainPageProps } from './@types';
import styles from './MainPage.module.scss';
import { TagsCloudWidget } from '@components/widgets/TagsCloudWidget';

function MainPageComponent(props: TMainPageProps) {
  const {
    pageStore: { pageData },
    userStore,
  } = props;

  const { setProductSelector } = useContext(MainPageCtx);

  const contentData = useMemo(() => {
    const data = {
      welcome: pageData.welcome,
      seoInfo: pageData.seoInfo,
      howDoIt: pageData.howDoIt,
      howItWorks: pageData.howItWorks,
      getAppInfo: pageData.getAppInfo,
      faqList: pageData.faqList,
      explanations: pageData.explanations,
      tagsCloud: pageData.tagsCloud,
      // footer: pageData.footer,
    };

    return data;
  }, [
    pageData.welcome,
    pageData.seoInfo,
    pageData.howDoIt,
    pageData.howItWorks,
    pageData.getAppInfo,
    pageData.faqList,
    pageData.explanations,
    pageData.tagsCloud,
  ]);

  useEffect(() => {
    const updateClientStep = async () => {
      //await userStore.updateUserState(); //не факт что нужно тут. Если не будет жалоб - удалить!
      await userStore.getClientStep(() => setProductSelector(true));
    };
    updateClientStep();
  }, [setProductSelector, userStore /*, userStore.userLoggedIn*/]);

  return (
    <>
      <Welcome {...contentData.welcome} />
      <SeoInfo {...contentData.seoInfo} />
      <HowDoItRedesign {...contentData.howDoIt} />
      <HowItWorksRedesign {...contentData.howItWorks} />
      <GetAppInfo {...contentData.getAppInfo} />
      <Faq {...contentData.faqList} />

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

      {/* <section className={styles.footer}>
        <FooterRedesign
          {...contentData.footer.normal}
          className={classNames(styles.footer, {
            [styles.footerfloatPanelGap]: [THEME_NAME.REDESIGN_1].includes(
              themeName
            ),
          })}
        />
      </section> */}

      <GoalpageStartFrame />
    </>
  );
}

export const MainPage = inject(STORE_IDS.LOYALTY_STORE)(MainPageComponent);
