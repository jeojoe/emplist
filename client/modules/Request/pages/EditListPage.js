import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

import SkillTagsInput from '../components/SkillTagsInput';
import DetailsEditor from '../components/DetailsEditor';
import ChangePasswordSection from '../components/ChangePasswordSection';
import SubmitEditButton from '../components/SubmitEditButton';
import callApi from '../../../util/apiCaller';
import c from 'classnames';
import s from './EditListPage.css';

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
      details: '',
    };
  }

  componentWillMount() {
    const { id } = this.props.params;
    callApi(`/list/${id}`, 'get').then((res, err) => {
      if (err) {
        console.log(err);
      } else {
        const { title, company_name, details, how_to_apply, salary, exp, skills, allow_remote, company_location, company_image, company_id } = res.list;
        const tags = skills.map((skill, i) => {
          return { id: i + 1, text: skill };
        });

        this.setState({
          fetching: false,
          title, company_name, how_to_apply, salary_min: salary.min, salary_max: salary.max, exp_condition: exp.condition, exp_between_min: exp.min, exp_between_max: exp.max, exp_more_than: exp.min, intern_check: exp.has_intern, tags, remote_check: allow_remote, country: company_location.country, city: company_location.city, location_detail: company_location.detail, logo_preview_url: company_image, logo_resized_url: company_image, company_id, details,
        });
      }
    });
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
    const { fetching } = this.state;
    if (fetching) {
      return (
        <div className="container">
          <p>Fetching List..</p>
        </div>
      );
    }
    const { title, tags, suggestions, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, how_to_apply, company_name, logo_preview_url, location_detail, remote_check, additional_note, details } = this.state;
    const { pathname } = this.props.location;

    return (
      <div className="container">
        <ChangePasswordSection list_id={this.props.params.id} />
        <div className={s.wrapper}>
          {/*
            Title
          */}
          <div className={s.row}>
            <label className={s.label} htmlFor="exampleEmailInput">List title<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}><FormattedMessage id="rlp_titleDesc" /></p>
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
            <p className={s['sub-label']}><FormattedMessage id="rlp_skillsDesc" /></p>
            <SkillTagsInput
              tags={tags}
              suggestions={suggestions}
              setTagsState={this.setTagsState}
            />
          </div>
          <div style={{ height: '150px' }}>
            {/*
              Experience
            */}
            <div className="six columns">
              <label className={s.label}>Experience<span className={s.requiredSign}>*</span></label>
              <p className={s['sub-label']}><FormattedMessage id="rlp_expDesc" /></p>
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
            <div className="six columns">
              <label className={s.label}>Salary Range</label>
              <p className={s['sub-label']}><FormattedMessage id="rlp_salaryDesc" /></p>
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
          </div>
          {/*
            Details - Draft.js
          */}
          <div style={{ paddingBottom: '30px' }}>
            <label className={s.label}>Details<span className={s.requiredSign}>*</span></label>
            <p className={s['sub-label']}><FormattedMessage id="rlp_detailsDesc" /></p>
            <DetailsEditor
              details={details} pathname={pathname}
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
            {/*
              Company's name
            */}
            <div className="six columns">
              <div className={s.row}>
                <label className={s.label}>Company's Name<span className={s.requiredSign}>*</span></label>
                <input
                  type="text" maxLength={120}
                  value={company_name}
                  onChange={(e) => this.setState({ company_name: e.target.value })}
                />
              </div>
            </div>
            {/*
              Company's logo
            */}
            <div className="six columns">
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
            <SubmitEditButton
              buttonStyle={s.submitButton}
              {...this.state}
              setSubmitState={this.setSubmitState}
              list_id={this.props.params.id}
            />
            <p className={c(s['sub-label'], s.coc)}>By clicking "SUBMIT LIST REQUEST" button you agree that your job(s) disregard(s) of gender, disability, ethnic and you also agree to our&nbsp;<Link to="/">Terms</Link>.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(EditListPage);
