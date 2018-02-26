import React, { Component } from 'react';
import fetchAutocompleteResults from 'src/services/autocomplete-service';
import queryString from 'query-string';
import { Input, ResultsContainer, OuterContainer, List } from './AutocompleteSubcomponents';

const addQueryParams = InnerComponent =>
  class QueryParamSetter extends Component {
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
      return <InnerComponent {...this.props} {...this.state} />;
    }
  };

class Autocomplete extends Component {
  state = {
    searchText: this.props.qs.searchText,
    autocompleteValues: [],
    currentRequestId: 0,
    loading: false,
    visible: !!this.props.qs.searchText,
  };

  componentDidMount() {
    if (this.state.searchText) {
      this.fetchAutocomplete();
    }
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillReceiveProps(newProps) {
    // synchronize our local state with what was provided to us, if its different
    // and make the box visible
    if (newProps.qs.searchText !== this.state.searchText) {
      this.setState({
        searchText: newProps.qs.searchText || '',
      }, this.fetchAutocomplete);
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

  fetchAutocomplete = () => {
    const currentRequestId = this.state.currentRequestId + 1;
    const { searchText } = this.state;
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
    this.setState({
      searchText: value || '',
    }, () => {
      this.fetchAutocomplete();
      // N.B. we need to wait until the searchText has been committed to state,
      // because otherwise the check in componentWillReceiveProps will be incorrect,
      // and we will call fetchAutocomplete twice!
      window.history.replaceState(null, null, `?${queryString.stringify(qs)}`);
    });
    const qs = {
      ...queryString.parse(location.search),
      searchText: value,
    };
    // N.B. will not work here:
    // window.history.replaceState(null, null, `?${queryString.stringify(qs)}`);
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

  render() {
    const { visible } = this.state;
    return (<OuterContainer>
      { this.input }
      { visible && this.autocompleteContainer }
    </OuterContainer>);
  }
}

export default addQueryParams(Autocomplete);
