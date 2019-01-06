import React from 'react';
import ReactDOM from 'react-dom';
import Agreements from './Agreements';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Agreements />, div);
  ReactDOM.unmountComponentAtNode(div);
});
