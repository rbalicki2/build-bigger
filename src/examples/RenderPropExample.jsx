/* eslint-disable */
import React, { Component } from 'react';

const router = {
  push: () => {},
};

// Simplified HOC example
const withRouter = (EnhancedComponent) =>
  class WithRouter extends Component {
    render() {
      return (<EnhancedComponent
        {...this.props}
        router={router}
      />);
    }
  };

// Usage:
const ExistingComponent = ({ router }) => (
  <div onClick={() => router.push('/home')}>
    Go home
  </div>
);
const ExistingComponentWithRouter = withRouter(
  ExistingComponent
);


// Render prop example
const RouterProvider = ({ children }) =>
  children(router);

// Usage:
<RouterProvider>{router => 
  (<div onClick={() => router.push('/home')}>
    Go home
  </div>)
}</RouterProvider>