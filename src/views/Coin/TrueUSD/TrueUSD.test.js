import React from 'react';
import TrueUSD from './TrueUSD';
import { shallow } from 'enzyme'

it('renders without crashing', () => {
  shallow(<TrueUSD />);
});
