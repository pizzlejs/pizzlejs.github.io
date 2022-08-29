import Dative from "dativejs";
import helper from "@dativejs/helpers";
import Prism from "prismjs";
import "prismjs/plugins/toolbar/prism-toolbar";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-js-extras";
import "prismjs/components/prism-css-extras";
import "prismjs/components/prism-js-templates";
import template from "./app.dative.html";

export let App = Dative.extend({
  template,
  use: [helper],
  onmounted() {
    Prism.highlightAll();
  },
});
