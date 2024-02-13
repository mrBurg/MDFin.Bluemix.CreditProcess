import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { BonusPromotionYear } from '@components/promotions/BonusPromotionYear';
import { TBonusPromotionYear } from '@components/promotions/BonusPromotionYear/@types';

function BonusPromotionYearPage(props: TStores) {
  const {
    pageStore: { pageData },
  } = props;

  return <BonusPromotionYear {...(pageData as TBonusPromotionYear)} />;
}

export default BonusPromotionYearPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'bonus-promotion-year-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'bonus-promotion-year-page',
    path: 'static',
  });

  const copyright = await staticApi.fetchStaticData({
    block: 'copyright',
    path: 'static',
  });

  return {
    props: {
      pageData: {
        ...pageData,
        copyright,
      },
      template,
      context,
    },
  };
};
