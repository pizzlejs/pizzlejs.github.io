import { defineConfig } from "rollup";
import image from "@rollup/plugin-image";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-css-only";
import nodeResolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import posthtml from "rollup-plugin-posthtml-template";
import { createFilter } from "@rollup/pluginutils";
import {marked} from 'marked'
import prism from "prismjs";

const production = !process.env.ROLLUP_WATCH;
function md() {
  const filter = createFilter("**/*.md");
  marked.setOptions({
    highlight: (code, lang) => {
      if (prism.languages[lang]) {
        return prism.highlight(code, prism.languages[lang], lang);
      } else {
        return code;
      }
    },
  });
  const escape = (code) => code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  var renderer = new marked.Renderer();
  renderer.code = function (code, language, escaped) {
    return `
    <div>
      <pre ${
        language === "bash" || language === "shell" ? 'data-prefix="$"' : ""
      } class="language-${language} mockup-code shadow-2xl"><code>${escape(
      code
    )}</code></pre>
    </div>`;
  };
  marked.use({
    renderer,
  });
  return {
    name: "md",
    async transform(code, id) {
      if (!filter(id)) return;
      return {
        code: `export default ${JSON.stringify(
          marked(code, { headerIds: true })
        )}`,
        map: { mappings: "" },
      };
    },
  };
}
function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn("npm", ["start"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default defineConfig({
  input: "src/index.js",
  output: {
    name: "app",
    format: "iife",
    file: "build/build.js",
  },
  plugins: [
    !production && image(),
    commonjs(),
    css({
      output: "build.css",
    }),
    nodeResolve({
      browser: true,
      dedupe: ["dativejs"],
    }),
    !production && livereload(),
    posthtml({
      include: "**/*.dative.html",
    }),
    md(),
    !production && serve(),
  ],
});
