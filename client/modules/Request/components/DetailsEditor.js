import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';
import isMobile from '../../../util/mobile-detect.js';
import c from 'classnames';
// import s from './DetailsEditor.css';
import _ from 'lodash';


class DetailsEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBarFix: false,
    };
    // this.handleScroll = _.throttle(this.handleScroll, 100);
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.initEditor();
    }
    // window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        this.initEditor();
      }
    }
  }

  componentWillUnmount() {
    tinymce.remove('#mytextarea');
  }

  initEditor = () => {
    tinymce.init({
      selector: '#mytextarea',
      theme: 'modern',
      max_width: 900,
      min_height: 500,
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc',
      ],
      toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor emoticons | link image media | codesample | print preview fullscreen ',
      plugin_preview_width: 900,
    });
  }
  // handleScroll = () => {
  //   const editor = document.getElementsByClassName(s.editor)[0];
  //   const editorTop = editor.getBoundingClientRect().top;
  //   const editorHeight = editor.offsetHeight;
  //   if (editorTop <= 0 && -editorTop <= editorHeight) {
  //     this.setState({ isBarFix: true });
  //   } else {
  //     this.setState({ isBarFix: false });
  //   }
  // }

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
