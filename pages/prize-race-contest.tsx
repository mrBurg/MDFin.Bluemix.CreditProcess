import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { PrizeRaceContest } from '@components/promotions/PrizeRaceContest';

function PrizeRaceContestPage(props: TStores) {
  const {
    pageStore: { pageData, copyright },
  } = props;

  return (
    <PrizeRaceContest
      pageData={{
        ...pageData,
        copyright,
      }}
    />
  );
}

export default PrizeRaceContestPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'prize-race-contest-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'prize-race-contest-page',
    path: 'static',
  });

  const usersWinners = await staticApi.fetchStaticData({
    block: 'prize-race-contest-page',
    path: 'winners',
  });

  const copyright = await staticApi.fetchStaticData({
    block: 'copyright',
    path: 'static',
  });

  return {
    props: {
      pageData: {
        copyright,
        ...usersWinners,
        ...pageData,
      },
      template,
      context,
    },
  };
};
