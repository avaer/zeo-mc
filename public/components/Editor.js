import React from 'react';
import ReactDom from 'react-dom';
import {is} from 'immutable';

import AceEditor from 'react-ace';
import 'brace/mode/jsx';
import 'brace/theme/chrome';

class Editor extends React.Component {
  static defaultProps = {
    visible: true,
    focus: true,
  };

  state = {
    value: 'lol'
  };

  componentWillMount() {
    this._editor = null;
  }

  componentDidMount() {
    this.getDomNode().css({
      position: 'absolute',
      width: 'auto',
      height: 'auto',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    });

    this.update();
  }

  componentWillReceiveProps(nextProps) {
    const {visible} = nextProps;
    const {visible: oldVisible} = this.props;
    if (!is(visible, oldVisible)) {
      this.updateVisibility(nextProps);
    }

    const {focused} = nextProps;
    const {focused: oldFocused} = this.props;
    if (!is(focused, oldFocused)) {
      this.updateFocus(nextProps);
    }
  }

  getDomNode() {
    return $(ReactDom.findDOMNode(this));
  }

  update() {
    this.updateVisibility();
    this.updateFocus();
  }

  updateVisibility(props) {
    props === undefined && (props = this.props);

    const {visible} = props;
    const visibility = visible ? '' : 'hidden';
    const opacity = visible ? '' : String(0);
    this.getDomNode().css({visibility, opacity});
  }

  updateFocus(props) {
    props === undefined && (props = this.props);

    const {focused} = props;
    if (focused) {
      this._editor.focus();
    }
  }

  render() {
    const {value, onChange} = this.props;

    return <AceEditor
      mode='jsx'
      theme='chrome'
      value={this.state.value}
      onChange={value => this.setState({value})}
      name='editor'
      tabSize={2}
      onLoad={editor => { this._editor = editor; }}
      // editorProps={{$blockScrolling: true}}
    />;
  }
}

export default Editor;
