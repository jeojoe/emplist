import React, { Component } from 'react';
import { convertToRaw } from 'draft-js';
import { withRouter } from 'react-router';
import AWS from 'aws-sdk';
import cuid from 'cuid';
import c from 'classnames';
import callApi from '../../../util/apiCaller';
import aws_config from '../../../../secret_config.json';

class EditListButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
  }

  uploadCompanyLogo = (callback) => {
    const { logo_image_file, company_name, logo_preview_url } = this.props; //eslint-disable-line
    if (!logo_image_file) {
      callback({ Location: logo_preview_url });
      return;
    }

    // Resize image
    const mainCanvas = document.createElement('canvas');
    const img = document.getElementById('logo-preview');
    mainCanvas.width = 200;
    mainCanvas.height = 200;
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

  submitEdited = () => {
    // Resize image
    const { submitting, setSubmitState, list_id } = this.props;
    if (submitting) return;
    setSubmitState(true);

    callApi(`/lists/${list_id}/permission`, 'post', { password: this.state.password })
    .then((res) => {
      if (!res.ok) {
        alert('Something is not right about password..');
        setSubmitState(false);
        return;
      }
      const { title, tags, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, editorState, how_to_apply, company_name, logo_image_file, logo_preview_url, remote_check, country, city, location_detail, additional_note, company_id } = this.props; // eslint-disable-line
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
      }

      // all passes, upload logo
      const yes = confirm('Do you want to submit ?');
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

        callApi(`/lists/${list_id}`, 'post', {
          list: {
            _id: list_id, title, tags, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, how_to_apply, company_name, company_image: image_url, remote_check, details, country, city, location_detail, additional_note, company_id,
          },
        }).then(res1 => {
          setSubmitState(false);
          console.log(res1);
          if (!res1.ok) {
            alert('Something went wrong! (err code: 2), please contact hi.emplist@gmail.com');
            return;
          }
          dis.props.router.push(`/list/${res1.list_request_id}/edit/done`);
        });
      });
    });
  }

  render() {
    const { buttonStyle, submitting } = this.props;
    const { password } = this.state;
    return (
      <div>
        <input
          type="password" value={password}
          placeholder="enter password again"
          onChange={(e) => this.setState({ password: e.target.value })}
        />
        <button
          className={c('button-primary', buttonStyle)}
          onClick={this.submitEdited}
        >
          {submitting ? 'Submitting..' : 'Submit edit request'}
        </button>
      </div>
    );
  }
}

EditListButton.propTypes = {
  buttonStyle: React.PropTypes.string,
  submitting: React.PropTypes.bool,
  setSubmitState: React.PropTypes.func,
  list_id: React.PropTypes.string,
};

export default withRouter(EditListButton);
