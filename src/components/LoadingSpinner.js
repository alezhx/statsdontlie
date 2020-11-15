import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const LoadingSpinner = ({active}) => (
  <Dimmer active={active} page>
    <Loader />
  </Dimmer>
)

export default LoadingSpinner
