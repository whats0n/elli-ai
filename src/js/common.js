import {DOC, BODY, NO_TOUCH, TOUCH, touchDetect} from './constants';

DOC.ready(() => {
  !touchDetect ? BODY.addClass(NO_TOUCH) : BODY.addClass(TOUCH);
  require('./components');
});
