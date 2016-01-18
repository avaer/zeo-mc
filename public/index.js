import React from 'react';
import ReactDOM from 'react-dom';
import AppBody from './components/AppBody';

import Stores from './stores/index';
import Engines from './engines/index';

class App {
  constructor(domElement) {
    this._domElement = domElement;
    this._rendering = false;

    this.stores = new Stores();
    this.engines = new Engines({
      getState: name => {
        return this.stores.get(name);
	  },
      setState: (name, newState) => {
        this.stores = this.stores.set(name, newState);

        this.lazyRender();
      }
    });

    this.lazyRender();
  }

  render() {
    const {stores} = this;
    ReactDOM.render(<AppBody {...{stores}}/>, this._domElement);
  }

  lazyRender() {
    if (!this._rendering) {
      this._rendering = true;

      requestAnimationFrame(() => {
        this.render();

        this._rendering = false;
      });
    }
  }
}

const domElement = document.getElementById('app-body');
new App(domElement);
