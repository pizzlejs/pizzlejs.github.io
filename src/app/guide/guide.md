# Introduction

PizzleJS is a Css+Javascript animation library

It Makes Using of ``@keyframes`` animation easier in your html 



Integration for
### Coming Soon
- ``@pizzle/dative`` - [DativeJs](https://dativejs.js.org)
- ``@pizzle/svelte`` - [SvelteJs](https://svelte.dev)
- ``@pizzle/react`` - [ReactJs](https://reactjs.dev)
- ``@pizzle/vue`` - [VueJs](https://vuejs.dev)
### We working on the plugins

# Installation

### Via Cdn

```html
<!-- Development -->
<link rel="stylesheet" href="https://unpkg.com/pizzle@1.0.0/dist/pizzle.css" />
<script src="https://unpkg.com/pizzle@1.0.0/dist/pizzle.js"></script>

<!-- Production -->
<link
  rel="stylesheet"
  href="https://unpkg.com/pizzle@1.0.0/dist/pizzle.min.css"
/>
<script src="https://unpkg.com/pizzle@1.0.0/dist/pizzle.min.js"></script>
```

### via Native Es Modules

```js
// Development
import { create } from "https://unpkg.com/pizzle@1.0.0/dist/pizzle.es.js";
// or
import pizzle from "https://unpkg.com/pizzle@1.0.0/dist/pizzle.es.js";
// avaliable as pizzle.create

// Production
import { create } from "https://unpkg.com/pizzle@1.0.0/dist/pizzle.es.min.js";
// or
import pizzle from "https://unpkg.com/pizzle@1.0.0/dist/pizzle.es.min.js";
// avaliable as pizzle.create
```

### Via Npm

```bash
npm install pizzle --save
```

### Via Yarn

```bash
yarn add pizzle -S
```


# Usage

```js
import pizzle from "pizzle";
let animate = new pizzle.create();
animate.init();
```

For Customization
Default Setting

```ts
import pizzle from "pizzle";
let animate = new pizzle.create({
  target: "app", // target for the animation
  duration: 1000, // duration for the animation
});
animate.init();
```

### Changing the Duration 
```ts
import pizzle from "pizzle";
let animate = new pizzle.create({
  target: "app", 
  duration: 4000,
});
animate.init();
```

With Pizzle you can do reverse too. But it's not in-built. Later in the guide we will show how you can do that

### List of All The Builtin Animations

- Bounce
- BounceIn
- BounceInLeft
- BounceInRight
- BounceInUp
- BounceInDown


- BounceOut
- BounceOutLeft
- BounceOutRight
- BounceOutUp
- BounceOutDown


- Pulse
- Flash
- Fadein
- Tada
- Swing
- Shake
- RubberBand

> **Note** The pizzle directives respects  kebabcase
> So when make a custom animation use of kebabcase is required for naming of the animations


```tsx
<h1 pizzle-bounce="<iteration: (infinite | reverse)> <duration: number>"></h1>
```

- `Bounce`

```html
<div pizzle-start="app">
    <h1 pizzle-bounce="infinite 3000">Hello</h1>
</div>
```

- `BounceIn` 

```html
<div pizzle-start="app">
    <h1 pizzle-bounce-in="infinite 3000">Hello</h1>
</div>
```

- `BounceOut`

```html
<div pizzle-start="app">
    <h1 pizzle-bounce-out="infinite 3000">Hello</h1>
</div>
```

- `Flash`

```html
<div pizzle-start="app">
    <h1 pizzle-flash="infinite 3000">Hello</h1>
</div>
```

- `Tada`

```html
<div pizzle-start="app">
    <h1 pizzle-tada="infinite 3000">Hello</h1>
</div>
```

- `Swing`

```html
<div pizzle-start="app">
    <h1 pizzle-swing="infinite 3000">Hello</h1>
</div>
```

- `Shake`

```html
<div pizzle-start="app">
    <h1 pizzle-shake="infinite 3000">Hello</h1>
</div>
```

- `Pulse`

```html
<div pizzle-start="app">
    <h1 pizzle-pulse="infinite 3000">Hello</h1>
</div>
```

- `RubberBand`

```html
<div pizzle-start="app">
    <h1 pizzle-rubber-band="infinite 3000">Hello</h1>
</div>
```

- `Fadein`

```html
<div pizzle-start="app">
    <h1 pizzle-fadde-in="infinite 3000">Hello</h1>
</div>
```

### Creating Custom Animations


```css
@keyframe rotate {
    from {
        transform: rotate(0deg)
    }
    to {
        transfrom: rotate(360deg)
    }
}


.rotate {
    aniamtion-name: rotate;
    animation-timing-function: linear;
}

.rotate-1000 {
    animation-duration: 1s;
}
.rotate-2000 {
    animation-duration: 2s;
}
.rotate-3000 {
    animation-duration: 3s;
}
.rotate-4000 {
    animation-duration: 4s;
}
.rotate-5000 {
    animation-duration: 5s;
}
/* Default for pizzlejs durations is 5000
 But You can extend it
*/
.rotate-6000 {
    animation-duration: 6s;
}
```


### Custom animation usage

```html
<div>
    <h1 pizzle-rotate="infinite 4000">Rollay</h1>
</div>
```







> The Next version of `pizzlejs` will be more of javascript with more helpers to ease the stress of creating custom animations