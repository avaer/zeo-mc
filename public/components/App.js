import React from 'react';

import World from './World';

export default class App extends React.Component {
  render() {
    const $window = $(window);
    const worldProps = {
      width: $window.width(),
      height: $(window).height()
    };

    return (
      <World {...worldProps}/>
    );
  }
}
