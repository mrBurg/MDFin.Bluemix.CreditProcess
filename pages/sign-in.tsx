import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { staticApi } from '@stores';
import { Authorization } from '@components/Authorization';
import { URIS_SUFFIX } from '@src/constants';
import { WithPageContainer } from '@components/hocs/WithPageContainer';

function SignInPage() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <WithPageContainer>
        <Authorization page={URIS_SUFFIX.SIGN_IN} />
      </WithPageContainer>
    </>
  );
}

export default SignInPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'sign-in-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'sign-in-page',
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
