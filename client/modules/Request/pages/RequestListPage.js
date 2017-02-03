import React, { Component } from 'react';
import { Link } from 'react-router';
import { EditorState } from 'draft-js';

import SkillTagsInput from '../components/SkillTagsInput';
import HeaderText from '../components/HeaderText';
import DetailsEditor from '../components/DetailsEditor';
import RequestListButton from '../components/RequestListButton';
import c from 'classnames';
import s from './RequestListPage.css';


class RequestListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      logo_image_file: null,
      logo_preview_url: null,
      logo_resized_url: null,
      country: 'Thailand',
      city: 'Bangkok',
      location_detail: '',
      remote_check: false,
      email: '',
      password: '',
      password_confirm: '',
      additional_note: '',
      submitting: false,
      error: true,
    };
  }

  componentDidMount() {
    window.onbeforeunload = (e) => {
      e = e || window.event;

      // For IE and Firefox prior to version 4
      if (e) {
        e.returnValue = 'Did you save your stuff?';
      }

      // For Safari
      return 'Did you save your stuff?';
    };
  }

  componentWillUnmount() {
    window.onbeforeunload = () => {};
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

  setSubmitState = (submitting) => {
    this.setState({ submitting });
  }

  render() {
    const { title, tags, suggestions, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, editorState, how_to_apply, company_name, logo_preview_url, location_detail, remote_check, email, password, password_confirm, additional_note } = this.state;

    const notSamePassword = password !== password_confirm;
    return (
      <div className="container">
        <HeaderText />
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
          <div style={{ height: '150px' }}>
            <div className="six columns">
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
                    type="number" min={0} max={99} placeholder="Min"
                    className={s['num-input']}
                    value={exp_between_min}
                    onChange={(e) => this.setState({ exp_between_min: e.target.value })}
                  />
                  -
                  <input
                    type="number" min={0} max={99} placeholder="Max"
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
            <div className="six columns">
              <label className={s.label}>Salary Range</label>
              <p className={s['sub-label']}>Optional, but preferred for competitiveness.</p>
              <div>
                <input
                  type="number" min={0} max={9999999} placeholder="Min"
                  className={c(s['salary-input'], s.fix)}
                  value={salary_min}
                  onChange={(e) => this.setState({ salary_min: e.target.value })}
                />
                -
                <input
                  type="number" min={0} max={9999999} placeholder="Max"
                  className={s['salary-input']}
                  value={salary_max}
                  onChange={(e) => this.setState({ salary_max: e.target.value })}
                />
                THB
              </div>
            </div>
          </div>
          {/*
            Details - Draft.js
          */}
          <div>
            <label className={s.label}>Details<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}>E.g. Introduce your company and its culture. Why does it exist. All jobs available. What you will offer, etc. (feel free to add creative styles !)</p>
            <DetailsEditor
              editorState={editorState}
              onEditorStateChange={this.onEditorStateChange}
            />
          </div>
          {/*
            How to apply - Draft.js
          */}
          <div className={s.rowFull}>
            <label className={s.label}>How to apply<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}>E.g. send resume to email, go to company’s jobs site or Workable link.</p>
            <input
              type="text"
              value={how_to_apply}
              onChange={(e) => this.setState({ how_to_apply: e.target.value })}
              className={s['how-to-apply']}
            />
          </div>
          <hr />
          <div style={{ height: '175px' }}>
            <div className="six columns">
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
            </div>
            <div className="six columns">
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
            </div>
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
              <p className={s['sub-label']}>Outside Bangkok and other countries soon!</p>
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
            Email & Password
          */}
          <div className={c(s.row, s.emailRow)}>
            <label className={s.label}>Email<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}>In case we need to contact you.</p>
            <input
              className="u-full-width" type="email"
              value={email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
            <label className={s.label}>Password<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}>For editing list in the next 30 days displaying period.</p>
            <input
              className="u-full-width" type="password"
              value={password}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <input
              className="u-full-width" type="password" placeholder="confirm"
              value={password_confirm}
              onChange={(e) => this.setState({ password_confirm: e.target.value })}
              className={c({ [`${s.inputAlert}`]: notSamePassword })}
            />
          </div>
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
            <RequestListButton
              {...this.state}
              buttonStyle={s.submitButton}
              setSubmitState={this.setSubmitState}
            />
            <p className={c(s['sub-label'], s.coc)}>By clicking "SUBMIT LIST REQUEST" button you agree that your job(s) disregard(s) of gender, disability, ethnic and you also agree to our&nbsp;<Link to="/">Terms</Link>.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default RequestListPage;
