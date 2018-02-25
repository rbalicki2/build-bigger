import React from 'react';

import { Link } from 'react-router-dom';
import Autocomplete from './Autocomplete';

export default () => (<div style={{ maxWidth: 800, margin: '50px auto' }}>
  <div style={{ textAlign: 'center' }}>
    <h1>Autocomplete Stage 0</h1>
    <h2>One long file</h2>
    <h3>Tag: v0</h3>
  </div>
  <div>
    Well known searches:
    <div><Link to="/autocomplete?searchText=Don">Don</Link></div>
    <div><Link to="/autocomplete?searchText=Jason">Jason</Link></div>
    <div><Link to="/autocomplete?searchText=Batman">Batman</Link></div>
    <div><Link to="/autocomplete?searchText=Iceman">Iceman</Link></div>
    <div><Link to="/autocomplete?searchText=Rick">Rick</Link></div>
    <div><Link to="/autocomplete?searchText=Harry">Harry</Link></div>
  </div>
  <Autocomplete />
</div>);
