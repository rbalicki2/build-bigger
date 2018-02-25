import React from 'react';

import { BrowserRouter, Route } from 'react-router-dom';

import HomePage from 'src/components/App/HomePage';
import AutocompletePage from 'src/components/App/AutocompletePage';

export default () => (
  <BrowserRouter>
    <div>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/autocomplete" component={AutocompletePage} />
    </div>
  </BrowserRouter>
);
