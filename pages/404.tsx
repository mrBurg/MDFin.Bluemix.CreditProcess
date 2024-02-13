import React from 'react';
import { GetStaticPropsContext, GetStaticProps } from 'next';
import Head from 'next/head';

import cfg from '@root/config.json';
import { staticApi, TStores } from '@stores';
import { Error404Page } from '@components/Error404Page';

function NotFound(props: TStores) {
  return (
    <>
      <Head>
        <title>{`${cfg.siteName} | 404`}</title>
      </Head>
      <Error404Page {...props} />
    </>
  );
}

export default NotFound;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'page-404',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'page-404',
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
