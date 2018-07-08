import {DOC, BODY, NO_TOUCH, touchDetect} from './constants';

DOC.ready(() => {
  !touchDetect && BODY.addClass(NO_TOUCH);
  require('./components');
});
