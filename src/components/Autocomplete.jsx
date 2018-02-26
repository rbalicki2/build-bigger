import React, { Component } from 'react';
import fetchAutocompleteResults from 'src/services/autocomplete-service';
import queryString from 'query-string';
import { Input, ResultsContainer, OuterContainer, List } from './AutocompleteSubcomponents';
import PromiseUnwrapper from './PromiseUnwrapper';

const POP_STATE_EVENT = 'popstate';
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
    window.addEventListener(POP_STATE_EVENT, this.updateQueryValueInState);
  }

  componentWillUnmount() {
    history.replaceState = this.originalReplaceState;
    history.pushState = this.originalPushState;
    window.removeEventListener(POP_STATE_EVENT, this.updateQueryValueInState);
  }

  updateQueryString = (method, ...args) => {
    method.call(history, ...args);
    this.updateQueryValueInState();
  }

  setQueryValue = (newVal, method = 'replaceState') => {
    const newQueries = {
      ...queryString.parse(location.search),
      [this.props.query]: newVal,
    };
    history[method](null, null, `?${queryString.stringify(newQueries)}`);
  };

  updateQueryValueInState = () => {
    const newValue = queryString.parse(location.search)[this.props.query];
    if (this.state.queryValue !== newValue) {
      this.setState({
        queryValue: newValue,
      }, () => this.props.onQueryValueChange(newValue));
    }
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
        // && !this.state.isFetchingAutocomplete
    ) {
      this.setState({ visible: false });
    }
  };

  fetchAutocomplete = (searchText) => {
    // N.B. There is an outstanding issue. handleDocumentClick is executed
    // after fetchAutocomplete. It sets the staet `visible: false`, thus causing
    // the autocompleteContainer to incorrectly hide.

    // Solution 1: use a requestAnimationFrame
    requestAnimationFrame(() => {
      this.setState({
        autocompletePromise: fetchAutocompleteResults(searchText),
        visible: true,
      });
    });

    // Solution 2: use a flag and avoid setting visible: false in handleDocumentClick
    // this.setState({
    //   autocompletePromise: fetchAutocompleteResults(searchText),
    //   visible: true,
    //   isFetchingAutocomplete: true,
    // });
    // setTimeout(() => {
    //   this.setState({
    //     isFetchingAutocomplete: false,
    //   });
    // });
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
