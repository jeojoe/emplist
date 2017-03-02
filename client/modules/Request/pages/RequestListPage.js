import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import SkillTagsInput from '../components/SkillTagsInput';
import HeaderText from '../components/HeaderText';
import DetailsEditor from '../components/DetailsEditor';
import SubmitRequestButton from '../components/SubmitRequestButton';

import c from 'classnames';
import s from './RequestListPage.css';


class RequestListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      tags: [],
      suggestions: [],
      intern_check: false,
      equity_check: false,
      salary_min: null,
      salary_max: null,
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

    // console.log(`logo change ${file.type}`);
    reader.readAsDataURL(file);
  }

  setTagsState = (tags) => {
    this.setState({ tags });
  }

  setSubmitState = (submitting) => {
    this.setState({ submitting });
  }

  render() {
    const { title, tags, suggestions, intern_check, equity_check, salary_min, salary_max, how_to_apply, company_name, logo_preview_url, location_detail, remote_check, email, password, password_confirm, additional_note } = this.state;
    const { pathname } = this.props.location;

    const notSamePassword = password !== password_confirm;
    return (
      <div className="container">
        <HeaderText />
        <div className={s.wrapper}>
          {/*
            Title
          */}
          <div className={s.row}>
            <label className={s.label} htmlFor="exampleEmailInput">Emplist Title<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}><FormattedMessage id="rlp_titleDesc" /></p>
            <input
              className="u-full-width" type="text" maxLength={140}
              value={title}
              onChange={(e) => this.setState({ title: e.target.value })}
              autoFocus
            />
          </div>
          {/*
            Skills & Internship
          */}
          <div className={s.row}>
            <label className={s.label}>Skills<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}><FormattedMessage id="rlp_skillsDesc" /></p>
            <SkillTagsInput
              tags={tags}
              suggestions={suggestions}
              setTagsState={this.setTagsState}
            />
            <div><label style={{ display: 'inline-block' }}>
              <input
                type="checkbox"
                checked={intern_check}
                onChange={(e) => this.setState({ intern_check: e.target.checked })}
              />
              <span className="label-body">
                <FormattedMessage id="rlp_internDesc" />
              </span>
            </label></div>
          </div>
          {/*
            Salary
          */}
          <div className={s.row}>
            <label className={s.label}>Salary Range</label>
            <p className={s['sub-label']}><FormattedMessage id="rlp_salaryDesc" /></p>
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
            <div><label style={{ display: 'inline-block' }}>
              <input
                type="checkbox"
                checked={equity_check}
                onChange={(e) => this.setState({ equity_check: e.target.checked })}
              />
              <span className="label-body">
                <FormattedMessage id="rlp_equityDesc" />
              </span>
            </label></div>
          </div>
          <hr />
          {/*
            Details - Draft.js
          */}
          <div className="row" style={{ paddingBottom: '30px' }}>
            <label className={s.label}>
              Company & Jobs Detail
              <span className={s.requiredSign}>*</span>
            </label>
            <p className={s['sub-label']}>
              <FormattedMessage id="rlp_detailsDesc" />
              {' '}
              <a href="https://nuuneoi.com/blog/blog.php?read_id=909" target="__blank">คำแนะนำ</a></p>
            <DetailsEditor
              details pathname={pathname}
            />
          </div>
          {/*
            How to apply - Draft.js
          */}
          <div className={s.rowFull}>
            <label className={s.label}>How to apply<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}><FormattedMessage id="rlp_howToApplyDesc" /></p>
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
              <p className={s['sub-label']}>More cities soon !</p>
            </div>
            <div>
              <label className={s.label}>Location Detail<span className={s.requiredSign}>*</span></label>
              <p className={s['sub-label']}><FormattedMessage id="rlp_locationDetailDesc" /></p>
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
              <span className="label-body">
                <FormattedMessage id="rlp_remoteDesc" />
              </span>
            </label>
          </div>
          <hr />
          {/*
            Email & Password
          */}
          <div className={c(s.row, s.emailRow)}>
            <label className={s.label}>Email<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}><FormattedMessage id="rlp_emailDesc" /></p>
            <input
              className="u-full-width" type="email"
              value={email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
            <label className={s.label}>Password<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}><FormattedMessage id="rlp_passwordDesc" /></p>
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
            <SubmitRequestButton
              {...this.state}
              buttonStyle={s.submitButton}
              setSubmitState={this.setSubmitState}
            />
            <p className={c(s['sub-label'], s.coc)}>By clicking "SUBMIT LIST REQUEST" button you agree that your job(s) disregard(s) of gender, disability, ethnic and you also agree to our&nbsp;<a>Terms</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default RequestListPage;
