import React from 'react';
import ReactDom from 'react-dom';
import {is} from 'immutable';

import AceEditor from 'react-ace';

class Editor extends React.Component {
  static defaultProps = {
    visible: true
  };

  state = {
    value: 'lol'
  };

  componentDidMount() {
    this.getDomNode().css({
      position: 'absolute',
      top: 0,
      left: 0
    });

    this.updateVisibility();
  }

  componentWillReceiveProps(nextProps) {
    const {visible} = nextProps;
    const {visible: oldVisible} = this.props;
    if (!is(visible, oldVisible)) {
      this.updateVisibility(nextProps);
    }
  }

  getDomNode() {
    return $(ReactDom.findDOMNode(this));
  }

  updateVisibility(props) {
    props === undefined && (props = this.props);

    const {visible} = props;
    const visibility = visible ? '' : 'hidden';
    this.getDomNode().css({visibility});
  }

  render() {
    const {value, onChange} = this.props;

    return <AceEditor
      mode='jsx'
      theme='chrome'
      value={this.state.value}
      onChange={value => this.setState({value})}
      name='editor'
      // editorProps={{$blockScrolling: true}}
    />;
  }
}

export default Editor;
