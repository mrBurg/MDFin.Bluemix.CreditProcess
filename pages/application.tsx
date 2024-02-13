import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi } from '@stores';
import { Application } from '@components/Application';

function ApplicationPage() {
  return <Application />;
}

export default ApplicationPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'application-page',
    path: 'template',
  });

  const loanInfoData = await staticApi.fetchStaticData({
    block: 'loan-info-form',
    path: 'form',
  });

  const dealData = await staticApi.fetchStaticData({
    block: 'deal-form',
    path: 'form',
  });

  const copyright = await staticApi.fetchStaticData({
    block: 'copyright',
    path: 'static',
  });

  return {
    props: {
      pageData: { copyright, ...loanInfoData, ...dealData },
      template,
      context,
    },
  };
};
