import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { VespaContest } from '@components/promotions/VespaContest';

function VespaContestPage(props: TStores) {
  const {
    pageStore: { pageData, copyright },
  } = props;

  return (
    <VespaContest
      pageData={{
        ...pageData,
        copyright,
      }}
    />
  );
}

export default VespaContestPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'vespa-contest-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'vespa-contest-page',
    path: 'static',
  });

  const usersWinners = await staticApi.fetchStaticData({
    block: 'vespa-contest-page',
    path: 'winners',
  });

  const copyright = await staticApi.fetchStaticData({
    block: 'copyright',
    path: 'static',
  });

  return {
    props: {
      pageData: {
        ...usersWinners,
        ...pageData,
        copyright,
      },
      template,
      context,
    },
  };
};
