import { TimelineMax, TweenMax } from 'gsap';

import { EVENTS, WIN, widthMD, getMediaMaxWidth, ACTIVE } from '../constants';
import connect from '../connect';

import {
  clearAnimation,
  animateSection,
  showSection,
  showHeader,
  clearSection,
  clearSections
} from './sections';

//EVENTS
connect.on(EVENTS.FULLSCREEN_INIT, (props) => {
  clearAnimation();
  clearSections(props.slides);
  props.disable();
  showSection({
    currentSlide: props.currentSlide,
    afterShow: () => props.nav.addClass(ACTIVE),
    // animationComplete: props.enable
  });
});

connect.on(EVENTS.FULLSCREEN_DESTROY, (props) => {
  clearAnimation();
  props.slides.show();
  props.nav.removeClass(ACTIVE);
  clearSections(props.slides);
});

connect.on(EVENTS.FULLSCREEN_BEFORE_CHANGE, (props) => {
  props.disable();
  props.currentSlide.fadeOut(700, () => {
    clearAnimation();
    clearSection(props.currentSlide);
  });
});

connect.on(EVENTS.FULLSCREEN_AFTER_CHANGE, (props) => {
  const {disable, enable, currentSlide} = props;
  disable();
  showSection({
    currentSlide,
    animationComplete: enable
  });
});
