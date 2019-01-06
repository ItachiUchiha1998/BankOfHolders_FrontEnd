import React from 'react';
import ReactDOM from 'react-dom';
import ActivateAccount from './ActivateAccount';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ActivateAccount />, div);
  ReactDOM.unmountComponentAtNode(div);
});
