import React, { Component } from 'react';
import SkillTagsInput from '../components/SkillTagsInput';
import HeaderText from '../components/HeaderText';
import DetailsEditor from '../components/DetailsEditor';
import s from './RequestListPage.css';

class RequestListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      suggestions: [],
      exp_condition: 'no',
      howToApply: '',
    };
  }

  setTagsState = tags => {
    this.setState({ tags });
  }

  handleHowToApplyChange = (event) => {
    this.setState({ howToApply: event.target.value });
  }

  changeExp = event => {
    this.setState({ exp_condition: event.target.value });
  }

  render() {
    const { tags, suggestions, exp_condition } = this.state;
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
            <input className="u-full-width" type="text" maxLength={120} />
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
              value={exp_condition} onChange={this.changeExp}
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
                />
                -
                <input
                  type="number" min={0} max={99} placeholder="max"
                  className={s['num-input']}
                />
                years
              </div>
            }
            {exp_condition === 'more_than' &&
              <div className={s.inline}>
                <input
                  type="number" min={0} max={99}
                  className={s['num-input']}
                />
                years
              </div>
            }
            <div>
              <label className={s.more_than}>
                <input type="checkbox" />
                <span className="label-body">Internship Opening</span>
              </label>
            </div>
          </div>
          {/*
            Salary
          */}
          <div className={s.row}>
            <label className={s.label}>Salary</label>
            <div>
              <input
                type="number" min={0} max={99} placeholder="min"
                className={s['salary-input'] + ' ' + s.fix}
              />
              -
              <input
                type="number" min={0} max={99} placeholder="max"
                className={s['salary-input']}
              />
              THB
            </div>
          </div>
          {/*
            Details - Draft.js
          */}
          <div className={s.rowFull}>
            <label className={s.label}>Details</label>
            <p className={s['sub-label']}>e.g. Introduce your company and its culture. Why does it exist. All jobs available. What you will offer (Add some styles !)</p>
            <DetailsEditor />
          </div>
          {/*
            Details - Draft.js
          */}
          <div className={s.rowFull}>
            <label className={s.label}>How to apply</label>
            <p className={s['sub-label']}>e.g. send resume to email, go to company’s jobs site or Workable link.</p>
            <textarea
              value={this.state.howToApply}
              onChange={this.handleHowToApplyChange}
              className={s['how-to-apply']}
            />
          </div>
          {/*
            Company's name
          */}
          <div className={s.row}>
            <label className={s.label}>Company's Name</label>
            <input type="text" maxLength={120} />
          </div>
          {/*
            Company's logo
          */}
          <div className={s.row}>
            <label className={s.label}>Company's Logo</label>
            <input type="file"/>
          </div>
          {/*
            Submit Button
          */}
          <div>
            <input className="button-primary" type="submit" value="Submit" />
          </div>
        </div>
      </div>
    );
  }
}

export default RequestListPage;
