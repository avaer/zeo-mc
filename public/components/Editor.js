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
    this.bind();
  }

  componentWillReceiveProps(nextProps) {
    const {visible} = nextProps;
    const {visible: oldVisible} = this.props;
    const updateVisibility = !is(visible, oldVisible);

    const {focused} = nextProps;
    const {focused: oldFocused} = this.props;
    const updateFocus = !is(focused, oldFocused);

    if (updateVisibility || updateFocus) {
      // avoid value update FOUC
      requestAnimationFrame(() => {      
        if (updateVisibility) {
          this.updateVisibility(nextProps);
        }
        if (updateFocus) {
          this.updateFocus(nextProps);
        }
      });
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

  bind() {
    this._editor.commands.addCommand({
      name: 'save',
      bindKey: {
        win: 'Ctrl-S',
        mac: 'Ctrl-S',
        sender: 'editor|cli'
      },
      exec: (env, args, request) => {
        const {value, onSave} = this.props;
        onSave(value);
      }
    });
    this._editor.commands.addCommand({
      name: 'quit',
      bindKey: {
        win: 'Ctrl-Q',
        mac: 'Ctrl-Q',
        sender: 'editor|cli'
      },
      exec: (env, args, request) => {
        const {onQuit} = this.props;
        onQuit();
      }
    });
  }

  render() {
    const {value, onChange} = this.props;

    return <AceEditor
      mode='jsx'
      theme='chrome'
      value={value}
      onChange={onChange}
      name='editor'
      tabSize={2}
      onLoad={editor => { this._editor = editor; }}
      // editorProps={{$blockScrolling: true}}
    />;
  }
}

export default Editor;
