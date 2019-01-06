import React from 'react';
import ReactDOM from 'react-dom';
import Requests from './Requests';

jest.mock('react-chartjs-2', () => ({
  Line: () => null,
  Polar: () => null,
  Pie: () => null,
  Radar: () => null,
  Bar: () => null,
  Doughnut: () => null,
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Requests />, div);
  ReactDOM.unmountComponentAtNode(div);
});