import React from 'react';
import PropTypes from 'prop-types';
import Link from './LinkWithLang';
import {FormattedMessage} from 'react-intl';

export const SectionBrowserComponent = ({sectionNav}) => {
  return (
    <div
      className="section-browser"
      role="navigation"
      aria-labelledby="section-browser-title"
    >
      <ul className="pager">
        <li className={`previous ${sectionNav.prevPath ? '' : 'disabled'}`}>
          <LinkWrapper disabled={!sectionNav.prevPath} to={{path: sectionNav.prevPath || '#'}}>
            <span aria-hidden>&larr; </span>&nbsp;
            <FormattedMessage id="previous" />
          </LinkWrapper>
        </li>
        <li role="presentation" className="section-browser-title" id="section-browser-title" aria-hidden="true">
          <FormattedMessage id="subsectionTitle" /> {sectionNav.currentNum}/{sectionNav.totalNum}
        </li>
        <li className={`next ${sectionNav.nextPath ? '' : 'disabled'}`}>
          <LinkWrapper disabled={!sectionNav.nextPath} to={{path: sectionNav.nextPath || '#'}}>
            <FormattedMessage id="next" />&nbsp;
            <span aria-hidden> &rarr;</span>
          </LinkWrapper>
        </li>
      </ul>
    </div>
  );
};

export default SectionBrowserComponent;

SectionBrowserComponent.propTypes = {
  sectionNav: PropTypes.object,
};


const LinkWrapper = ({disabled, to, children, ...rest}) => {
  if (disabled) {
    return (
      <span>
        <span className="sr-only">
          <FormattedMessage id="disabledLink" />
        </span>
        {children}
      </span>
    );
  }
  return (
    <Link to={to} {...rest}>
      {children}
    </Link>
  );
};

LinkWrapper.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.array,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
};
