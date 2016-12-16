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
    };
  }

  setTagsState = tags => {
    this.setState({ tags });
  }

  changeExp = event => {
    this.setState({ exp_condition: event.target.value });
  }

  render() {
    const { tags, suggestions, exp_condition } = this.state;
    return (
      <div className="container">
        <HeaderText />
        {/*
          Title
        */}
        <div className={s.wrapper}>
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
            <p className={s['sub-label']}>All skills required. (up to 6 skills)</p>
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
            <select value={exp_condition} onChange={this.changeExp}>
              <option value="no">No minimum</option>
              <option value="between">Between</option>
              <option value="more_than">More than</option>
            </select>
            {exp_condition === 'no' &&
              <div className={s.more_than}>
                <input type="checkbox" />
                <span class="label-body">Internship ?</span>
              </div>
            }
            {exp_condition === 'between' &&
              <div className={s.more_than}>
                <input type="number" min={0} max={99} placeholder="min" />
                -
                <input type="number" min={0} max={99} placeholder="max" />
              </div>
            }
            {exp_condition === 'more_than' &&
              <input type="number" min={0} max={99} placeholder="years" />
            }
          </div>
          {/*
            Salary
          */}
          <div className={s.row}>
            <label className={s.label}>Salary</label>
            <div>
              <input type="number" min={0} max={99} placeholder="min" />
              -
              <input type="number" min={0} max={99} placeholder="max" />
              <label>THB</label>
            </div>
          </div>
          {/*
            Details - Draft.js
          */}
          <div>
            <DetailsEditor />
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
