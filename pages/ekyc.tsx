import React from 'react';
import { Ekyc } from '@components/Ekyc';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi } from '@stores';

function EkycPage() {
  return <Ekyc />;
}

export default EkycPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'ekyc-page',
    path: 'template',
  });

  /* const pageData = await staticApi.fetchStaticData({
    block: 'ekyc-page',
    path: 'static',
  }); */

  const copyright = await staticApi.fetchStaticData({
    block: 'copyright',
    path: 'static',
  });

  return {
    props: {
      pageData: { copyright /* ...pageData */ },
      template,
      context,
    },
  };
};
