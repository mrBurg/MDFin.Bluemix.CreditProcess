import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { HotSummerDraw } from '@components/promotions/HotSummerDraw';

function HotSummerDrawPage(props: TStores) {
  const {
    pageStore: { pageData },
  } = props;

  return <HotSummerDraw pageData={pageData} />;
}

export default HotSummerDrawPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'hot-summer-draw-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'hot-summer-draw-page',
    path: 'static',
  });

  const usersWinners = await staticApi.fetchStaticData({
    block: 'reminder',
    path: 'hot-summer-draw-page-result',
  });

  const copyright = await staticApi.fetchStaticData({
    block: 'copyright',
    path: 'static',
  });

  return {
    props: {
      pageData: {
        copyright,
        ...usersWinners,
        ...pageData,
      },
      template,
      context,
    },
  };
};
