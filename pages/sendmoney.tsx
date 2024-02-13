import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { Sendmoney } from '@components/Sendmoney';

function SendmoneyPage(props: TStores) {
  return <Sendmoney {...props} />;
}

export default SendmoneyPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'sendmoney-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'sendmoney-page',
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
