import React, { useEffect, useState } from 'react';
import size from 'lodash/size';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';

import { staticApi, TStores } from '@stores';
import { FullpageNotification } from '@components/FullpageNotification';
import { TValidateEmail } from '@stores-types/userStore';
import { Preloader } from '@components/Preloader';

function ValidateEmail(props: TStores) {
  const { pageStore, userStore } = props;
  const [data, setData] = useState('');
  const router = useRouter();

  // /campaign/validate_email?e=9297&uuid=e58e6c040928d05a6ee993223378fd39bc9f84c94717cef6886261735aa99a81&utm_source=EMAIL_ADDRESS_VERIFICATION&utm_medium=email&utm_campaign=05.07.2023

  useEffect(() => {
    const init = async () => {
      const result = await userStore.validateEmail(
        pageStore.pageData as TValidateEmail,
        router.query
      );

      setData(result);
    };

    if (size(router.query)) {
      init();
    }
  }, [pageStore.pageData, router.query, userStore]);

  if (data) {
    return <FullpageNotification text={data} />;
  }

  return <Preloader />;
}

export default ValidateEmail;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const pageData = await staticApi.fetchStaticData({
    block: 'validate-email-page',
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
