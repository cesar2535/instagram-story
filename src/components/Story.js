import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled/macro";
import css from "@emotion/css/macro";

class Story extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      transform: props.transform,
      processing: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.transform !== state.transform) {
      return {
        transform: props.transform,
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
        transform={this.state.transform}
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

Story.propTypes = {
  transform: PropTypes.oneOf(["center", "right", "left"]),
  onTransitionEnd: PropTypes.func
};

Story.defaultProps = {
  transform: "center",
  onTransitionEnd: () => null
};

const Container = styled.section`
  width: 100%;
  height: 100%;
  will-change: transform;

  ${({ transform }) =>
    transform === "right" ? right : transform === "left" ? left : null};

  ${({ processing }) => (processing ? transition : null)};
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
