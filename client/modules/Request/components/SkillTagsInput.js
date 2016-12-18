import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import s from './SkillTagsInput.css';

class SkillTagsInput extends Component {
  handleDelete = (i) => {
    let tags = this.props.tags;
    tags.splice(i, 1);
    this.props.setTagsState(tags);
  }

  handleAddition = (tag) => {
    let tags = this.props.tags;
    tags.push({
        id: tags.length + 1,
        text: tag
    });
    this.props.setTagsState(tags);
  }

  handleDrag = (tag, currPos, newPos) => {
    let tags = this.props.tags;

    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    // re-render
    this.props.setTagsState(tags);
  }

  render() {
    const { tags, suggestions } = this.props;
    return (
      <ReactTags
        tags={tags}
        suggestions={suggestions}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition}
        handleDrag={this.handleDrag}
        placeholder=""
        classNames={{
          tag: s.skill,
          remove: s.remove,
          tagInput: tags.length >= 6 ? s['hide-input'] : 'ReactTags__tagInput',
        }}
      />
    );
  }
}

export default SkillTagsInput;
