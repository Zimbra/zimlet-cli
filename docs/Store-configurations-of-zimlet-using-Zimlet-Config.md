## Problem
Many times zimlets wants to store configuration or metadata in a persistent manner, which should be changeable by admins if required.

## Demo Zimlet
A demonstration Zimlet and Guide is available for this topic at https://github.com/Zimbra/zimbra-zimlet-configuration.

## Solutions which we discourage
1. We could use LDAP attributes to store zimlet specific information

    Problem with this approach is we will be adding LDAP attributes in the core product which are related to zimlets, even if we do it we are not providing robust solution for external zimlet devs as they would not have access to core product. This also creates tight coupling between core product and zimlet which is not desired.

2. We could add client configs for zimlets

    Problem with this approach is we will be expecting admins to create client configs with proper information for zimlets. For Zimbra Cloud this works because most of the deployments are having customisations and client configs are already present so it's easier to update it, but for Zimbra 9 most of the customers are using product as it is without any client customisations so expecting customers to create client config just to make a zimlet workable is not optimal solution. This also creates problem where default values for these zimlet configurations needs to be hardcoded in zimlets, so if we decide to change default value then new zimlet needs to be created which is unnecessary overhead.

## Best solution
To overcome all above problems and issues we have introduced a new way for zimlets to store configurations and metadata. It makes use of `config_template.xml` file. Every zimlet can create this file and put it at root level of the zip to make use of this feature.

### Prerequisites
Modern UI >= 3.13.0

Zimlet CLI >= 11.7.0

### Packaging
`config_template.xml` should have config name and its value in below format. It's mandatory to provide zimlet name and version same as what is used when packaging the zimlet.

````
<zimletConfig name="<zimlet-name>" version="<zimlet-version>">
    <global>
        <property name="configPropertyName">valueOfConfig</property>
    </global>
</zimletConfig>
````
More information about syntax is available in https://wiki.zimbra.com/wiki/Zimlet_Developers_Guide:Zimlet_Configuration_File_Reference

We have extended zimlet-cli to look for `config_template.xml` in the root of the zimlet repo and package it automatically if it finds one. so zimlet devs don't have to do anything to package it as part of zip.

### Using this configurations in zimlets
Once zimlet is deployed on Zimbra Server, all the values specified in `config_template.xml` will be available in AccountInfo graphql response, which can be used by zimlets to get it's value.

```
import { useAccountInfo } from '@zimbra-client/hooks/graphql';
import get from 'lodash/get';

function App() {
    const { data } = useAccountInfo();

    const zimlets = get(data, 'accountInfo.zimlets.zimlet');

    // find the zimlet from the config
    const zimlet = zimlets.find(zimlet => "<zimlet-name>" === get(zimlet, 'zimlet.0.name'));
    let configValue;

    if (zimlet) {
        const globalConfig = get(zimlet, 'zimletConfig.0.global') || [];

        // find the config with the configPropertyName as name
	globalConfig.forEach(({ property }) => {
		property = property || [];
		property.forEach(({ name, content }) => {
			if (name === configPropertyName) {
				configValue = content;
			}
		});
	});
    }

    // configValue has the required information
}
```

### Config Modifications by admins
#### Zimbra 9
Once the zimlet is deployed on Zimbra Server then admins can modify these configurations using below commands. For Zimbra 9, the commands should be executed through admin-cli. The same is true for Zimbra Cloud as well, bash to the mailbox pod and execute the following commands using admin-cli.
* To extract the configuration template type `zmzimletctl getConfigTemplate <zimlet.zip>`
    * If you don't have a zip file, you can navigate to `/opt/zimbra/zimlets-deployed` and copy the config_template.xml from the zimlet's folder to somewhere else (/tmp/ would be a good place)
* Make the required changes in the file. Be careful to only change the required areas. Save the file.
* Type the following command to update the configuration in the LDAP. `zmzimletctl configure config_template.xml` (or whatever you named the template file)

**NOTE:** the config file is irrelevant other than being used to set the value(s) in LDAP. It's fine if it gets wiped out due to pod restarts

Refer https://wiki.zimbra.com/wiki/Zimlets,_Setting_Up for more information

#### Zimbra X
The config can be overridden by copying the template file, adjusting as needed, and storing some place (like dropbox or aws) for the zmc-zimlets-provider.yml file to point at. More details here: [https://github.com/ZimbraOS/zm-kubernetes/wiki/Zimlets-and-Extensions-deployment-guidelines](https://github.com/ZimbraOS/zm-kubernetes/wiki/Zimlets-and-Extensions-deployment-guidelines)

## Development notes
It is not possible to side-load config_template.xml files. So you must always deploy an actual Zimlet to read the configuration properties.