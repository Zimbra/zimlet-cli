To make your Zimlet available in multiple languages, you can use `preact-i18n`. This wiki page describes it's set-up.

Assuming you have a Zimlet called `mytest` you will need to add the following files:

* mytest/src/intl/en_US.json
* mytest/src/enhancers.js

The contents of enhancers.js is similar across all Zimlets:

      import { withIntlWrapper } from '@zimbra-client/enhancers';
      
      /**
       * @method withIntlWrapper
       * accepts three arguments which can be use to load zimlet locale.
       * @param {Object} - with following values
       * @param {Function} importFn which returns `import` with intl locale path of the zimlet.
       * @param {Boolean} showLoader Show loader on container or not
       *
       */
      export const withIntl = () => withIntlWrapper(
          {
              importFn: locale => import(/* webpackMode: "eager" */`./intl/${locale}.json`),
              showLoader: false
          }
      );

In src/intl you have to provide JSON formatted language strings for all languages you wish to support. But at least you must always provide `en_US.json` as the default fallback language. Example content:

      {
         "mytest": {
            "title": "This is a test"
            }
      }
      
      

Now to make use of the `title` string in a Preact Component you have to load it like so:

      import { createElement, Component } from 'preact';
      import { withIntl } from '../../enhancers';
      import { withText } from 'preact-i18n';
      
      @withIntl()
      @withText({
          title: 'mytest.title',
      })
      export default class MyComponent extends Component {
      
         render() {
            const { title } = this.props;
            return (<div>{title}</div>);
         }
      }

Now this component will return the string `This is a test`.