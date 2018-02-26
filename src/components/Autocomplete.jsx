import React, { Component } from 'react';
import fetchAutocompleteResults from 'src/services/autocomplete-service';
import queryString from 'query-string';
import { Input, ResultsContainer, OuterContainer, List } from './AutocompleteSubcomponents';

class QueryParamProvider extends Component {
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
    return this.props.children(this.state.qs);
  }
}

export default () => (<QueryParamProvider>{({ searchText }) =>
  <Autocomplete searchText={searchText} />
}</QueryParamProvider>);

class Autocomplete extends Component {
  state = {
    autocompleteValues: [],
    currentRequestId: 0,
    loading: false,
    visible: !!this.props.searchText,
  };

  componentDidMount() {
    if (this.props.searchText) {
      this.fetchAutocomplete(this.props.searchText);
    }
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillReceiveProps(newProps) {
    // synchronize our local state with what was provided to us, if its different
    // and make the box visible
    if (newProps.searchText !== this.props.searchText) {
      this.fetchAutocomplete(newProps.searchText);
    }
    this.isUpdatingVisibility = true;
    this.setState({
      visible: true,
    });
    setTimeout(() => {
      this.isUpdatingVisibility = false;
    });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick = (e) => {
    // if we are clicking on the rest of the document, we want to
    // hide the dropdown

    // N.B. We need this.isUpdatingVisibility because handleDocumentClick
    // is called after componentWillReceiveProps, and don't want to override
    // the setState({ visible: true })
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
    const currentRequestId = this.state.currentRequestId + 1;
    this.setState({
      currentRequestId,
      loading: true,
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

  updateText = ({ target: { value } }) => {
    const qs = {
      ...queryString.parse(location.search),
      searchText: value,
    };
    window.history.replaceState(null, null, `?${queryString.stringify(qs)}`);
  };

  get autocompleteContainer() {
    const { autocompleteValues, loading } = this.state;
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
      onChange={this.updateText}
      onBlur={() => this.setState({ visible: false })}
      onFocus={() => this.setState({ visible: true })}
      innerRef={(el) => { this.inputEl = el; }}
    />);
  }

  render() {
    const { visible } = this.state;
    return (<OuterContainer>
      { this.autocompleteInput }
      { visible && this.autocompleteContainer }
    </OuterContainer>);
  }
}
