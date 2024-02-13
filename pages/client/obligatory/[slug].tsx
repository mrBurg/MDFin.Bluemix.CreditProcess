import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { Obligatory } from '@components/client';

function ObligatoryPage(props: TStores) {
  return <Obligatory {...props} />;
}

export default ObligatoryPage;

export async function getStaticPaths() {
  return {
    paths: [{ params: { slug: 'check' } }],
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  // const { params } = context;
  // let slug = '';

  // if (params && params.slug) {slug = `-${params.slug}`;}

  const template = await staticApi.fetchStaticData({
    block: 'obligatory-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    // block: `obligatory-page${slug}`,
    block: 'obligatory-page',
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
