# calcite-ui-icons-react

Calcite UI Icons as individual React components.

## Basic Usage

Find the icon you want to use here: https://esri.github.io/calcite-ui-icons/

The name of the React component you will import is simply the icon name in PascalCase plus suffixed with `Icon`.

For example:

If you want to use the `globe` and `caret-square-down` icons...

```js
import Globe from 'calcite-ui-icons-react/Globe';
import CaretSquareDown from 'calcite-ui-icons-react/CaretSquareDown';

const MyComponent = () => (
  <div>
    <Globe />
    <CaretSquareDown />
  </div>
);
```

## Sizes

Calcite UI Icons come in three size variations: 16px, 24px, and 32px. Note that these are three unique SVGs to avoid issues when scaling vector graphics. You can read more about this [here](https://github.com/Esri/calcite-ui-icons#why-3-sizes).

Each component in this library includes all three of these unique SVGs - simply pass a `size` prop, and we'll pick the right one for you. Note that if you don't include a `size` prop, it defaults to 24. The 32px SVG will be used whenever a `size` prop greater than 24 is found.

```js
import Globe from 'calcite-ui-icons-react/Globe';

const MyComponent = () => (
  <div>
    {/* size will be 24, 24px version of SVG will be used */}
    <Globe />

    {/* size will be 12, 12px version of SVG will be used */}
    <Globe size={12} />

    {/* size will be 48, 32px version of SVG will be used */}
    <Globe size={48} />
  <div>
)
```

## Filled vs. Outline

Calcite UI Icons come in two styles: `filled` and `outline`.

All components in this library default to the `outline` style. To use the `filled` style, simply pass the prop `fill` (as a boolean).

```js
import Globe from 'calcite-ui-icons-react/Globe';

const MyComponent = () => (
  <div>
    {/* outline style */}
    <Globe />

    {/* filled style */}
    <Globe filled />
  <div>
)
```

## Color

All components accept a `color` prop, which will be applied to the `fill` attribute on the `<svg>` element. If a `color` prop is not found, we will set it to [`currentColor`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentColor).

## Styling

All components get a `calcite-ui-icon` css class that you can use for generic styling. We merge in a `className` prop if you provide one. We also spread all other props ontot he `<svg>` element for you.