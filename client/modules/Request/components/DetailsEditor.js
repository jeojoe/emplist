import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import s from './DetailsEditor.css';

class DetailsEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  // componentDidMount() {
  //   window.addEventListener('scroll', this.handleScroll);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.handleScroll);
  // }

  onEditorStateChange = (editorState) => {
    this.setState({ editorState });
  }

  // handleScroll = (event) => {
  //   console.log(window.scrollY);
  //   const toolbar = document.getElementsByClassName('rdw-editor-toolbar')[0]
  //   console.log(toolbar.offsetTop);
  //   console.log(toolbar.offsetHeight);
  // }

  render() {
    const { editorState } = this.state;
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
          onEditorStateChange={this.onEditorStateChange}
          toolbar={toolbar}
          placeholder="Enter text..."
        />
      </div>
    );
  }
}

export default DetailsEditor;
