import React from 'react';
import Immutable, {is} from 'immutable';

class NodeState extends Immutable.Record({
  value: ''
}) {}

function _initialState() {
  return {
    state: new NodeState({
      value: ''
    })
  };
}

class Node extends React.Component {
  state = _initialState();

  componentWillMount() {
    this._nodeScript = null;
  }

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.stop();
  }

  componentWillReceiveProps(nextProps) {
    const {src} = nextProps;
    const {src: oldSrc} = this.props;
    if (!is(src, oldSrc)) {
      this.updateSrc(nextProps);
    }

    const {state} = nextProps;
    const {state: oldState} = this.props;
    if (!is(state, oldState)) {
      this.updateState(nextProps);
    }
  }

  update(props) {
    props === undefined && ({props} = this);

    this.updateSrc(props);
    this.updateState(props);
  }

  updateSrc(props) {
    props === undefined && ({props} = this);

    this.stop(props);
    this.start(props);
  }

  updateState(props) {
    props === undefined && ({props} = this);

    const {state} = props;
    this._nodeScript.emit('state', state.toJS());
  }

  start(props) {
    props === undefined && ({props} = this);

    const {src} = props;

    this.setState(_initialState());

    this._nodeScript = new NodeScript(src);
    this._nodeScript.start();
    this._nodeScript.on('render', d => { // XXX refactor this into an exported render() call
      this.setState(({state}) => {state: state.update('value', oldValue => oldValue + JSON.stringify(d, null, 2) + '\n')});
    });
    this._nodeScript.on('console', s => {
      this.setState(({state}) => {state: state.update('value', oldValue => oldValue + s)});
    });
    this._nodeScript.on('error', error => {
      const {filename, lineno, message} = error;
      const s = 'script.js:' + lineno + ': ' + message + '\n';
      this.setState(({state}) => {state: state.update('value', oldValue => oldValue + s)});
    });
  }

  stop(props) {
    props === undefined && ({props} = this);

    if (this._nodeScript) {
      this._nodeScript.kill();
      this._nodeScript.destroy();
      this._nodeScript = null;
    }
  }

  render() {
    const {state: {value}} = this.state;
    return <div>{value}</div>;
  }
}

export default Node;
