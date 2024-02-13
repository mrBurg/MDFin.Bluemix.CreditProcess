import React, { useEffect, useState } from 'react';

import { staticApi, TStores } from '@stores';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { GetStaticProps, GetStaticPropsContext } from 'next';

function DevPage(props: TStores) {
  const [state, setstate] = useState(<div>{Math.random()}</div>);

  useEffect(() => {
    setstate(<div>{Math.random()}</div>);
  }, []);

  return (
    <WithPageContainer>
      {state}
      <div>{JSON.stringify(props)}</div>
    </WithPageContainer>
  );
}

export default DevPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const copyright = await staticApi.fetchStaticData({
    block: 'copyright',
    path: 'static',
  });

  return {
    props: {
      pageData: { copyright },
      context,
    },
  };
};
