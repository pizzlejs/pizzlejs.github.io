
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

  /**
    * dativejs v2.0.0-alpha.1
    * (c) 2021-2022 Tobithedev <ucheemekatobi@gmail.com>
    * https://github.com/dativeJs/dativejs
    * Released under the MIT License.
  */
  /**
   * Converts String To HTML
   * @param {String} str
   * @returns {HTMLBodyElement}
   */
  function stringToHTML(str) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, "text/html");
    return doc.body;
  }
  /** @type {Document} */
  var doc = document !== undefined ? document : {};
  /** @type {Boolean} */
  var isClient = !!doc;

  /**
   * Configuration For DativeJs Applications
   *
   * @example
   * ```ts
   *    Dative.config.foo = 'bar'
   * ```
   *
   *
   * @type {{
   *      slient: boolean
   *      mode: string
   *      noop: Function
   *      CurrentInstance: null
   * }}
   */
  var config = {
    slient: isClient ? false : true,
    mode: "development",
    /** Please Do Not Append it */
    noop: function () {},
    CurrentInstance: null,
    // errorHandler: []
  };
  /**
   *
   * @param {any} msg
   * @param  {...any} others
   */
  function warn(msg, ...others) {
    if (config.slient === false) {
      console.error("[dative Warn]: ", msg, ...others);
    }
  }
  /**
   *
   * @param {any} msg
   * @param  {...any} others
   */
  function tip(msg, ...others) {
    if (config.slient === false) {
      console.warn("[dative tips]: ", msg, ...others);
    }
  }
  function _type$$(object) {
    let class2type = {},
      type = class2type.toString.call(object),
      typeString =
        "Boolean Number String Function Array Date RegExp Object Error Symbol";

    if (object == null) {
      return object + "";
    }

    typeString.split(" ").forEach((type) => {
      class2type[`[object ${type}]`] = type.toLowerCase();
    });

    return typeof object === "object" || typeof object === "function"
      ? class2type[type] || "object"
      : typeof object;
  }

  function isReserved(string) {
    // 0x24: $, 0x5F: _.
    const char = `${string}`.charCodeAt(0);
    return char === 0x24 || char === 0x5f;
  }

  function isPlainObject(object) {
    let proto,
      ctor,
      class2type = {},
      toString = class2type.toString,
      hasOwn = class2type.hasOwnProperty,
      fnToString = hasOwn.toString,
      ObjectFunctionString = fnToString.call(Object);

    if (!object || toString.call(object) !== "[object Object]") {
      return false;
    }

    proto = Object.getPrototypeOf(object);
    if (!proto) {
      return true;
    }

    ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return (
      typeof ctor === "function" && fnToString.call(ctor) === ObjectFunctionString
    );
  }
  let uid = 0;
  class Dep$1 {
    constructor() {
      this.id = uid++;
      this.subs = {};
    }
    addSub(sub) {
      // avoid repeated additions
      if (!this.subs[sub.uid]) this.subs[sub.uid] = sub;
    }
    notify() {
      for (let uid in this.subs) {
        this.subs[uid].update();
      }
    }
  }
  Dep$1.target = null;
  function defineReactive(object, key) {
    let value = object[key],
      dep = new Dep$1();
    Object.defineProperty(object, key, {
      get() {
        Dep$1.target && dep.addSub(Dep$1.target);
        return value;
      },
      set(newValue) {
        value = newValue;
        dep.notify();
      },
    });
    return object;
  }
  function observe(data) {
    if (_type$$(data) != "object") return;
    var obj;
    for (let key in data) {
      obj = defineReactive(data, key);
    }
    return obj;
  }

  function proxy(sourceKey, key) {
    let self = this;
    Object.defineProperty(self, key, {
      configurable: true,
      enumerable: true,
      get: function reactivegetter() {
        return self[sourceKey][key];
      },
      set: function reactivesetter(newVal) {
        self[sourceKey][key] = newVal;
        self.render();
        return true;
      },
    });
  }
  function sanitizeStr(obj) {
    return obj.replace(/javascript:/gi, "").replace(/[^\w-_. ]/gi, function (c) {
      return `&#${c.charCodeAt(0)};`;
    });
  }
  function initData(options, dative) {
    let data = options.data;
    data = dative.data =
      typeof data === "function" ? data.apply(dative, [dative]) : data || {};
    if (!isPlainObject(data)) {
      data = {};
      warn(
        "options data should return an object." +
          "https://dativejs.js.org/api#why-data-should-return-object/"
      );
    }

    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      var val = data[keys[i]];
      if (typeof val === "string" && dative.sanitize) {
        data[keys[i]] = sanitizeStr(data[keys[i]]);
      }
      if (!isReserved()) dative.proxy(`data`, keys[i]);
    }
    observe(data);
  }
  var _typeof$1 =
    typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
      ? function (obj) {
          return typeof obj;
        }
      : function (obj) {
          return obj &&
            typeof Symbol === "function" &&
            obj.constructor === Symbol &&
            obj !== Symbol.prototype
            ? "symbol"
            : typeof obj;
        };

  function type(object) {
    var class2type = {};
    var type = class2type.toString.call(object);
    var typeString =
      "Boolean Number String Function Array Date RegExp Object Error Symbol";

    if (object == null) return "" + object;

    typeString.split(" ").forEach(function (type) {
      return (class2type["[object " + type + "]"] = type.toLowerCase());
    });

    return (typeof object === "undefined" ? "undefined" : _typeof$1(object)) ===
      "object" || typeof object === "function"
      ? class2type[type] || "object"
      : typeof object === "undefined"
      ? "undefined"
      : _typeof$1(object);
  }

  function eachparse(options) {
    return (_, char) => {
      if (!char.includes("as")) {
        warn("Expected keyword 'as' But got " + "'  '" + "");
      }
      char = char.replace(/as/, "of");
      var each = char.split("of");
      function d(c) {
        if (c[1].startsWith("{") && c[1].split(" ") && c[1].endsWith("}")) {
          var space = c[1].split(" ");
          for (const {} in space) {
            var cx = space.join(",");
            return `[${c[0]}, ${cx}]`;
          }
        }
        return `[${c[0]},${c[1]}]`;
      }

      return `for (const ${
      each[1].includes(",")
        ? d(each[1].split(","))
        : each[1].startsWith("{") && each[1].endsWith("}")
        ? each[1]
        : each[1]
    } of ${
      !each[1].startsWith("{") && each[1].includes(",")
        ? `Object.entries(${each[0].trim()})`
        : each[0]
    }) {`;
    };
  }
  function ifparse(_, char) {
    return `if (${char}) {`;
  }
  function elseifparse(_, char) {
    return `} else if (${char}) {`;
  }
  function elseparse(_, char) {
    return "} else {";
  }

  function withparse(_, char) {
    return `with (${char}) {`;
  }

  function debugparse(_, char) {
    return `_c(console[console.debug ? 'debug' : 'log']({${char}}));\n debugger`;
  }

  function commentparse(_, char, charr) {
    return `/** ${charr} **/`;
  }

  function variableparse(_, char) {
    return `let ${char};`;
  }

  function isFunction(val) {
    return typeof val === "function";
  }

  var inBrowser = typeof window !== "undefined";

  const range = 2;

  function generateCodeFrame(source, start = 0, end = source.length) {
    // Split the content into individual lines but capture the newline sequence
    // that separated each line. This is important because the actual sequence is
    // needed to properly take into account the full line length for offset
    // comparison
    let lines = source.split(/(\r?\n)/);
    // Separate the lines and newline sequences into separate arrays for easier referencing
    const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
    lines = lines.filter((_, idx) => idx % 2 === 0);
    let count = 0;
    const res = [];
    for (let i = 0; i < lines.length; i++) {
      count +=
        lines[i].length +
        ((newlineSequences[i] && newlineSequences[i].length) || 0);
      if (count >= start) {
        for (let j = i - range; j <= i + range || end > count; j++) {
          if (j < 0 || j >= lines.length) continue;
          const line = j + 1;
          res.push(
            `${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${
            lines[j]
          }`
          );
          const lineLength = lines[j].length;
          const newLineSeqLength =
            (newlineSequences[j] && newlineSequences[j].length) || 0;
          if (j === i) {
            // push underline
            const pad = start - (count - (lineLength + newLineSeqLength));
            const length = Math.max(
              1,
              end > count ? lineLength - pad : end - start
            );
            res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
          } else if (j > i) {
            if (end > count) {
              const length = Math.max(Math.min(end - count, lineLength), 1);
              res.push(`   |  ` + "^".repeat(length));
            }
            count += lineLength + newLineSeqLength;
          }
        }
        break;
      }
    }
    return res.join("\n");
  }
  //{{(.+?)}}
  var string$ = /`/g;

  function parse(html, options, elem) {
    html = html.trim();
    var re = /{{(.+?)}}/g,
      reExp =
        /(^( )?(var|let|const|await|if|for|else|{|}|#each|\/each|#if|:else|:else if|\/if|#with|\/with|debugger|@debug|\$:|;))(.*)?/g,
      code = "with(obj) { var r=[]; ",
      cursor = 0,
      result = "",
      match;
    code += "var _c = (msg)=>{ return r.push(msg)}; ";
    var add = function (line, js) {
      js
        ? (code += line.match(reExp)
            ? line
                .replace(/#each ((?:.|)+)/g, eachparse())
                .replace(/\/each/g, "\n}")
                .replace(/#if ((?:.|)+)/g, ifparse)
                .replace(/:else if ((?:.|)+)/g, elseifparse)
                .replace(/:else/g, elseparse)
                .replace(/\/if/g, "}")
                .replace(/#with ((?:.|)+)/g, withparse)
                .replace(/\/with/g, (_) => `}`)
                .replace(/@debug\s+?((?:.|)+)/g, debugparse)
                .replace(/\$:\s+((?:.|)+)/g, variableparse) + "\n"
            : "_c(" + line.replace(/!(--)?((?:.|)+)?/g, commentparse) + ");\n")
        : (code +=
            line != ""
              ? "_c(`" +
                line.replace(string$, "\\`").replace(/\${/g, "$\\{") +
                "`);"
              : "");

      return add;
    };
    while ((match = re.exec(html))) {
      add(html.slice(cursor, match.index))(match[1], true);
      cursor = match.index + match[0].length;
    }

    add(html.substr(cursor, html.length - cursor));
    code = (code + 'return r.join(""); }').replace(/[\t]/g, "").trim();
    try {
      result = new Function("obj", code).apply(options, [options]);
    } catch (err) {
      warn(
        "Compiler " +
          err.name +
          ": " +
          err.message +
          " at \n" +
          generateCodeFrame(options.template)
      );
    }
    return result;
  }

  function stringToHTML$__(str) {
    // Create document
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, "text/html");

    return doc.body || document.createElement("body");
  }

  /**
   * Get the content from a node
   * @param  {Node}   node The node
   * @return {String}      The content
   */
  function getNodeContent(node) {
    return node.childNodes && node.childNodes.length ? null : node.textContent;
  }

  /**
   * Check if two nodes are different
   * @param  {Node}  node1 The first node
   * @param  {Node}  node2 The second node
   * @return {Boolean}     If true, they're not the same node
   */
  function isDifferentNode(node1, node2) {
    return (
      node1.nodeType !== node2.nodeType ||
      node1.tagName !== node2.tagName ||
      node1.id !== node2.id ||
      node1.src !== node2.src
    );
  }

  /**
   * Check if the desired node is further ahead in the DOM existingNodes
   * @param  {Node}     node           The node to look for
   * @param  {NodeList} existingNodes  The DOM existingNodes
   * @param  {Integer}  index          The indexing index
   * @return {Integer}                 How many nodes ahead the target node is
   */
  function aheadInTree(node, existingNodes, index) {
    return Array.from(existingNodes)
      .slice(index + 1)
      .find(function (branch) {
        return !isDifferentNode(node, branch);
      });
  }

  /**
   * If there are extra elements in DOM, remove them
   * @param  {Array} existingNodes      The existing DOM
   * @param  {Array} templateNodes The template
   */
  function trimExtraNodes(existingNodes, templateNodes) {
    let extra = existingNodes.length - templateNodes.length;
    if (extra < 1) return;
    for (; extra > 0; extra--) {
      existingNodes[existingNodes.length - 1].remove();
    }
  }

  /**
   * Diff the existing DOM node versus the template
   * @param  {Element} template The template HTML
   * @param  {Node}  elem     The current DOM HTML
   * @param  {Array} polyps   Attached components for this element
   */
  function compiler(template, elem, polyps = []) {
    // Get arrays of child nodes
    let domMap = elem.childNodes;
    let templateMap = template.childNodes;
    // Diff each item in the templateMap
    templateMap.forEach(function (node, index) {
      if (template.querySelectorAll("template")) {
        var temps = template.querySelectorAll("template");
        for (var temp of temps) {
          const fragg = document.createElement("div");
          fragg.innerHTML = temp.innerHTML;
          temp.replaceWith(fragg);
        }
      }
      // If element doesn't exist, create it
      if (!domMap[index]) {
        elem.append(node.cloneNode(true));
        return;
      }
      // If element is not the same type, update the DOM accordingly
      if (isDifferentNode(node, domMap[index])) {
        // Check if node exists further in the tree
        let ahead = aheadInTree(node, domMap, index);

        // If not, insert the node before the current one
        if (!ahead) {
          domMap[index].before(node.cloneNode(true));
          return;
        }

        // Otherwise, move it to the current spot
        domMap[index].before(ahead);
      }
      // If element is an attached component, skip it
      let isPolyp = polyps.filter(function (polyp) {
        return ![3, 8].includes(node.nodeType) && node.matches(polyp);
      });

      if (isPolyp.length > 0) return;
      // If content is different, update it
      let templateContent = getNodeContent(node);
      if (templateContent && templateContent !== getNodeContent(domMap[index])) {
        domMap[index].textContent = templateContent;
      }

      // If target element should be empty, wipe it
      if (domMap[index].childNodes.length > 0 && node.childNodes.length < 1) {
        domMap[index].innerHTML = "";
        return;
      }

      // If element is empty and shouldn't be, build it up
      // This uses a document fragment to minimize reflows
      if (domMap[index].childNodes.length < 1 && node.childNodes.length > 0) {
        let fragment = document.createDocumentFragment();
        compiler(node, fragment, polyps);
        domMap[index].appendChild(fragment);
        return;
      }

      // If there are existing child elements that need to be modified, diff them
      if (node.childNodes.length > 0) {
        compiler(node, domMap[index], polyps);
      }
    });

    // If extra elements in DOM, remove them
    trimExtraNodes(domMap, templateMap);
  }
  var processor = function (elem, template, data) {
    if (elem instanceof Element) {
      var temp = stringToHTML(template);
      if (temp.childElementCount > 1) {
        warn(
          "Multiple root nodes returned from template. Template",
          "should return a single root node. \n",
          temp.innerHTML,
          "\n" +
            "^".repeat(
              temp.innerHTML.length / temp.lastChild.textContent.length - 2
            )
        );
        return;
      }
      if (temp.querySelector("script")) {
        warn(
          "<script> inside template will not be compiled and will give errors"
        );
      }

      if (temp.querySelector("style")) {
        warn("<style> inside template will not be compiled and will give errors");
      }

      compiler(stringToHTML$__(parse(template, data)), elem);
    } else {
      warn(typeof elem + " not a Node");
    }
  };
  function event(data, expression, elem, evt) {
    var _$ = "with(obj){ var $on = []; var _on = (c)=> $on.push(c);";
    _$ += "_on((($event,$self)=>{" + expression + "})($event,$self));";
    _$ = _$ + 'return $on.join("") }';
    try {
      new Function("obj", "$event", "$self", _$).apply(data, [data, evt, elem]);
    } catch (err) {
      const message__ =
        "Compiler (Event) " +
        err.name +
        ": " +
        err.message +
        " found at: \n" +
        elem.outerHTML +
        "\n" +
        "^".repeat(elem.outerHTML.length) +
        "\n";
      warn(message__);
    }
  }
  function attributeparser(data, elem$$, self) {
    var result;
    var code = "with (obj) { var att = []; var _a = (c)=> att.push(c);";
    code += `_a(${elem$$});`;
    code = code + 'return att.join(""); }';
    try {
      result = new Function("obj", code).apply(data, [data]);
    } catch (err) {
      const message__ =
        "Compiler (Directives) " +
        err.name +
        ": " +
        err.message +
        " found at: \n" +
        self.outerHTML +
        "\n^^^^^^^^\n";
      warn(message__);
    }
    return result;
  }
  var warnDuplicate = function (target, key, property) {
    warn(
      'Property "' +
        key +
        '" is already defined in the ' +
        property +
        "property" +
        target || ""
    );
  };

  /**
   * @param {Element|String} el
   */
  function query(el) {
    if (typeof el === "string") {
      var elem = document.querySelector(el);
      if (!elem) {
        warn("Can't find this element " + el);
        return document.createElement("div");
      }
      return elem;
    } else {
      if (el.shadowRoot) {
        return el.shadowRoot.host;
      } else {
        return el;
      }
    }
  }

  /**
   * @param {string} id
   */
  function idToTemplate(id) {
    var el = query(id);
    if (el.tagName.toLowerCase() !== "script") {
      warn(`Template element with id ${id}, must be a <script> element
      Instead of <${el.tagName.toLowerCase()} id='${id.replace(/#/g, "")}' ${
      el.hasAttribute("class")
        ? `class="${el.getAttribute("class")}"`
        : el.hasAttribute("style")
        ? `style="${el.getAttribute("style")}"`
        : ""
    } ...>...</${el.tagName.toLowerCase()}> Use <script type="text/dative" id="${id.replace(
      /#/g,
      ""
    )}" ...>...</script>`);
      return;
    }
    return el && el.innerHTML;
  }

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  function uuid_() {
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }
  /**
   * Prefix for directives
   */
  function prefix(subject = "") {
    return "dv-" + subject;
  }
  function valps(val, data) {
    var sub = val.split(".");
    if (sub.length > 1) {
      var temp = data;
      sub.forEach((item) => {
        if (!temp[item]) return;
        temp = temp[item];
      });
      return temp;
    } else if (!data[val]) return;
    return data[val];
  }

  /**
   * @param {Dative} Dative
   */
  function initRender(Dative) {
    /**
     * @param {string|object} obj new object for the data
     * @param {any} data new object for the data
     **/
    Dative.prototype.set = function set(obj, data) {
      var $this = this;
      if (typeof obj !== "object") {
        $this[obj] = data;
        $this.render();
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            $this[key] = obj[key];
            $this.render();
          }
        }
      }
    };
    Dative.prototype.get = function get(value = "") {
      return value === "" ? this : valps(value, this);
    };
    function kebabToCamel(str, options = { prefix: "", ignorePrefix: "" }) {
      const { prefix, ignorePrefix } = options;
      let ignoredStr = str;
      if (
        ignorePrefix !== undefined &&
        ignorePrefix !== null &&
        ignorePrefix !== ""
      ) {
        ignoredStr = ignoredStr.replace(new RegExp(`^${ignorePrefix}-`), "");
      }
      const camelStr = ignoredStr
        .split("-")
        .filter((s) => s !== "")
        .reduce((r, s) => (r = r + `${s[0].toUpperCase()}${s.slice(1)}`));
      if (prefix !== undefined && prefix !== null && prefix !== "") {
        return `${prefix}${camelStr.replace(/^([a-z])/, (m, p) =>
        p.toUpperCase()
      )}`;
      }
      return camelStr;
    }
    /**
     *
     * @param {Element} target
     * @param {string} key
     * @param {Element} elem
     * @param {boolean} isDirective
     */
    var warnDuplicate$ = function (target, key, elem, isDirective = false) {
      target &&
        warn(
          `'${key}' is in ${elem} already.Do not duplicate ${
          isDirective ? "directives" : "attributes"
        }`
        );
    };

    /**
     *
     * @param {Array<any>} polyps
     * @param {any} dv
     * @returns {void}
     */
    function renderPolyps(polyps, dv) {
      if (!polyps) return;
      polyps.forEach(function (component) {
        if (component.attached.includes(dv))
          return err(
            `"${dv.$el}" has attached nodes that it is also attached to, creating an infinite loop.`
          );
        if ("render" in component) component.render();
      });
    }
    /**
     * Credits: DativeAnimate
     * @link https://tobithedev.github.io/dative-animation
     * @param {HTMLElement|Element} el Element to be animated
     * @param {Number} duration duration for the animation
     * @param {Number} delay
     * @param {Boolean} once
     */
    function fadeIn(el, duration, delay = 0, once = true) {
      var op = 0;
      var animate = el.animate([{ opacity: op }, { display: "block" }], {
        duration,
        delay,
        easing: "linear",
      });
      var timer = setInterval(function () {
        if (op >= 1.0) {
          clearInterval(timer);
          if (once) {
            animate.pause();
          }
        }
        animate = el.animate([{ transition: "2s" }, { opacity: op }], {
          duration,
          delay,
          easing: "linear",
        });
        op = op + 0.1;
        if (once) {
          animate.cancel();
        }
      }, duration);
    }

    /**
     * Credits: DativeAnimate
     * @param {HTMLElement|Element} el Element to be animated
     * @param {Number} duration duration for the animation
     * @param {Number} delay
     * @param {Boolean} once
     */
    function bounce(el, duration, delay = 0, once = false) {
      var animate = el.animate(
        [
          {
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
            transform: "translateY(-25%)",
          },
          {
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
            transform: "translateY(0)",
          },
        ],
        {
          duration,
          delay,
          easing: "linear",
          iterations: Infinity,
        }
      );
      if (once === true) {
        animate.cancel();
      }
    }
    /**
     * returns the template to the dom
     * @returns {Element}
     **/
    Dative.prototype.render = function () {
      var $app = this;
      $app.kebabToCamel = kebabToCamel;
      let template = this.options.template || "";
      if (typeof template === "string") {
        if (template[0] === "#") {
          template = idToTemplate(template);
        }
      }
      /** @type {string} */
      this.template = template;
      $app.isMounted = true;
      $app.isUnmounted = false;
      $app.$el.dative_app = $app;
      /** @type {Element} */
      var elem = this.$el;
      if ($app.isMounted) {
        $app.attached.map(function (polyp) {
          return polyp.$el;
        });
        processor(elem, template.trim(), this);

        renderPolyps($app.attached, $app);
        for (const el of elem.querySelectorAll("*")) {
          if ($app.options.css) {
            el.setAttribute("data-dative-css", $app.cssId_);
          }
          for (const name of el.getAttributeNames()) {
            if (name.startsWith(prefix("on:")) || name.startsWith("on:")) {
              var eventName = name.slice(6);
              if (name.startsWith("on:")) {
                eventName = name.slice(3);
              }

              const handlerName = el.getAttribute(name);
              if ($app.events) {
                for (const events in $app.events) {
                  const vall = $app.events[events];
                  // console.log(events,vall);
                  if (eventName === events) {
                    vall(el, event.bind(this));
                  }
                }
              }
              el.addEventListener(eventName, (evt) => {
                event(this, handlerName, el, evt);
              });

              el.removeAttribute(name);
            } else if (name.startsWith("transition")) {
              name.slice(11);
              var transyName = el.getAttribute(name);
              let modifiersregexp = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
              let modifiers = modifiersregexp.map((i) => i.replace(".", ""));
              var transitionMap = {
                enter: function enter(klass) {
                  el.classList.add(klass + "-enter");
                },
                "before-enter": function enter(klass) {
                  el.classList.add(klass + "-before-enter");
                },
                leave: function enter(klass) {
                  el.classList.add(klass + "-leave");
                },
                "before-leave": function enter(klass) {
                  el.classList.add(klass + "-before-leave");
                },
              };
              if (transyName !== null) {
                modifiers.map(($value) => {
                  if ($value == "leave") transitionMap[$value](transyName);
                  else if ($value == "enter") transitionMap[$value](transyName);
                  else if ($value == "before-enter")
                    transitionMap[$value](transyName);
                  else if ($value == "before-leave")
                    transitionMap[$value](transyName);
                });
              } else {
                modifiers.map(($value) => {
                  if ($value == "leave") {
                    el.style.transition = {
                      opacity: 0,
                      transform: `scale(1)`,
                    };
                  } else if ($value == "enter") {
                    el.style.transition = {
                      opacity: 1,
                      transform: `scale(1)`,
                    };
                  } else if ($value == "before-enter") {
                    el.style.transition = {
                      opacity: 0,
                      transform: `scale(1)`,
                    };
                  } else if ($value == "before-leave") {
                    el.style.transition = {
                      opacity: 1,
                      transform: `scale(1)`,
                    };
                  }
                });
              }
              el.removeAttribute(name);
            } else if (name.startsWith("animate:") || name.startsWith("@")) {
              var animation_name = name.slice(8);
              if (name.startsWith("@")) {
                animation_name = name.slice(1);
              }
              const checkani = el.getAttribute(name).split(",");

              var animationName = {
                duration: checkani[0],
                delay: checkani[1],
                ease: checkani[2],
              };
              const delay = animationName.delay;
              const duration = animationName.duration;
              const ease = animationName.ease;
              if ($app.animate) {
                for (const animate in $app.animate) {
                  const vall = $app.animate[animate];
                  const setStyle = (options) => {
                    for (const key in options) {
                      if (Object.hasOwnProperty.call(options, key)) {
                        const property = options[key];
                        el.style[key] = property;
                      }
                    }
                  };
                  if (animation_name === animate) {
                    vall({
                      animate: el.animate.bind(el),
                      setStyle,
                      duration: Number(duration),
                      delay: Number(delay),
                      ease: ease,
                    });
                  }
                }
              }
              if (animation_name === "fadein") {
                fadeIn(el, Number(duration) || 200, Number(delay) || 200);
              } else if (animation_name === "bounce") {
                bounce(el, Number(duration) || 200, Number(delay) || 200);
              }
              el.removeAttribute(name);
            } else if (name === prefix("ref") || name === "ref") {
              if (el.ref) {
                warnDuplicate$(el, "ref", el, true);
                return;
              }
              const refName = el.getAttribute(name);
              this.$ref[refName] = el;
              el.removeAttribute(name);
            } else if (name.startsWith("#")) {
              if (el.ref) {
                warnDuplicate$(el, "ref", el, true);
                return;
              }
              const refName = name.slice(1);
              this.$ref[refName] = el;
              el.removeAttribute(name);
            } else if (
              name.startsWith(prefix("bind:")) ||
              name.startsWith("bind:")
            ) {
              let propName = name.slice(8);
              if (name.startsWith("bind:")) {
                propName = name.slice(5);
              }
              const dataName = el.getAttribute(name);
              if (propName === "this") {
                if (el.ref) {
                  warnDuplicate$(el, "bind:this", el, true);
                  return;
                }
                this.$ref[dataName] = el;
                el.removeAttribute(name);
              } else {
                el[this.kebabToCamel(propName)] = attributeparser(
                  this,
                  dataName,
                  el
                );
                el.removeAttribute(name);
              }
            } else if (name === prefix("cloak")) {
              if (el.getAttribute(name) !== "") {
                warn(
                  "`dv-cloak` doesn't accepts any value.\nShould be\n<" +
                    el.tagName.toLowerCase() +
                    " dv-cloak ...>...</" +
                    el.tagName.toLowerCase() +
                    ">"
                );
              }
              queueMicrotask(() => el.removeAttribute(name));
            }

            for (var keys in $app.directives) {
              var val = $app.directives[keys];
              if (typeof val === "function") {
                var $name = keys;
                if (name.startsWith(prefix($name))) {
                  var binding = el.getAttribute(name);
                  let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
                  val(el, {
                    bind: {
                      value: attributeparser(this, binding, el),
                      args: name.split(":")[1],
                      name: name,
                      expression: binding,
                      modifiers: modifiers.map((i) => i.replace(".", "")),
                    },
                  });
                  val._dv_directives_ = el._dv_directives_ = {
                    active: true,
                    args: name.split(":")[1],
                    value: attributeparser(this, binding, el),
                    expression: binding,
                    name: name,
                    modifiers: modifiers.map((i) => i.replace(".", "")),
                  };
                  el.removeAttribute(name);
                }
              }
            }
          }
        }

        return elem;
      }
    };
    /**
     * Attach a component to this one
     * @param  {Function|Array<Function>} component The component(s) to attach
     */
    Dative.prototype.attach = function (component) {
      var ref = this;
      // Attach components
      let polyps = type(component) === "array" ? component : [component];
      for (let polyp of polyps) {
        ref.attached.push(polyp);
      }
    };
  }

  /**
   * Detach a linked component to this one
   * @param  {Function|Array<Function>} component The linked component(s) to detach
   */
  Dative.prototype.detach = function (component) {
    // Detach components
    let polyps = type(component) === "array" ? component : [component];
    for (let polyp of polyps) {
      let index = this.attached.indexOf(polyp);
      if (index < 0) return;
      this.attached.splice(index, 1);
    }
  };
  /**
   * @param {String} str
   * @param {boolean} expectsLowerCase
   */
  function makeMap(str, expectsLowerCase) {
    const map = Object.create(null);
    const list = str.split(",");
    for (let lists in list) {
      map[list[lists]] = true;
    }
    return expectsLowerCase
      ? (val) => !!map[val.toLowerCase()]
      : (val) => !!map[val];
  }

  var BuiltinNames = makeMap(
    "object, function,switch,const,eval,var,let,Object,Array,in,of,if,else,instanceof,this,class,export,import,default,try,catch"
  );

  /**
   * @param {Dative} dative
   */
  function initMethods(dative) {
    let methods = dative.methods;
    if (methods) {
      for (const key in methods) {
        if (key in dative.data) {
          warnDuplicate(this, key, "data");
          return;
        }
        if (BuiltinNames(key)) {
          warn(
            "Don't use Valid Javascript Builtin names for functions in methods to avoid errors"
          );
        }
        if (typeof methods[key] !== "function") {
          warn(
            `Method "${key}" has type "${typeof methods[
            key
          ]}" in the component definition. ` +
              `Did you reference the function correctly?`
          );
          return;
        }
        if (key in dative && isReserved(key)) {
          warn(
            `Method "${key}" conflicts with an existing Dative instance method. ` +
              `Avoid defining component methods that start with _ or $.`
          );
          return;
        }
        dative[key] =
          methods[key] == null
            ? config.noop
            : typeof methods[key] == "function"
            ? methods[key].bind(dative)
            : "";
        dative[key]._dv_function = true;
      }
    }
  }

  /**
   * idtotemplate converter for style
   * @param {string} id
   */
  function idToTemplate$1(id) {
    var el = query(id);
    if (el.tagName.toLowerCase() !== "style") {
      warn(
        `Template element with id ${id}, must be a <style> element.\nInstead of <${el.tagName.toLowerCase()} id='${id.replace(
        /#/g,
        ""
      )}' ${
        el.hasAttribute("class")
          ? `class="${el.getAttribute("class")}"`
          : el.hasAttribute("style")
          ? `style="${el.getAttribute("style")}"`
          : ""
      } ...>...</${el.tagName.toLowerCase()}> Use <style type="text/dss" id="${id.replace(
        /#/g,
        ""
      )}" ...>...</style>`
      );
      return;
    }
    return el && el.innerHTML;
  }
  /** @type {Number} */
  var $$uid = 0;

  /**
   * Install Dative plugin
   * @param  {Array<Dative>} args The Dative plugin
   */
  function use() {
    var arguments$1 = arguments;

    var _this = this;
    var plugins = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      plugins[_i] = arguments$1[_i];
    }
    plugins.forEach(function (p) {
      if (p.install && isFunction(p.install)) {
        p.install({
          proto: _this.constructor.prototype,
          Dative: _this.constructor,
          instance: _this,
        });
      } else {
        p({
          proto: _this.constructor.prototype,
          Dative: _this.constructor,
          instance: _this,
        });
      }
    });
    return this;
  }
  var ReservedProperties = makeMap("el,ref");

  class DeprecatedError extends Error {
    constructor(message) {
      super(message);
      this.name = "DeprecatedError";
      this.message = message;
    }
  }

  function depd(namespace) {
    return function deprecated(message) {
      console.warn(new DeprecatedError(`${namespace} ${message}`));
    };
  }function _init($this) {
      $this.oncreated = $this.options.oncreated || config.noop;
      $this.onmounted = $this.options.onmounted || config.noop;
      $this.methods = $this.options.methods || Object.create(null);
      $this.directives = $this.options.directives || Object.create(null);
      $this.animate = $this.options.animate || Object.create(null);
      $this.$ref = Object.create(null);
      $this.isUnmounted = false;
      $this.isMounted = false;
      $this.ondestroy = $this.options.ondestroy || config.noop;
      $this.attached = [];
      $this.sanitize = $this.options.sanitize === undefined ? false : $this.options.sanitize;
      $this.events = $this.options.events;
      if ($this.options.css) $this.cssId_ = uuid_();
      initData($this.options,$this);
      initMethods($this);
      var attach = $this.options.attach  ? (type($this.options.attach) === 'array' ? $this.options.attach : [$this.options.attach]) : [];
    if ($this.oncreated !== undefined && $this.oncreated !== null) {
        $this.oncreated();
      }  	
      var target = $this.options.el;
      if (target) {
        $this.mount(target);
      }
      $this._uid = $$uid+=1;
      if ($this.options.store) {
        tip('store options has been deprecated in Dyte '+(config.dyte ? config.dyte.version : '')+' and in DativeJs '+Dative.version+'.Access it globally after installing Dyte.\n`app.use(store);`');
      }
      if ($this.options.update) {
        tip('update options has been deprecated in '+Dative.version+'');
      }
      
    /**
     * initialize mounted hooks
    **/  
      if ($this.onmounted !== undefined && $this.onmounted !== null && ($this.$el instanceof Node)) {
        $this.onmounted();
      }else if($this.isUnmounted && $this.ondestroy !== null && $this.ondestroy !== undefined){
        $this.ondestroy();
      }
    const computed = $this.options.computed || Object.create(null);
    if (!computed) return false;
    for (let key in computed) {
      const value = computed[key];
      if (key in $this.data || key in $this.methods) {
        warnDuplicate($this,key, key in $this.data ? 'data' : 'methods');
        return;
      }
      if (typeof value === 'function') {
        Object.defineProperty($this, key, {
          get: value,
          enumerable: true,
          configurable: true,
        });
      }else if (typeof value === 'string' || typeof value !== 'function' && typeof value !== 'object') {
        warn(
          'computed options accepts ``Object|Function`` but got '+typeof value 
        );
        return;
      }else if (typeof value === 'object') {
        Object.defineProperty($this, key, {
          get: value.get || config.noop,
          set: value.set || config.noop,
          configurable: true,
        });
      }
    }
    var property$ = $this.options.property || Object.create(null);
    for (var prop in property$) {
     const vall = property$[prop];
     if (typeof vall === 'function'){
      Object.defineProperty($this,'$'+prop,{
        get: function propertygetter(){ 
          return vall($this)
        },
        configurable: true
      });
     }
    }
    
    
    
      
    if (attach.length) {
      attach.forEach(function(component) {
        if ('attach' in component) {
          component.attach($this);
        }
      });
    }
    
    if ($this.$el) $this.render();
    
  }

  /**
   * Create the Dative Application
   * @param {Object} options The component options
   */
  function Dative(options) {
    options = options || {};
    if (!('DOMParser' in window)) warn('Your Browser Doesnt support DativeJs.');
    if (!(this instanceof Dative)) warn('Dative Must be called as a constructor');
      var $this = this;
      $this.options = options;
      config.CurrentInstance = $this;
      var $plugins = $this.options.use || [];
      var styles = $this.options.css;
      
    if (styles) {
      warn('css options is not supported on per-instance. Use it in \n var Component = Dative.extend({ \n ...,\n css: \'/** Your css **/\' });\n var comp = new Component({ ... });');
    }
    if ($plugins) {
      if (Array.isArray($this.options.use)){ $this.use.apply($this, $this.options.use); }
    }
     _init($this);
  }

  Dative.prototype.mount = function(el){
    var $app = this;
      if (el) {
        $app.$el = query(el);
        $app.$el.setAttribute('data-dative-app','');
      }
      if ($app.$el == document.documentElement || $app.$el == document.body) {
        this.$el.remove();
        $app.isUnmounted = true;
        warn('Can\'t mount on <head> or <body>');
      }
    $app.render();
    return $app  
  };

  /**
   * Destroys the current instance
   */
  Dative.prototype.$destroy = function () {
    var $this = this;
    if ($this.isUnmounted) {
      warn("Instance can't be unmounted again");
    }
    if ($this.isMounted) {
      this.$el.firstChild.remove();
      delete this.onmounted;
      delete this.$el.dative_app;
      $this.isUnmounted = true;
      $this.isMounted = false;
      $this.ondestroy();
    } else {
      warn("Cannot use $destroy() on an instance that's not mounted");
    }
  };

  initRender(Dative);
  Dative.prototype.proxy = proxy;
  Dative.prototype.use = use;

  var configs = { enumerable: true, configurable: true };
  configs.get = function () {
    return config;
  };
  {
    configs.set = function () {
      warn(
        "Do not replace the Dative.config object, set individual fields instead."
      );
    };
  }
  Object.defineProperty(Dative, "config", configs);
  var WarnReserved$ = function (key, target) {
    warn(
      ["`" + key + "` is a reserved property.\n", "Try using another name"].join(
        ""
      ),
      target
    );
  };

  /**
   * @param {string} name name of the property
   * @param {Function} callback callback function
   */

  var property = function (name, callback) {
    if (ReservedProperties(name)) {
      WarnReserved$(name);
      return;
    }
    Object.defineProperty(Dative.prototype, "$" + name, {
      get: function propertygetter() {
        return callback();
      },
      set: function propertysetter(v) {
        warn("Dative.defineProperty is readonly");
      },
      configurable: true,
      enumerable: true,
    });
  };

  /**
   * @param {any} options
   */
  var defineApp = function defineApp(options) {
    if (options.data) {
      if (typeof options.data !== "function") {
        warn(`Data should be a function,But got ${typeof options.data}`);
        return;
      }
    }
    return new Dative(options);
  };

  function initProps(options, dative, prop) {
    let props = options.props;
    props = dative.props = props || Object.create(null);
    if (!Array.isArray(props) && !isPlainObject(props)) {
      props = {};
      warn("options props should return an object.");
    }

    const props_ = prop;
    for (let propss in props_) {
      if (typeof prop[propss] === "string" && dative.sanitize) {
        prop[propss] = sanitizeStr(prop[propss]);
      }
      if (!isReserved())
        dative.proxyProps(
          `props`,
          propss,
          props_[propss].type || props_[propss],
          propss,
          props_[propss].default
        );
    }
    observe(props);
  }
  function proxyProps(sourceKey, key, value, name, defaultvalue) {
    let self = this;
    Object.defineProperty(self, key, {
      configurable: true,
      enumerable: true,
      get: function reactivepropsgetter() {
        var va = self[sourceKey][key];
        if (value === String && typeof va !== "string") {
          warn(
            'Props "' +
              name +
              '" requires String as the value but got ' +
              typeof va
          );
          return "undefined";
        } else if (value === Number && typeof va !== "number") {
          warn(
            'Props "' +
              name +
              '" requires Number as the value but got ' +
              typeof va
          );
          return "undefined";
        } else if (value === Number && typeof va !== "number") {
          warn(
            'Props "' +
              name +
              '" requires Number as the value but got ' +
              typeof va
          );
          return "undefined";
        } else if (value === Function && typeof va !== "function") {
          warn(
            'Props "' +
              name +
              '" requires Function as the value but got ' +
              typeof va
          );
          return "undefined";
        } else if (value === Object && typeof va !== "object") {
          warn(
            'Props "' +
              name +
              '" requires Object as the value but got ' +
              typeof va
          );
          return "undefined";
        } else if (value === Array && type(va) !== "array") {
          warn(
            'Props "' +
              name +
              '" requires Array as the value but got ' +
              typeof va
          );
          return "undefined";
        } else if (value === Boolean && typeof va !== "boolean") {
          warn(
            'Props "' +
              name +
              '" requires Boolean as the value but got ' +
              typeof va
          );
          return "undefined";
        } else if (value === null) {
          return self[sourceKey][key] || defaultvalue;
        } else {
          return self[sourceKey][key] || defaultvalue;
        }
      },
      set: function reactivepropssetter(newVal) {
        if (value === String && typeof newVal !== "string") {
          warn(
            'Props "' +
              name +
              '" requires String as the value but got ' +
              typeof newVal
          );
          return;
        } else if (value === Number && typeof newVal !== "number") {
          warn(
            'Props "' +
              name +
              '" requires Number as the value but got ' +
              typeof newVal
          );
          return;
        } else if (value === Function && typeof newVal !== "function") {
          warn(
            'Props "' +
              name +
              '" requires Function as the value but got ' +
              typeof newVal
          );
          return;
        } else if (value === Object && typeof newVal !== "object") {
          warn(
            'Props "' +
              name +
              '" requires Object as the value but got ' +
              typeof newVal
          );
          return;
        } else if (value === Boolean && typeof newVal !== "boolean") {
          warn(
            'Props "' +
              name +
              '" requires Boolean as the value but got ' +
              typeof newVal
          );
          return;
        } else if (value === Array && type(newVal) !== "array") {
          warn(
            'Props "' +
              name +
              '" requires Array as the value but got ' +
              typeof newVal
          );
          return;
        } else if (value === null) {
          self[sourceKey][key] = newVal;
          self.render();
        } else {
          self[sourceKey][key] = newVal;
          self.render();
          return true;
        }
      },
    });
  }

  var PREFIX = "/* Dative.js component styles */";
  function makeStyle(id) {
    if (doc) {
      var el = doc.createElement("style");
      el.type = "text/css";
      el.setAttribute("data-dative-css", id || "");
      doc.getElementsByTagName("head")[0].appendChild(el);
      return el;
    }
  }
  function getStyle(id) {
    return (
      doc &&
      (doc.querySelector('[data-dative-css="' + id + '"]') || makeStyle(id))
    );
  }

  var remove = /\/\*(?:[\s\S]*?)\*\//g;
  var escape =
    /url\(\s*(['"])(?:\\[\s\S]|(?!\1).)*\1\s*\)|url\((?:\\[\s\S]|[^)])*\)|(['"])(?:\\[\s\S]|(?!\2).)*\2/gi;
  var value = /\0(\d+)/g;
  /**
   * Removes comments and strings from the given CSS to make it easier to parse.
   *
   * @param css
   * @param callback receives the cleaned CSS
   * @param additionalReplaceRules
   */
  function cleanCss(css, callback, additionalReplaceRules) {
    if (additionalReplaceRules === void 0) {
      additionalReplaceRules = [];
    }
    var values = [];
    css = css
      .replace(escape, function (match) {
        return "\0" + (values.push(match) - 1);
      })
      .replace(remove, "");
    additionalReplaceRules.forEach(function (pattern) {
      css = css.replace(pattern, function (match) {
        return "\0" + (values.push(match) - 1);
      });
    });
    var reconstruct = function (css) {
      return css.replace(value, function (_match, n) {
        return values[n];
      });
    };
    return callback(css, reconstruct);
  }
  var selectorsPattern = /(?:^|\}|\{|\x01)\s*([^\{\}\0\x01]+)\s*(?=\{)/g;
  var importPattern = /@import\s*\([^)]*\)\s*;?/gi;
  var importEndPattern = /\x01/g;
  var keyframesDeclarationPattern =
    /@keyframes\s+[^\{\}]+\s*\{(?:[^{}]+|\{[^{}]+})*}/gi;
  var selectorUnitPattern =
    /((?:(?:\[[^\]]+\])|(?:[^\s\+\>~:]))+)((?:::?[^\s\+\>\~\(:]+(?:\([^\)]+\))?)*\s*[\s\+\>\~]?)\s*/g;
  var excludePattern = /^(?:@|\d+%)/;
  var globe = /^(?:\:|\d+%)/g;
  var dataRvcGuidPattern = /\[data-dative-css~="[a-z0-9-]"]/g;
  function trim(str) {
    return str.trim();
  }
  function extractString(unit) {
    return unit.str;
  }
  function transformSelector(selector, parent) {
    var selectorUnits = [];
    var match;
    while ((match = selectorUnitPattern.exec(selector))) {
      selectorUnits.push({
        str: match[0],
        base: match[1],
        modifiers: match[2],
      });
    }
    // For each simple selector within the selector, we need to create a version
    // that a) combines with the id, and b) is inside the id
    var base = selectorUnits.map(extractString);
    var transformed = [];
    var i = selectorUnits.length;
    while (i--) {
      var appended = base.slice();
      // Pseudo-selectors should go after the attribute selector
      var unit = selectorUnits[i];
      appended[i] = unit.base + parent + unit.modifiers || "";
      var prepended = base.slice();
      prepended[i] = parent + " " + prepended[i];
      transformed.push(appended.join(" "), prepended.join(" "));
    }
    return transformed.join(", ");
  }
  function transformCss(css, id) {
    var dataAttr = '[data-dative-css~="' + id + '"]';
    var transformed;
    if (dataRvcGuidPattern.test(css)) {
      transformed = css.replace(dataRvcGuidPattern, dataAttr);
    } else {
      transformed = cleanCss(
        css,
        function (css, reconstruct) {
          css = css
            .replace(importPattern, "$&\x01")
            .replace(selectorsPattern, function (match, $1) {
              // don't transform at-rules and keyframe declarations
              if (excludePattern.test($1)) {
                return match;
              }
              if (globe.test($1)) return match;
              var selectors = $1.split(",").map(trim);
              var transformed =
                selectors
                  .map(function (selector) {
                    return transformSelector(selector, dataAttr);
                  })
                  .join(", ") + " ";
              return match.replace($1, transformed);
            })
            .replace(importEndPattern, "");
          return reconstruct(css);
        },
        [keyframesDeclarationPattern]
      );
    }
    return PREFIX + "\n" + transformed;
  }

  var extend = function extend(options) {
    if (options.el || options.target) {
      warn(
        `Dative.extend doesn't accept ${
        options.el
          ? "el: " + options.el
          : options.target
          ? "target: " + options.target
          : ""
      }.\nThe el or target should be pass to the var app = Dative.extend({...});\n new app({ ${
        options.el
          ? "el: '" + options.el + "'"
          : options.target
          ? "target: '" + options.target + "'"
          : ""
      }',.... })`
      );
      return;
    }
    /** @type {Dative} */
    var Parent = this;
    function DativeComponent(initialProps) {
      if (!(this instanceof DativeComponent)) {
        warn("Dative.extend class has to be called with the `new` keyboard");
        return;
      }
      var $this = this;
      $this.options = options;
      if (initialProps.el || initialProps.target) {
        $this.options.el = initialProps.el || initialProps.target;
      } else {
        $this.options.el = doc.createDocumentFragment();
      }
      var $plugins = $this.options.use || [];
      if ($plugins) {
        if (Array.isArray($this.options.use)) {
          $this.use.apply($this, $this.options.use);
        }
      }

      if ($this.options.data) {
        if (typeof $this.options.data !== "function") {
          tip(
            `Data should be a function,But got ${typeof $this.options.data}\n ${
            typeof $this.options.data === "object"
              ? "Replace data:{ \n \t msg: '....' \n } with data(){ return{ \n \t msg:'....' \n } }"
              : ""
          }`
          );
        }
      }

      if (!$this.options.attach && initialProps.attach) {
        $this.options.attach = initialProps.attach;
      }

      if (options.props && initialProps.props)
        initProps(initialProps, $this, options.props);

      _init($this);
      var styles = $this.options.css;
      $this.cssScoped = $this.options.cssScoped || true;
      const scoped = $this.cssScoped;
      if (styles) {
        if (styles[0] === "#") {
          styles = idToTemplate$1(styles);
        }

        var compiled_styles = parse(styles, $this);
        if (scoped) {
          var compiled = transformCss(compiled_styles, $this.cssId_);
          $this.css = {
            value: compiled_styles,
            transformed: { active: true, value: compiled },
          };
          if (doc.querySelector("style[data-dative-css]")) {
            var st = doc.querySelector("style[data-dative-css]");
            st.innerHTML = st.innerHTML + compiled;
          } else {
            var style = getStyle();
            style.innerHTML = compiled;
          }
        }
      }
    }
    initRender(DativeComponent);
    var proto = Object.create(Parent.prototype);
    proto.constructor = DativeComponent;
    //DativeComponent['super']
    DativeComponent.prototype = proto;
    DativeComponent.prototype.proxyProps = proxyProps;

    Object.defineProperties(DativeComponent, {
      extend: { value: Parent.extend, configurable: true, enumerable: true },
      defineApp: {
        value: Parent.defineApp,
        configurable: true,
        enumerable: true,
      },
      defineProperty: {
        value: Parent.defineProperty,
        configurable: true,
        enumerable: true,
      },
      utlis: {
        value: { warn: Parent.utlis.warn },
        configurable: true,
        enumerable: true,
      },
      version: { value: Parent.version, configurable: true, enumerable: true },
    });
    return DativeComponent;
  };

  var __version__ = "V2.0.0-alpha";
  Dative.version = __version__;
  Dative.defineProperty = property;
  Dative.defineApp = defineApp;
  Object.defineProperty(Dative, "utlis", {
    value: {
      warn: warn,
    },
    configurable: true,
    enumerable: true,
  });
  Dative.extend = extend;

  var deprecatedMethods = [
    "use",
    "importStyle",
    "ref",
    "reactive",
    "watchEffect",
  ];

  deprecatedMethods.forEach((methods) => {
    Object.defineProperty(Dative, methods, {
      /** @deprecated */
      value: function () {
        var deprecate = depd(methods);
        // tip(`${methods} Has been deprecated in v2-alpha`)
        deprecate(`Has been deprecated in v2-alpha`);
      },
      configurable: true,
      enumerable: true,
    });
  });

  if (inBrowser) {
    var welcomeIntro_1 = [
      "%cDative.js %c" + Dative.version + " %cin debug mode, %cmore...",
      "color: #FF3E00;font-weight: bold;",
      "color: #111; font-weight: 600;",
      "color: rgb(85, 85, 255); font-weight: normal;",
      "color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;",
    ];
    var message = [
      `You're running Dative ${Dative.version} in debug mode - messages will be printed to the console to help you fix problems and optimise your application.
    
  To disable debug mode, add this line at the start of your app:
  Dative.config.slient = true;
  
  Get help and support:
      http://dativejs.js.org`,
    ];
    if (config.slient === false) {
      if (typeof console !== "undefined") {
        var hasCollpased = !!console.groupCollapsed;
        if (hasCollpased) {
          console[hasCollpased ? "groupCollapsed" : "group"].apply(
            console,
            welcomeIntro_1
          );
          console[console.info ? "info" : "log"].apply(console, message);
          console.groupEnd();
        } else {
          console[console.info ? "info" : "log"].apply(console, message);
        }
      }
    }
  }

  /**
    * @dativejs/helper v1.0.0
    * (c) 2022-2022 Tobithedev <ucheemekatobi@gmail.com>
    * https://github.com/dativeJs/helper
    * Released under the MIT License.
  */
  var index = {
      install({Dative}){
       var $range = function (start, stop, step) {
                if (step === void 0) {
                  step = 1;
                }
    
                // Accept $range(10) and expect 1...10
               if (typeof stop === 'undefined') {
                  stop = start;
                  start = start ? 1 : 0;
               } // Accept $range(20, 10) and expect 20...10
    
    
                var reverse = start > stop;
    
                if (reverse) {
                  var _ref = [stop, start];
                  start = _ref[0];
                  stop = _ref[1];
                } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Sequence_generator_range
                var range = Array.from({
                  length: (stop - start) / step + 1
                }, function (_, i) {
                  return start + i * step;
                });
                return reverse ? range.reverse() : range;
            };
        Dative.defineProperty('range',()=>{
          return (start, stop, step)=>{
            return $range(start, stop, step)
          }
        });
        /**
         * @param {Function} callback (()=> console.log('hi'))
         * @param {Number} time delay
        */
        var $interval = function(callback,time){
          if (time == void 0) {
            time = 0;
          }
         return setInterval(callback,time);
        };
        var $timeout = function(callback,time){
          if (time == void 0) {
            time = 0;
          }
          return setTimeout(callback, time);
        };
        
        Dative.defineProperty('interval',()=>{
          return (callback,time)=>{
            return $interval(callback,time)
          }
        });
        
        Dative.defineProperty('timeout', () => {
          return (callback, time) => {
            return $timeout(callback, time)
          }
        });
        
        
        
        Dative.defineProperty('truncate', () => {
                return (...parameters) => {
                    if (typeof parameters[0] !== 'string') return parameters[0]
    
                    // If the second parameter isn't truthy, return the full string
                    if (!parameters[1]) return parameters[0]
    
                    // if only a number or string is passed in, keep it simple
                    if (typeof parameters[1] !== 'object') {
                        return appendEllipsis(parameters[0].slice(0, parameters[1]), parameters)
                    }
    
                    // If words or characters is set, also check that they are truthy. Setting to 0, for example, shoudld show all
                    if (Object.prototype.hasOwnProperty.call(parameters[1], 'words') && parameters[1].words) {
                        return appendEllipsis(parameters[0].split(' ').splice(0, parameters[1].words).join(' '), parameters)
                    }
                    if (Object.prototype.hasOwnProperty.call(parameters[1], 'characters') && parameters[1].characters) {
                        return appendEllipsis(parameters[0].slice(0, parameters[1].characters), parameters)
                    }
                    return parameters[0]
                }
            });
        
      function appendEllipsis(string, parameters) {
            if (parameters[0].length <= string.length) return string
            let ellipsis = '…';
            // 3rd parameter is an optional '…' override (soon to be deprecated)
            if (typeof parameters[2] !== 'undefined') {
                ellipsis = parameters[2];
            }
            // If the second parameter is an object
            if (Object.prototype.hasOwnProperty.call(parameters[1], 'ellipsis')) {
                ellipsis = parameters[1].ellipsis;
            }
            return string + ellipsis
        }
        class Config {
        constructor() {
            this.values = {
                breakpoints: {
                    xs: 0,
                    sm: 640,
                    md: 768,
                    lg: 1024,
                    xl: 1280,
                    '2xl': 1536,
                },
            };
        }
    
        get(property) {
            return this.values[property] ? this.values[property] : null
        }
    }
    
    const config = new Config();
    
        Dative.defineProperty('screen', () => {
          return (breakpoint) => {
            // Get current window width
            const width = window.innerWidth;
        
            // Early return if breakpoint is provided as number
            if (Number.isInteger(breakpoint)) return breakpoint <= width
        
            // Get breakpoints from Config
            const configBreakpoints = config.get('breakpoints');
        
            // Check if breakpoint exists
            if (configBreakpoints[breakpoint] === undefined) {
              Dative.utlis.warn('Undefined $screen property: ' + breakpoint);
            }
        
            // Finally compare breakpoint with window width and return as boolean
            return configBreakpoints[breakpoint] <= width
          }
        });
      }
    };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var prism = {exports: {}};

  (function (module) {
  /* **********************************************
       Begin prism-core.js
  ********************************************** */

  /// <reference lib="WebWorker"/>

  var _self = (typeof window !== 'undefined')
  	? window   // if in browser
  	: (
  		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
  			? self // if in worker
  			: {}   // if in node js
  	);

  /**
   * Prism: Lightweight, robust, elegant syntax highlighting
   *
   * @license MIT <https://opensource.org/licenses/MIT>
   * @author Lea Verou <https://lea.verou.me>
   * @namespace
   * @public
   */
  var Prism = (function (_self) {

  	// Private helper vars
  	var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
  	var uniqueId = 0;

  	// The grammar object for plaintext
  	var plainTextGrammar = {};


  	var _ = {
  		/**
  		 * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
  		 * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
  		 * additional languages or plugins yourself.
  		 *
  		 * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
  		 *
  		 * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
  		 * empty Prism object into the global scope before loading the Prism script like this:
  		 *
  		 * ```js
  		 * window.Prism = window.Prism || {};
  		 * Prism.manual = true;
  		 * // add a new <script> to load Prism's script
  		 * ```
  		 *
  		 * @default false
  		 * @type {boolean}
  		 * @memberof Prism
  		 * @public
  		 */
  		manual: _self.Prism && _self.Prism.manual,
  		/**
  		 * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
  		 * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
  		 * own worker, you don't want it to do this.
  		 *
  		 * By setting this value to `true`, Prism will not add its own listeners to the worker.
  		 *
  		 * You obviously have to change this value before Prism executes. To do this, you can add an
  		 * empty Prism object into the global scope before loading the Prism script like this:
  		 *
  		 * ```js
  		 * window.Prism = window.Prism || {};
  		 * Prism.disableWorkerMessageHandler = true;
  		 * // Load Prism's script
  		 * ```
  		 *
  		 * @default false
  		 * @type {boolean}
  		 * @memberof Prism
  		 * @public
  		 */
  		disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,

  		/**
  		 * A namespace for utility methods.
  		 *
  		 * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
  		 * change or disappear at any time.
  		 *
  		 * @namespace
  		 * @memberof Prism
  		 */
  		util: {
  			encode: function encode(tokens) {
  				if (tokens instanceof Token) {
  					return new Token(tokens.type, encode(tokens.content), tokens.alias);
  				} else if (Array.isArray(tokens)) {
  					return tokens.map(encode);
  				} else {
  					return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
  				}
  			},

  			/**
  			 * Returns the name of the type of the given value.
  			 *
  			 * @param {any} o
  			 * @returns {string}
  			 * @example
  			 * type(null)      === 'Null'
  			 * type(undefined) === 'Undefined'
  			 * type(123)       === 'Number'
  			 * type('foo')     === 'String'
  			 * type(true)      === 'Boolean'
  			 * type([1, 2])    === 'Array'
  			 * type({})        === 'Object'
  			 * type(String)    === 'Function'
  			 * type(/abc+/)    === 'RegExp'
  			 */
  			type: function (o) {
  				return Object.prototype.toString.call(o).slice(8, -1);
  			},

  			/**
  			 * Returns a unique number for the given object. Later calls will still return the same number.
  			 *
  			 * @param {Object} obj
  			 * @returns {number}
  			 */
  			objId: function (obj) {
  				if (!obj['__id']) {
  					Object.defineProperty(obj, '__id', { value: ++uniqueId });
  				}
  				return obj['__id'];
  			},

  			/**
  			 * Creates a deep clone of the given object.
  			 *
  			 * The main intended use of this function is to clone language definitions.
  			 *
  			 * @param {T} o
  			 * @param {Record<number, any>} [visited]
  			 * @returns {T}
  			 * @template T
  			 */
  			clone: function deepClone(o, visited) {
  				visited = visited || {};

  				var clone; var id;
  				switch (_.util.type(o)) {
  					case 'Object':
  						id = _.util.objId(o);
  						if (visited[id]) {
  							return visited[id];
  						}
  						clone = /** @type {Record<string, any>} */ ({});
  						visited[id] = clone;

  						for (var key in o) {
  							if (o.hasOwnProperty(key)) {
  								clone[key] = deepClone(o[key], visited);
  							}
  						}

  						return /** @type {any} */ (clone);

  					case 'Array':
  						id = _.util.objId(o);
  						if (visited[id]) {
  							return visited[id];
  						}
  						clone = [];
  						visited[id] = clone;

  						(/** @type {Array} */(/** @type {any} */(o))).forEach(function (v, i) {
  							clone[i] = deepClone(v, visited);
  						});

  						return /** @type {any} */ (clone);

  					default:
  						return o;
  				}
  			},

  			/**
  			 * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
  			 *
  			 * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
  			 *
  			 * @param {Element} element
  			 * @returns {string}
  			 */
  			getLanguage: function (element) {
  				while (element) {
  					var m = lang.exec(element.className);
  					if (m) {
  						return m[1].toLowerCase();
  					}
  					element = element.parentElement;
  				}
  				return 'none';
  			},

  			/**
  			 * Sets the Prism `language-xxxx` class of the given element.
  			 *
  			 * @param {Element} element
  			 * @param {string} language
  			 * @returns {void}
  			 */
  			setLanguage: function (element, language) {
  				// remove all `language-xxxx` classes
  				// (this might leave behind a leading space)
  				element.className = element.className.replace(RegExp(lang, 'gi'), '');

  				// add the new `language-xxxx` class
  				// (using `classList` will automatically clean up spaces for us)
  				element.classList.add('language-' + language);
  			},

  			/**
  			 * Returns the script element that is currently executing.
  			 *
  			 * This does __not__ work for line script element.
  			 *
  			 * @returns {HTMLScriptElement | null}
  			 */
  			currentScript: function () {
  				if (typeof document === 'undefined') {
  					return null;
  				}
  				if ('currentScript' in document && 1 < 2 /* hack to trip TS' flow analysis */) {
  					return /** @type {any} */ (document.currentScript);
  				}

  				// IE11 workaround
  				// we'll get the src of the current script by parsing IE11's error stack trace
  				// this will not work for inline scripts

  				try {
  					throw new Error();
  				} catch (err) {
  					// Get file src url from stack. Specifically works with the format of stack traces in IE.
  					// A stack will look like this:
  					//
  					// Error
  					//    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
  					//    at Global code (http://localhost/components/prism-core.js:606:1)

  					var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(err.stack) || [])[1];
  					if (src) {
  						var scripts = document.getElementsByTagName('script');
  						for (var i in scripts) {
  							if (scripts[i].src == src) {
  								return scripts[i];
  							}
  						}
  					}
  					return null;
  				}
  			},

  			/**
  			 * Returns whether a given class is active for `element`.
  			 *
  			 * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
  			 * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
  			 * given class is just the given class with a `no-` prefix.
  			 *
  			 * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
  			 * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
  			 * ancestors have the given class or the negated version of it, then the default activation will be returned.
  			 *
  			 * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
  			 * version of it, the class is considered active.
  			 *
  			 * @param {Element} element
  			 * @param {string} className
  			 * @param {boolean} [defaultActivation=false]
  			 * @returns {boolean}
  			 */
  			isActive: function (element, className, defaultActivation) {
  				var no = 'no-' + className;

  				while (element) {
  					var classList = element.classList;
  					if (classList.contains(className)) {
  						return true;
  					}
  					if (classList.contains(no)) {
  						return false;
  					}
  					element = element.parentElement;
  				}
  				return !!defaultActivation;
  			}
  		},

  		/**
  		 * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
  		 *
  		 * @namespace
  		 * @memberof Prism
  		 * @public
  		 */
  		languages: {
  			/**
  			 * The grammar for plain, unformatted text.
  			 */
  			plain: plainTextGrammar,
  			plaintext: plainTextGrammar,
  			text: plainTextGrammar,
  			txt: plainTextGrammar,

  			/**
  			 * Creates a deep copy of the language with the given id and appends the given tokens.
  			 *
  			 * If a token in `redef` also appears in the copied language, then the existing token in the copied language
  			 * will be overwritten at its original position.
  			 *
  			 * ## Best practices
  			 *
  			 * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
  			 * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
  			 * understand the language definition because, normally, the order of tokens matters in Prism grammars.
  			 *
  			 * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
  			 * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
  			 *
  			 * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
  			 * @param {Grammar} redef The new tokens to append.
  			 * @returns {Grammar} The new language created.
  			 * @public
  			 * @example
  			 * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
  			 *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
  			 *     // at its original position
  			 *     'comment': { ... },
  			 *     // CSS doesn't have a 'color' token, so this token will be appended
  			 *     'color': /\b(?:red|green|blue)\b/
  			 * });
  			 */
  			extend: function (id, redef) {
  				var lang = _.util.clone(_.languages[id]);

  				for (var key in redef) {
  					lang[key] = redef[key];
  				}

  				return lang;
  			},

  			/**
  			 * Inserts tokens _before_ another token in a language definition or any other grammar.
  			 *
  			 * ## Usage
  			 *
  			 * This helper method makes it easy to modify existing languages. For example, the CSS language definition
  			 * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
  			 * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
  			 * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
  			 * this:
  			 *
  			 * ```js
  			 * Prism.languages.markup.style = {
  			 *     // token
  			 * };
  			 * ```
  			 *
  			 * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
  			 * before existing tokens. For the CSS example above, you would use it like this:
  			 *
  			 * ```js
  			 * Prism.languages.insertBefore('markup', 'cdata', {
  			 *     'style': {
  			 *         // token
  			 *     }
  			 * });
  			 * ```
  			 *
  			 * ## Special cases
  			 *
  			 * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
  			 * will be ignored.
  			 *
  			 * This behavior can be used to insert tokens after `before`:
  			 *
  			 * ```js
  			 * Prism.languages.insertBefore('markup', 'comment', {
  			 *     'comment': Prism.languages.markup.comment,
  			 *     // tokens after 'comment'
  			 * });
  			 * ```
  			 *
  			 * ## Limitations
  			 *
  			 * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
  			 * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
  			 * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
  			 * deleting properties which is necessary to insert at arbitrary positions.
  			 *
  			 * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
  			 * Instead, it will create a new object and replace all references to the target object with the new one. This
  			 * can be done without temporarily deleting properties, so the iteration order is well-defined.
  			 *
  			 * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
  			 * you hold the target object in a variable, then the value of the variable will not change.
  			 *
  			 * ```js
  			 * var oldMarkup = Prism.languages.markup;
  			 * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
  			 *
  			 * assert(oldMarkup !== Prism.languages.markup);
  			 * assert(newMarkup === Prism.languages.markup);
  			 * ```
  			 *
  			 * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
  			 * object to be modified.
  			 * @param {string} before The key to insert before.
  			 * @param {Grammar} insert An object containing the key-value pairs to be inserted.
  			 * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
  			 * object to be modified.
  			 *
  			 * Defaults to `Prism.languages`.
  			 * @returns {Grammar} The new grammar object.
  			 * @public
  			 */
  			insertBefore: function (inside, before, insert, root) {
  				root = root || /** @type {any} */ (_.languages);
  				var grammar = root[inside];
  				/** @type {Grammar} */
  				var ret = {};

  				for (var token in grammar) {
  					if (grammar.hasOwnProperty(token)) {

  						if (token == before) {
  							for (var newToken in insert) {
  								if (insert.hasOwnProperty(newToken)) {
  									ret[newToken] = insert[newToken];
  								}
  							}
  						}

  						// Do not insert token which also occur in insert. See #1525
  						if (!insert.hasOwnProperty(token)) {
  							ret[token] = grammar[token];
  						}
  					}
  				}

  				var old = root[inside];
  				root[inside] = ret;

  				// Update references in other language definitions
  				_.languages.DFS(_.languages, function (key, value) {
  					if (value === old && key != inside) {
  						this[key] = ret;
  					}
  				});

  				return ret;
  			},

  			// Traverse a language definition with Depth First Search
  			DFS: function DFS(o, callback, type, visited) {
  				visited = visited || {};

  				var objId = _.util.objId;

  				for (var i in o) {
  					if (o.hasOwnProperty(i)) {
  						callback.call(o, i, o[i], type || i);

  						var property = o[i];
  						var propertyType = _.util.type(property);

  						if (propertyType === 'Object' && !visited[objId(property)]) {
  							visited[objId(property)] = true;
  							DFS(property, callback, null, visited);
  						} else if (propertyType === 'Array' && !visited[objId(property)]) {
  							visited[objId(property)] = true;
  							DFS(property, callback, i, visited);
  						}
  					}
  				}
  			}
  		},

  		plugins: {},

  		/**
  		 * This is the most high-level function in Prism’s API.
  		 * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
  		 * each one of them.
  		 *
  		 * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
  		 *
  		 * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
  		 * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
  		 * @memberof Prism
  		 * @public
  		 */
  		highlightAll: function (async, callback) {
  			_.highlightAllUnder(document, async, callback);
  		},

  		/**
  		 * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
  		 * {@link Prism.highlightElement} on each one of them.
  		 *
  		 * The following hooks will be run:
  		 * 1. `before-highlightall`
  		 * 2. `before-all-elements-highlight`
  		 * 3. All hooks of {@link Prism.highlightElement} for each element.
  		 *
  		 * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
  		 * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
  		 * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
  		 * @memberof Prism
  		 * @public
  		 */
  		highlightAllUnder: function (container, async, callback) {
  			var env = {
  				callback: callback,
  				container: container,
  				selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
  			};

  			_.hooks.run('before-highlightall', env);

  			env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

  			_.hooks.run('before-all-elements-highlight', env);

  			for (var i = 0, element; (element = env.elements[i++]);) {
  				_.highlightElement(element, async === true, env.callback);
  			}
  		},

  		/**
  		 * Highlights the code inside a single element.
  		 *
  		 * The following hooks will be run:
  		 * 1. `before-sanity-check`
  		 * 2. `before-highlight`
  		 * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
  		 * 4. `before-insert`
  		 * 5. `after-highlight`
  		 * 6. `complete`
  		 *
  		 * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
  		 * the element's language.
  		 *
  		 * @param {Element} element The element containing the code.
  		 * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
  		 * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
  		 * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
  		 * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
  		 *
  		 * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
  		 * asynchronous highlighting to work. You can build your own bundle on the
  		 * [Download page](https://prismjs.com/download.html).
  		 * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
  		 * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
  		 * @memberof Prism
  		 * @public
  		 */
  		highlightElement: function (element, async, callback) {
  			// Find language
  			var language = _.util.getLanguage(element);
  			var grammar = _.languages[language];

  			// Set language on the element, if not present
  			_.util.setLanguage(element, language);

  			// Set language on the parent, for styling
  			var parent = element.parentElement;
  			if (parent && parent.nodeName.toLowerCase() === 'pre') {
  				_.util.setLanguage(parent, language);
  			}

  			var code = element.textContent;

  			var env = {
  				element: element,
  				language: language,
  				grammar: grammar,
  				code: code
  			};

  			function insertHighlightedCode(highlightedCode) {
  				env.highlightedCode = highlightedCode;

  				_.hooks.run('before-insert', env);

  				env.element.innerHTML = env.highlightedCode;

  				_.hooks.run('after-highlight', env);
  				_.hooks.run('complete', env);
  				callback && callback.call(env.element);
  			}

  			_.hooks.run('before-sanity-check', env);

  			// plugins may change/add the parent/element
  			parent = env.element.parentElement;
  			if (parent && parent.nodeName.toLowerCase() === 'pre' && !parent.hasAttribute('tabindex')) {
  				parent.setAttribute('tabindex', '0');
  			}

  			if (!env.code) {
  				_.hooks.run('complete', env);
  				callback && callback.call(env.element);
  				return;
  			}

  			_.hooks.run('before-highlight', env);

  			if (!env.grammar) {
  				insertHighlightedCode(_.util.encode(env.code));
  				return;
  			}

  			if (async && _self.Worker) {
  				var worker = new Worker(_.filename);

  				worker.onmessage = function (evt) {
  					insertHighlightedCode(evt.data);
  				};

  				worker.postMessage(JSON.stringify({
  					language: env.language,
  					code: env.code,
  					immediateClose: true
  				}));
  			} else {
  				insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
  			}
  		},

  		/**
  		 * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
  		 * and the language definitions to use, and returns a string with the HTML produced.
  		 *
  		 * The following hooks will be run:
  		 * 1. `before-tokenize`
  		 * 2. `after-tokenize`
  		 * 3. `wrap`: On each {@link Token}.
  		 *
  		 * @param {string} text A string with the code to be highlighted.
  		 * @param {Grammar} grammar An object containing the tokens to use.
  		 *
  		 * Usually a language definition like `Prism.languages.markup`.
  		 * @param {string} language The name of the language definition passed to `grammar`.
  		 * @returns {string} The highlighted HTML.
  		 * @memberof Prism
  		 * @public
  		 * @example
  		 * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
  		 */
  		highlight: function (text, grammar, language) {
  			var env = {
  				code: text,
  				grammar: grammar,
  				language: language
  			};
  			_.hooks.run('before-tokenize', env);
  			if (!env.grammar) {
  				throw new Error('The language "' + env.language + '" has no grammar.');
  			}
  			env.tokens = _.tokenize(env.code, env.grammar);
  			_.hooks.run('after-tokenize', env);
  			return Token.stringify(_.util.encode(env.tokens), env.language);
  		},

  		/**
  		 * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
  		 * and the language definitions to use, and returns an array with the tokenized code.
  		 *
  		 * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
  		 *
  		 * This method could be useful in other contexts as well, as a very crude parser.
  		 *
  		 * @param {string} text A string with the code to be highlighted.
  		 * @param {Grammar} grammar An object containing the tokens to use.
  		 *
  		 * Usually a language definition like `Prism.languages.markup`.
  		 * @returns {TokenStream} An array of strings and tokens, a token stream.
  		 * @memberof Prism
  		 * @public
  		 * @example
  		 * let code = `var foo = 0;`;
  		 * let tokens = Prism.tokenize(code, Prism.languages.javascript);
  		 * tokens.forEach(token => {
  		 *     if (token instanceof Prism.Token && token.type === 'number') {
  		 *         console.log(`Found numeric literal: ${token.content}`);
  		 *     }
  		 * });
  		 */
  		tokenize: function (text, grammar) {
  			var rest = grammar.rest;
  			if (rest) {
  				for (var token in rest) {
  					grammar[token] = rest[token];
  				}

  				delete grammar.rest;
  			}

  			var tokenList = new LinkedList();
  			addAfter(tokenList, tokenList.head, text);

  			matchGrammar(text, tokenList, grammar, tokenList.head, 0);

  			return toArray(tokenList);
  		},

  		/**
  		 * @namespace
  		 * @memberof Prism
  		 * @public
  		 */
  		hooks: {
  			all: {},

  			/**
  			 * Adds the given callback to the list of callbacks for the given hook.
  			 *
  			 * The callback will be invoked when the hook it is registered for is run.
  			 * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
  			 *
  			 * One callback function can be registered to multiple hooks and the same hook multiple times.
  			 *
  			 * @param {string} name The name of the hook.
  			 * @param {HookCallback} callback The callback function which is given environment variables.
  			 * @public
  			 */
  			add: function (name, callback) {
  				var hooks = _.hooks.all;

  				hooks[name] = hooks[name] || [];

  				hooks[name].push(callback);
  			},

  			/**
  			 * Runs a hook invoking all registered callbacks with the given environment variables.
  			 *
  			 * Callbacks will be invoked synchronously and in the order in which they were registered.
  			 *
  			 * @param {string} name The name of the hook.
  			 * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
  			 * @public
  			 */
  			run: function (name, env) {
  				var callbacks = _.hooks.all[name];

  				if (!callbacks || !callbacks.length) {
  					return;
  				}

  				for (var i = 0, callback; (callback = callbacks[i++]);) {
  					callback(env);
  				}
  			}
  		},

  		Token: Token
  	};
  	_self.Prism = _;


  	// Typescript note:
  	// The following can be used to import the Token type in JSDoc:
  	//
  	//   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

  	/**
  	 * Creates a new token.
  	 *
  	 * @param {string} type See {@link Token#type type}
  	 * @param {string | TokenStream} content See {@link Token#content content}
  	 * @param {string|string[]} [alias] The alias(es) of the token.
  	 * @param {string} [matchedStr=""] A copy of the full string this token was created from.
  	 * @class
  	 * @global
  	 * @public
  	 */
  	function Token(type, content, alias, matchedStr) {
  		/**
  		 * The type of the token.
  		 *
  		 * This is usually the key of a pattern in a {@link Grammar}.
  		 *
  		 * @type {string}
  		 * @see GrammarToken
  		 * @public
  		 */
  		this.type = type;
  		/**
  		 * The strings or tokens contained by this token.
  		 *
  		 * This will be a token stream if the pattern matched also defined an `inside` grammar.
  		 *
  		 * @type {string | TokenStream}
  		 * @public
  		 */
  		this.content = content;
  		/**
  		 * The alias(es) of the token.
  		 *
  		 * @type {string|string[]}
  		 * @see GrammarToken
  		 * @public
  		 */
  		this.alias = alias;
  		// Copy of the full string this token was created from
  		this.length = (matchedStr || '').length | 0;
  	}

  	/**
  	 * A token stream is an array of strings and {@link Token Token} objects.
  	 *
  	 * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
  	 * them.
  	 *
  	 * 1. No adjacent strings.
  	 * 2. No empty strings.
  	 *
  	 *    The only exception here is the token stream that only contains the empty string and nothing else.
  	 *
  	 * @typedef {Array<string | Token>} TokenStream
  	 * @global
  	 * @public
  	 */

  	/**
  	 * Converts the given token or token stream to an HTML representation.
  	 *
  	 * The following hooks will be run:
  	 * 1. `wrap`: On each {@link Token}.
  	 *
  	 * @param {string | Token | TokenStream} o The token or token stream to be converted.
  	 * @param {string} language The name of current language.
  	 * @returns {string} The HTML representation of the token or token stream.
  	 * @memberof Token
  	 * @static
  	 */
  	Token.stringify = function stringify(o, language) {
  		if (typeof o == 'string') {
  			return o;
  		}
  		if (Array.isArray(o)) {
  			var s = '';
  			o.forEach(function (e) {
  				s += stringify(e, language);
  			});
  			return s;
  		}

  		var env = {
  			type: o.type,
  			content: stringify(o.content, language),
  			tag: 'span',
  			classes: ['token', o.type],
  			attributes: {},
  			language: language
  		};

  		var aliases = o.alias;
  		if (aliases) {
  			if (Array.isArray(aliases)) {
  				Array.prototype.push.apply(env.classes, aliases);
  			} else {
  				env.classes.push(aliases);
  			}
  		}

  		_.hooks.run('wrap', env);

  		var attributes = '';
  		for (var name in env.attributes) {
  			attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
  		}

  		return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
  	};

  	/**
  	 * @param {RegExp} pattern
  	 * @param {number} pos
  	 * @param {string} text
  	 * @param {boolean} lookbehind
  	 * @returns {RegExpExecArray | null}
  	 */
  	function matchPattern(pattern, pos, text, lookbehind) {
  		pattern.lastIndex = pos;
  		var match = pattern.exec(text);
  		if (match && lookbehind && match[1]) {
  			// change the match to remove the text matched by the Prism lookbehind group
  			var lookbehindLength = match[1].length;
  			match.index += lookbehindLength;
  			match[0] = match[0].slice(lookbehindLength);
  		}
  		return match;
  	}

  	/**
  	 * @param {string} text
  	 * @param {LinkedList<string | Token>} tokenList
  	 * @param {any} grammar
  	 * @param {LinkedListNode<string | Token>} startNode
  	 * @param {number} startPos
  	 * @param {RematchOptions} [rematch]
  	 * @returns {void}
  	 * @private
  	 *
  	 * @typedef RematchOptions
  	 * @property {string} cause
  	 * @property {number} reach
  	 */
  	function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
  		for (var token in grammar) {
  			if (!grammar.hasOwnProperty(token) || !grammar[token]) {
  				continue;
  			}

  			var patterns = grammar[token];
  			patterns = Array.isArray(patterns) ? patterns : [patterns];

  			for (var j = 0; j < patterns.length; ++j) {
  				if (rematch && rematch.cause == token + ',' + j) {
  					return;
  				}

  				var patternObj = patterns[j];
  				var inside = patternObj.inside;
  				var lookbehind = !!patternObj.lookbehind;
  				var greedy = !!patternObj.greedy;
  				var alias = patternObj.alias;

  				if (greedy && !patternObj.pattern.global) {
  					// Without the global flag, lastIndex won't work
  					var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
  					patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
  				}

  				/** @type {RegExp} */
  				var pattern = patternObj.pattern || patternObj;

  				for ( // iterate the token list and keep track of the current token/string position
  					var currentNode = startNode.next, pos = startPos;
  					currentNode !== tokenList.tail;
  					pos += currentNode.value.length, currentNode = currentNode.next
  				) {

  					if (rematch && pos >= rematch.reach) {
  						break;
  					}

  					var str = currentNode.value;

  					if (tokenList.length > text.length) {
  						// Something went terribly wrong, ABORT, ABORT!
  						return;
  					}

  					if (str instanceof Token) {
  						continue;
  					}

  					var removeCount = 1; // this is the to parameter of removeBetween
  					var match;

  					if (greedy) {
  						match = matchPattern(pattern, pos, text, lookbehind);
  						if (!match || match.index >= text.length) {
  							break;
  						}

  						var from = match.index;
  						var to = match.index + match[0].length;
  						var p = pos;

  						// find the node that contains the match
  						p += currentNode.value.length;
  						while (from >= p) {
  							currentNode = currentNode.next;
  							p += currentNode.value.length;
  						}
  						// adjust pos (and p)
  						p -= currentNode.value.length;
  						pos = p;

  						// the current node is a Token, then the match starts inside another Token, which is invalid
  						if (currentNode.value instanceof Token) {
  							continue;
  						}

  						// find the last node which is affected by this match
  						for (
  							var k = currentNode;
  							k !== tokenList.tail && (p < to || typeof k.value === 'string');
  							k = k.next
  						) {
  							removeCount++;
  							p += k.value.length;
  						}
  						removeCount--;

  						// replace with the new match
  						str = text.slice(pos, p);
  						match.index -= pos;
  					} else {
  						match = matchPattern(pattern, 0, str, lookbehind);
  						if (!match) {
  							continue;
  						}
  					}

  					// eslint-disable-next-line no-redeclare
  					var from = match.index;
  					var matchStr = match[0];
  					var before = str.slice(0, from);
  					var after = str.slice(from + matchStr.length);

  					var reach = pos + str.length;
  					if (rematch && reach > rematch.reach) {
  						rematch.reach = reach;
  					}

  					var removeFrom = currentNode.prev;

  					if (before) {
  						removeFrom = addAfter(tokenList, removeFrom, before);
  						pos += before.length;
  					}

  					removeRange(tokenList, removeFrom, removeCount);

  					var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
  					currentNode = addAfter(tokenList, removeFrom, wrapped);

  					if (after) {
  						addAfter(tokenList, currentNode, after);
  					}

  					if (removeCount > 1) {
  						// at least one Token object was removed, so we have to do some rematching
  						// this can only happen if the current pattern is greedy

  						/** @type {RematchOptions} */
  						var nestedRematch = {
  							cause: token + ',' + j,
  							reach: reach
  						};
  						matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);

  						// the reach might have been extended because of the rematching
  						if (rematch && nestedRematch.reach > rematch.reach) {
  							rematch.reach = nestedRematch.reach;
  						}
  					}
  				}
  			}
  		}
  	}

  	/**
  	 * @typedef LinkedListNode
  	 * @property {T} value
  	 * @property {LinkedListNode<T> | null} prev The previous node.
  	 * @property {LinkedListNode<T> | null} next The next node.
  	 * @template T
  	 * @private
  	 */

  	/**
  	 * @template T
  	 * @private
  	 */
  	function LinkedList() {
  		/** @type {LinkedListNode<T>} */
  		var head = { value: null, prev: null, next: null };
  		/** @type {LinkedListNode<T>} */
  		var tail = { value: null, prev: head, next: null };
  		head.next = tail;

  		/** @type {LinkedListNode<T>} */
  		this.head = head;
  		/** @type {LinkedListNode<T>} */
  		this.tail = tail;
  		this.length = 0;
  	}

  	/**
  	 * Adds a new node with the given value to the list.
  	 *
  	 * @param {LinkedList<T>} list
  	 * @param {LinkedListNode<T>} node
  	 * @param {T} value
  	 * @returns {LinkedListNode<T>} The added node.
  	 * @template T
  	 */
  	function addAfter(list, node, value) {
  		// assumes that node != list.tail && values.length >= 0
  		var next = node.next;

  		var newNode = { value: value, prev: node, next: next };
  		node.next = newNode;
  		next.prev = newNode;
  		list.length++;

  		return newNode;
  	}
  	/**
  	 * Removes `count` nodes after the given node. The given node will not be removed.
  	 *
  	 * @param {LinkedList<T>} list
  	 * @param {LinkedListNode<T>} node
  	 * @param {number} count
  	 * @template T
  	 */
  	function removeRange(list, node, count) {
  		var next = node.next;
  		for (var i = 0; i < count && next !== list.tail; i++) {
  			next = next.next;
  		}
  		node.next = next;
  		next.prev = node;
  		list.length -= i;
  	}
  	/**
  	 * @param {LinkedList<T>} list
  	 * @returns {T[]}
  	 * @template T
  	 */
  	function toArray(list) {
  		var array = [];
  		var node = list.head.next;
  		while (node !== list.tail) {
  			array.push(node.value);
  			node = node.next;
  		}
  		return array;
  	}


  	if (!_self.document) {
  		if (!_self.addEventListener) {
  			// in Node.js
  			return _;
  		}

  		if (!_.disableWorkerMessageHandler) {
  			// In worker
  			_self.addEventListener('message', function (evt) {
  				var message = JSON.parse(evt.data);
  				var lang = message.language;
  				var code = message.code;
  				var immediateClose = message.immediateClose;

  				_self.postMessage(_.highlight(code, _.languages[lang], lang));
  				if (immediateClose) {
  					_self.close();
  				}
  			}, false);
  		}

  		return _;
  	}

  	// Get current script and highlight
  	var script = _.util.currentScript();

  	if (script) {
  		_.filename = script.src;

  		if (script.hasAttribute('data-manual')) {
  			_.manual = true;
  		}
  	}

  	function highlightAutomaticallyCallback() {
  		if (!_.manual) {
  			_.highlightAll();
  		}
  	}

  	if (!_.manual) {
  		// If the document state is "loading", then we'll use DOMContentLoaded.
  		// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
  		// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
  		// might take longer one animation frame to execute which can create a race condition where only some plugins have
  		// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
  		// See https://github.com/PrismJS/prism/issues/2102
  		var readyState = document.readyState;
  		if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
  			document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
  		} else {
  			if (window.requestAnimationFrame) {
  				window.requestAnimationFrame(highlightAutomaticallyCallback);
  			} else {
  				window.setTimeout(highlightAutomaticallyCallback, 16);
  			}
  		}
  	}

  	return _;

  }(_self));

  if (module.exports) {
  	module.exports = Prism;
  }

  // hack for components to work correctly in node.js
  if (typeof commonjsGlobal !== 'undefined') {
  	commonjsGlobal.Prism = Prism;
  }

  // some additional documentation/types

  /**
   * The expansion of a simple `RegExp` literal to support additional properties.
   *
   * @typedef GrammarToken
   * @property {RegExp} pattern The regular expression of the token.
   * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
   * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
   * @property {boolean} [greedy=false] Whether the token is greedy.
   * @property {string|string[]} [alias] An optional alias or list of aliases.
   * @property {Grammar} [inside] The nested grammar of this token.
   *
   * The `inside` grammar will be used to tokenize the text value of each token of this kind.
   *
   * This can be used to make nested and even recursive language definitions.
   *
   * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
   * each another.
   * @global
   * @public
   */

  /**
   * @typedef Grammar
   * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
   * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
   * @global
   * @public
   */

  /**
   * A function which will invoked after an element was successfully highlighted.
   *
   * @callback HighlightCallback
   * @param {Element} element The element successfully highlighted.
   * @returns {void}
   * @global
   * @public
   */

  /**
   * @callback HookCallback
   * @param {Object<string, any>} env The environment variables of the hook.
   * @returns {void}
   * @global
   * @public
   */


  /* **********************************************
       Begin prism-markup.js
  ********************************************** */

  Prism.languages.markup = {
  	'comment': {
  		pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
  		greedy: true
  	},
  	'prolog': {
  		pattern: /<\?[\s\S]+?\?>/,
  		greedy: true
  	},
  	'doctype': {
  		// https://www.w3.org/TR/xml/#NT-doctypedecl
  		pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
  		greedy: true,
  		inside: {
  			'internal-subset': {
  				pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
  				lookbehind: true,
  				greedy: true,
  				inside: null // see below
  			},
  			'string': {
  				pattern: /"[^"]*"|'[^']*'/,
  				greedy: true
  			},
  			'punctuation': /^<!|>$|[[\]]/,
  			'doctype-tag': /^DOCTYPE/i,
  			'name': /[^\s<>'"]+/
  		}
  	},
  	'cdata': {
  		pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
  		greedy: true
  	},
  	'tag': {
  		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
  		greedy: true,
  		inside: {
  			'tag': {
  				pattern: /^<\/?[^\s>\/]+/,
  				inside: {
  					'punctuation': /^<\/?/,
  					'namespace': /^[^\s>\/:]+:/
  				}
  			},
  			'special-attr': [],
  			'attr-value': {
  				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
  				inside: {
  					'punctuation': [
  						{
  							pattern: /^=/,
  							alias: 'attr-equals'
  						},
  						/"|'/
  					]
  				}
  			},
  			'punctuation': /\/?>/,
  			'attr-name': {
  				pattern: /[^\s>\/]+/,
  				inside: {
  					'namespace': /^[^\s>\/:]+:/
  				}
  			}

  		}
  	},
  	'entity': [
  		{
  			pattern: /&[\da-z]{1,8};/i,
  			alias: 'named-entity'
  		},
  		/&#x?[\da-f]{1,8};/i
  	]
  };

  Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
  	Prism.languages.markup['entity'];
  Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup;

  // Plugin to make entity title show the real entity, idea by Roman Komarov
  Prism.hooks.add('wrap', function (env) {

  	if (env.type === 'entity') {
  		env.attributes['title'] = env.content.replace(/&amp;/, '&');
  	}
  });

  Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
  	/**
  	 * Adds an inlined language to markup.
  	 *
  	 * An example of an inlined language is CSS with `<style>` tags.
  	 *
  	 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
  	 * case insensitive.
  	 * @param {string} lang The language key.
  	 * @example
  	 * addInlined('style', 'css');
  	 */
  	value: function addInlined(tagName, lang) {
  		var includedCdataInside = {};
  		includedCdataInside['language-' + lang] = {
  			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
  			lookbehind: true,
  			inside: Prism.languages[lang]
  		};
  		includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

  		var inside = {
  			'included-cdata': {
  				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
  				inside: includedCdataInside
  			}
  		};
  		inside['language-' + lang] = {
  			pattern: /[\s\S]+/,
  			inside: Prism.languages[lang]
  		};

  		var def = {};
  		def[tagName] = {
  			pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () { return tagName; }), 'i'),
  			lookbehind: true,
  			greedy: true,
  			inside: inside
  		};

  		Prism.languages.insertBefore('markup', 'cdata', def);
  	}
  });
  Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
  	/**
  	 * Adds an pattern to highlight languages embedded in HTML attributes.
  	 *
  	 * An example of an inlined language is CSS with `style` attributes.
  	 *
  	 * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
  	 * case insensitive.
  	 * @param {string} lang The language key.
  	 * @example
  	 * addAttribute('style', 'css');
  	 */
  	value: function (attrName, lang) {
  		Prism.languages.markup.tag.inside['special-attr'].push({
  			pattern: RegExp(
  				/(^|["'\s])/.source + '(?:' + attrName + ')' + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
  				'i'
  			),
  			lookbehind: true,
  			inside: {
  				'attr-name': /^[^\s=]+/,
  				'attr-value': {
  					pattern: /=[\s\S]+/,
  					inside: {
  						'value': {
  							pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
  							lookbehind: true,
  							alias: [lang, 'language-' + lang],
  							inside: Prism.languages[lang]
  						},
  						'punctuation': [
  							{
  								pattern: /^=/,
  								alias: 'attr-equals'
  							},
  							/"|'/
  						]
  					}
  				}
  			}
  		});
  	}
  });

  Prism.languages.html = Prism.languages.markup;
  Prism.languages.mathml = Prism.languages.markup;
  Prism.languages.svg = Prism.languages.markup;

  Prism.languages.xml = Prism.languages.extend('markup', {});
  Prism.languages.ssml = Prism.languages.xml;
  Prism.languages.atom = Prism.languages.xml;
  Prism.languages.rss = Prism.languages.xml;


  /* **********************************************
       Begin prism-css.js
  ********************************************** */

  (function (Prism) {

  	var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;

  	Prism.languages.css = {
  		'comment': /\/\*[\s\S]*?\*\//,
  		'atrule': {
  			pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
  			inside: {
  				'rule': /^@[\w-]+/,
  				'selector-function-argument': {
  					pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
  					lookbehind: true,
  					alias: 'selector'
  				},
  				'keyword': {
  					pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
  					lookbehind: true
  				}
  				// See rest below
  			}
  		},
  		'url': {
  			// https://drafts.csswg.org/css-values-3/#urls
  			pattern: RegExp('\\burl\\((?:' + string.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
  			greedy: true,
  			inside: {
  				'function': /^url/i,
  				'punctuation': /^\(|\)$/,
  				'string': {
  					pattern: RegExp('^' + string.source + '$'),
  					alias: 'url'
  				}
  			}
  		},
  		'selector': {
  			pattern: RegExp('(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + string.source + ')*(?=\\s*\\{)'),
  			lookbehind: true
  		},
  		'string': {
  			pattern: string,
  			greedy: true
  		},
  		'property': {
  			pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
  			lookbehind: true
  		},
  		'important': /!important\b/i,
  		'function': {
  			pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
  			lookbehind: true
  		},
  		'punctuation': /[(){};:,]/
  	};

  	Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

  	var markup = Prism.languages.markup;
  	if (markup) {
  		markup.tag.addInlined('style', 'css');
  		markup.tag.addAttribute('style', 'css');
  	}

  }(Prism));


  /* **********************************************
       Begin prism-clike.js
  ********************************************** */

  Prism.languages.clike = {
  	'comment': [
  		{
  			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
  			lookbehind: true,
  			greedy: true
  		},
  		{
  			pattern: /(^|[^\\:])\/\/.*/,
  			lookbehind: true,
  			greedy: true
  		}
  	],
  	'string': {
  		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
  		greedy: true
  	},
  	'class-name': {
  		pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
  		lookbehind: true,
  		inside: {
  			'punctuation': /[.\\]/
  		}
  	},
  	'keyword': /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
  	'boolean': /\b(?:false|true)\b/,
  	'function': /\b\w+(?=\()/,
  	'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  	'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  	'punctuation': /[{}[\];(),.:]/
  };


  /* **********************************************
       Begin prism-javascript.js
  ********************************************** */

  Prism.languages.javascript = Prism.languages.extend('clike', {
  	'class-name': [
  		Prism.languages.clike['class-name'],
  		{
  			pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
  			lookbehind: true
  		}
  	],
  	'keyword': [
  		{
  			pattern: /((?:^|\})\s*)catch\b/,
  			lookbehind: true
  		},
  		{
  			pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
  			lookbehind: true
  		},
  	],
  	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  	'function': /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  	'number': {
  		pattern: RegExp(
  			/(^|[^\w$])/.source +
  			'(?:' +
  			(
  				// constant
  				/NaN|Infinity/.source +
  				'|' +
  				// binary integer
  				/0[bB][01]+(?:_[01]+)*n?/.source +
  				'|' +
  				// octal integer
  				/0[oO][0-7]+(?:_[0-7]+)*n?/.source +
  				'|' +
  				// hexadecimal integer
  				/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
  				'|' +
  				// decimal bigint
  				/\d+(?:_\d+)*n/.source +
  				'|' +
  				// decimal number (integer or float) but no bigint
  				/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source
  			) +
  			')' +
  			/(?![\w$])/.source
  		),
  		lookbehind: true
  	},
  	'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
  });

  Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;

  Prism.languages.insertBefore('javascript', 'keyword', {
  	'regex': {
  		// eslint-disable-next-line regexp/no-dupe-characters-character-class
  		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
  		lookbehind: true,
  		greedy: true,
  		inside: {
  			'regex-source': {
  				pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
  				lookbehind: true,
  				alias: 'language-regex',
  				inside: Prism.languages.regex
  			},
  			'regex-delimiter': /^\/|\/$/,
  			'regex-flags': /^[a-z]+$/,
  		}
  	},
  	// This must be declared before keyword because we use "function" inside the look-forward
  	'function-variable': {
  		pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
  		alias: 'function'
  	},
  	'parameter': [
  		{
  			pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
  			lookbehind: true,
  			inside: Prism.languages.javascript
  		},
  		{
  			pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
  			lookbehind: true,
  			inside: Prism.languages.javascript
  		},
  		{
  			pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
  			lookbehind: true,
  			inside: Prism.languages.javascript
  		},
  		{
  			pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
  			lookbehind: true,
  			inside: Prism.languages.javascript
  		}
  	],
  	'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  });

  Prism.languages.insertBefore('javascript', 'string', {
  	'hashbang': {
  		pattern: /^#!.*/,
  		greedy: true,
  		alias: 'comment'
  	},
  	'template-string': {
  		pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
  		greedy: true,
  		inside: {
  			'template-punctuation': {
  				pattern: /^`|`$/,
  				alias: 'string'
  			},
  			'interpolation': {
  				pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
  				lookbehind: true,
  				inside: {
  					'interpolation-punctuation': {
  						pattern: /^\$\{|\}$/,
  						alias: 'punctuation'
  					},
  					rest: Prism.languages.javascript
  				}
  			},
  			'string': /[\s\S]+/
  		}
  	},
  	'string-property': {
  		pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
  		lookbehind: true,
  		greedy: true,
  		alias: 'property'
  	}
  });

  Prism.languages.insertBefore('javascript', 'operator', {
  	'literal-property': {
  		pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
  		lookbehind: true,
  		alias: 'property'
  	},
  });

  if (Prism.languages.markup) {
  	Prism.languages.markup.tag.addInlined('script', 'javascript');

  	// add attribute support for all DOM events.
  	// https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events
  	Prism.languages.markup.tag.addAttribute(
  		/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
  		'javascript'
  	);
  }

  Prism.languages.js = Prism.languages.javascript;


  /* **********************************************
       Begin prism-file-highlight.js
  ********************************************** */

  (function () {

  	if (typeof Prism === 'undefined' || typeof document === 'undefined') {
  		return;
  	}

  	// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
  	if (!Element.prototype.matches) {
  		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  	}

  	var LOADING_MESSAGE = 'Loading…';
  	var FAILURE_MESSAGE = function (status, message) {
  		return '✖ Error ' + status + ' while fetching file: ' + message;
  	};
  	var FAILURE_EMPTY_MESSAGE = '✖ Error: File does not exist or is empty';

  	var EXTENSIONS = {
  		'js': 'javascript',
  		'py': 'python',
  		'rb': 'ruby',
  		'ps1': 'powershell',
  		'psm1': 'powershell',
  		'sh': 'bash',
  		'bat': 'batch',
  		'h': 'c',
  		'tex': 'latex'
  	};

  	var STATUS_ATTR = 'data-src-status';
  	var STATUS_LOADING = 'loading';
  	var STATUS_LOADED = 'loaded';
  	var STATUS_FAILED = 'failed';

  	var SELECTOR = 'pre[data-src]:not([' + STATUS_ATTR + '="' + STATUS_LOADED + '"])'
  		+ ':not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';

  	/**
  	 * Loads the given file.
  	 *
  	 * @param {string} src The URL or path of the source file to load.
  	 * @param {(result: string) => void} success
  	 * @param {(reason: string) => void} error
  	 */
  	function loadFile(src, success, error) {
  		var xhr = new XMLHttpRequest();
  		xhr.open('GET', src, true);
  		xhr.onreadystatechange = function () {
  			if (xhr.readyState == 4) {
  				if (xhr.status < 400 && xhr.responseText) {
  					success(xhr.responseText);
  				} else {
  					if (xhr.status >= 400) {
  						error(FAILURE_MESSAGE(xhr.status, xhr.statusText));
  					} else {
  						error(FAILURE_EMPTY_MESSAGE);
  					}
  				}
  			}
  		};
  		xhr.send(null);
  	}

  	/**
  	 * Parses the given range.
  	 *
  	 * This returns a range with inclusive ends.
  	 *
  	 * @param {string | null | undefined} range
  	 * @returns {[number, number | undefined] | undefined}
  	 */
  	function parseRange(range) {
  		var m = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(range || '');
  		if (m) {
  			var start = Number(m[1]);
  			var comma = m[2];
  			var end = m[3];

  			if (!comma) {
  				return [start, start];
  			}
  			if (!end) {
  				return [start, undefined];
  			}
  			return [start, Number(end)];
  		}
  		return undefined;
  	}

  	Prism.hooks.add('before-highlightall', function (env) {
  		env.selector += ', ' + SELECTOR;
  	});

  	Prism.hooks.add('before-sanity-check', function (env) {
  		var pre = /** @type {HTMLPreElement} */ (env.element);
  		if (pre.matches(SELECTOR)) {
  			env.code = ''; // fast-path the whole thing and go to complete

  			pre.setAttribute(STATUS_ATTR, STATUS_LOADING); // mark as loading

  			// add code element with loading message
  			var code = pre.appendChild(document.createElement('CODE'));
  			code.textContent = LOADING_MESSAGE;

  			var src = pre.getAttribute('data-src');

  			var language = env.language;
  			if (language === 'none') {
  				// the language might be 'none' because there is no language set;
  				// in this case, we want to use the extension as the language
  				var extension = (/\.(\w+)$/.exec(src) || [, 'none'])[1];
  				language = EXTENSIONS[extension] || extension;
  			}

  			// set language classes
  			Prism.util.setLanguage(code, language);
  			Prism.util.setLanguage(pre, language);

  			// preload the language
  			var autoloader = Prism.plugins.autoloader;
  			if (autoloader) {
  				autoloader.loadLanguages(language);
  			}

  			// load file
  			loadFile(
  				src,
  				function (text) {
  					// mark as loaded
  					pre.setAttribute(STATUS_ATTR, STATUS_LOADED);

  					// handle data-range
  					var range = parseRange(pre.getAttribute('data-range'));
  					if (range) {
  						var lines = text.split(/\r\n?|\n/g);

  						// the range is one-based and inclusive on both ends
  						var start = range[0];
  						var end = range[1] == null ? lines.length : range[1];

  						if (start < 0) { start += lines.length; }
  						start = Math.max(0, Math.min(start - 1, lines.length));
  						if (end < 0) { end += lines.length; }
  						end = Math.max(0, Math.min(end, lines.length));

  						text = lines.slice(start, end).join('\n');

  						// add data-start for line numbers
  						if (!pre.hasAttribute('data-start')) {
  							pre.setAttribute('data-start', String(start + 1));
  						}
  					}

  					// highlight code
  					code.textContent = text;
  					Prism.highlightElement(code);
  				},
  				function (error) {
  					// mark as failed
  					pre.setAttribute(STATUS_ATTR, STATUS_FAILED);

  					code.textContent = error;
  				}
  			);
  		}
  	});

  	Prism.plugins.fileHighlight = {
  		/**
  		 * Executes the File Highlight plugin for all matching `pre` elements under the given container.
  		 *
  		 * Note: Elements which are already loaded or currently loading will not be touched by this method.
  		 *
  		 * @param {ParentNode} [container=document]
  		 */
  		highlight: function highlight(container) {
  			var elements = (container || document).querySelectorAll(SELECTOR);

  			for (var i = 0, element; (element = elements[i++]);) {
  				Prism.highlightElement(element);
  			}
  		}
  	};

  	var logged = false;
  	/** @deprecated Use `Prism.plugins.fileHighlight.highlight` instead. */
  	Prism.fileHighlight = function () {
  		if (!logged) {
  			console.warn('Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.');
  			logged = true;
  		}
  		Prism.plugins.fileHighlight.highlight.apply(this, arguments);
  	};

  }());
  }(prism));

  var Prism$1 = prism.exports;

  (function () {

  	if (typeof Prism === 'undefined' || typeof document === 'undefined') {
  		return;
  	}

  	var callbacks = [];
  	var map = {};
  	var noop = function () {};

  	Prism.plugins.toolbar = {};

  	/**
  	 * @typedef ButtonOptions
  	 * @property {string} text The text displayed.
  	 * @property {string} [url] The URL of the link which will be created.
  	 * @property {Function} [onClick] The event listener for the `click` event of the created button.
  	 * @property {string} [className] The class attribute to include with element.
  	 */

  	/**
  	 * Register a button callback with the toolbar.
  	 *
  	 * @param {string} key
  	 * @param {ButtonOptions|Function} opts
  	 */
  	var registerButton = Prism.plugins.toolbar.registerButton = function (key, opts) {
  		var callback;

  		if (typeof opts === 'function') {
  			callback = opts;
  		} else {
  			callback = function (env) {
  				var element;

  				if (typeof opts.onClick === 'function') {
  					element = document.createElement('button');
  					element.type = 'button';
  					element.addEventListener('click', function () {
  						opts.onClick.call(this, env);
  					});
  				} else if (typeof opts.url === 'string') {
  					element = document.createElement('a');
  					element.href = opts.url;
  				} else {
  					element = document.createElement('span');
  				}

  				if (opts.className) {
  					element.classList.add(opts.className);
  				}

  				element.textContent = opts.text;

  				return element;
  			};
  		}

  		if (key in map) {
  			console.warn('There is a button with the key "' + key + '" registered already.');
  			return;
  		}

  		callbacks.push(map[key] = callback);
  	};

  	/**
  	 * Returns the callback order of the given element.
  	 *
  	 * @param {HTMLElement} element
  	 * @returns {string[] | undefined}
  	 */
  	function getOrder(element) {
  		while (element) {
  			var order = element.getAttribute('data-toolbar-order');
  			if (order != null) {
  				order = order.trim();
  				if (order.length) {
  					return order.split(/\s*,\s*/g);
  				} else {
  					return [];
  				}
  			}
  			element = element.parentElement;
  		}
  	}

  	/**
  	 * Post-highlight Prism hook callback.
  	 *
  	 * @param env
  	 */
  	var hook = Prism.plugins.toolbar.hook = function (env) {
  		// Check if inline or actual code block (credit to line-numbers plugin)
  		var pre = env.element.parentNode;
  		if (!pre || !/pre/i.test(pre.nodeName)) {
  			return;
  		}

  		// Autoloader rehighlights, so only do this once.
  		if (pre.parentNode.classList.contains('code-toolbar')) {
  			return;
  		}

  		// Create wrapper for <pre> to prevent scrolling toolbar with content
  		var wrapper = document.createElement('div');
  		wrapper.classList.add('code-toolbar');
  		pre.parentNode.insertBefore(wrapper, pre);
  		wrapper.appendChild(pre);

  		// Setup the toolbar
  		var toolbar = document.createElement('div');
  		toolbar.classList.add('toolbar');

  		// order callbacks
  		var elementCallbacks = callbacks;
  		var order = getOrder(env.element);
  		if (order) {
  			elementCallbacks = order.map(function (key) {
  				return map[key] || noop;
  			});
  		}

  		elementCallbacks.forEach(function (callback) {
  			var element = callback(env);

  			if (!element) {
  				return;
  			}

  			var item = document.createElement('div');
  			item.classList.add('toolbar-item');

  			item.appendChild(element);
  			toolbar.appendChild(item);
  		});

  		// Add our toolbar to the currently created wrapper of <pre> tag
  		wrapper.appendChild(toolbar);
  	};

  	registerButton('label', function (env) {
  		var pre = env.element.parentNode;
  		if (!pre || !/pre/i.test(pre.nodeName)) {
  			return;
  		}

  		if (!pre.hasAttribute('data-label')) {
  			return;
  		}

  		var element; var template;
  		var text = pre.getAttribute('data-label');
  		try {
  			// Any normal text will blow up this selector.
  			template = document.querySelector('template#' + text);
  		} catch (e) { /* noop */ }

  		if (template) {
  			element = template.content;
  		} else {
  			if (pre.hasAttribute('data-url')) {
  				element = document.createElement('a');
  				element.href = pre.getAttribute('data-url');
  			} else {
  				element = document.createElement('span');
  			}

  			element.textContent = text;
  		}

  		return element;
  	});

  	/**
  	 * Register the toolbar with Prism.
  	 */
  	Prism.hooks.add('complete', hook);
  }());

  // https://www.json.org/json-en.html
  Prism.languages.json = {
  	'property': {
  		pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
  		lookbehind: true,
  		greedy: true
  	},
  	'string': {
  		pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
  		lookbehind: true,
  		greedy: true
  	},
  	'comment': {
  		pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
  		greedy: true
  	},
  	'number': /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  	'punctuation': /[{}[\],]/,
  	'operator': /:/,
  	'boolean': /\b(?:false|true)\b/,
  	'null': {
  		pattern: /\bnull\b/,
  		alias: 'keyword'
  	}
  };

  Prism.languages.webmanifest = Prism.languages.json;

  (function (Prism) {

  	var javascript = Prism.util.clone(Prism.languages.javascript);

  	var space = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source;
  	var braces = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source;
  	var spread = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;

  	/**
  	 * @param {string} source
  	 * @param {string} [flags]
  	 */
  	function re(source, flags) {
  		source = source
  			.replace(/<S>/g, function () { return space; })
  			.replace(/<BRACES>/g, function () { return braces; })
  			.replace(/<SPREAD>/g, function () { return spread; });
  		return RegExp(source, flags);
  	}

  	spread = re(spread).source;


  	Prism.languages.jsx = Prism.languages.extend('markup', javascript);
  	Prism.languages.jsx.tag.pattern = re(
  		/<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.source
  	);

  	Prism.languages.jsx.tag.inside['tag'].pattern = /^<\/?[^\s>\/]*/;
  	Prism.languages.jsx.tag.inside['attr-value'].pattern = /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/;
  	Prism.languages.jsx.tag.inside['tag'].inside['class-name'] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
  	Prism.languages.jsx.tag.inside['comment'] = javascript['comment'];

  	Prism.languages.insertBefore('inside', 'attr-name', {
  		'spread': {
  			pattern: re(/<SPREAD>/.source),
  			inside: Prism.languages.jsx
  		}
  	}, Prism.languages.jsx.tag);

  	Prism.languages.insertBefore('inside', 'special-attr', {
  		'script': {
  			// Allow for two levels of nesting
  			pattern: re(/=<BRACES>/.source),
  			alias: 'language-javascript',
  			inside: {
  				'script-punctuation': {
  					pattern: /^=(?=\{)/,
  					alias: 'punctuation'
  				},
  				rest: Prism.languages.jsx
  			},
  		}
  	}, Prism.languages.jsx.tag);

  	// The following will handle plain text inside tags
  	var stringifyToken = function (token) {
  		if (!token) {
  			return '';
  		}
  		if (typeof token === 'string') {
  			return token;
  		}
  		if (typeof token.content === 'string') {
  			return token.content;
  		}
  		return token.content.map(stringifyToken).join('');
  	};

  	var walkTokens = function (tokens) {
  		var openedTags = [];
  		for (var i = 0; i < tokens.length; i++) {
  			var token = tokens[i];
  			var notTagNorBrace = false;

  			if (typeof token !== 'string') {
  				if (token.type === 'tag' && token.content[0] && token.content[0].type === 'tag') {
  					// We found a tag, now find its kind

  					if (token.content[0].content[0].content === '</') {
  						// Closing tag
  						if (openedTags.length > 0 && openedTags[openedTags.length - 1].tagName === stringifyToken(token.content[0].content[1])) {
  							// Pop matching opening tag
  							openedTags.pop();
  						}
  					} else {
  						if (token.content[token.content.length - 1].content === '/>') ; else {
  							// Opening tag
  							openedTags.push({
  								tagName: stringifyToken(token.content[0].content[1]),
  								openedBraces: 0
  							});
  						}
  					}
  				} else if (openedTags.length > 0 && token.type === 'punctuation' && token.content === '{') {

  					// Here we might have entered a JSX context inside a tag
  					openedTags[openedTags.length - 1].openedBraces++;

  				} else if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces > 0 && token.type === 'punctuation' && token.content === '}') {

  					// Here we might have left a JSX context inside a tag
  					openedTags[openedTags.length - 1].openedBraces--;

  				} else {
  					notTagNorBrace = true;
  				}
  			}
  			if (notTagNorBrace || typeof token === 'string') {
  				if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces === 0) {
  					// Here we are inside a tag, and not inside a JSX context.
  					// That's plain text: drop any tokens matched.
  					var plainText = stringifyToken(token);

  					// And merge text with adjacent text
  					if (i < tokens.length - 1 && (typeof tokens[i + 1] === 'string' || tokens[i + 1].type === 'plain-text')) {
  						plainText += stringifyToken(tokens[i + 1]);
  						tokens.splice(i + 1, 1);
  					}
  					if (i > 0 && (typeof tokens[i - 1] === 'string' || tokens[i - 1].type === 'plain-text')) {
  						plainText = stringifyToken(tokens[i - 1]) + plainText;
  						tokens.splice(i - 1, 1);
  						i--;
  					}

  					tokens[i] = new Prism.Token('plain-text', plainText, null, plainText);
  				}
  			}

  			if (token.content && typeof token.content !== 'string') {
  				walkTokens(token.content);
  			}
  		}
  	};

  	Prism.hooks.add('after-tokenize', function (env) {
  		if (env.language !== 'jsx' && env.language !== 'tsx') {
  			return;
  		}
  		walkTokens(env.tokens);
  	});

  }(Prism));

  (function (Prism) {

  	Prism.languages.typescript = Prism.languages.extend('javascript', {
  		'class-name': {
  			pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
  			lookbehind: true,
  			greedy: true,
  			inside: null // see below
  		},
  		'builtin': /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/,
  	});

  	// The keywords TypeScript adds to JavaScript
  	Prism.languages.typescript.keyword.push(
  		/\b(?:abstract|declare|is|keyof|readonly|require)\b/,
  		// keywords that have to be followed by an identifier
  		/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
  		// This is for `import type *, {}`
  		/\btype\b(?=\s*(?:[\{*]|$))/
  	);

  	// doesn't work with TS because TS is too complex
  	delete Prism.languages.typescript['parameter'];
  	delete Prism.languages.typescript['literal-property'];

  	// a version of typescript specifically for highlighting types
  	var typeInside = Prism.languages.extend('typescript', {});
  	delete typeInside['class-name'];

  	Prism.languages.typescript['class-name'].inside = typeInside;

  	Prism.languages.insertBefore('typescript', 'function', {
  		'decorator': {
  			pattern: /@[$\w\xA0-\uFFFF]+/,
  			inside: {
  				'at': {
  					pattern: /^@/,
  					alias: 'operator'
  				},
  				'function': /^[\s\S]+/
  			}
  		},
  		'generic-function': {
  			// e.g. foo<T extends "bar" | "baz">( ...
  			pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
  			greedy: true,
  			inside: {
  				'function': /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
  				'generic': {
  					pattern: /<[\s\S]+/, // everything after the first <
  					alias: 'class-name',
  					inside: typeInside
  				}
  			}
  		}
  	});

  	Prism.languages.ts = Prism.languages.typescript;

  }(Prism));

  (function (Prism) {
  	var typescript = Prism.util.clone(Prism.languages.typescript);
  	Prism.languages.tsx = Prism.languages.extend('jsx', typescript);

  	// doesn't work with TS because TS is too complex
  	delete Prism.languages.tsx['parameter'];
  	delete Prism.languages.tsx['literal-property'];

  	// This will prevent collisions between TSX tags and TS generic types.
  	// Idea by https://github.com/karlhorky
  	// Discussion: https://github.com/PrismJS/prism/issues/2594#issuecomment-710666928
  	var tag = Prism.languages.tsx.tag;
  	tag.pattern = RegExp(/(^|[^\w$]|(?=<\/))/.source + '(?:' + tag.pattern.source + ')', tag.pattern.flags);
  	tag.lookbehind = true;
  }(Prism));

  (function (Prism) {
  	// $ set | grep '^[A-Z][^[:space:]]*=' | cut -d= -f1 | tr '\n' '|'
  	// + LC_ALL, RANDOM, REPLY, SECONDS.
  	// + make sure PS1..4 are here as they are not always set,
  	// - some useless things.
  	var envVars = '\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b';

  	var commandAfterHeredoc = {
  		pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
  		lookbehind: true,
  		alias: 'punctuation', // this looks reasonably well in all themes
  		inside: null // see below
  	};

  	var insideString = {
  		'bash': commandAfterHeredoc,
  		'environment': {
  			pattern: RegExp('\\$' + envVars),
  			alias: 'constant'
  		},
  		'variable': [
  			// [0]: Arithmetic Environment
  			{
  				pattern: /\$?\(\([\s\S]+?\)\)/,
  				greedy: true,
  				inside: {
  					// If there is a $ sign at the beginning highlight $(( and )) as variable
  					'variable': [
  						{
  							pattern: /(^\$\(\([\s\S]+)\)\)/,
  							lookbehind: true
  						},
  						/^\$\(\(/
  					],
  					'number': /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
  					// Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
  					'operator': /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
  					// If there is no $ sign at the beginning highlight (( and )) as punctuation
  					'punctuation': /\(\(?|\)\)?|,|;/
  				}
  			},
  			// [1]: Command Substitution
  			{
  				pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
  				greedy: true,
  				inside: {
  					'variable': /^\$\(|^`|\)$|`$/
  				}
  			},
  			// [2]: Brace expansion
  			{
  				pattern: /\$\{[^}]+\}/,
  				greedy: true,
  				inside: {
  					'operator': /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
  					'punctuation': /[\[\]]/,
  					'environment': {
  						pattern: RegExp('(\\{)' + envVars),
  						lookbehind: true,
  						alias: 'constant'
  					}
  				}
  			},
  			/\$(?:\w+|[#?*!@$])/
  		],
  		// Escape sequences from echo and printf's manuals, and escaped quotes.
  		'entity': /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/
  	};

  	Prism.languages.bash = {
  		'shebang': {
  			pattern: /^#!\s*\/.*/,
  			alias: 'important'
  		},
  		'comment': {
  			pattern: /(^|[^"{\\$])#.*/,
  			lookbehind: true
  		},
  		'function-name': [
  			// a) function foo {
  			// b) foo() {
  			// c) function foo() {
  			// but not “foo {”
  			{
  				// a) and c)
  				pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
  				lookbehind: true,
  				alias: 'function'
  			},
  			{
  				// b)
  				pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/,
  				alias: 'function'
  			}
  		],
  		// Highlight variable names as variables in for and select beginnings.
  		'for-or-select': {
  			pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
  			alias: 'variable',
  			lookbehind: true
  		},
  		// Highlight variable names as variables in the left-hand part
  		// of assignments (“=” and “+=”).
  		'assign-left': {
  			pattern: /(^|[\s;|&]|[<>]\()\w+(?=\+?=)/,
  			inside: {
  				'environment': {
  					pattern: RegExp('(^|[\\s;|&]|[<>]\\()' + envVars),
  					lookbehind: true,
  					alias: 'constant'
  				}
  			},
  			alias: 'variable',
  			lookbehind: true
  		},
  		'string': [
  			// Support for Here-documents https://en.wikipedia.org/wiki/Here_document
  			{
  				pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
  				lookbehind: true,
  				greedy: true,
  				inside: insideString
  			},
  			// Here-document with quotes around the tag
  			// → No expansion (so no “inside”).
  			{
  				pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
  				lookbehind: true,
  				greedy: true,
  				inside: {
  					'bash': commandAfterHeredoc
  				}
  			},
  			// “Normal” string
  			{
  				// https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html
  				pattern: /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
  				lookbehind: true,
  				greedy: true,
  				inside: insideString
  			},
  			{
  				// https://www.gnu.org/software/bash/manual/html_node/Single-Quotes.html
  				pattern: /(^|[^$\\])'[^']*'/,
  				lookbehind: true,
  				greedy: true
  			},
  			{
  				// https://www.gnu.org/software/bash/manual/html_node/ANSI_002dC-Quoting.html
  				pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
  				greedy: true,
  				inside: {
  					'entity': insideString.entity
  				}
  			}
  		],
  		'environment': {
  			pattern: RegExp('\\$?' + envVars),
  			alias: 'constant'
  		},
  		'variable': insideString.variable,
  		'function': {
  			pattern: /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
  			lookbehind: true
  		},
  		'keyword': {
  			pattern: /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
  			lookbehind: true
  		},
  		// https://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
  		'builtin': {
  			pattern: /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
  			lookbehind: true,
  			// Alias added to make those easier to distinguish from strings.
  			alias: 'class-name'
  		},
  		'boolean': {
  			pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
  			lookbehind: true
  		},
  		'file-descriptor': {
  			pattern: /\B&\d\b/,
  			alias: 'important'
  		},
  		'operator': {
  			// Lots of redirections here, but not just that.
  			pattern: /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
  			inside: {
  				'file-descriptor': {
  					pattern: /^\d/,
  					alias: 'important'
  				}
  			}
  		},
  		'punctuation': /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
  		'number': {
  			pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
  			lookbehind: true
  		}
  	};

  	commandAfterHeredoc.inside = Prism.languages.bash;

  	/* Patterns in command substitution. */
  	var toBeCopied = [
  		'comment',
  		'function-name',
  		'for-or-select',
  		'assign-left',
  		'string',
  		'environment',
  		'function',
  		'keyword',
  		'builtin',
  		'boolean',
  		'file-descriptor',
  		'operator',
  		'punctuation',
  		'number'
  	];
  	var inside = insideString.variable[1].inside;
  	for (var i = 0; i < toBeCopied.length; i++) {
  		inside[toBeCopied[i]] = Prism.languages.bash[toBeCopied[i]];
  	}

  	Prism.languages.shell = Prism.languages.bash;
  }(Prism));

  (function (Prism) {

  	Prism.languages.insertBefore('javascript', 'function-variable', {
  		'method-variable': {
  			pattern: RegExp('(\\.\\s*)' + Prism.languages.javascript['function-variable'].pattern.source),
  			lookbehind: true,
  			alias: ['function-variable', 'method', 'function', 'property-access']
  		}
  	});

  	Prism.languages.insertBefore('javascript', 'function', {
  		'method': {
  			pattern: RegExp('(\\.\\s*)' + Prism.languages.javascript['function'].source),
  			lookbehind: true,
  			alias: ['function', 'property-access']
  		}
  	});

  	Prism.languages.insertBefore('javascript', 'constant', {
  		'known-class-name': [
  			{
  				// standard built-ins
  				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
  				pattern: /\b(?:(?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|(?:Weak)?(?:Map|Set)|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|WebAssembly)\b/,
  				alias: 'class-name'
  			},
  			{
  				// errors
  				pattern: /\b(?:[A-Z]\w*)Error\b/,
  				alias: 'class-name'
  			}
  		]
  	});

  	/**
  	 * Replaces the `<ID>` placeholder in the given pattern with a pattern for general JS identifiers.
  	 *
  	 * @param {string} source
  	 * @param {string} [flags]
  	 * @returns {RegExp}
  	 */
  	function withId(source, flags) {
  		return RegExp(
  			source.replace(/<ID>/g, function () { return /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/.source; }),
  			flags);
  	}
  	Prism.languages.insertBefore('javascript', 'keyword', {
  		'imports': {
  			// https://tc39.es/ecma262/#sec-imports
  			pattern: withId(/(\bimport\b\s*)(?:<ID>(?:\s*,\s*(?:\*\s*as\s+<ID>|\{[^{}]*\}))?|\*\s*as\s+<ID>|\{[^{}]*\})(?=\s*\bfrom\b)/.source),
  			lookbehind: true,
  			inside: Prism.languages.javascript
  		},
  		'exports': {
  			// https://tc39.es/ecma262/#sec-exports
  			pattern: withId(/(\bexport\b\s*)(?:\*(?:\s*as\s+<ID>)?(?=\s*\bfrom\b)|\{[^{}]*\})/.source),
  			lookbehind: true,
  			inside: Prism.languages.javascript
  		}
  	});

  	Prism.languages.javascript['keyword'].unshift(
  		{
  			pattern: /\b(?:as|default|export|from|import)\b/,
  			alias: 'module'
  		},
  		{
  			pattern: /\b(?:await|break|catch|continue|do|else|finally|for|if|return|switch|throw|try|while|yield)\b/,
  			alias: 'control-flow'
  		},
  		{
  			pattern: /\bnull\b/,
  			alias: ['null', 'nil']
  		},
  		{
  			pattern: /\bundefined\b/,
  			alias: 'nil'
  		}
  	);

  	Prism.languages.insertBefore('javascript', 'operator', {
  		'spread': {
  			pattern: /\.{3}/,
  			alias: 'operator'
  		},
  		'arrow': {
  			pattern: /=>/,
  			alias: 'operator'
  		}
  	});

  	Prism.languages.insertBefore('javascript', 'punctuation', {
  		'property-access': {
  			pattern: withId(/(\.\s*)#?<ID>/.source),
  			lookbehind: true
  		},
  		'maybe-class-name': {
  			pattern: /(^|[^$\w\xA0-\uFFFF])[A-Z][$\w\xA0-\uFFFF]+/,
  			lookbehind: true
  		},
  		'dom': {
  			// this contains only a few commonly used DOM variables
  			pattern: /\b(?:document|(?:local|session)Storage|location|navigator|performance|window)\b/,
  			alias: 'variable'
  		},
  		'console': {
  			pattern: /\bconsole(?=\s*\.)/,
  			alias: 'class-name'
  		}
  	});


  	// add 'maybe-class-name' to tokens which might be a class name
  	var maybeClassNameTokens = ['function', 'function-variable', 'method', 'method-variable', 'property-access'];

  	for (var i = 0; i < maybeClassNameTokens.length; i++) {
  		var token = maybeClassNameTokens[i];
  		var value = Prism.languages.javascript[token];

  		// convert regex to object
  		if (Prism.util.type(value) === 'RegExp') {
  			value = Prism.languages.javascript[token] = {
  				pattern: value
  			};
  		}

  		// keep in mind that we don't support arrays

  		var inside = value.inside || {};
  		value.inside = inside;

  		inside['maybe-class-name'] = /^[A-Z][\s\S]*/;
  	}

  }(Prism));

  (function (Prism) {

  	var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
  	var selectorInside;

  	Prism.languages.css.selector = {
  		pattern: Prism.languages.css.selector.pattern,
  		lookbehind: true,
  		inside: selectorInside = {
  			'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
  			'pseudo-class': /:[-\w]+/,
  			'class': /\.[-\w]+/,
  			'id': /#[-\w]+/,
  			'attribute': {
  				pattern: RegExp('\\[(?:[^[\\]"\']|' + string.source + ')*\\]'),
  				greedy: true,
  				inside: {
  					'punctuation': /^\[|\]$/,
  					'case-sensitivity': {
  						pattern: /(\s)[si]$/i,
  						lookbehind: true,
  						alias: 'keyword'
  					},
  					'namespace': {
  						pattern: /^(\s*)(?:(?!\s)[-*\w\xA0-\uFFFF])*\|(?!=)/,
  						lookbehind: true,
  						inside: {
  							'punctuation': /\|$/
  						}
  					},
  					'attr-name': {
  						pattern: /^(\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+/,
  						lookbehind: true
  					},
  					'attr-value': [
  						string,
  						{
  							pattern: /(=\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+(?=\s*$)/,
  							lookbehind: true
  						}
  					],
  					'operator': /[|~*^$]?=/
  				}
  			},
  			'n-th': [
  				{
  					pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
  					lookbehind: true,
  					inside: {
  						'number': /[\dn]+/,
  						'operator': /[+-]/
  					}
  				},
  				{
  					pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i,
  					lookbehind: true
  				}
  			],
  			'combinator': />|\+|~|\|\|/,

  			// the `tag` token has been existed and removed.
  			// because we can't find a perfect tokenize to match it.
  			// if you want to add it, please read https://github.com/PrismJS/prism/pull/2373 first.

  			'punctuation': /[(),]/,
  		}
  	};

  	Prism.languages.css['atrule'].inside['selector-function-argument'].inside = selectorInside;

  	Prism.languages.insertBefore('css', 'property', {
  		'variable': {
  			pattern: /(^|[^-\w\xA0-\uFFFF])--(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*/i,
  			lookbehind: true
  		}
  	});

  	var unit = {
  		pattern: /(\b\d+)(?:%|[a-z]+(?![\w-]))/,
  		lookbehind: true
  	};
  	// 123 -123 .123 -.123 12.3 -12.3
  	var number = {
  		pattern: /(^|[^\w.-])-?(?:\d+(?:\.\d+)?|\.\d+)/,
  		lookbehind: true
  	};

  	Prism.languages.insertBefore('css', 'function', {
  		'operator': {
  			pattern: /(\s)[+\-*\/](?=\s)/,
  			lookbehind: true
  		},
  		// CAREFUL!
  		// Previewers and Inline color use hexcode and color.
  		'hexcode': {
  			pattern: /\B#[\da-f]{3,8}\b/i,
  			alias: 'color'
  		},
  		'color': [
  			{
  				pattern: /(^|[^\w-])(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGr[ae]y|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGr[ae]y|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGr[ae]y|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gr[ae]y|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGr[ae]y|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGr[ae]y|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGr[ae]y|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Transparent|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)(?![\w-])/i,
  				lookbehind: true
  			},
  			{
  				pattern: /\b(?:hsl|rgb)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:hsl|rgb)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B/i,
  				inside: {
  					'unit': unit,
  					'number': number,
  					'function': /[\w-]+(?=\()/,
  					'punctuation': /[(),]/
  				}
  			}
  		],
  		// it's important that there is no boundary assertion after the hex digits
  		'entity': /\\[\da-f]{1,8}/i,
  		'unit': unit,
  		'number': number
  	});

  }(Prism));

  (function (Prism) {

  	var templateString = Prism.languages.javascript['template-string'];

  	// see the pattern in prism-javascript.js
  	var templateLiteralPattern = templateString.pattern.source;
  	var interpolationObject = templateString.inside['interpolation'];
  	var interpolationPunctuationObject = interpolationObject.inside['interpolation-punctuation'];
  	var interpolationPattern = interpolationObject.pattern.source;


  	/**
  	 * Creates a new pattern to match a template string with a special tag.
  	 *
  	 * This will return `undefined` if there is no grammar with the given language id.
  	 *
  	 * @param {string} language The language id of the embedded language. E.g. `markdown`.
  	 * @param {string} tag The regex pattern to match the tag.
  	 * @returns {object | undefined}
  	 * @example
  	 * createTemplate('css', /\bcss/.source);
  	 */
  	function createTemplate(language, tag) {
  		if (!Prism.languages[language]) {
  			return undefined;
  		}

  		return {
  			pattern: RegExp('((?:' + tag + ')\\s*)' + templateLiteralPattern),
  			lookbehind: true,
  			greedy: true,
  			inside: {
  				'template-punctuation': {
  					pattern: /^`|`$/,
  					alias: 'string'
  				},
  				'embedded-code': {
  					pattern: /[\s\S]+/,
  					alias: language
  				}
  			}
  		};
  	}


  	Prism.languages.javascript['template-string'] = [
  		// styled-jsx:
  		//   css`a { color: #25F; }`
  		// styled-components:
  		//   styled.h1`color: red;`
  		createTemplate('css', /\b(?:styled(?:\([^)]*\))?(?:\s*\.\s*\w+(?:\([^)]*\))*)*|css(?:\s*\.\s*(?:global|resolve))?|createGlobalStyle|keyframes)/.source),

  		// html`<p></p>`
  		// div.innerHTML = `<p></p>`
  		createTemplate('html', /\bhtml|\.\s*(?:inner|outer)HTML\s*\+?=/.source),

  		// svg`<path fill="#fff" d="M55.37 ..."/>`
  		createTemplate('svg', /\bsvg/.source),

  		// md`# h1`, markdown`## h2`
  		createTemplate('markdown', /\b(?:markdown|md)/.source),

  		// gql`...`, graphql`...`, graphql.experimental`...`
  		createTemplate('graphql', /\b(?:gql|graphql(?:\s*\.\s*experimental)?)/.source),

  		// sql`...`
  		createTemplate('sql', /\bsql/.source),

  		// vanilla template string
  		templateString
  	].filter(Boolean);


  	/**
  	 * Returns a specific placeholder literal for the given language.
  	 *
  	 * @param {number} counter
  	 * @param {string} language
  	 * @returns {string}
  	 */
  	function getPlaceholder(counter, language) {
  		return '___' + language.toUpperCase() + '_' + counter + '___';
  	}

  	/**
  	 * Returns the tokens of `Prism.tokenize` but also runs the `before-tokenize` and `after-tokenize` hooks.
  	 *
  	 * @param {string} code
  	 * @param {any} grammar
  	 * @param {string} language
  	 * @returns {(string|Token)[]}
  	 */
  	function tokenizeWithHooks(code, grammar, language) {
  		var env = {
  			code: code,
  			grammar: grammar,
  			language: language
  		};
  		Prism.hooks.run('before-tokenize', env);
  		env.tokens = Prism.tokenize(env.code, env.grammar);
  		Prism.hooks.run('after-tokenize', env);
  		return env.tokens;
  	}

  	/**
  	 * Returns the token of the given JavaScript interpolation expression.
  	 *
  	 * @param {string} expression The code of the expression. E.g. `"${42}"`
  	 * @returns {Token}
  	 */
  	function tokenizeInterpolationExpression(expression) {
  		var tempGrammar = {};
  		tempGrammar['interpolation-punctuation'] = interpolationPunctuationObject;

  		/** @type {Array} */
  		var tokens = Prism.tokenize(expression, tempGrammar);
  		if (tokens.length === 3) {
  			/**
  			 * The token array will look like this
  			 * [
  			 *     ["interpolation-punctuation", "${"]
  			 *     "..." // JavaScript expression of the interpolation
  			 *     ["interpolation-punctuation", "}"]
  			 * ]
  			 */

  			var args = [1, 1];
  			args.push.apply(args, tokenizeWithHooks(tokens[1], Prism.languages.javascript, 'javascript'));

  			tokens.splice.apply(tokens, args);
  		}

  		return new Prism.Token('interpolation', tokens, interpolationObject.alias, expression);
  	}

  	/**
  	 * Tokenizes the given code with support for JavaScript interpolation expressions mixed in.
  	 *
  	 * This function has 3 phases:
  	 *
  	 * 1. Replace all JavaScript interpolation expression with a placeholder.
  	 *    The placeholder will have the syntax of a identify of the target language.
  	 * 2. Tokenize the code with placeholders.
  	 * 3. Tokenize the interpolation expressions and re-insert them into the tokenize code.
  	 *    The insertion only works if a placeholder hasn't been "ripped apart" meaning that the placeholder has been
  	 *    tokenized as two tokens by the grammar of the embedded language.
  	 *
  	 * @param {string} code
  	 * @param {object} grammar
  	 * @param {string} language
  	 * @returns {Token}
  	 */
  	function tokenizeEmbedded(code, grammar, language) {
  		// 1. First filter out all interpolations

  		// because they might be escaped, we need a lookbehind, so we use Prism
  		/** @type {(Token|string)[]} */
  		var _tokens = Prism.tokenize(code, {
  			'interpolation': {
  				pattern: RegExp(interpolationPattern),
  				lookbehind: true
  			}
  		});

  		// replace all interpolations with a placeholder which is not in the code already
  		var placeholderCounter = 0;
  		/** @type {Object<string, string>} */
  		var placeholderMap = {};
  		var embeddedCode = _tokens.map(function (token) {
  			if (typeof token === 'string') {
  				return token;
  			} else {
  				var interpolationExpression = token.content;

  				var placeholder;
  				while (code.indexOf(placeholder = getPlaceholder(placeholderCounter++, language)) !== -1) { /* noop */ }
  				placeholderMap[placeholder] = interpolationExpression;
  				return placeholder;
  			}
  		}).join('');


  		// 2. Tokenize the embedded code

  		var embeddedTokens = tokenizeWithHooks(embeddedCode, grammar, language);


  		// 3. Re-insert the interpolation

  		var placeholders = Object.keys(placeholderMap);
  		placeholderCounter = 0;

  		/**
  		 *
  		 * @param {(Token|string)[]} tokens
  		 * @returns {void}
  		 */
  		function walkTokens(tokens) {
  			for (var i = 0; i < tokens.length; i++) {
  				if (placeholderCounter >= placeholders.length) {
  					return;
  				}

  				var token = tokens[i];

  				if (typeof token === 'string' || typeof token.content === 'string') {
  					var placeholder = placeholders[placeholderCounter];
  					var s = typeof token === 'string' ? token : /** @type {string} */ (token.content);

  					var index = s.indexOf(placeholder);
  					if (index !== -1) {
  						++placeholderCounter;

  						var before = s.substring(0, index);
  						var middle = tokenizeInterpolationExpression(placeholderMap[placeholder]);
  						var after = s.substring(index + placeholder.length);

  						var replacement = [];
  						if (before) {
  							replacement.push(before);
  						}
  						replacement.push(middle);
  						if (after) {
  							var afterTokens = [after];
  							walkTokens(afterTokens);
  							replacement.push.apply(replacement, afterTokens);
  						}

  						if (typeof token === 'string') {
  							tokens.splice.apply(tokens, [i, 1].concat(replacement));
  							i += replacement.length - 1;
  						} else {
  							token.content = replacement;
  						}
  					}
  				} else {
  					var content = token.content;
  					if (Array.isArray(content)) {
  						walkTokens(content);
  					} else {
  						walkTokens([content]);
  					}
  				}
  			}
  		}
  		walkTokens(embeddedTokens);

  		return new Prism.Token(language, embeddedTokens, 'language-' + language, code);
  	}

  	/**
  	 * The languages for which JS templating will handle tagged template literals.
  	 *
  	 * JS templating isn't active for only JavaScript but also related languages like TypeScript, JSX, and TSX.
  	 */
  	var supportedLanguages = {
  		'javascript': true,
  		'js': true,
  		'typescript': true,
  		'ts': true,
  		'jsx': true,
  		'tsx': true,
  	};
  	Prism.hooks.add('after-tokenize', function (env) {
  		if (!(env.language in supportedLanguages)) {
  			return;
  		}

  		/**
  		 * Finds and tokenizes all template strings with an embedded languages.
  		 *
  		 * @param {(Token | string)[]} tokens
  		 * @returns {void}
  		 */
  		function findTemplateStrings(tokens) {
  			for (var i = 0, l = tokens.length; i < l; i++) {
  				var token = tokens[i];

  				if (typeof token === 'string') {
  					continue;
  				}

  				var content = token.content;
  				if (!Array.isArray(content)) {
  					if (typeof content !== 'string') {
  						findTemplateStrings([content]);
  					}
  					continue;
  				}

  				if (token.type === 'template-string') {
  					/**
  					 * A JavaScript template-string token will look like this:
  					 *
  					 * ["template-string", [
  					 *     ["template-punctuation", "`"],
  					 *     (
  					 *         An array of "string" and "interpolation" tokens. This is the simple string case.
  					 *         or
  					 *         ["embedded-code", "..."] This is the token containing the embedded code.
  					 *                                  It also has an alias which is the language of the embedded code.
  					 *     ),
  					 *     ["template-punctuation", "`"]
  					 * ]]
  					 */

  					var embedded = content[1];
  					if (content.length === 3 && typeof embedded !== 'string' && embedded.type === 'embedded-code') {
  						// get string content
  						var code = stringContent(embedded);

  						var alias = embedded.alias;
  						var language = Array.isArray(alias) ? alias[0] : alias;

  						var grammar = Prism.languages[language];
  						if (!grammar) {
  							// the embedded language isn't registered.
  							continue;
  						}

  						content[1] = tokenizeEmbedded(code, grammar, language);
  					}
  				} else {
  					findTemplateStrings(content);
  				}
  			}
  		}

  		findTemplateStrings(env.tokens);
  	});


  	/**
  	 * Returns the string content of a token or token stream.
  	 *
  	 * @param {string | Token | (string | Token)[]} value
  	 * @returns {string}
  	 */
  	function stringContent(value) {
  		if (typeof value === 'string') {
  			return value;
  		} else if (Array.isArray(value)) {
  			return value.map(stringContent).join('');
  		} else {
  			return stringContent(value.content);
  		}
  	}

  }(Prism));

  var template$4 = "<main>\r\n  <nav id=\"nav\"></nav>\r\n  <div id=\"hero\"></div>\r\n  <div id=\"footer\"></div>\r\n</main>\r\n";

  let App = Dative.extend({
    template: template$4,
    use: [index],
    onmounted() {
      Prism$1.highlightAll();
    },
  });

  var template$3 = "<nav class=\"bg-white shadow dark:bg-base-300\">\r\n  <div class=\"container px-6 py-3 mx-auto md:flex\">\r\n    <div class=\"flex items-center justify-between\">\r\n      <div>\r\n        <a class=\"text-2xl font-bold text-gray-800 transition-colors duration-200 transform dark:text-white lg:text-3xl hover:text-gray-700 dark:hover:text-gray-300\" href=\"/\">Pizzle</a>\r\n      </div>\r\n\r\n      <!-- Mobile menu button -->\r\n      <div class=\"flex md:hidden\" on:click=\"$ref.menu.classList.toggle('hidden')\">\r\n        <button type=\"button\" class=\"text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400\" aria-label=\"toggle menu\">\r\n          <svg viewBox=\"0 0 24 24\" class=\"w-6 h-6 fill-current\">\r\n            <path fill-rule=\"evenodd\" d=\"M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z\"></path>\r\n          </svg>\r\n        </button>\r\n      </div>\r\n    </div>\r\n\r\n    <!-- Mobile Menu open: \"block\", Menu closed: \"hidden\" -->\r\n    <div class=\"w-full md:flex md:items-center md:justify-between hidden transition-all duration-100 delay-75\" #menu=\"\">\r\n      <div class=\"flex flex-col px-2 py-3 -mx-4 md:flex-row md:mx-0 md:py-0\">\r\n        <a href=\"/\" class=\"px-2 py-1 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded dark:text-gray-200 hover:bg-gray-900 hover:text-gray-100 md:mx-2\">Home</a>\r\n        <a href=\"guide/index.html\" class=\"px-2 py-1 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded dark:text-gray-200 hover:bg-gray-900 hover:text-gray-100 md:mx-2\">Guide</a>\r\n      </div>\r\n\r\n      <div class=\"relative\">\r\n        <span class=\"absolute inset-y-0 left-0 flex items-center pl-3\">\r\n          <svg class=\"w-5 h-5 text-gray-400\" viewBox=\"0 0 24 24\" fill=\"none\">\r\n            <path d=\"M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>\r\n          </svg>\r\n        </span>\r\n\r\n        <input #search=\"\" type=\"text\" class=\"w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none\" placeholder=\"Search (Cmd + /)\" on:focus=\"open = true\" on:blur=\"open = false\" on:input=\"search($event)\">\r\n        <div>\r\n          <ul class=\"menu bg-base-100 w-56 absolute divide-y divide-gray-50\">\r\n            {{#if (open && $ref.search.value && filteredNames.length === 0)}}\r\n            <p class=\"text-xl text-gray-200 px-5\">Not Found</p>\r\n            {{/if}}  \r\n            {{#each filteredNames as item}}\r\n            <li><a href=\"{{item.link}}\">{{item.name}}</a></li>\r\n            {{/each}} \r\n          </ul>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</nav>\r\n";

  let Nav = Dative.extend({
    template: template$3,
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

  var template$2 = "<div class=\"hero min-h-screen bg-base-200\">\r\n  <div class=\"hero-content flex-col lg:flex-row-reverse\">\r\n    <div class=\"mockup-code max-w-sm rounded-lg shadow-2xl\">\r\n      <pre data-prefix=\"$\"><code><span @slidein=\"2100, 8\"><span class=\"text-yellow-600\">npm</span> <span class=\"text-yellow-400\">install</span> pizzle</span></code></pre>\r\n    </div>\r\n    <div class=\"px-8\">\r\n      <h1 class=\"text-5xl font-bold\">pizzle</h1>\r\n      <p class=\"py-6 text-center text-3xl\">An Animation Library</p>\r\n      <div class=\"grid place-items-center\">\r\n        <button class=\"btn btn-primary\"><a href=\"/guide/index.html\">Get Started</a></button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n";

  let Hero = Dative.extend({
    template: template$2,
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

  var template$1 = "<footer class=\"footer items-center p-4 bg-neutral text-neutral-content\">\r\n  <div class=\"items-center grid-flow-col\">\r\n    <p>Copyright © 2022 - MIT Licensed. Built By TexxaLabs Tech Teams</p>\r\n  </div>\r\n</footer>\r\n";

  let Footer = Dative.extend({
      template: template$1
  });

  var template = "<h1 id=\"introduction\">Introduction</h1>\n<p>PizzleJS is a Css+Javascript animation library</p>\n<p>It Makes Using of <code>@keyframes</code> animation easier in your html </p>\n<p>Integration for</p>\n<h3 id=\"coming-soon\">Coming Soon</h3>\n<ul>\n<li><code>@pizzle/dative</code> - <a href=\"https://dativejs.js.org\">DativeJs</a></li>\n<li><code>@pizzle/svelte</code> - <a href=\"https://svelte.dev\">SvelteJs</a></li>\n<li><code>@pizzle/react</code> - <a href=\"https://reactjs.dev\">ReactJs</a></li>\n<li><code>@pizzle/vue</code> - <a href=\"https://vuejs.dev\">VueJs</a><h3 id=\"we-working-on-the-plugins\">We working on the plugins</h3>\n</li>\n</ul>\n<h1 id=\"installation\">Installation</h1>\n<h3 id=\"via-cdn\">Via Cdn</h3>\n\n    <div>\n      <pre  class=\"language-html mockup-code shadow-2xl\"><code>&lt;!-- Development --&gt;\n&lt;link rel=\"stylesheet\" href=\"https://unpkg.com/pizzle@1.0.0/dist/pizzle.css\" /&gt;\n&lt;script src=\"https://unpkg.com/pizzle@1.0.0/dist/pizzle.js\"&gt;&lt;/script&gt;\n\n&lt;!-- Production --&gt;\n&lt;link\n  rel=\"stylesheet\"\n  href=\"https://unpkg.com/pizzle@1.0.0/dist/pizzle.min.css\"\n/&gt;\n&lt;script src=\"https://unpkg.com/pizzle@1.0.0/dist/pizzle.min.js\"&gt;&lt;/script&gt;</code></pre>\n    </div><h3 id=\"via-native-es-modules\">via Native Es Modules</h3>\n\n    <div>\n      <pre  class=\"language-js mockup-code shadow-2xl\"><code>// Development\nimport { create } from \"https://unpkg.com/pizzle@1.0.0/dist/pizzle.es.js\";\n// or\nimport pizzle from \"https://unpkg.com/pizzle@1.0.0/dist/pizzle.es.js\";\n// avaliable as pizzle.create\n\n// Production\nimport { create } from \"https://unpkg.com/pizzle@1.0.0/dist/pizzle.es.min.js\";\n// or\nimport pizzle from \"https://unpkg.com/pizzle@1.0.0/dist/pizzle.es.min.js\";\n// avaliable as pizzle.create</code></pre>\n    </div><h3 id=\"via-npm\">Via Npm</h3>\n\n    <div>\n      <pre data-prefix=\"$\" class=\"language-bash mockup-code shadow-2xl\"><code>npm install pizzle --save</code></pre>\n    </div><h3 id=\"via-yarn\">Via Yarn</h3>\n\n    <div>\n      <pre data-prefix=\"$\" class=\"language-bash mockup-code shadow-2xl\"><code>yarn add pizzle -S</code></pre>\n    </div><h1 id=\"usage\">Usage</h1>\n\n    <div>\n      <pre  class=\"language-js mockup-code shadow-2xl\"><code>import pizzle from \"pizzle\";\nlet animate = new pizzle.create();\nanimate.init();</code></pre>\n    </div><p>For Customization\nDefault Setting</p>\n\n    <div>\n      <pre  class=\"language-ts mockup-code shadow-2xl\"><code>import pizzle from \"pizzle\";\nlet animate = new pizzle.create({\n  target: \"app\", // target for the animation\n  duration: 1000, // duration for the animation\n});\nanimate.init();</code></pre>\n    </div><h3 id=\"changing-the-duration\">Changing the Duration</h3>\n\n    <div>\n      <pre  class=\"language-ts mockup-code shadow-2xl\"><code>import pizzle from \"pizzle\";\nlet animate = new pizzle.create({\n  target: \"app\", \n  duration: 4000,\n});\nanimate.init();</code></pre>\n    </div><p>With Pizzle you can do reverse too. But it&#39;s not in-built. Later in the guide we will show how you can do that</p>\n<h3 id=\"list-of-all-the-builtin-animations\">List of All The Builtin Animations</h3>\n<ul>\n<li><p>Bounce</p>\n</li>\n<li><p>BounceIn</p>\n</li>\n<li><p>BounceInLeft</p>\n</li>\n<li><p>BounceInRight</p>\n</li>\n<li><p>BounceInUp</p>\n</li>\n<li><p>BounceInDown</p>\n</li>\n<li><p>BounceOut</p>\n</li>\n<li><p>BounceOutLeft</p>\n</li>\n<li><p>BounceOutRight</p>\n</li>\n<li><p>BounceOutUp</p>\n</li>\n<li><p>BounceOutDown</p>\n</li>\n<li><p>Pulse</p>\n</li>\n<li><p>Flash</p>\n</li>\n<li><p>Fadein</p>\n</li>\n<li><p>Tada</p>\n</li>\n<li><p>Swing</p>\n</li>\n<li><p>Shake</p>\n</li>\n<li><p>RubberBand</p>\n</li>\n</ul>\n<blockquote>\n<p><strong>Note</strong> The pizzle directives respects  kebabcase\nSo when make a custom animation use of kebabcase is required for naming of the animations</p>\n</blockquote>\n\n    <div>\n      <pre  class=\"language-tsx mockup-code shadow-2xl\"><code>&lt;h1 pizzle-bounce=\"&lt;iteration: (infinite | reverse)&gt; &lt;duration: number&gt;\"&gt;&lt;/h1&gt;</code></pre>\n    </div><ul>\n<li><code>Bounce</code></li>\n</ul>\n\n    <div>\n      <pre  class=\"language-html mockup-code shadow-2xl\"><code>&lt;div pizzle-start=\"app\"&gt;\n    &lt;h1 pizzle-bounce=\"infinite 3000\"&gt;Hello&lt;/h1&gt;\n&lt;/div&gt;</code></pre>\n    </div><ul>\n<li><code>BounceIn</code></li>\n</ul>\n\n    <div>\n      <pre  class=\"language-html mockup-code shadow-2xl\"><code>&lt;div pizzle-start=\"app\"&gt;\n    &lt;h1 pizzle-bounce-in=\"infinite 3000\"&gt;Hello&lt;/h1&gt;\n&lt;/div&gt;</code></pre>\n    </div><ul>\n<li><code>BounceOut</code></li>\n</ul>\n\n    <div>\n      <pre  class=\"language-html mockup-code shadow-2xl\"><code>&lt;div pizzle-start=\"app\"&gt;\n    &lt;h1 pizzle-bounce-out=\"infinite 3000\"&gt;Hello&lt;/h1&gt;\n&lt;/div&gt;</code></pre>\n    </div><ul>\n<li><code>Flash</code></li>\n</ul>\n\n    <div>\n      <pre  class=\"language-html mockup-code shadow-2xl\"><code>&lt;div pizzle-start=\"app\"&gt;\n    &lt;h1 pizzle-flash=\"infinite 3000\"&gt;Hello&lt;/h1&gt;\n&lt;/div&gt;</code></pre>\n    </div><ul>\n<li><code>Tada</code></li>\n</ul>\n\n    <div>\n      <pre  class=\"language-html mockup-code shadow-2xl\"><code>&lt;div pizzle-start=\"app\"&gt;\n    &lt;h1 pizzle-tada=\"infinite 3000\"&gt;Hello&lt;/h1&gt;\n&lt;/div&gt;</code></pre>\n    </div><ul>\n<li><code>Swing</code></li>\n</ul>\n\n    <div>\n      <pre  class=\"language-html mockup-code shadow-2xl\"><code>&lt;div pizzle-start=\"app\"&gt;\n    &lt;h1 pizzle-swing=\"infinite 3000\"&gt;Hello&lt;/h1&gt;\n&lt;/div&gt;</code></pre>\n    </div><ul>\n<li><code>Shake</code></li>\n</ul>\n\n    <div>\n      <pre  class=\"language-html mockup-code shadow-2xl\"><code>&lt;div pizzle-start=\"app\"&gt;\n    &lt;h1 pizzle-shake=\"infinite 3000\"&gt;Hello&lt;/h1&gt;\n&lt;/div&gt;</code></pre>\n    </div><ul>\n<li><code>Pulse</code></li>\n</ul>\n\n    <div>\n      <pre  class=\"language-html mockup-code shadow-2xl\"><code>&lt;div pizzle-start=\"app\"&gt;\n    &lt;h1 pizzle-pulse=\"infinite 3000\"&gt;Hello&lt;/h1&gt;\n&lt;/div&gt;</code></pre>\n    </div><ul>\n<li><code>RubberBand</code></li>\n</ul>\n\n    <div>\n      <pre  class=\"language-html mockup-code shadow-2xl\"><code>&lt;div pizzle-start=\"app\"&gt;\n    &lt;h1 pizzle-rubber-band=\"infinite 3000\"&gt;Hello&lt;/h1&gt;\n&lt;/div&gt;</code></pre>\n    </div><ul>\n<li><code>Fadein</code></li>\n</ul>\n\n    <div>\n      <pre  class=\"language-html mockup-code shadow-2xl\"><code>&lt;div pizzle-start=\"app\"&gt;\n    &lt;h1 pizzle-fadde-in=\"infinite 3000\"&gt;Hello&lt;/h1&gt;\n&lt;/div&gt;</code></pre>\n    </div><h3 id=\"creating-custom-animations\">Creating Custom Animations</h3>\n\n    <div>\n      <pre  class=\"language-css mockup-code shadow-2xl\"><code>@keyframe rotate {\n    from {\n        transform: rotate(0deg)\n    }\n    to {\n        transfrom: rotate(360deg)\n    }\n}\n\n\n.rotate {\n    aniamtion-name: rotate;\n    animation-timing-function: linear;\n}\n\n.rotate-1000 {\n    animation-duration: 1s;\n}\n.rotate-2000 {\n    animation-duration: 2s;\n}\n.rotate-3000 {\n    animation-duration: 3s;\n}\n.rotate-4000 {\n    animation-duration: 4s;\n}\n.rotate-5000 {\n    animation-duration: 5s;\n}\n/* Default for pizzlejs durations is 5000\n But You can extend it\n*/\n.rotate-6000 {\n    animation-duration: 6s;\n}</code></pre>\n    </div><h3 id=\"custom-animation-usage\">Custom animation usage</h3>\n\n    <div>\n      <pre  class=\"language-html mockup-code shadow-2xl\"><code>&lt;div&gt;\n    &lt;h1 pizzle-rotate=\"infinite 4000\"&gt;Rollay&lt;/h1&gt;\n&lt;/div&gt;</code></pre>\n    </div><blockquote>\n<p>The Next version of <code>pizzlejs</code> will be more of javascript with more helpers to ease the stress of creating custom animations</p>\n</blockquote>\n";

  let Guide = Dative.extend({
    template: `<div class="bg-base-200">
    <div id="nav"></div>
        <div class="prose prose-lg sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl mx-auto min-h-screen prose-blue mt-5">
            <div class="mx-3">
            ${template}
            </div>
        </div>
        <div id="footer"></div>
    </div>`
  });

  let app = new App({
    el: "#app",
  });


  if (window.location.pathname === "/guide/index.html") {
    let guide = new Guide({
      el: "#app",
    });
    
    guide.attach([nav, footer]);
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

})();
