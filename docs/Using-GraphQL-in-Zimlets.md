To get started learning GraphQL queries, see [Queries and Mutations | GraphQL](https://graphql.org/learn/queries/).

See [`schema.graphql`](https://github.com/Zimbra/zm-api-js-client/blob/develop/src/schema/schema.graphql) for a full list of fields that can be queried in the Zimbra schema.

**Example**

```js
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

@graphql(gql`
  query GetPreferences {
    getPreferences {
      zimbraPrefLocale
    }
  }
`)
class MyClass extends Component {
  render({ data }) {
    const { loading, error, getPreferences } = data;
    return loading ? (
      'GetPreferences Loading...'
    ) : error ? (
      `GetPreferences ERROR: ${error}`
    ) : (
      <div>Some data from getPreferences: {getPreferences.zimbraPrefLocale}
    );
  }
}
```

## Related Libraries

 - [Zimbra/api-js-client](https://github.com/Zimbra/zm-api-js-client/)
 - [graphql-tag](https://github.com/apollographql/graphql-tag)
 - [apollo-client](https://github.com/apollographql/apollo-client)
 - [react-apollo](https://github.com/apollographql/react-apollo)

## GraphiQL

[GraphiQL](https://github.com/graphql/graphiql) is "A graphical interactive in-browser GraphQL IDE", useful for testing queries and getting an instant response.

See the `/graphiql` route of the Zimbra X Client for a GraphiQL instance to query the current GraphQL schema.