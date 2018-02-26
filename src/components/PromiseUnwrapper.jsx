import { Component } from 'react';

export default class PromiseUnwrapper extends Component {
  state = {
    loading: undefined,
    value: undefined,
    error: undefined,
    currentPromiseVersion: 0,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.promise !== this.props.promise) {
      const { currentPromiseVersion } = this.state;
      this.setState({
        currentPromiseVersion: currentPromiseVersion + 1,
        loading: true,
        value: undefined,
        error: undefined,
      });

      newProps.promise.then((value) => {
        if (currentPromiseVersion + 1 === this.state.currentPromiseVersion) {
          this.setState({
            loading: false,
            value,
          });
        }
      }, (error) => {
        if (currentPromiseVersion + 1 === this.state.currentPromiseVersion) {
          this.setState({
            loading: false,
            error,
          });
        }
      });
    }
  }

  render() {
    const { loading, value, error } = this.state;
    return this.props.children(loading, value, error);
  }
}
