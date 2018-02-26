import React from 'react';
import { render } from 'react-dom';

import { AppContainer } from 'react-hot-loader';
import Root from 'src/components/Root';

const renderApp = () => render(
  <AppContainer><Root /></AppContainer>,
  document.getElementById('app')
);

renderApp();

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept();
}
