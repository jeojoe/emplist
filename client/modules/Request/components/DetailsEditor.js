import React, { Component } from 'react';
// import { Editor } from 'react-draft-wysiwyg';
import scriptLoader from 'react-async-script-loader';
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
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;
    if (isScriptLoaded && isScriptLoadSucceed) {
      tinymce.init({
        selector: '#mytextarea',
        theme: 'modern',
        menubar: false,
        plugins: [
          'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
          'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
          'save table contextmenu directionality emoticons template paste textcolor',
        ],
        toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',
        plugin_preview_width: 900,
      });
    }
    // window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        tinymce.init({
          selector: '#mytextarea',
          theme: 'modern',
          menubar: false,
          plugins: [
            'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
            'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
            'save table contextmenu directionality emoticons template paste textcolor',
          ],
          toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',
          plugin_preview_width: 900,
        });
      }
    }
  }

  componentWillUnmount() {
    tinymce.remove('#mytextarea');
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
    const { isScriptLoaded, isScriptLoadedSucceed } = this.props;
    const { isBarFix } = this.state;

    return (
      <div>
        <textarea id="mytextarea">Hello, World!</textarea>
      </div>
    );
  }
}

export default scriptLoader(
  'https://cloud.tinymce.com/stable/tinymce.min.js?apiKey=icv599u9scktjksi0db6oh4n3obkh0ryupfevrw06ps5q9vj'
)(DetailsEditor);
