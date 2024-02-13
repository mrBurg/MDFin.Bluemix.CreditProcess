import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { TAboutLoanProps } from '@components/sections/AboutLoan/@types';
import { AboutLoan } from '@components/sections/AboutLoan';

function AboutLoanPage(props: TStores) {
  const { pageStore } = props;

  return <AboutLoan {...(pageStore.pageData as TAboutLoanProps)} />;
}

export default AboutLoanPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'about-loan-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'about-loan-page',
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
