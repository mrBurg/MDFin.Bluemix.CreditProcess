import React from 'react';

import { TStores } from '@stores';
import { LeadLogin } from '@components/LeadLogin';

function ValidateLeadRedirect(props: TStores) {
  return <LeadLogin {...props} />;
}

export default ValidateLeadRedirect;
