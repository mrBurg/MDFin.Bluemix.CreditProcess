import React, { useEffect } from 'react';

import { Preloader } from '@components/Preloader';
import { TStores } from '@stores';

function Router(props: TStores) {
  const { userStore } = props;

  useEffect(() => {
    userStore.getClientNextStep();
  }, [userStore]);

  return <Preloader />;
}

export { Router };
