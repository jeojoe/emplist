import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// workaround, adds extra DOM level
// For reference: https://github.com/yahoo/react-intl/issues/401
const toParagraphs = (...nodes) => {
  let key = 0;
  const children = nodes.reduce((result, node) => (
      result.concat(
        typeof node === 'string'
          ? node
            .split('\n')
            .map(paragraph => <p key={++key}>{paragraph}</p>)
          : node
      )
  ), []);

  return <span>{children}</span>;
};

export default ({ id }) => {
  return (
    <FormattedMessage id={id}>
        {toParagraphs}
    </FormattedMessage>
  );
};
