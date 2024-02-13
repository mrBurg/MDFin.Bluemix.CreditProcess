import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { PrivacyPolicy } from '@components/sections/PrivacyPolicy';
import { TPrivacyPolicy } from '@components/sections/PrivacyPolicy/@types';

function PrivacyPolicyPage(props: TStores) {
  return <PrivacyPolicy {...(props.pageStore.pageData as TPrivacyPolicy)} />;
}

export default PrivacyPolicyPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'privacy-policy-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'privacy-policy-page',
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
