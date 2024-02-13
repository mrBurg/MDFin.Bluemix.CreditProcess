import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { observer } from 'mobx-react';

import { staticApi, TStores } from '@stores';
import { RepaymentInfo } from '@components/sections';
import { gt } from '@utils';
import { WithPageContainer } from '@components/hocs/WithPageContainer';

function PaymentPage(props: TStores) {
  const {
    pageStore: {
      pageData: { pageTitle, repaymentInfo, bankAccounts },
    },
  } = props;

  return (
    <WithPageContainer>
      <h2 className="page-title">{gt.gettext(pageTitle)}</h2>
      <RepaymentInfo bankAccounts={bankAccounts} dataList={repaymentInfo} />
    </WithPageContainer>
  );
}

export default observer(PaymentPage);

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'repayment-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'repayment-page',
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
