If you want to set custom meta data for an item so you can do it by using withSetCustomMetaData and withGetCustomMetaData decorators. These decorators are using [SetCustomMetadata](https://files.zimbra.com/docs/soap_api/8.8.15/api-reference/zimbraMail/SetCustomMetadata.html) and [GetCustomMetadata](https://files.zimbra.com/docs/soap_api/8.8.15/api-reference/zimbraMail/GetCustomMetadata.html) SOAP API and has client side GraphQL implementation.

## Use of withSetCustomMetaData decorator with a Component

Use `withSetCustomMetaData` decorator which trigger SetCustomMetadataRequest to set custom meta to an item.

```js
import { withSetCustomMetaData } from '@zimbra-client/graphql';

@withSetCustomMetaData() // This will provide you setCustomMetadata method in props to set custom meta
class FancyZimlet extends Component {
	handleClick = () => {
		this.props.setCustomMetadata({
			id: "1234", // id of any appointment, mail or contact item on which we want to set metadata
			section: "zwc:<sectionName>", // <sectionName> can be replaced with any string, it is recommended to use zimlet name, like zwc:slackZimlet
			attrs: [
				{
					key: "metaKey",
					value:"metaValue"
				},
				...
			]
		})
	}

	render() {
		return (
			<button onClick={this.handleClick} />
		)
	}
}

```

## Use of withGetCustomMetaData decorator in a Component

Use `withGetCustomMetaData` decorator which trigger SetCustomMetadataRequest to get defined custom meta with an item.

```js
import { withGetCustomMetaData } from '@zimbra-client/graphql';

@withGetCustomMetaData({
    id: "1234" // id of any appointment, mail or contact item from which we want to get metadata
    section: "zwc:<sectionName>" // <sectionName> can be replaced with any string, it is recommended to use zimlet name, like zwc:slackZimlet
}, ({ data: { getCustomMetadata } }) => {
    const customMetaInfo = get(getCustomMetadata, 'meta.0._attrs');
    return {
        customMetaInfo
    }
})
```
