import React, { Component } from 'react';
import fetchAutocompleteResults from 'src/services/autocomplete-service';
import queryString from 'query-string';
import { Input, ResultsContainer, OuterContainer, List } from './AutocompleteSubcomponents';
import PromiseUnwrapper from './PromiseUnwrapper';

class QueryParamProvider extends Component {
  state = {
    queryValue: queryString.parse(location.search)[this.props.query],
  };

  componentDidMount() {
    this.originalReplaceState = history.replaceState;
    history.replaceState = this.updateQueryString.bind(this, this.originalReplaceState);
    this.originalPushState = history.pushState;
    history.pushState = this.updateQueryString.bind(this, this.originalPushState);
    this.props.onQueryValueChange(this.state.queryValue);
  }

  componentWillUnmount() {
    history.replaceState = this.originalReplaceState;
    history.pushState = this.originalPushState;
  }

  updateQueryString = (method, ...args) => {
    method.call(history, ...args);
    const newValue = queryString.parse(location.search)[this.props.query];
    if (this.state.queryValue !== newValue) {
      this.setState({
        queryValue: newValue,
      }, () => this.props.onQueryValueChange(newValue));
    }
  }

  setQueryValue = (newVal, method = 'replaceState') => {
    const newQueries = {
      ...queryString.parse(location.search),
      [this.props.query]: newVal,
    };
    history[method](null, null, `?${queryString.stringify(newQueries)}`);
  };

  render() {
    return this.props.children(this.state.queryValue, this.setQueryValue);
  }
}

export default class AutocompleteStateHandler extends Component {
  state = {
    visible: !!this.props.searchText,
  };

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick = (e) => {
    // if we are clicking on the rest of the document, we want to
    // hide the dropdown
    if (
      this.inputEl
        && e.target !== this.inputEl
        && this.state.visible
        && !this.isUpdatingVisibility
    ) {
      this.setState({ visible: false });
    }
  };

  fetchAutocomplete = (searchText) => {
    this.isUpdatingVisibility = true;
    this.setState({
      autocompletePromise: fetchAutocompleteResults(searchText),
      visible: true,
    });
    setTimeout(() => {
      this.isUpdatingVisibility = false;
    });
  }

  render() {
    return (<QueryParamProvider
      query="searchText"
      onQueryValueChange={this.fetchAutocomplete}
    >
      {
        (searchText, updateSearchText) =>
          (<PromiseUnwrapper promise={this.state.autocompletePromise}>
            {
              (loading, autocompleteValues = []) =>
                (<Autocomplete
                  searchText={searchText}
                  updateSearchText={updateSearchText}
                  loading={loading}
                  visible={this.state.visible}
                  setVisible={visible => this.setState({ visible })}
                  autocompleteValues={autocompleteValues}
                  inputRef={(el) => { this.inputEl = el; }}
                />)
            }
          </PromiseUnwrapper>)
      }
    </QueryParamProvider>);
  }
}

const Autocomplete = ({
  setVisible,
  autocompleteValues,
  loading,
  visible,
  inputRef,
  searchText,
  updateSearchText,
}) => {
  const autocompleteContainer = (() => {
    const autocompleteRows = autocompleteValues.map(val => <li key={val}>{ val }</li>);
    const autocompleteSection = autocompleteValues.length > 0
      ? (<List>{ autocompleteRows }</List>)
      : <List><li>No results found!</li></List>;
    const autocompleteDiv = loading
      ? <List><li>Loading...</li></List>
      : autocompleteSection;
    return (<ResultsContainer>
      { autocompleteDiv }
    </ResultsContainer>);
  })();

  const autocompleteInput = (<Input
    placeholder="Search for movies, or something"
    type="text"
    value={searchText}
    onChange={({ target: { value } }) => updateSearchText(value)}
    onBlur={() => setVisible(false)}
    onFocus={() => setVisible(true)}
    innerRef={inputRef}
  />);

  return (<OuterContainer>
    { autocompleteInput }
    { visible && autocompleteContainer }
  </OuterContainer>);
};
