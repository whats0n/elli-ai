export const NO_TOUCH = 'no-touch';
export const OPEN = 'is-open';
export const ACTIVE = 'is-active';
export const ERROR = 'is-error';
export const VALID = 'is-valid';
export const HIDDEN = 'is-hidden';
export const DISABLED = 'is-disabled';
export const FOCUS = 'is-focus';
export const FIXED = 'is-fixed';
export const OWL = 'owl-carousel';

export const WIN = $(window);
export const DOC = $(document);
export const BODY = $('body');
export const HTMLBODY = $('html, body');

export const widthMD = 1025;

export const touchDetect = 'ontouchstart' in window;

export const getMediaMaxWidth = width => window.matchMedia(`(max-width: ${width}px)`).matches;

export const EVENTS = {
  FULLSCREEN_BEFORE_CHANGE: 'FULLSCREEN_BEFORE_CHANGE',
  FULLSCREEN_AFTER_CHANGE: 'FULLSCREEN_AFTER_CHANGE',
  FULLSCREEN_INIT: 'FULLSCREEN_INIT',
  FULLSCREEN_DESTROY: 'FULLSCREEN_DESTROY'
};
