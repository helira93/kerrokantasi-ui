import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import LoadSpinner from '../components/LoadSpinner';
import WrappedSectionContainer from '../components/SectionContainer';
import { injectIntl } from 'react-intl';
import { fetchHearing } from '../actions';
import { getOpenGraphMetaData } from '../utils/hearing';
import getAttr from '../utils/getAttr';
import { getUser } from '../selectors/user';
import { withRouter } from 'react-router-dom';
import { parseQuery } from '../utils/urlQuery';
import trackLink from '../utils/trackLink';
// import {groupSections, isSpecialSectionType} from '../utils/section';

export class QuestionView extends Component {
  /**
   * Return a promise that will, as it fulfills, have added requisite
   * data for the HearingView view into the dispatch's associated store.
   *
   * @param dispatch Redux Dispatch function
   * @param getState Redux state getter
   * @param location Router location
   * @param params Router params
   * @return {Promise} Data fetching promise
   */
  static fetchData(dispatch, getState, location, params) {
    return Promise.all([dispatch(fetchHearing(params.hearingSlug, parseQuery(location.search).preview))]);
  }

  /**
   * Return truthy if the view can be rendered fully with the data currently
   * acquirable by `getState()`.
   *
   * @param getState State getter
   * @param location Router location
   * @param params Router params
   * @return {boolean} Renderable?
   */
  static canRenderFully(getState) {
    const { state, data } = getState().hearing || { state: 'initial' };
    return state === 'done' && data;
  }

  componentDidMount() {
    const { dispatch, location, match: { params } } = this.props;
    QuestionView.fetchData(dispatch, null, location, params);
    trackLink();
  }

  componentWillMount() {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, location, match: { params } } = this.props;
    if (!this.props.user && nextProps.user) QuestionView.fetchData(dispatch, null, location, params);
  }

  render() {
    const { match: { params: { hearingSlug, sectionId } }, user, location, sectionComments, language } = this.props;
    const { data: hearing } = this.props.hearing || { state: 'initial' };

    if (!QuestionView.canRenderFully(() => this.props)) {
      return (
        <div className="question-view container">
          <LoadSpinner />
        </div>
      );
    }

    return (
      <div key="question" className="question-view">
        <Helmet title={getAttr(hearing.title, language)} meta={getOpenGraphMetaData(hearing, language)} />
        <WrappedSectionContainer
          hearingSlug={hearingSlug}
          sectionId={sectionId}
          hearing={hearing}
          user={user}
          section={hearing.sections.find(section => section.id === sectionId)}
          sectionComments={sectionComments}
          location={location}
          language={language}
        />
      </div>
    );
  }
}

/* eslint react/forbid-prop-types: "off" */
QuestionView.propTypes = {
  dispatch: PropTypes.func,
  hearing: PropTypes.object,
  language: PropTypes.string,
  location: PropTypes.object,
  sectionComments: PropTypes.object,
  user: PropTypes.object,
  match: PropTypes.object,
};

const mapStateToProps = (state, props) => {
  const { hearingSlug, sectionId } = props.match.params;
  return {
    hearing: state.hearing[hearingSlug],
    language: state.language,
    user: getUser(state),
    sectionComments: state.sectionComments[sectionId],
  };
};

export function wrapQuestionView(view) {
  const wrappedView = connect(mapStateToProps)(injectIntl(view));
  wrappedView.canRenderFully = view.canRenderFully;
  wrappedView.fetchData = view.fetchData;
  return wrappedView;
}

export default withRouter(wrapQuestionView(QuestionView));
