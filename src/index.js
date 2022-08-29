import { App } from "./app/app.dative";
import { Nav } from "./app/nav/nav.dative";
import { Hero } from "./app/hero/hero.dative";
import { Footer } from "./app/footer/footer.dative";
import { Guide } from "./app/guide/guide.dative";
import "../build/output.css";

let app = new App({
  el: "#app",
});


if (window.location.pathname === "/guide/index.html") {
  let guide = new Guide({
    el: "#app",
  });
  
  guide.attach([nav, footer])
}

var nav = new Nav({
  el: "#nav",
});
if (document.querySelector('#hero'))
  var hero = new Hero({
    el: "#hero",
  });
if (document.querySelector("#footer"))
  var footer = new Footer({
    el: "#footer",
  });
app.attach([nav, hero, footer]);