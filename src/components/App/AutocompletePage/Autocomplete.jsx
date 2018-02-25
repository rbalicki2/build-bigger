import React, { Component } from 'react';

import fetchAutocompleteResults from 'src/services/autocomplete-service';

export default class Autocomplete extends Component {
  state = {
    currentText: '',
    autocompleteValues: [],
    currentId: 0,
    loading: false,
    visible: false,
  };

  updateText = ({ target: { value } }) => {
    const currentId = this.state.currentId + 1;
    this.setState({
      currentText: value,
      currentId,
      loading: true,
    });
    fetchAutocompleteResults(value)
      .then((arr) => {
        // Check if the currentId matches. Only update state if it does.
        if (currentId !== this.state.currentId) {
          return;
        }

        this.setState({
          autocompleteValues: arr,
          loading: false,
        });
      })
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
    const autocompleteContainer = (<div style={{
      width: 300,
      backgroundColor: '#FAFAFA',
      boxShadow: '0px 2px 4px 0px #EEE',
      padding: 20,
    }}>
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