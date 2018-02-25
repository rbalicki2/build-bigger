import React from 'react';

import { Link } from 'react-router-dom';

export default () => (<div style={{ maxWidth: 800, margin: '50px auto' }}>
  <h1 style={{ textAlign: 'center' }}>Building Bigger By Building Smaller</h1>
  <div>
    You can:
    <ul>
      <li><a href="/presentation">View the presentation</a></li>
      <li><a href="https://github.com/rbalicki2/build-bigger">View the repository</a></li>
      <li><Link to="/autocomplete">View the autocomplete widget</Link></li>
    </ul>
  </div>
</div>);
