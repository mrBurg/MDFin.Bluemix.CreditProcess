import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { HollydaysHappyDraw } from '@components/promotions/HollydaysHappyDraw';

function HollydaysHappyDrawPage(props: TStores) {
  const {
    pageStore: { pageData, copyright },
  } = props;

  return (
    <HollydaysHappyDraw
      pageData={{
        ...pageData,
        copyright,
      }}
    />
  );
}

export default HollydaysHappyDrawPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'hollydays-happy-draw-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'hollydays-happy-draw-page',
    path: 'static',
  });

  /* const usersWinners = await staticApi.fetchStaticData({
    block: 'hollydays-happy-draw-page',
    path: 'winners',
  }); */

  const copyright = await staticApi.fetchStaticData({
    block: 'copyright',
    path: 'static',
  });

  return {
    props: {
      pageData: {
        copyright,
        //...usersWinners,
        ...pageData,
      },
      template,
      context,
    },
  };
};
