import React from 'react';
import { GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { MainPageRedesign } from '@components/MainPage/MainPageRedesign';

function RedesignPage(props: TStores) {
  return <MainPageRedesign {...props} />;
}

export default RedesignPage;

export async function getStaticProps(context: GetStaticPropsContext) {
  const template = await staticApi.fetchStaticData({
    block: 'redesign-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'redesign-page',
    path: 'static',
  });

  const signUpPageData = await staticApi.fetchStaticData({
    block: 'sign-up-page',
    path: 'static',
  });

  const tagsCloud = await staticApi.fetchStaticData({
    block: 'main-page',
    path: 'tagsCloud',
  });

  const footer = await staticApi.fetchStaticData({
    block: 'footer',
    path: 'static',
  });

  return {
    // notFound: true, // для блокировки страницы
    props: {
      pageData: {
        ...pageData,
        ...signUpPageData,
        tagsCloud,
        footer,
      },
      template,
      context,
    },
  };
}
