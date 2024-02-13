import { inject } from 'mobx-react';
import React, { useContext, useEffect, useMemo } from 'react';

import { TMainPageProps } from './@types';
import {
  Explanations,
  HowDoIt,
  HowItWorks,
  FaqOld,
  Contacts,
  WelcomeOld,
  DrawResult,
  VendorStores,
  SeoInfoDefault,
} from '@components/sections';
import { Anpc } from '@components/Anpc';
import { STORE_IDS } from '@stores';
import { GoalpageStartFrame } from '@components/GoalpageFrame/GoalpageFrame';
import { MainPageCtx } from './MainPageContext';
import { TagsCloudWidget } from '@components/widgets/TagsCloudWidget';
import styles from './MainPage.module.scss';

function MainPageComponent(props: TMainPageProps) {
  const {
    pageStore: { pageData },
    userStore,
    loyaltyStore,
  } = props;

  const { setProductSelector } = useContext(MainPageCtx);

  const contentData = useMemo(() => {
    let data = {
      welcome: pageData.welcome,
      seoInfo: pageData.seoInfo,
      howDoIt: pageData.howDoIt,
      howItWorks: pageData.howItWorks,
      faqList: pageData.faqList,
      contactsData: pageData.contactsData,
      vendorStores: pageData.vendorStores,
      tagsCloud: pageData.tagsCloud,
      explanations: pageData.explanations,
    };

    if (loyaltyStore.loyaltyEnabled) {
      data = {
        ...data,
        welcome: pageData.welcome_loyalty,
      };
    }

    return data;
  }, [
    pageData.welcome,
    pageData.welcome_loyalty,
    pageData.seoInfo,
    pageData.howDoIt,
    pageData.howItWorks,
    pageData.faqList,
    pageData.contactsData,
    pageData.vendorStores,
    pageData.tagsCloud,
    pageData.explanations,
    loyaltyStore.loyaltyEnabled,
  ]);

  useEffect(() => {
    const updateClientStep = async () => {
      await userStore.updateUserState();
      await userStore.getClientStep(() => setProductSelector(true));
    };

    updateClientStep();
  }, [setProductSelector, userStore, userStore.userLoggedIn]);

  return (
    <>
      <WelcomeOld {...contentData.welcome} />
      <SeoInfoDefault {...contentData.seoInfo} />
      <HowDoIt {...contentData.howDoIt} />
      <HowItWorks {...contentData.howItWorks} />
      <DrawResult />
      <FaqOld {...contentData.faqList} />
      <Contacts {...contentData.contactsData} />
      <VendorStores {...contentData.vendorStores} />
      <section className={styles.tagsCloudContainer}>
        <TagsCloudWidget tagsList={contentData.tagsCloud} />
      </section>
      <Explanations {...contentData.explanations} />
      <section className={styles.anpcContainer}>
        <Anpc />
      </section>
      <GoalpageStartFrame />
    </>
  );
}

export const MainPage = inject(STORE_IDS.LOYALTY_STORE)(MainPageComponent);
