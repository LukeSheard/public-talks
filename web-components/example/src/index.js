require('webcomponents.js');

const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const Select = require('react-select');
require('react-select/dist/react-select.css');

String.prototype.

Select.propConverters = {
  options: JSON.parse
};

Select.eventHandlers = {
  onChange: function(val) {
    this.setAttribute('value', val.value);
  }
}

function createWebComponent(Component) {
  return class extends HTMLElement {
    createdCallback() {
      this.events = _.mapValues(Component.eventHandlers, (fn) => fn.bind(this));
      this._preventRender = false;
    }

    attributeChangedCallback(name, oldValue, value) {
      if (oldValue !== value) {
        this.render();
      }
    }

    addEventListener(name, cb) {
      super.addEventListener(name, cb);

      this._preventRender = true;
      const eventName = 'on' + name[0].toUpperCase() + name.slice(1);
      this.events[eventName] = (args) => {
        if (Component.eventHandlers[eventName]) {
          Select.eventHandlers[eventName].call(this, args);
        }
        return cb.call(this, args);
      };
      this._preventRender = false;
      this.render();
    }

    attachedCallback() {
      this.render();
    }

    render() {
      if (this._preventRender) {
        return;
      }

      const props = _.reduce(this.attributes, (acc, attribute) => {
        const convertFn = Component.propConverters[attribute.name];
        acc[attribute.name] = convertFn ? convertFn(attribute.value): attribute.value;
        return acc;
      }, this.events);
      return ReactDOM.render(<Component {...props} />, this);
    }
  };
}

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' }
];

document.registerElement('react-select', createWebComponent(Select));

const element = document.getElementsByTagName('react-select')[0];
window.part1 = function() {
  element.setAttribute('value', 'one');
  element.setAttribute('options', JSON.stringify(options));
}

window.part2 = function() {
  element.addEventListener('change', function(selected) {
    console.log(`Selected ${selected.value}`);
  });
}

const map = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
};

const button = document.getElementById('clicker');
button.onclick = () => {
  options.push({
    value: map[options.length + 1],
    label: map[options.length + 1].capitalise()
  });
  element.setAttribute('options', JSON.stringify(options));
};