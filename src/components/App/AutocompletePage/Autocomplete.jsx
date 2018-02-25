import React, { Component } from 'react';
import fetchAutocompleteResults from 'src/services/autocomplete-service';
import queryString from 'query-string';
import { Input, ResultsContainer, OuterContainer, List } from './Components';

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
      return <InnerComponent {...this.state} />;
    }
  };

class Autocomplete extends Component {
  state = {
    currentText: this.props.qs.searchText,
    autocompleteValues: [],
    currentId: 0,
    loading: false,
    visible: !!this.props.qs.searchText,
  };

  componentDidMount() {
    if (this.state.currentText) {
      this.fetchAutocomplete();
    }
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillReceiveProps(newProps) {
    // synchronize our local state with what was provided to us, if its different
    // and make the box visible
    if (newProps.qs.searchText !== this.state.currentText) {
      this.setState({
        currentText: newProps.qs.searchText || '',
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
    const currentId = this.state.currentId + 1;
    const { currentText } = this.state;
    this.setState({
      currentId,
      loading: true,
    });
    fetchAutocompleteResults(currentText)
      .then((arr) => {
        // N.B. Check if the currentId matches. Only update state if it does.
        if (currentId !== this.state.currentId) {
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
      currentText: value || '',
    }, () => {
      this.fetchAutocomplete();
      // N.B. we need to wait until the currentText has been committed to state,
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

  render() {
    const { autocompleteValues, loading, visible } = this.state;
    const autocompleteRows = autocompleteValues.map(val => <li key={val}>{ val }</li>);
    const autocompleteSection = autocompleteValues.length > 0
      ? (<List>{ autocompleteRows }</List>)
      : <List><li>No results found!</li></List>;
    const autocompleteDiv = loading
      ? <List><li>Loading...</li></List>
      : autocompleteSection;
    const autocompleteContainer = (<ResultsContainer>
      { autocompleteDiv }
    </ResultsContainer>);

    return (<OuterContainer>
      <Input
        placeholder="Search for movies, or something"
        type="text"
        value={this.state.currentText}
        onChange={this.updateText}
        onBlur={() => this.setState({ visible: false })}
        onFocus={() => this.setState({ visible: true })}
        innerRef={(el) => { this.inputEl = el; }}
      />
      { visible && autocompleteContainer }
    </OuterContainer>);
  }
}

export default addQueryParams(Autocomplete);
