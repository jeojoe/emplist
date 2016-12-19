import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import SkillTagsInput from '../components/SkillTagsInput';
import HeaderText from '../components/HeaderText';
import DetailsEditor from '../components/DetailsEditor';
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
      remote_check: false,
      email: '',
      password: '',
      password_confirm: '',
      additional_note: '',
    };
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
    reader.readAsDataURL(file);
  }

  setTagsState = tags => {
    this.setState({ tags });
  }

  submitRequest = () => {
    // validate FIRST!!
    console.log(this.state);
  }

  render() {
    const { title, tags, suggestions, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, editorState, how_to_apply, company_name, logo_preview_url, remote_check, email, password, password_confirm, additional_note } = this.state;

    const notSamePassword = password !== password_confirm;
    console.log(notSamePassword);
    return (
      <div className="container">
        <HeaderText />
        <div className={s.wrapper}>
          {/*
            Title
          */}
          <div className={s.row}>
            <label className={s.label} htmlFor="exampleEmailInput">List title</label>
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
            <label className={s.label}>Skills</label>
            <p className={s['sub-label']}>All skills required. e.g. Javascript, PHP (up to 6 skills)</p>
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
            <label className={s.label}>Experience</label>
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
            <div>
              <input
                type="number" min={0} max={99} placeholder="min"
                className={c(s['salary-input'], s.fix)}
                value={salary_min}
                onChange={(e) => this.setState({ salary_min: e.target.value })}
              />
              -
              <input
                type="number" min={0} max={99} placeholder="max"
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
            <label className={s.label}>Details</label>
            <p className={s['sub-label']}>e.g. Introduce your company and its culture. Why does it exist. All jobs available. What you will offer, etc. (feel free to add creative styles !)</p>
            <DetailsEditor
              editorState={editorState}
              onEditorStateChange={this.onEditorStateChange}
            />
          </div>
          {/*
            Details - Draft.js
          */}
          <div className={s.rowFull}>
            <label className={s.label}>How to apply</label>
            <p className={s['sub-label']}>e.g. send resume to email, go to company’s jobs site or Workable link.</p>
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
            <label className={s.label}>Company's Name</label>
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
            <label className={s.label}>Company's Logo</label>
            <p className={s['sub-label']}>1 : 1 regtangle</p>
            <input
              type="file" accept="image/*"
              onChange={this.onLogoImageChange}
              className={s.logoImageInput}
            />
            {logo_preview_url ?
              <img src={logo_preview_url} alt="logo" className={s.logoPreview} />
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
            <label>
              <input
                type="checkbox" checked={remote_check}
                onChange={(e) => this.setState({ remote_check: e.target.checked })}
              />
              <span className="label-body">Remote working allowed</span>
            </label>
          </div>
          {/*
            Email & Password
          */}
          <div className={c(s.row, s.emailRow)}>
            <label className={s.label}>Email</label>
            <input
              className="u-full-width" type="email"
              value={email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
            <label className={s.label}>Password</label>
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
              onClick={this.submitRequest}
            >Submit list request</button>
            <p className={c(s['sub-label'], s.coc)}>All jobs on this site disregard of gender, disability and ethnic</p>
          </div>
        </div>
      </div>
    );
  }
}

export default RequestListPage;
