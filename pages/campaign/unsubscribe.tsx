import React, { useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';

import { staticApi, TStores } from '@stores';
import { FullpageNotification } from '@components/FullpageNotification';
import { TUnsubscribe } from '@stores-types/userStore';
import { Preloader } from '@components/Preloader';

function Unsubscribe(props: TStores) {
  const { pageStore, userStore } = props;
  const [data, setData] = useState('');
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      setData(
        await userStore.unsubscribe(
          pageStore.pageData as TUnsubscribe,
          router.query
        )
      );
    };

    init();
  }, [pageStore.pageData, router.query, userStore]);

  if (data) {
    return <FullpageNotification text={data} />;
  }

  return <Preloader />;
}

export default Unsubscribe;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const pageData = await staticApi.fetchStaticData({
    block: 'unsubscribe-page',
    path: 'static',
  });

  const copyright = await staticApi.fetchStaticData({
    block: 'copyright',
    path: 'static',
  });

  return {
    props: {
      pageData: { copyright, ...pageData },
      context,
    },
  };
};
