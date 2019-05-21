import * as React from 'react';
import { map, range } from 'ramda';
import './App.css';

import StoryTransformer from '../components/StoryTransformer';

const genCharList = (charA: string, charB: string) => {
  const start = charA.charCodeAt(0);
  const end = charB.charCodeAt(0) + 1;
  return map(code => String.fromCharCode(code), range(start, end));
};
const LIST: string[] = genCharList('a', 'z');
const VIDEO_LIST: string[] = [
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
];

class CoverTest extends React.PureComponent {
  componentDidMount() {}

  render() {
    return this.props.children;
  }
}

function renderChar(char: string): React.ReactElement {
  return (
    <CoverTest>
      <div className="App-character">{char}</div>;
    </CoverTest>
  );
}

class MediaTest extends React.PureComponent {
  componentDidMount() {}

  render() {
    return this.props.children;
  }
}

function renderVideo(url: string): React.ReactElement {
  return (
    <MediaTest>
      <video
        className="App-video"
        style={{ width: '100%', height: '100%' }}
        src={url}
        autoPlay
        muted
      />
    </MediaTest>
  );
}

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <StoryTransformer
          id={VIDEO_LIST[0]}
          list={VIDEO_LIST}
          renderCover={renderChar}
          renderMedia={renderVideo}
        />
      </header>
    </div>
  );
};

export default App;
