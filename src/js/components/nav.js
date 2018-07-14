import { TimelineMax, TweenMax } from 'gsap';
import {OPEN, EVENTS, BODY, WIN, FIXED, touchDetect} from '../constants';
import connect from '../connect';

const USELESS = 'is-useless';
const nav = $('.js-nav');
const navElements = nav.find('[data-animation-from]');
let top = WIN.scrollTop();
const disableScroll = () => {
  top = WIN.scrollTop();
  BODY.addClass(FIXED);
  if (!touchDetect) return;
  BODY.css('top', -top);
};
const enableScroll = () => {
  BODY.removeClass(FIXED);
  if (!touchDetect) return;
  BODY.removeAttr('style');
  WIN.scrollTop(top);
};

const animation = new TimelineMax({paused: true})
  .to(nav, 0.4, {
    opacity: 1
  })
  .staggerTo(navElements, 0.6, {
    opacity: 1,
    y: 0
  }, 0.15, '-=0.3')
  .eventCallback('onComplete', () => {
    nav.removeClass(USELESS);
    connect.call(EVENTS.NAV_OPEN);
  })
  .eventCallback('onReverseComplete', () => {
    nav.removeClass(USELESS);
    nav.removeClass(OPEN);
    connect.call(EVENTS.NAV_CLOSE);
  });

const close = () => {
  nav.addClass(USELESS);
  enableScroll();
  animation.reverse();
};

const open = () => {
  nav.addClass(OPEN);
  nav.addClass(USELESS);
  connect.call(EVENTS.NAV_OPEN);
  disableScroll();
  animation.play();
};

$('.js-nav-open').on('click', e => {
  e.preventDefault();
  open();
});


$('.js-nav-close').on('click', e => {
  e.preventDefault();
  close();
});

$('.js-nav').on('click', e => {
  if ($(e.target).closest('.js-nav-container').length) return;
  close();
});

export default { close, open };
