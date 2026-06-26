(function () {
  function MiniQuery(elements) {
    this.elements = Array.prototype.slice.call(elements || []);
  }

  function $(selector) {
    if (typeof selector === "function") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", selector);
      } else {
        selector();
      }
      return new MiniQuery([]);
    }

    if (selector instanceof MiniQuery) return selector;
    if (selector === window || selector === document || selector instanceof Element) {
      return new MiniQuery([selector]);
    }

    return new MiniQuery(document.querySelectorAll(selector));
  }

  MiniQuery.prototype.each = function (callback) {
    this.elements.forEach(function (element, index) {
      callback.call(element, index, element);
    });
    return this;
  };

  MiniQuery.prototype.css = function (property, value) {
    if (typeof property === "object") {
      return this.each(function () {
        Object.keys(property).forEach((key) => {
          this.style[key] = property[key];
        });
      });
    }
    return this.each(function () {
      this.style[property] = typeof value === "number" ? value + "px" : value;
    });
  };

  MiniQuery.prototype.width = function () {
    return this.elements[0] ? this.elements[0].getBoundingClientRect().width : 0;
  };

  MiniQuery.prototype.height = function () {
    return this.elements[0] ? this.elements[0].getBoundingClientRect().height : 0;
  };

  MiniQuery.prototype.parent = function () {
    return new MiniQuery(this.elements.map((element) => element.parentElement).filter(Boolean));
  };

  MiniQuery.prototype.find = function (selector) {
    var found = [];
    this.each(function () {
      found = found.concat(Array.prototype.slice.call(this.querySelectorAll(selector)));
    });
    return new MiniQuery(found);
  };

  MiniQuery.prototype.eq = function (index) {
    return new MiniQuery(this.elements[index] ? [this.elements[index]] : []);
  };

  MiniQuery.prototype.click = function (handler) {
    return this.each(function () {
      this.addEventListener("click", function (event) {
        handler.call(this, event);
      });
    });
  };

  MiniQuery.prototype.append = function (content) {
    return this.each(function () {
      this.insertAdjacentHTML("beforeend", content);
    });
  };

  MiniQuery.prototype.text = function (content) {
    if (content === undefined) return this.elements[0] ? this.elements[0].textContent : "";
    return this.each(function () {
      this.textContent = content;
    });
  };

  MiniQuery.prototype.attr = function (name, value) {
    if (value === undefined) return this.elements[0] ? this.elements[0].getAttribute(name) : null;
    return this.each(function () {
      this.setAttribute(name, value);
    });
  };

  MiniQuery.prototype.fadeIn = function () {
    return this.each(function () {
      this.style.display = "block";
      this.style.opacity = "0";
      this.style.transition = "opacity 420ms ease";
      requestAnimationFrame(() => {
        this.style.opacity = "1";
      });
    });
  };

  MiniQuery.prototype.fadeOut = function () {
    return this.each(function () {
      this.style.opacity = "0";
      this.style.transition = "opacity 240ms ease";
      setTimeout(() => {
        this.style.display = "none";
      }, 240);
    });
  };

  $.ajaxSettings = {};
  $.getJSON = function (url, callback) {
    fetch(url)
      .then((response) => response.json())
      .then(callback);
  };

  window.$ = window.jQuery = $;
})();
