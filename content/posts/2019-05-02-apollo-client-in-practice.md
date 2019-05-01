---
title: "Apollo Client in Practice"
cover: ""
date: "02-05-2019"
category: "webdevelopment"
tags:
    - webdevelopment
---

Some time ago I joined a team that is working on a search application. Implemented in React and using [Apollo](https://www.apollographql.com/) for 
GraphQL calls, I was surprised to find it noticeably slow when a lot of search results were retrieved.

Looking into the performance tab of Chrome dev tools lead me to believe the performance problems were caused by 
computations in the bottom components (e.g. formatting in cells). Because there are so many and they are 
re-rendered quite often, this approach is quite intensive on resources.

Besides that, the application had obvious state synchronization problems. When moving between views it was not  maintaining the same state of selected rows. Even though Redux is used to store application state and communicate it between components, it is not used consistently. There are still plenty of React class components that store some parts of the state locally. 

Since both issues are caused by (a lack of) architecture, we redesigned the structure of the application. The original implementation used:

* [Apollo Client](https://www.apollographql.com) as a GraphQL client
* [Axios](https://github.com/axios/axios) as an HTTP client for REST endpoints
* [Redux](https://redux.js.org) and [React local state](https://reactjs.org/docs/hooks-reference.html#usestate) to manage the state between components

It used Apollo, but by [manually firing](https://www.apollographql.com/docs/react/essentials/queries#manual-query) `client.query()` and 
after processing the response, it stored the result in the Redux store.

# Local state

When restructuring the application, Apollo Client was updated to 2.5. This version has a built-in [local state manager](https://www.apollographql.com/docs/react/essentials/local-state)
(formerly *apollo-link-state*). and it supports REST calls with the [apollo-link-rest](https://www.apollographql.com/docs/link/links/rest) plugin. 
The [apollo-boost](https://github.com/apollographql/apollo-client/tree/master/packages/apollo-boost) package contains the 
client and several useful plugins. Adopting these means that both Redux and Axios can be removed and Apollo will be used as a single source of truth.

Instead of using `client.query()` directly, components are split into a presentational component and enhanced with the 
[graphql()](https://www.apollographql.com/docs/react/api/react-apollo#graphql) HOC to add data from remote (i.e. GraphQL 
back-end) or local fields. Both utilize the Apollo cache, which fulfills multiple functions, one of them an application local state store.

Example of wrapping a component in a Query HOC:

```javascript
const Books = ({ data: { books } }) => (
  <ul>
    {books.map(book => <li>{book.title}</li>}
  </ul>);

export graphql({ query: gql`
  query($author: String!) {
    books(author: $author) {
     title
    }
  }`, 
  variables: { author: "Mickiewicz" })(Books);
```

Apollo reactively updates when using `Query` as a container, basically like the `connect` HOC in Redux. When 
the `variables` prop on the `Query` component is updated, it will automatically re-query. It use the cache if possible and
 falls back to a network call if needed, although this behavior can be configured.

# Resolvers

Having a single source of truth fixes the state synchronization problem. It also paves the way for improving the 
performance. In general, when a lot of data enters the application, it is a good idea to format it once and cascade the 
formatted data down to the components and it's descendants with as little transformations to the data itself. This 
reduces the amount of computations in the lower components. 

When using Redux, a common way to solve this is using 
[Reselect](https://github.com/reduxjs/reselect), which computes derived data from the Redux store with selectors. For 
Apollo this is done by:
* wrapping the table in a `Query` that queries a local prop `rows @client`, using the [@client](https://www.apollographql.com/docs/react/essentials/local-state) directive
* making client side resolvers for rows that queries GraphQL endpoint
* mapping the data in a resolver from a raw format to a format ready for the table components, e.g.:

from a data object
 
```javascript
{ 
  author: "Mickiewicz", 
  publications: [ 
    { 
      title: "Pan Tadeusz",
      date: -4291747200 
    } 
  ] 
}
``` 

to an array rows of cells
  
```javascript
[
  [ "Mickiewicz", "Pan Tadeusz", "January 1834" ]
]
```

# Next steps

Apollo is excellent for merging data from multiple sources (in this case GraphQL, REST, local state and cache) and 
functions as a "single source of truth" which should solve the state synchronization problems. These are some other 
things you might want to take into account when working with Apollo Client.

Outside of restructuring the application, we improved performance with [react-virtualized](https://github.com/bvaughn/react-virtualized) which speeds up rendering
large tables. Apollo also offers GraphQL pagination. We did not use that, as we
have to do our pagination on the client side to keep the sorting feature of react-virtualized in tact.

Apollo Client offers support for TypeScript, it is even possible to generate queries and typed React components from 
GraphQL schemas with [@graphql-codegen/cli](https://graphql-code-generator.com/).

Also definitely use the [JS GraphQL IntelliJ Plugin](https://jimkyndemeyer.github.io/js-graphql-intellij-plugin/) because 
it will not only auto complete queries, but it willl help you think about (client side) schema's.

When the `Query` component mounts, it creates an observable that subscribes to the query in the query prop. This 
encourages reactive behavior like RxJS (which can also be used as a [state store](https://github.com/mdvanes/realtime-planner)). 
However, it seems that Apollo offers much less fine-grained control over the observables than what RxJS provides. And considering observables, Apollo Client 
effortlessly [scales to web sockets](https://www.apollographql.com/docs/link/links/ws)!

For now, the application takes search terms and displays the results in a table with potentially dozens of columns and hundreds of rows, even before paging.


Are you looking for inspiration on how Apollo client can be applied? I can recommend [this talk by Uri Goldshtein](https://www.youtube.com/watch?v=g6Mhm9W76jY). 