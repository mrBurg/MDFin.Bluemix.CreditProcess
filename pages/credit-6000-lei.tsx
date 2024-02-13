import React from 'react';
import { TStores, staticApi } from '@stores';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { PromoPageContent } from '@components/PromoPageContent';
import { TPromoPageContent } from '@components/PromoPageContent/@types';

function Credit6000LeiPage(props: TStores) {
  const {
    pageStore: { pageData },
  } = props;

  return <PromoPageContent {...(pageData as TPromoPageContent)} />;
}

export default Credit6000LeiPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'credit-6000-lei-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'credit-6000-lei-page',
    path: 'static',
  });

  return {
    props: {
      pageData: { ...pageData },
      template,
      context,
    },
  };
};
