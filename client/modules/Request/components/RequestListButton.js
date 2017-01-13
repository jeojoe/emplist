import React, { Component } from 'react';
import { withRouter } from 'react-router';
import AWS from 'aws-sdk';
import cuid from 'cuid';
import { convertToRaw } from 'draft-js';
import c from 'classnames';
import callApi from '../../../util/apiCaller';
import aws_config from '../../../../secret_config.json';

class RequestListButton extends Component {
  uploadCompanyLogo = (callback) => {
    const { logo_image_file, company_name } = this.props; //eslint-disable-line

    if (!logo_image_file) { return; }

    // Resize image
    const mainCanvas = document.createElement('canvas');
    const img = document.getElementById('logo-preview');
    mainCanvas.width = 100;
    mainCanvas.height = 100;
    const ctx = mainCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);

    // * CHANGE THIS ON PRODUCTION
    // E.g., Read from JSON is the least recommended approach here:
    // http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html
    AWS.config.update(aws_config);

    function dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      let byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
      } else {
        byteString = unescape(dataURI.split(',')[1]);
      }
      // separate out the mime component
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      // write the bytes of the string to a typed array
      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    }

    const s3 = new AWS.S3();
    const bucket = 'testemplist';
    const blob = dataURItoBlob(mainCanvas.toDataURL(logo_image_file.type));

    // console.log(`logos/lg_${company_name}_${cuid.slug()}`);
    const params = {
      Bucket: bucket,
      Key: `logos/lg_${company_name}_${cuid.slug()}`,
      Body: blob,
      ACL: 'public-read',
      ContentType: logo_image_file.type,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        callback(data, err);
      } else {
        callback(data);
      }
    });
  }

  submitRequest = () => {
    // Resize image
    const { submitting, setSubmitState } = this.props;
    if (submitting) return;

    setSubmitState(true);
    const { title, tags, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, editorState, how_to_apply, company_name, logo_image_file, logo_preview_url, remote_check, email, password, password_confirm, additional_note, country, city, location_detail } = this.props; //eslint-disable-line
    const details = convertToRaw(editorState.getCurrentContent());

    if (!title || !tags) {
      setSubmitState(false);
      alert('Please check Title or Skills field again.');
      return;
    } else if (exp_condition === 'between' && (!exp_between_min || !exp_between_max)) {
      setSubmitState(false);
      alert('Please check Experience field again (errors on "Between" condition).');
      return;
    } else if (exp_condition === 'more_than' && (!exp_more_than)) {
      setSubmitState(false);
      alert('Please check Experience field again (errors on "More than" condition).');
      return;
    } else if (!editorState.getCurrentContent().hasText()) {
      setSubmitState(false);
      alert('Please fill some details.');
      return;
    } else if (!how_to_apply) {
      setSubmitState(false);
      alert('Please specify how to apply.');
      return;
    } else if (!company_name || !location_detail) {
      setSubmitState(false);
      alert('Please specify your company\'s name or location detail.');
      return;
    } else if (!logo_preview_url || !logo_image_file) {
      setSubmitState(false);
      alert('Please reinsert your company\'s logo.');
      return;
    } else if (!email) {
      setSubmitState(false);
      alert('Please specify your email.');
      return;
    } else if (!password || !password_confirm) {
      setSubmitState(false);
      alert('Please specify your password or password confirmation.');
      return;
    }

    // all passes, upload logo
    const yes = confirm('Do you want to submit the request?');
    if (!yes) {
      setSubmitState(false);
      return;
    }

    const dis = this;
    this.uploadCompanyLogo((data, err) => {
      if (err) {
        alert('Something went wrong! (err code: 1), please contact hi.emplist@gmail.com');
        return;
      }
      const image_url = data.Location;
      // console.log(`company logo is at ${image_url}`);

      callApi('/requests', 'post', {
        list_request: {
          title, tags, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, how_to_apply, company_name, company_image: image_url, remote_check, email, password, password_confirm, additional_note, details, country, city, location_detail,
        },
      }).then((res) => {
        setSubmitState(false);
        if (!res.ok) {
          alert('Something went wrong! (err code: 2), please contact hi.emplist@gmail.com');
          return;
        }
        dis.props.router.push(`/request/done/${res.list_request_id}`);
      });
    });
  }

  render() {
    const { submitting, buttonStyle } = this.props;
    return (
      <button
        className={c('button-primary', buttonStyle)}
        onClick={this.submitRequest}
      >
        {submitting ? 'Submitting..' : 'Submit list request'}
      </button>
    );
  }
}

RequestListButton.propTypes = {
  submitting: React.PropTypes.bool,
  setSubmitState: React.PropTypes.func,
  buttonStyle: React.PropTypes.string,
};

export default withRouter(RequestListButton);
