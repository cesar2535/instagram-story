import * as React from 'react';
import styled from '@emotion/styled/macro';
import css from '@emotion/css/macro';

enum Transform {
  Center = 'center',
  Right = 'right',
  Left = 'left'
}

type Props = {
  cssTransform: Transform;
  onTransitionEnd: () => void;
};
type State = {
  cssTransform: Transform;
  processing: boolean;
};

class Story extends React.PureComponent<Props, State> {
  static defaultProps = {
    cssTransform: 'center',
    onTransitionEnd: () => null
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      cssTransform: props.cssTransform,
      processing: false
    };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.cssTransform !== state.cssTransform) {
      return {
        cssTransform: props.cssTransform,
        processing: true
      };
    }

    return null;
  }

  componentDidMount() {}
  componentDidUpdate() {}
  render() {
    return (
      <Container
        cssTransform={this.state.cssTransform}
        processing={this.state.processing}
        onTransitionEnd={this.handleTransitionEnd}
      >
        {this.props.children}
      </Container>
    );
  }

  handleTransitionEnd = () => {
    this.setState({ processing: false });
    this.props.onTransitionEnd();
  };
}

type ContainerProps = {
  cssTransform: Transform;
  processing: boolean;
};

const Container = styled.section<ContainerProps>`
  width: 100%;
  height: 100%;
  will-change: transform;

  ${props =>
    props.cssTransform === Transform.Right
      ? right
      : props.cssTransform === Transform.Left
      ? left
      : null};

  ${props => (props.processing ? transition : null)};
`;

const transition = css`
  transition: transform 350ms ease-in-out;
`;
const right = css`
  transform: rotateY(90deg) translateX(50%) rotateY(90deg) translateX(-50%)
    rotateY(-90deg);
`;
const left = css`
  transform: rotateY(-90deg) translateX(-50%) rotateY(-90deg) translateX(50%)
    rotateY(90deg);
`;

export default Story;
