import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';
import css from '@emotion/css/macro';

import { getHandlers, initialState } from '../utils/getTouchHandlers';

class StoryTransformer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.transientState = { ...initialState, type: 'class' };
    this.initialize();
    this.state = { index: this.index };
  }

  render() {
    const { index, processing } = this.state;
    return (
      <Scene>
        <Container
          processing={processing}
          onTransitionEnd={this.handleTransitionEnd}
        >
          {this.renderCard('current', index)}
          {this.renderTransitionCard(processing, index)}
        </Container>
      </Scene>
    );
  }

  renderCard(type, idx) {
    const isClickable = type === 'current';
    const props = this.getCardProps(isClickable);

    return (
      <Card {...props} key={idx} processing={type}>
        <CardMedia>
          {this.renderMedia(idx)}
          {isClickable && idx > 0 && (
            <ClickableLeft onClick={() => this.goTo(-1)} />
          )}
          {isClickable && idx + 1 < this.props.list.length && (
            <ClickableRight onClick={() => this.goTo(1)} />
          )}
        </CardMedia>
        <CardCover>{this.renderCover(idx)}</CardCover>
      </Card>
    );
  }

  renderTransitionCard(processing, idx) {
    if (processing == null) return null;

    const index = processing === 'previous' ? idx - 1 : idx + 1;
    return this.renderCard(processing, index);
  }

  renderMedia(idx) {
    const { list } = this.props;
    const id = list.length > 0 ? list[idx] : this.props.id;
    return this.props.renderMedia(id, idx, list);
  }

  renderCover(idx) {
    const { list } = this.props;
    const id = list.length > 0 ? list[idx] : this.props.id;
    return this.props.renderCover(id, idx, list);
  }

  initialize() {
    const { id, list } = this.props;
    const idx = list.indexOf(id);

    if (idx !== -1) {
      this.index = idx;
    }
  }

  getIdByIndex(idx) {
    if (idx == null) return null;

    const { list } = this.props;
    const id = list[idx];

    if (typeof id !== 'string') {
      throw new TypeError('The list item must be a unique string');
    }
    return id;
  }

  goTo(n = 0) {
    const nextIdx = this.index + n;
    if (isNaN(nextIdx)) {
      throw new TypeError('The argument of the goTo function must be a number');
    }

    if (nextIdx < 0 || nextIdx + 1 > this.props.list.length) {
      throw new Error(`this index ${nextIdx} is out of the list.`);
    }

    this.index = nextIdx;
    this.id = this.getIdByIndex(this.index);

    if (n > 0) {
      this.processing = 'next';
    } else if (n < 0) {
      this.processing = 'previous';
    } else {
      this.processing = null;
    }

    this.setState({ processing: this.processing });
  }

  handleTransitionEnd = event => {
    if (event.target !== event.currentTarget) {
      return false;
    }

    this.setState({ index: this.index, processing: null });
    this.props.onChanged(this.index);
  };

  _setTransientState = callback => {
    this.transientState = callback(this.transientState, {
      onSwiped: this.handleSwiped
    });
  };

  handleSwiped = event => {
    if (event.velocity > 0.5) {
      try {
        if (event.dir === 'RIGHT') {
          this.goTo(-1);
        } else if (event.dir === 'LEFT') {
          this.goTo(1);
        }
      } catch (error) {
        this.props.onError(error);
      }
    }
  };

  getCardProps = isClickable => {
    if (!isClickable) {
      return {};
    }

    const { onStart, onEnd, onMove } = getHandlers(this._setTransientState);
    return {
      onTouchStart: onStart,
      onTouchEnd: onEnd,
      onTouchMove: onMove
    };
  };
}

StoryTransformer.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string),
  swipedDelta: PropTypes.number,
  renderMedia: PropTypes.func,
  renderCover: PropTypes.func,
  onChanged: PropTypes.func,
  onError: PropTypes.func
};

StoryTransformer.defaultProps = {
  list: [],
  swipedDelta: 10,
  renderMedia: () => null,
  renderCover: () => null,
  onChanged: () => null,
  onError: () => null
};

const Scene = styled.div`
  width: 100%;
  height: 100%;
  perspective: 1000px;
  perspective-origin: 50% 50%;
`;

const Container = styled.div`
  position: relative;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform;

  ${({ processing }) =>
    processing === 'next'
      ? `
        transform: translateZ(-50vw) rotateY(-90deg);
        transition: transform 350ms;
      `
      : processing === 'previous'
      ? `
        transform: translateZ(-50vw) rotateY(90deg);
        transition: transform 350ms;
      `
      : 'transform: translateZ(-50vw)'};
`;

const Card = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;

  ${({ processing }) =>
    processing === 'next'
      ? next
      : processing === 'previous'
      ? previous
      : current};
`;

const current = css`
  transform: translateZ(50vw);
`;
const next = css`
  transform: rotateY(90deg) translateX(50%);
  transform-origin: top right;
`;
const previous = css`
  transform: rotateY(-90deg) translateX(-50%);
  transform-origin: center left;
`;

const CardMedia = styled.div`
  width: 100%;
  height: 100%;
`;

const CardCover = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Clickable = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  margin: 0;
  border: 0;
  padding: 0;
  height: 100%;
  background: none;
  outline: 0;
`;
const ClickableLeft = styled(Clickable)`
  left: 0;
  width: 25%;

  &:active {
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.25),
      rgba(0, 0, 0, 0) 75%
    );
  }
`;
const ClickableRight = styled(Clickable)`
  right: 0;
  width: 75%;
`;

export default StoryTransformer;
