import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import s from './DetailsEditor.css';

class DetailsEditor extends Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount() {
  //   window.addEventListener('scroll', this.handleScroll);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.handleScroll);
  // }

  // handleScroll = (event) => {
  //   console.log(window.scrollY);
  //   const toolbar = document.getElementsByClassName('rdw-editor-toolbar')[0]
  //   console.log(toolbar.offsetTop);
  //   console.log(toolbar.offsetHeight);
  // }

  render() {
    const { editorState, onEditorStateChange } = this.props;
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
        />
      </div>
    );
  }
}

export default DetailsEditor;
