import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { Documents } from '@components/client';

function DocumentsPage(props: TStores) {
  return <Documents staticData={props.pageStore.pageData} {...props} />;
}

export default DocumentsPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'documents-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'documents-page',
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
