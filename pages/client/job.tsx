import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { Job } from '@components/client';
import { WithPageContainer } from '@components/hocs/WithPageContainer';

function JobPage(props: TStores) {
  const {
    pageStore: { pageData },
  } = props;

  return (
    <WithPageContainer>
      <Job staticData={pageData} {...props} />
    </WithPageContainer>
  );
}

export default JobPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'job-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'job-page',
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
