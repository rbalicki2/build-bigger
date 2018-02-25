import React, { Component } from 'react';

import fetchAutocompleteResults from 'src/services/autocomplete-service';
import queryString from 'query-string';

export default class AutocompleteWrapper extends Component {
  state = {
    qs: queryString.parse(location.search),
  };

  componentDidMount() {
    this.originalReplaceState = history.replaceState;
    history.replaceState = this.updateQueryString.bind(this, this.originalReplaceState);
    this.originalPushState = history.pushState;
    history.pushState = this.updateQueryString.bind(this, this.originalPushState);
  }

  componentWillUnmount() {
    history.replaceState = this.originalReplaceState;
    history.pushState = this.originalPushState;
  }

  updateQueryString = (method, ...args) => {
    method.call(history, ...args);
    this.setState({
      qs: queryString.parse(location.search),
    });
  }

  render() {
    return <Autocomplete {...this.state} />;
  }
}

class Autocomplete extends Component {
  state = {
    currentText: this.props.qs.searchText,
    autocompleteValues: [],
    currentId: 0,
    loading: false,
    visible: false,
  };

  componentWillReceiveProps(newProps) {
    this.setState({
      currentText: newProps.qs.searchText || '',
    }, this.fetchAutocomplete);
  }

  fetchAutocomplete = () => {
    const currentId = this.state.currentId + 1;
    const { currentText } = this.state;
    this.setState({
      currentId,
    }, () => {
      fetchAutocompleteResults(currentText)
        .then((arr) => {
          // Check if the currentId matches. Only update state if it does.
          if (currentId !== this.state.currentId) {
            return;
          }

          this.setState({
            autocompleteValues: arr,
            loading: false,
          });
        });
    });
  }

  updateText = ({ target: { value } }) => {
    this.setState({
      currentText: value || '',
      loading: true,
    }, this.fetchAutocomplete);
    const qs = {
      ...queryString.parse(location.search),
      searchText: value,
    };
    window.history.replaceState(null, null, `?${queryString.stringify(qs)}`);
  };

  render() {
    const { autocompleteValues, loading, visible } = this.state;
    const autocompleteRows = autocompleteValues.map(val => <li key={val}>{ val }</li>);
    const autocompleteSection = autocompleteValues.length > 0
      ? (<ul>{ autocompleteRows }</ul>)
      : <div>No results found!</div>;
    const autocompleteDiv = loading
      ? <div>Loading...</div>
      : autocompleteSection;
    const autocompleteContainer = (<div
      style={{
        width: 300,
        backgroundColor: '#FAFAFA',
        boxShadow: '0px 2px 4px 0px #EEE',
        padding: 20,
      }}
    >
      { autocompleteDiv }
    </div>);

    return (<div>
      <input
        type="text"
        value={this.state.currentText}
        onChange={this.updateText}
        onClick={() => this.setState({ visible: true })}
        onBlur={() => this.setState({ visible: false })}
      />
      { visible && autocompleteContainer }
    </div>);
  }
}
