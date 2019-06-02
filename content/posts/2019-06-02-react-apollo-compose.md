---
title: "React Apollo Compose"
cover: ""
date: "02-06-2019"
category: "webdevelopment"
tags:
    - webdevelopment
---

*The past months I've been working* with [Apollo Client]() (more background [here]()) and React.

To add data to UI Components Apollo provides HOCs (e.g. `withQuery` and `withMutation`), much like `connect` from Redux. Example:

```typescript
const withDevicesList = () => withQuery(SOME_QUERY, { name: "devicesQuery" });

export default withDevicesList()(DeviceList);
```

_Please note I am leaving off the types for `withQuery`. This is because it is quite verbose and irrelevant when using 
composition lateron. I intend to explore the types on `withQuery` in a later article._

# Recompose

When using multiple HOCs this could look like this:

```typescript
const withDevicesList = () => withQuery(SOME_QUERY, { name: "devicesQuery" });
const withVendors = () => withQuery(SOME_OTHER_QUERY, { name: "vendorsQuery" });

export default withVendors()(withDevicesList()(DeviceList));
```

so it is more convenient to use a compose util. This is a very common situation, and that is why there are many such
utils available. So far, I used the version from [Recompose](https://github.com/acdlite/recompose), which also provides HOCs for common patterns like
`withState`. The HOCs in Recompose have now been superseded by React Hooks, [not coincidentally by the same author](https://github.com/acdlite/recompose#a-note-from-the-author-acdlite-oct-25-2018).

The above snippet would look like this when using `compose` from Recompose:

```typescript
const withDevicesList = () => withQuery(SOME_QUERY, { name: "devicesQuery" });
const withVendors = () => withQuery(SOME_OTHER_QUERY, { name: "vendorsQuery" });

export default compose<Props, OuterProps>(
  withDevicesList(),
  withVendors()
)(DeviceList);
```

Here I have added the generic types on `compose`. This is relevant for later, so I will go into a bit more detail here.

# InnerProps and OuterProps

Both generic types serve the purpose of prop type checking, which can replace [PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html).
In this case, `OuterProps` represents the properties that must be supplied to the enhanced DeviceList, i.e. what is exported
in the last example. `Props` represents the properties that, after using compose, must be available on the (unenhanced) `DeviceList`
component. This is effectively the union of `OuterProps` and the props added by all the HOCs. Let's look at a possible
implementation and use of DeviceList to make this clear:

```typescript jsx
// DeviceList.tsx
interface OuterProps {
  title: string;
}

interface InnerProps {
  devicesQuery: {
    devices: string[];
  };
  vendorsQuery: {
    vendors: string[];
  };
}

type Props = OuterProps & InnerProps;

const DeviceList: FC<Props> = ({
  title,
  devicesQuery: { devices },
  vendorsQuery: { vendors }
}): JSX.Element => (<div>{title} {devices.length} {vendors.length}</div>);

// App.tsx
...
<DeviceList title="Devices" />
...
```

The prop `title` is an `OuterProp`, it is only added when the DeviceList component is added to a render function. The props
`devicesQuery` and `vendorsQuery` are `InnerProps` and are added by the HOCs. The union of the `InnerProps` and `OuterProps` is
`Props` and all those props are avaiable within the `DeviceList` component.

If, in this, the `title` prop would be left off in `App.tsx`, there would be a (compile time) type error. In this way,
these typings replace PropTypes.

# React Apollo

Now the Recompose HOCs are deprecated, adding the Recompose dependency to a project just for `compose` feels a bit wasteful.
Fortunately, React Apollo comes with its own implementation of [compose](https://www.apollographql.com/docs/react/api/react-apollo/#composeenhancerscomponent).

key differences:

* confirm that this is a difference: right to left (usually has no effect, unless the HOCs depend on each other directly) - or is recompose/compose also right to left?
* typing

# Problem

Upon switching it became clear that React Apollo does not have generic types on their `compose` implementation. This means
that using this `compose` strips all the type checking! That is a big step back in the typesafety of my application and
that is why I made a PR to add generic types to React Apollo `compose`, similar to that in Recompose `compose`.

WIP