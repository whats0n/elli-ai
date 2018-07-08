import { TimelineMax, TweenMax } from 'gsap';

import { EVENTS } from '../constants';
import connect from '../connect';


const USELESS = 'is-useless';

const show = props => {

  const {currentSlide, animationComplete, afterShow} = props;
  const lines = currentSlide.find('.js-section-line');
  const items = currentSlide.find('[data-animation-from]');
  const bg = currentSlide.find('.js-section-bg');
  const colorBlocks = $('.js-color-block');

  currentSlide.addClass(USELESS);

  currentSlide.fadeIn(700, () => {
    
    const theme = currentSlide.data('theme');
    theme ? colorBlocks.attr('data-theme', theme) : colorBlocks.removeAttr('data-theme');

    afterShow && afterShow();

    new TimelineMax()
      // .to(bg, 0.6, {
      //   opacity: 1
      // })
      .to(lines, 1, {
        scaleY: 1
      })
      .staggerTo(items, 0.6, {
        opacity: 1,
        y: 0,
        ease: Power2.easeOut
      }, 0.15)
      .eventCallback('onComplete', () => {
        currentSlide.removeClass(USELESS);
        animationComplete && animationComplete();
      });
  });

};

connect.on(EVENTS.FULLSCREEN_INIT, (props) => {
  const {disable, enable, currentSlide} = props;

  const navBtn = $('.js-nav-btn');
  const logo = $('.js-logo');
  const features = $('.js-features');

  disable();

  show({
    currentSlide,
    afterShow: () => new TimelineMax()
      .staggerTo([navBtn, logo], 0.6, {
        opacity: 1,
        y: 0,
        ease: Power2.easeOut
      }, 0.15)
      .to(features, 0.6, {
        opacity: 1
      }, '-=0.45'),
    animationComplete: enable
  });
});

connect.on(EVENTS.FULLSCREEN_BEFORE_CHANGE, (props) => {
  const {disable, currentSlide, enable} = props;
  const lines = currentSlide.find('.js-section-line');
  const items = currentSlide.find('[data-animation-from]');
  // currentSlide
  //   .find('.js-fullscreen-section-scrollable')
  //   .animate({
  //     scrollTop: 0
  //   }, 700);
  currentSlide.fadeOut(700, () => {
    TweenMax.set( [ lines, items ], { clearProps: 'all' } );
  });
});

connect.on(EVENTS.FULLSCREEN_AFTER_CHANGE, (props) => {
  const {disable, enable, currentSlide} = props;
  disable();
  show({
    currentSlide,
    animationComplete: enable
  });
});
