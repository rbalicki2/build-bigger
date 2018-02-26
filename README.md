# Build Bigger By Building Smaller

> You can view the presentation [here](https://build-bigger.robertbalicki.com/presentation).

## [Tag v0](https://github.com/rbalicki2/build-bigger/blob/v0/)

### Files to look at:

[`src/components/Autocomplete.jsx`](https://github.com/rbalicki2/build-bigger/blob/v0/src/components/Autocomplete.jsx)

### How does it work?

`Autocomplete.jsx` is divided into two components: the `addQueryParams`
higher order component and the `Autocomplete` component.

`addQueryParams` overrides `history.pushState` and `history.replaceState`
to listen for changes, and passes the query params to its children.
Overriding `history` is a bit janky, but we won't worry about that during
this presentation.

`Autocomplete`: 

This component is responsible for calling `fetchAutocompleteResults`,
rendering the results, and keeping track of whether the autocomplete is open.
It should also serialize its `searchText` state with the `searchText`
query param, and update itself when the `searchText` query param is updated.

### What is the story behind how `Autocomplete` was created?

Initially, autocomplete was a self-contained component, so it kept track of
`searchText` in local state.

Then, your PM asked that the `Autocomplete` component write to the query
params, and when the page was refreshed, re-use that search term. So, it
wrote its state to the query params and read from them when the page was
loaded.

Then, your PM said, "I want people to be able to add links to common searches
to this page. Surely, that can be handled through query params, right?"
Rather than admit that the engineer was wrong, the engineer quickly bolted
on some code to synchronize the query params and the internal state.

This involved many hacks, explored in the next section.

### What is wrong?

Many things! Let's list some of them that we're going to fix:

* `Autocomplete` stores a copy of the `qs.searchText` prop redundantly
  in its state. As a result, there's lots of complicated code to
  keep these two in sync. Instead, the component should only use the
  query string version.
* The component has too many responsibilities. Splitting it between a
  state management component (which hooks up to query params) and a
  purely functional UI component is a better design.
* It also triggers a side effect when the `qs.searchText` prop changes: calling
  `fetchAutocompleteResults`. There's a lot of complicated code to distinguish
  between calling it when you update the `searchText` from within the
  autocomplete, and when the query string updates it.
* It also calls `setState` in an async callback. Since many requests can go
  out in a short amount of time (as the user types), there is some boilerplate
  involved (namely, counting `currentRequestId`) to make sure we're only
  rendering the correct results.
* There's code in the `render` method that could go into a separate,
  pure function.
* Adding a document listener is janky, although, TBH I'm not sure if we're
  going to change that.

* `addQueryParams` should be replaced by a render prop

### What does this implementation do well?

* It cleans up after itself in the componentWillUnmount method
* Using an HOC is a good idea for the `addQueryParams` component. (However,
  it's not the best idea.)