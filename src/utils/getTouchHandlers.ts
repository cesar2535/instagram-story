import * as React from 'react';

export enum Direction {
  Left = 'LEFT',
  Right = 'RIGHT',
  Up = 'UP',
  Down = 'DOWN'
}

export type EventData = {
  dir: Direction;
  event: HandlerEvent;
  absX: number;
  absY: number;
  deltaX: number;
  deltaY: number;
  velocity: number;
};

type XY = [number, number];

export type State = {
  type?: string;
  xy: XY;
  swiping: boolean;
  lastEventData?: EventData;
  start?: number;
};

type SetStateFn = (cb: (state: State, props: any) => State) => void;
type HandlerEvent = React.TouchEvent | React.MouseEvent;

function isTouchEvent(event: HandlerEvent): event is React.TouchEvent {
  return event.nativeEvent instanceof TouchEvent;
}

export const initialState: State = {
  xy: [0, 0],
  swiping: false,
  lastEventData: undefined,
  start: undefined
};

function getDirection(
  absX: number,
  absY: number,
  deltaX: number,
  deltaY: number
): Direction {
  if (absX > absY) {
    if (deltaX > 0) {
      return Direction.Left;
    }
    return Direction.Right;
  } else if (deltaY > 0) {
    return Direction.Up;
  }
  return Direction.Down;
}

function rotateXYByAngle(pos: XY, angle: number = 0): XY {
  if (angle === 0) return pos;
  const angleInRadians = (Math.PI / 180) * angle;
  const x =
    pos[0] * Math.cos(angleInRadians) + pos[1] * Math.sin(angleInRadians);
  const y =
    pos[1] * Math.cos(angleInRadians) - pos[0] * Math.sin(angleInRadians);
  return [x, y];
}

export function getHandlers(set: SetStateFn, handlerProps?: any) {
  const onStart = (event: HandlerEvent) => {
    // if more than a single touch don't track, for now...
    if (isTouchEvent(event) && event.touches.length > 1) return;

    set((state, props) => {
      const { clientX, clientY } = isTouchEvent(event)
        ? event.touches[0]
        : event;
      const xy = rotateXYByAngle([clientX, clientY], props.rotationAngle);
      return { ...state, ...initialState, xy, start: event.timeStamp || 0 };
    });
  };

  const onMove = (event: HandlerEvent) => {
    set((state, props) => {
      if (
        !state.xy[0] ||
        !state.xy[1] ||
        (isTouchEvent(event) && event.touches.length > 1)
      ) {
        return state;
      }

      const { clientX, clientY } = isTouchEvent(event)
        ? event.touches[0]
        : event;
      const [x, y] = rotateXYByAngle([clientX, clientY], props.rotationAngle);
      const deltaX = state.xy[0] - x;
      const deltaY = state.xy[1] - y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const start = typeof state.start === 'number' ? state.start : 0;
      const time = (event.timeStamp || 0) - start;
      const velocity = Math.sqrt(absX * absX + absY * absY) / (time || 1);

      // if swipe is under delta and we have not started to track a swipe: skip update
      if (absX < props.delta && absY < props.delta && !state.swiping)
        return state;

      const dir = getDirection(absX, absY, deltaX, deltaY);
      const eventData = { event, absX, absY, deltaX, deltaY, velocity, dir };

      props.onSwiping && props.onSwiping(eventData);

      // track if a swipe is cancelable(handler for swiping or swiped(dir) exists)
      // so we can call preventDefault if needed
      let cancelablePageSwipe = false;
      if (props.onSwiping || props.onSwiped || props[`onSwiped${dir}`]) {
        cancelablePageSwipe = true;
      }

      if (
        cancelablePageSwipe &&
        props.preventDefaultTouchmoveEvent &&
        props.trackTouch
      ) {
        event.preventDefault();
      }

      return { ...state, lastEventData: eventData, swiping: true };
    });
  };

  const onEnd = (event: HandlerEvent) => {
    set((state, props) => {
      if (state.swiping) {
        const eventData = { ...state.lastEventData, event } as EventData;
        props.onSwiped && props.onSwiped(eventData);

        props[`onSwiped${eventData.dir}`] &&
          props[`onSwiped${eventData.dir}`](eventData);
      }
      return { ...state, ...initialState };
    });
  };

  const cleanUpMouse = () => {};

  const onUp = (e: HandlerEvent) => {
    cleanUpMouse();
    onEnd(e);
  };

  return {
    onStart,
    onMove,
    onEnd,
    onUp
  };
}
