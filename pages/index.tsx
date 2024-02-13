import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { MainPage } from '@components/MainPage/MainPageDefault';
import { ServiceMessage } from '@components/ServiceMessage';

function IndexPage(props: TStores) {
  return (
    <>
      <ServiceMessage />
      <MainPage {...props} />
    </>
  );
}

export default IndexPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'main-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'main-page',
    path: 'static new',
  });

  const signUpPageData = await staticApi.fetchStaticData({
    block: 'sign-up-page',
    path: 'static',
  });

  const tagsCloud = await staticApi.fetchStaticData({
    block: 'main-page',
    path: 'tagsCloud',
  });

  // const copyright = await staticApi.fetchStaticData({
  //   block: 'copyright',
  //   path: 'static',
  // });

  // const footer = await staticApi.fetchStaticData({
  //   block: 'footer',
  //   path: 'static',
  // });

  return {
    props: {
      pageData: {
        ...pageData,
        ...signUpPageData,
        tagsCloud,
        // footer,
        // copyright,
      },
      template,
      context,
    },
  };
};
