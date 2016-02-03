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
