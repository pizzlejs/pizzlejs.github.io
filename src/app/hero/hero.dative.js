import Dative from "dativejs";
import template from "./hero.dative.html";

export let Hero = Dative.extend({
  template,
  animate: {
    slidein({ animate, delay, duration }) {
      animate(
        [
          {
            letterSpacing: "-.5em",
            filter: "blur(12px)",
            opacity: 0,
          },
          {
            filter: "blur(0)",
            opacity: 1,
          },
        ],
        {
          duration: duration,
          delay: delay,
          easing: "cubic-bezier(0.83, 0, 0.17, 1)",
        }
      );
    }
  },
});
