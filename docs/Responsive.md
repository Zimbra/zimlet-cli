`zm-x-web` exposes constants to represent supported screen sizes for desktop, tablet, and phone. These constants can be used to render different components or apply different styles based on the supported screen sizes.

## From JavaScript

Use the `withMediaQuery` decorator:

```js

import { withMediaQuery } from '@zimbra-client/enhancers';

import {
  screenXs,
  screenSm,
  screenMd,
  screenLg,
  screenXsMax,
  screenSmMax,
  screenMdMax,
  minWidth,
  maxWidth
} from '@zimbra-client/constants';
```

Examples:

```js
// Use the decorator to inject a prop which updates based on screen size

@withMediaQuery(minWidth(screenMd), 'matchesScreenMd')
@withMediaQuery(minWidth(screenSm), 'matchesScreenSm')
@withMediaQuery(minWidth(screenXs), 'matchesScreenXs')
class ResponsiveComponent extends Component {
  render({ matchesScreenMd, matchesScreenSm, matchesScreenXs }) {
    if (matchesScreenMd) {
      return 'I am at least 1025px wide';
    }
    if (matchesScreenSm) {
      return 'I am at least 769px wide';
    }
    if (matchesScreenXs) {
      return 'I am at least 480px wide';
    }

    return 'I am less than 480px wide';
  }
}
```

## From LESS/SASS

See [`Zimbra/zm-x-ui`](https://github.com/Zimbra/zm-x-ui) in the [`variables.less`](https://github.com/Zimbra/zm-x-ui/blob/3810c0886038ba4157196885ba1f0b4a26511f81/variables.less#L168-L185) file for breakpoints. Use these variables to create media queries:

```css
@screen-xs: 480px;
@screen-phone: @screen-xs;

// Small screen / tablet portrait
@screen-sm: 769px;
@screen-tablet: @screen-sm;

// Medium screen / tablet landscape
@screen-md: 1025px;
@screen-desktop: @screen-md;

// Large screen / wide desktop
@screen-lg: 1300px;
@screen-lg-desktop: @screen-lg;

// So media queries don't overlap when required, provide a maximum
@screen-xs-max: (@screen-sm - 1);
@screen-sm-max: (@screen-md - 1);
@screen-md-max: (@screen-lg - 1);
```

