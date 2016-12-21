import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import c from 'classnames';
import s from './DetailsEditor.css';
import _ from 'lodash';

class DetailsEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBarFix: false,
    };
    this.handleScroll = _.throttle(this.handleScroll, 100);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { isBarFix } = this.state;

    const windowTop = window.scrollY;
    const editor = document.getElementsByClassName(s.editor)[0];
    const editorTop = editor.getBoundingClientRect().top;
    const editorHeight = editor.offsetHeight;
    console.log(windowTop, editorTop, editorHeight);
    if (editorTop <= 0 && -editorTop <= editorHeight) {
      this.setState({ isBarFix: true });
    } else {
      this.setState({ isBarFix: false });
    }
  }

  render() {
    const { editorState, onEditorStateChange } = this.props;
    const { isBarFix } = this.state;
    const toolbar = {
      options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'history'],
      inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough'],
      },
    };

    return (
      <div>
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          toolbar={toolbar}
          placeholder="Enter text..."
          toolbarClassName={c(s.toolbar, {[`${s.fixed}`]: isBarFix})}
          wrapperClassName={s.wrapper}
          editorClassName={s.editor}
        />
      </div>
    );
  }
}

export default DetailsEditor;
