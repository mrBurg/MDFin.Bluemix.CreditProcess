import React, { useEffect } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores, staticApi } from '@stores';
import { Preloader } from '@components/Preloader';

function StartPage(props: TStores) {
  const { userStore } = props;

  useEffect(() => {
    userStore.fetchWithAuthStartPage(async () => {
      await userStore.getClientNextStep();
    });
  }, [userStore]);

  return <Preloader />;
}

export default StartPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'start-page',
    path: 'template',
  });

  return {
    props: {
      template,
      context,
    },
  };
};
