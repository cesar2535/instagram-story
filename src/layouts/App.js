import React from 'react';
import { map, range } from 'ramda';
import logo from './logo.svg';
import './App.css';

import StoryTransformer from '../components/StoryTransformer';

const genCharList = (charA, charB) => {
  const start = charA.charCodeAt(charA);
  const end = charB.charCodeAt(charB) + 1;
  return map(code => String.fromCharCode(code), range(start, end));
};
const LIST = genCharList('a', 'z');
const VIDEO_LIST = [
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

function renderChar(char) {
  return <div className="App-character">{char}</div>;
}

function renderVideo(url) {
  return (
    <video
      className="App-video"
      style={{ width: '100%', height: '100%' }}
      src={url}
      autoPlay
      muted
    />
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <StoryTransformer
          id={VIDEO_LIST[0]}
          list={VIDEO_LIST}
          render={renderVideo}
        />
      </header>
    </div>
  );
}

export default App;
