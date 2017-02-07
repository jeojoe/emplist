import React, { Component } from 'react';
// import { Editor } from 'react-draft-wysiwyg';
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

  componentWillMount() {
    console.log('what');
  }
  componentDidMount() {
    // window.addEventListener('scroll', this.handleScroll);
    console.log('hey');
    console.log(window.$);
    console.log(window.jQuery);
    setTimeout(() => {
      $('#react-trumbowyg').trumbowyg();
    }, 1000);
  }

  componentWillUnmount() {
    // window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const editor = document.getElementsByClassName(s.editor)[0];
    const editorTop = editor.getBoundingClientRect().top;
    const editorHeight = editor.offsetHeight;
    if (editorTop <= 0 && -editorTop <= editorHeight) {
      this.setState({ isBarFix: true });
    } else {
      this.setState({ isBarFix: false });
    }
  }

  render() {
    // const { editorState, onEditorStateChange } = this.props;
    const { isBarFix } = this.state;
    const toolbar = {
      options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'history'],
      inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough'],
      },
    };

    return (
      <div>
        {/*<Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          toolbar={toolbar}
          placeholder="Enter text..."
          toolbarClassName={c(s.toolbar, {[`${s.fixed}`]: isBarFix})}
          wrapperClassName={s.wrapper}
          editorClassName={s.editor}
        />*/}
        <div id='react-trumbowyg' />
      </div>
    );
  }
}

export default DetailsEditor;
