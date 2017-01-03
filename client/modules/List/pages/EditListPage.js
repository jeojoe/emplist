import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import AWS from 'aws-sdk';
import cuid from 'cuid';

import SkillTagsInput from '../../Request/components/SkillTagsInput';
import HeaderText from '../../Request/components/HeaderText';
import DetailsEditor from '../../Request/components/DetailsEditor';
import callApi from '../../../util/apiCaller';
import c from 'classnames';
import s from './EditListPage.css';
import aws_config from '../../../../secret_config.json';

class EditListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      title: '',
      tags: [],
      suggestions: [],
      exp_condition: 'no',
      exp_between_min: null,
      exp_between_max: null,
      exp_more_than: null,
      intern_check: false,
      salary_min: null,
      salary_max: null,
      editorState: EditorState.createEmpty(),
      how_to_apply: '',
      company_name: '',
      company_id: '',
      logo_image_file: null,
      logo_preview_url: null,
      logo_resized_url: null,
      country: 'Thailand',
      city: 'Bangkok',
      location_detail: '',
      remote_check: false,
      additional_note: '',
      submitting: false,
      error: true,
    };
  }

  componentWillMount() {
    const { id } = this.props.params;
    callApi(`/list/${id}`, 'get').then((res, err) => {
      if (err) {
        alert(err);
      } else {
        console.log(res.list);
        const { title, company_name, details, how_to_apply, salary, exp, skills, allow_remote, company_location, company_image, company_id } = res.list;
        const tags = skills.map((skill, i) => {
          return { id: i + 1, text: skill };
        });

        const contentState = convertFromRaw(details);
        // console.log(contentBlocks);
        // const contentState = ContentState.createFromBlockArray(contentBlocks);
        // console.log(contentState);
        const editorState = EditorState.createWithContent(contentState);
        console.log(editorState);
        this.setState({
          fetching: false,
          title, company_name, how_to_apply, salary_min: salary.min, salary_max: salary.max, editorState, exp_condition: exp.condition, exp_between_min: exp.min, exp_between_max: exp.max, exp_more_than: exp.min, intern_check: exp.has_intern, tags, remote_check: allow_remote, country: company_location.country, city: company_location.city, location_detail: company_location.detail, logo_preview_url: company_image, logo_resized_url: company_image, company_id,
        });
      }
    });
  }

  onEditorStateChange = (editorState) => {
    this.setState({ editorState });
  }

  onLogoImageChange = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    if (!file) {
      this.setState({
        logo_image_file: null,
        logo_preview_url: null,
      });
      return;
    }
    reader.onloadend = () => {
      this.setState({
        logo_image_file: file,
        logo_preview_url: reader.result,
      });
    };

    console.log(`logo change ${file.type}`);
    reader.readAsDataURL(file);
  }

  setTagsState = (tags) => {
    this.setState({ tags });
  }

  uploadCompanyLogo = (callback) => {
    const { logo_image_file, company_name, logo_preview_url } = this.state;

    if (!logo_image_file) {
      callback({ Location: logo_preview_url });
      return;
    }

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

    console.log(`logos/lg_${company_name}_${cuid.slug()}`);
    const params = {
      Bucket: bucket,
      Key: `logos/lg_${company_name}_${cuid.slug()}`,
      Body: blob,
      ACL: 'public-read',
      ContentType: logo_image_file.type,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.log(`Error: ${err}`);
      } else {
        callback(data);
      }
    });
  }

  submitEdited = () => {
    // Resize image
    const { submitting } = this.state;
    if (submitting) return;

    this.setState({ submitting: true });
    const { title, tags, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, editorState, how_to_apply, company_name, logo_image_file, logo_preview_url, remote_check, country, city, location_detail, company_id } = this.state;
    const details = convertToRaw(editorState.getCurrentContent());

    if (!title || !tags) {
      this.setState({ submitting: false });
      alert('Please check Title or Skills field again.');
      return;
    } else if (exp_condition === 'between' && (!exp_between_min || !exp_between_max)) {
      this.setState({ submitting: false });
      alert('Please check Experience field again (errors on "Between" condition).');
      return;
    } else if (exp_condition === 'more_than' && (!exp_more_than)) {
      this.setState({ submitting: false });
      alert('Please check Experience field again (errors on "More than" condition).');
      return;
    } else if (!editorState.getCurrentContent().hasText()) {
      this.setState({ submitting: false });
      alert('Please fill some details.');
      return;
    } else if (!how_to_apply) {
      this.setState({ submitting: false });
      alert('Please specify how to apply.');
      return;
    } else if (!company_name || !location_detail) {
      this.setState({ submitting: false });
      alert('Please specify your company\'s name or location detail.');
      return;
    } else if (!logo_preview_url || !logo_image_file) {
      this.setState({ submitting: false });
      alert('Please reinsert your company\'s logo.');
      return;
    }

    // all passes, upload logo
    const yes = confirm('Do you want to submit ?');
    if (!yes) {
      this.setState({ submitting: false });
      return;
    }

    const { id } = this.props.params;
    const dis = this;
    this.uploadCompanyLogo((data) => {
      const image_url = data.Location;
      console.log(`company logo is at ${image_url}`);

      callApi(`/lists/${id}`, 'put', {
        list: {
          id, title, tags, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, how_to_apply, company_name, company_image: image_url, remote_check, details, country, city, location_detail, company_id,
        },
      }).then((res, err) => {
        dis.setState({ submitting: false });
        if (err) {
          alert(`Something went wrong! : ${err}`);
          return;
        }
        dis.props.router.push(`/list/${id}`);
      });
    });
  }

  render() {
    const { fetching } = this.state;
    if (fetching) {
      return (
        <div className="container">
          <p>Fetching List..</p>
        </div>
      );
    }
    const { title, tags, suggestions, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, editorState, how_to_apply, company_name, logo_preview_url, location_detail, remote_check, additional_note, submitting } = this.state;

    return (
      <div className="container">
        <div className={s.wrapper}>
          {/*
            Title
          */}
          <div className={s.row}>
            <label className={s.label} htmlFor="exampleEmailInput">List title<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}>Use your creativity freely to create company’s emplist title ! (up to 120 chars.)</p>
            <input
              className="u-full-width" type="text" maxLength={120}
              value={title}
              onChange={(e) => this.setState({ title: e.target.value })}
            />
          </div>
          {/*
            Skills
          */}
          <div className={s.row}>
            <label className={s.label}>Skills<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}>All skills required. e.g. Javascript, PHP (at least 1, up to 6 skills)</p>
            <SkillTagsInput
              tags={tags}
              suggestions={suggestions}
              setTagsState={this.setTagsState}
            />
          </div>
          {/*
            Experience
          */}
          <div className={s.row}>
            <label className={s.label}>Experience<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}>Experience rage of all your company's jobs.</p>
            <select
              value={exp_condition}
              onChange={(e) => this.setState({ exp_condition: e.target.value })}
              className={s['exp-dropdown']}
            >
              <option value="no">No minimum</option>
              <option value="between">Between</option>
              <option value="more_than">More than</option>
            </select>
            {exp_condition === 'between' &&
              <div className={s.inline}>
                <input
                  type="number" min={0} max={99} placeholder="min"
                  className={s['num-input']}
                  value={exp_between_min}
                  onChange={(e) => this.setState({ exp_between_min: e.target.value })}
                />
                -
                <input
                  type="number" min={0} max={99} placeholder="max"
                  className={s['num-input']}
                  value={exp_between_max}
                  onChange={(e) => this.setState({ exp_between_max: e.target.value })}
                />
                years
              </div>
            }
            {exp_condition === 'more_than' &&
              <div className={s.inline}>
                <input
                  type="number" min={0} max={99}
                  className={s['num-input']}
                  value={exp_more_than}
                  onChange={(e) => this.setState({ exp_more_than: e.target.value })}
                />
                years
              </div>
            }
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={intern_check}
                  onChange={(e) => this.setState({ intern_check: e.target.checked })}
                />
                <span className="label-body">Internship opening</span>
              </label>
            </div>
          </div>
          {/*
            Salary
          */}
          <div className={s.row}>
            <label className={s.label}>Salary Range</label>
            <p className={s['sub-label']}>Optional, but preferred for competitiveness.</p>
            <div>
              <input
                type="number" min={0} max={9999999} placeholder="min"
                className={c(s['salary-input'], s.fix)}
                value={salary_min}
                onChange={(e) => this.setState({ salary_min: e.target.value })}
              />
              -
              <input
                type="number" min={0} max={9999999} placeholder="max"
                className={s['salary-input']}
                value={salary_max}
                onChange={(e) => this.setState({ salary_max: e.target.value })}
              />
              THB
            </div>
          </div>
          {/*
            Details - Draft.js
          */}
          <div className={s.rowFull}>
            <label className={s.label}>Details<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}>E.g. Introduce your company and its culture. Why does it exist. All jobs available. What you will offer, etc. (feel free to add creative styles !)</p>
            <DetailsEditor
              editorState={editorState}
              onEditorStateChange={this.onEditorStateChange}
            />
          </div>
          {/*
            Details - Draft.js
          */}
          <div className={s.rowFull}>
            <label className={s.label}>How to apply<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}>E.g. send resume to email, go to company’s jobs site or Workable link.</p>
            <textarea
              value={how_to_apply}
              onChange={(e) => this.setState({ how_to_apply: e.target.value })}
              className={s['how-to-apply']}
            />
          </div>
          {/*
            Company's name
          */}
          <div className={s.row}>
            <label className={s.label}>Company's Name<span className={s.requiredSign}>*</span></label>
            <input
              type="text" maxLength={120}
              value={company_name}
              onChange={(e) => this.setState({ company_name: e.target.value })}
            />
          </div>
          {/*
            Company's logo
          */}
          <div className={s.row}>
            <label className={s.label}>Company's Logo<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}>1 : 1 regtangle</p>
            <input
              type="file" accept="image/*"
              onChange={this.onLogoImageChange}
              className={s.logoImageInput}
            />
            {logo_preview_url ?
              <img src={logo_preview_url} alt="logo" className={s.logoPreview} id="logo-preview" />
              :
              <div className={s.logoPreviewBlank}>
                Preview
              </div>
            }
          </div>
          {/*
            Company's location
          */}
          <div className={s.row}>
            <div className={s.country}>
              <label className={s.label}>Country</label>
              <p>Thailand</p>
            </div>
            <div className={s.city}>
              <label className={s.label}>City (Province)</label>
              <p>Bangkok</p>
              <p className={s['sub-label']}>Outside Bangkok and other country soon!</p>
            </div>
            <div>
              <label className={s.label}>Location Detail</label>
              <p className={s['sub-label']}>E.g. near BTS Foo, in Bar Building.</p>
              <input
                type="text"
                value={location_detail}
                className="u-full-width"
                onChange={(e) => this.setState({ location_detail: e.target.value })}
              />
            </div>
            <label>
              <input
                type="checkbox" checked={remote_check}
                onChange={(e) => this.setState({ remote_check: e.target.checked })}
              />
              <span className="label-body">Remote working allowed</span>
            </label>
          </div>

          <hr />
          {/*
            Submit Button
          */}
          <div className={s.row}>
            <input
              className="u-full-width" type="text" placeholder="Additional note to us. (optional, won't be displayed)"
              value={additional_note}
              onChange={(e) => this.setState({ additional_note: e.target.value })}
            />
          </div>
          <div>
            <button
              className={c('button-primary', s.submitButton)}
              onClick={this.submitEdited}
            >
              {submitting ? 'Submitting..' : 'Submit edited list'}
            </button>
            <p className={c(s['sub-label'], s.coc)}>By clicking "SUBMIT LIST REQUEST" button you agree that your job(s) disregard(s) of gender, disability, ethnic and you also agree to our&nbsp;<Link to="/">Terms</Link>.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(EditListPage);
