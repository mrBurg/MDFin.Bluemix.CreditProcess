import React from 'react';
import { TStores, staticApi } from '@stores';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { PromoPageContent } from '@components/PromoPageContent';
import { TPromoPageContent } from '@components/PromoPageContent/@types';

function CreditOnlineUrgentPage(props: TStores) {
  const {
    pageStore: { pageData },
  } = props;

  return <PromoPageContent {...(pageData as TPromoPageContent)} />;
}

export default CreditOnlineUrgentPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'credit-online-urgent-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'credit-online-urgent-page',
    path: 'static',
  });

  const copyright = await staticApi.fetchStaticData({
    block: 'copyright',
    path: 'static',
  });

  return {
    props: {
      pageData: { copyright, ...pageData },
      template,
      context,
    },
  };
};
