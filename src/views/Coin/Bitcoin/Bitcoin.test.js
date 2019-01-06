import React from 'react';
import Bitcoin from './Bitcoin';
import { shallow } from 'enzyme'

it('renders without crashing', () => {
  shallow(<Bitcoin />);
});
