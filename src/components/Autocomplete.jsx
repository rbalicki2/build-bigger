import React, { Component } from 'react';
import fetchAutocompleteResults from 'src/services/autocomplete-service';
import queryString from 'query-string';
import { Input, ResultsContainer, OuterContainer, List } from './AutocompleteSubcomponents';

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
    autocompleteValues: [],
    currentRequestId: 0,
    loading: false,
    visible: !!this.props.searchText,
  };

  fetchAutocomplete = (searchText) => {
    const currentRequestId = this.state.currentRequestId + 1;
    this.isUpdatingVisibility = true;
    this.setState({
      currentRequestId,
      loading: true,
      visible: true,
    });
    setTimeout(() => {
      this.isUpdatingVisibility = false;
    });
    fetchAutocompleteResults(searchText)
      .then((arr) => {
        // N.B. Check if the currentRequestId matches. Only update state if it does.
        if (currentRequestId !== this.state.currentRequestId) {
          return;
        }

        this.setState({
          autocompleteValues: arr,
          loading: false,
        });
      });
  }

  updateVisibility = (visible) => {
    if (!this.isUpdatingVisibility) {
      this.setState({
        visible,
      });
    }
  }

  render() {
    return (<QueryParamProvider
      query="searchText"
      onQueryValueChange={this.fetchAutocomplete}
    >
      {
        (searchText, updateSearchText) =>
          (<Autocomplete
            searchText={searchText}
            updateSearchText={updateSearchText}
            loading={this.state.loading}
            visible={this.state.visible}
            setVisible={this.updateVisibility}
            autocompleteValues={this.state.autocompleteValues}
          />)
      }
    </QueryParamProvider>);
  }
}

class Autocomplete extends Component {
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
        && this.props.visible
    ) {
      this.props.setVisible(false);
    }
  };

  get autocompleteContainer() {
    const { autocompleteValues, loading } = this.props;
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
  }

  get autocompleteInput() {
    return (<Input
      placeholder="Search for movies, or something"
      type="text"
      value={this.props.searchText}
      onChange={({ target: { value } }) => this.props.updateSearchText(value)}
      onBlur={() => this.props.setVisible(false)}
      onFocus={() => this.props.setVisible(true)}
      innerRef={(el) => { this.inputEl = el; }}
    />);
  }

  render() {
    const { visible } = this.props;
    return (<OuterContainer>
      { this.autocompleteInput }
      { visible && this.autocompleteContainer }
    </OuterContainer>);
  }
}
