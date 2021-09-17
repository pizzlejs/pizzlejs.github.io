# PizzleJs — An Animation Library for Javascript

[![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hw/pizzle)](https://www.jsdelivr.com/package/npm/pizzle)
[![npm](https://img.shields.io/npm/dt/pizzle)](https://npmjs.com/package/pizzle)
![npm](https://img.shields.io/npm/v/pizzle?style=plastic)


# Please you can star 🌟 the project on [GitHub](https://github.com/pizzlejs/pizzlejs)

#### Installation

#### Npm

```bash
npm install pizzle
```

```js
import pizzle from 'pizzle'
```
#### Cdn

```html
<!--Development-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pizzle@1.0.0/dist/pizzle.css" />
<script src="https://cdn.jsdelivr.net/npm/pizzle@1.0.0/dist/pizzle.js"></script>
<!--Production-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pizzle@1.0.0/dist/pizzle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/pizzle@1.0.0/dist/pizzle.min.js"></script>
```

<!--#### Cli

> Checkout the official cli [docs](https://pizzlejs.github.io/cli/)
-->
#### Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Pizzle — An Animation library</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pizzle@1.0.0/dist/pizzle.min.css" />
</head>

<body>
  <div pizzle-start="app">
    <h1 pizzle-bounce="infinite 1000">Im Bouncing</h1>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/pizzle@1.0.0/dist/pizzle.min.js"></script>
  <script>
    var animate = new pizzle.create();
    animate.init()
  </script>
</body>
</html>
```
The pizzle directive for initializing your app
```html
pizzle-<animation-name>="infinite <duration>"
```

```html
<div pizzle-start="<name>">

</div>
```
The value of the attribute ``pizzle-start`` is the target for the ``pizzle.create()``

#### Default Settings
```js
var default$ = {
  target: "app",
  duration: 1000,
  directives: {}
}
```


```js
var defaultoptions = {
  target: String,
  duration: Number,
  directives: Object,
}
```

You can create your own animation in this format

```css
@keyframes big-font{
  from{
    font-size: 20px;
  }
  to{
    font-size: 50px;
  }
}
.big-font{
  animation: big-font;
}
.big-font-1000{
  animation-direction: 1s;
}
.big-font-infinite{
  animation-iteration-count: infinite;
}
```

You can now use it with pizzlejs like this:

```html
 <div pizzle-start="app">
    <h1 pizzle-big-font="infinite 1000">Big Font</h1>
 </div>
```

#### Changing the default target

```js
pizzle.create({
  target: 'root'
}).init();
```

#### Changing the default duration

```js
pizzle.create({
  duration: 4000
}).init();
```
#### Creating Custom directives


```js
pizzle.create({
  directives:{
    'color': function(el,{ bind }){
      // el is the target
      // bind is the attribute value
      el.style.color = bind;
    }
  }
}).init()
```

Can now be use like this:

```html
  <div pizzle-start="app">
    <h1 pizzle-big-font="infinite 1000" pizzle:color="green">Big Font</h1>
  </div>
```

Thanks to [Animate.css](https://animate.style) the keyframe animation was inspired by them

------

© 2021 Made by [Tobithedev](https://tobithedev.github.io)
