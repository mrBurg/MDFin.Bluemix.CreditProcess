import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import { TLeadLoginProps } from './@types';
import { Preloader } from '@components/Preloader';
import { TValidateLead } from '@stores-types/userStore';
import size from 'lodash/size';

function LeadLogin(props: TLeadLoginProps) {
  const router = useRouter();

  const fp = useMemo(() => {
    if (props.userStore.fingerprint) {
      return props.userStore.fingerprint.visitorId;
    }
  }, [props.userStore.fingerprint]);

  useEffect(() => {
    if (size(router.query) && fp) {
      props.userStore.leadLogin(router.query as TValidateLead);
    }
  }, [fp, props.userStore, router.query]);

  return <Preloader />;
}

export { LeadLogin };
