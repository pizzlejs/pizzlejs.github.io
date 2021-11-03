hljs.initHighlightingOnLoad();

var animate = new pizzle.create();
animate.init()

customElements.define('date-now',class extends HTMLElement {
  constructor(){
    super();
  
    this.innerHTML = new Date().getFullYear();
  }
})
