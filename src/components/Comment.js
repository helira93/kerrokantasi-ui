import React from 'react';
import {injectIntl, FormattedMessage, FormattedRelative} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import Icon from '../utils/Icon';
import nl2br from 'react-nl2br';
import {notifyError} from '../utils/notify';

class Comment extends React.Component {
  onVote() {
    if (this.props.canVote) {
      const {data} = this.props;
      this.props.onPostVote(data.id, data.section);
    } else {
      notifyError("Kirjaudu sisään äänestääksesi kommenttia.");
    }
  }

  render() {
    const {data} = this.props;
    if (!data.content) {
      return null;
    }

    return (<div className="hearing-comment">
      <div className="hearing-comment-header clearfix">
        <div className="hearing-comment-votes">
          <Button className="btn-sm hearing-comment-vote-link" onClick={this.onVote.bind(this)}>
            <Icon name="thumbs-o-up"/> {data.n_votes}
          </Button>
        </div>
        <div className="hearing-comment-publisher">
          <span className="hearing-comment-user">
            {data.is_registered ?
              <span className="hearing-comment-user-registered">
                <Icon name="user"/>&nbsp;
                <FormattedMessage id="registered"/>:&nbsp;
              </span>
            : null}
            {data.author_name || <FormattedMessage id="anonymous"/>}
          </span>
          <span className="hearing-comment-date"><FormattedRelative value={data.created_at}/></span>
        </div>
      </div>
      <div className="hearing-comment-body">
        <p>{nl2br(data.content)}</p>
      </div>
      <div className="hearing-comment__images">
        {data.images
          ? data.images.map((image, index) =>
            <a
               className="hearing-comment-images-image"
               key={index + Math.random()}
               rel="noopener noreferrer"
               target="_blank"
               href={image.url}
            >
              <img
                 alt={image.title}
                 src={image.url}
                 width={image.width < 100 ? image.width : 100}
                 height={image.height < 100 ? image.height : 100}
              />
            </a>
          )
          : null}
      </div>
    </div>);
  }
}

Comment.propTypes = {
  data: React.PropTypes.object,
  canVote: React.PropTypes.bool,
  onPostVote: React.PropTypes.func,
};

export default injectIntl(Comment);
