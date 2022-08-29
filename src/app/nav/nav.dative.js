import Dative from "dativejs";
import template from "./nav.dative.html";

export let Nav = Dative.extend({
  template,
  data: () => ({
    open: false,
    filteredNames: [],
    api: [
      {
        name: "installation",
        link: "/guide/index.html#installation",
      },
      {
        name: "introduction",
        link: "/guide/index.html#introduction",
      },
      {
        name: "usage",
        link: "/guide/index.html#usage",
      },
    ],
  }),
  onmounted() {
    addEventListener("keyup", (e) => {
      if (e.key === "/" && (e.ctrlKey || e.metaKey)) {
        this.open = true;
        this.$ref.search.focus();
      }
    });
  },
  methods: {
    search(e) {
      this.filteredNames = e.target.value
        ? this.api.filter((d) =>
            d.name.toLowerCase().includes(e.target.value.toLowerCase())
          )
        : [];
    },
  },
});
