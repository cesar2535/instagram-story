import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

class StoryTransformer extends React.PureComponent {
  state = { index: null };

  componentDidMount() {
    this.initialize();
  }
  componentDidUpdate() {}
  render() {
    const { index, processing } = this.state;
    return (
      <Scene>
        <Container
          processing={processing}
          onTransitionEnd={this.handleTransitionEnd}
        >
          {processing === 'previous' && (
            <PreviousCard>{this.renderChild(index - 1)}</PreviousCard>
          )}
          <CurrentCard>
            {this.renderChild(index)}
            {index > 0 && <ClickableLeft onClick={() => this.goTo(-1)} />}
            {index + 1 < this.props.list.length && (
              <ClickableRight onClick={() => this.goTo(1)} />
            )}
          </CurrentCard>
          {processing === 'next' && (
            <NextCard>{this.renderChild(index + 1)}</NextCard>
          )}
        </Container>
      </Scene>
    );
  }

  renderChild(idx) {
    const { list } = this.props;
    return (
      <ChildWrapper>{this.props.render(list[idx], idx, list)}</ChildWrapper>
    );
  }

  initialize() {
    const { id, list } = this.props;
    const idx = list.indexOf(id);

    if (idx !== -1) {
      this.index = idx;
      this.setState({ index: this.index });
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
      throw new Error('Out of the range');
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

  handleTransitionEnd = () => {
    this.setState({ index: this.index, processing: null });
  };
}

StoryTransformer.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string),
  render: PropTypes.func
};

StoryTransformer.defaultProps = {
  list: [],
  render: () => null
};

const Scene = styled.div`
  width: 100%;
  height: 100%;
  perspective: 200vw;
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
`;
const CurrentCard = styled(Card)`
  transform: translateZ(50vw);
`;
const NextCard = styled(Card)`
  transform: rotateY(90deg) translateX(50%);
  transform-origin: top right;
`;
const PreviousCard = styled(Card)`
  transform: rotateY(-90deg) translateX(-50%);
  transform-origin: center left;
`;

const Clickable = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  background: none;
`;
const ClickableLeft = styled(Clickable)`
  left: 0;
  width: 25%;

  &:active {
    background: linear-gradient(to right, #000, rgba(0, 0, 0, 0));
  }
`;
const ClickableRight = styled(Clickable)`
  right: 0;
  width: 75%;
`;

const ChildWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export default StoryTransformer;
