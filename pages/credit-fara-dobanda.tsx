import React from 'react';
import { TStores, staticApi } from '@stores';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { PromoPageContent } from '@components/PromoPageContent';
import { TPromoPageContent } from '@components/PromoPageContent/@types';

function CreditFaraDobandaPage(props: TStores) {
  const {
    pageStore: { pageData },
  } = props;

  return <PromoPageContent {...(pageData as TPromoPageContent)} />;
}

export default CreditFaraDobandaPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'credit-fara-dobanda-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'credit-fara-dobanda-page',
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