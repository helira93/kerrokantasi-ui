/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import Icon from '../../utils/Icon';
import LanguageSwitcher from './LanguageSwitcher';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { login, logout } from '../../actions';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import Link from '../../components/LinkWithLang';
import throttle from 'lodash/throttle';
import scrolltop from 'scrolltop';

// eslint-disable-next-line import/no-unresolved
import logoBlack from '@city-images/logo-fi-black.svg';

// eslint-disable-next-line import/no-unresolved
import logoSwedishBlack from '@city-images/logo-sv-black.svg';

class Header extends React.Component {
  componentDidMount() {
    if (typeof window !== 'undefined') {
      this._handleNavFix = throttle(() => {
        const scrollY = scrolltop();
        if (scrollY > 115) {
          document.body.classList.add('nav-fixed');
        } else {
          document.body.classList.remove('nav-fixed');
        }
      }, 25);
      window.addEventListener('scroll', this._handleNavFix, false);
    }
  }

  componentWillUnmount() {
    if (this._handleNavFix) {
      window.removeEventListener('scroll', this._handleNavFix);
    }
  }

  onSelect(eventKey) {
    switch (eventKey) {
      case 'login':
        // TODO: Actual login flow
        this.props.dispatch(login());
        break;
      case 'logout':
        // TODO: Actual logout flow
        this.props.dispatch(logout());
        break;
      default:
      // Not sure what to do here
    }
  }

  getUserItems() {
    const {user} = this.props;
    if (user) {
      return [
        <DropdownButton
          pullRight
          key="profile"
          id="userMenu"
          className="user-menu user-menu--logged"
          title={
            <span>
              <Icon name="user" className="user-nav-icon" aria-hidden="true" />
              <span className="user-name">{user.displayName}</span>
            </span>
          }
        >
          <MenuItem
            key="logout"
            eventKey="logout"
            onClick={() => this.onSelect('logout')}
          >
            <FormattedMessage id="logout" />
          </MenuItem>
        </DropdownButton>,
      ];
    }
    return [
      <Button
        key="login"
        className="user-menu login-link user-menu--unlogged"
        onClick={() => this.onSelect('login')}
      >
        <Icon name="user-o" className="user-nav-icon" aria-hidden="true" />
        <span className="user-name"><FormattedMessage id="login" /></span>
      </Button>,
    ];
  }

  getNavItem(id, url) {
    const {history, language} = this.props;
    const active = history && history.location.pathname === url;
    const navLink = (
      <a href="#">
        <FormattedMessage id={id + 'HeaderText'} />
      </a>
    );
    if (url) {
      // Can't use custom link component here because it will break the navigation
      // so LinkContainer must contain same logic
      return (
        <li className={`nav-item ${active ? 'active' : ''}`}>
          <LinkContainer to={url + '?lang=' + language} className="nav-link">
            {navLink}
          </LinkContainer>
        </li>
      );
    }
    return (
      <li className={`nav-item ${active && 'active'}`}>
        {navLink}
      </li>
    );
  }

  render() {
    const {language} = this.props;
    const header = this;
    const onSelect = eventKey => {
      header.onSelect(eventKey);
    };
    const userItems = this.getUserItems();
    return (
      <div>
        <FormattedMessage id="headerUserNavLabel">
          {headerUserNavLabel => (
            <Navbar fluid staticTop defaultExpanded className="navbar-kerrokantasi" aria-label={headerUserNavLabel}>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to={{ path: "/" }}>
                    <FormattedMessage id="headerLogoAlt">
                      {altText => <img
                        src={language === 'sv' ? logoSwedishBlack : logoBlack}
                        className="navbar-logo"
                        alt={altText}
                      />}
                    </FormattedMessage>
                  </Link>
                </Navbar.Brand>
              </Navbar.Header>

              <div onSelect={onSelect} className="nav-user-menu navbar-right">
                <LanguageSwitcher currentLanguage={this.props.language} />
                {userItems}
              </div>
            </Navbar>
          )}
        </FormattedMessage>

        <FormattedMessage id="headerPagesNavLabel">
          {headerPagesNavLabel => (
            <Navbar default fluid collapseOnSelect className="navbar-primary" aria-label={headerPagesNavLabel}>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to={{path: "/"}}>
                    Kerrokantasi
                  </Link>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <ul className="nav navbar-nav">
                  {this.getNavItem('hearings', '/hearings/list')}
                  {this.getNavItem('hearingMap', '/hearings/map')}
                  {this.getNavItem('info', '/info')}
                </ul>
              </Navbar.Collapse>
            </Navbar>
          )}
        </FormattedMessage>
      </div>
    );
  }
}

Header.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.object,
  language: PropTypes.string,
  user: PropTypes.object,
};

Header.contextTypes = {
  history: PropTypes.object,
};

export default withRouter(connect(state => ({
  user: state.user.data, // User dropdown requires this state
  language: state.language, // Language switch requires this state
  router: state.router, // Navigation activity requires this state
}))(Header));
