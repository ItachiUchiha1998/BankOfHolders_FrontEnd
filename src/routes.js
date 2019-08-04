import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
    return <span className="theme-text-h4">Loading ...</span>;
}

const Agreements = Loadable({
    loader: () => import('./views/Base/Agreements'),
    loading: Loading,
});

const Requests = Loadable({
    loader: () => import('./views/Requests'),
    loading: Loading,
});

const Dashboard = Loadable({
    loader: () => import('./views/Dashboard'),
    loading: Loading,
});

const Wallet = Loadable({
    loader: () => import('./views/Wallet'),
    loading: Loading,
});

const Bitcoin = Loadable({
    loader: () => import('./views/Coin/Bitcoin'),
    loading: Loading,
});

const TrueUSD = Loadable({
    loader: () => import('./views/Coin/TrueUSD'),
    loading: Loading,
});

const Ethereum = Loadable({
    loader: () => import('./views/Coin/Ethereum'),
    loading: Loading,
});

const Users = Loadable({
    loader: () => import('./views/Users/Users'),
    loading: Loading,
});

const User = Loadable({
    loader: () => import('./views/Users/User'),
    loading: Loading,
});

const routes = [
    {path: '/', exact: true, name: 'Home', component: DefaultLayout},
    {path: '/dashboard', name: 'Dashboard', component: Dashboard},
    {path: '/wallet', name: 'Wallet', component: Wallet},
    {path: '/coin/bitcoin', name: 'Bitcoin', component: Bitcoin},
    {path: '/coin/ethereum', name: 'Ethereum', component: Ethereum},
    {path: '/coin/trueusd', name: 'TrueUSD', component: TrueUSD},
    {path: '/agreements', name: 'Agreements', component: Agreements},
    {path: '/requests', name: 'Requests', component: Requests},
    {path: '/borrow-len', exact: true, name: 'Users', component: Users},
    {path: '/users/:id', exact: true, name: 'User Details', component: User},
];

export default routes;
