import {BODY} from '../constants';

const USELESS = 'is-useless';
let currentTimeLine = null;

export const clearAnimation = () => currentTimeLine && currentTimeLine.kill();

export const animateSection = props => {
  const {currentSlide, animationComplete, afterShow} = props;

  const lines = currentSlide.find('.js-section-line');
  const items = currentSlide.find('[data-animation-from]');
  const bg = currentSlide.find('.js-section-bg');
  const colorBlocks = $('.js-color-block');

  const theme = BODY.find(currentSlide).data('theme');
  theme ? colorBlocks.attr('data-theme', theme) : colorBlocks.removeAttr('data-theme');

  afterShow && afterShow();

  currentTimeLine = new TimelineMax()
    .to(lines, 1, {
      scaleY: 1
    })
    .staggerTo(items, 0.6, {
      opacity: 1,
      y: 0,
      ease: Power2.easeOut
    }, 0.15, '-=0.8')
    .eventCallback('onComplete', () => {
      currentSlide.removeClass(USELESS);
      animationComplete && animationComplete();
    });
};

export const showSection = props => {
  props.currentSlide.addClass(USELESS);
  props.currentSlide.fadeIn(700, () => {
    animateSection(props);
  });
};

export const showHeader = () => {
  const navOpen = $('.js-nav-open');
  const logo = $('.js-logo');
  const features = $('.js-features');
  const btn = $('.js-header-btn');

  return new TimelineMax()
    .staggerTo([navOpen, logo, btn], 0.6, {
      opacity: 1,
      y: 0,
      ease: Power2.easeOut
    }, 0.15)
    .to(features, 0.6, {
      opacity: 1
    }, '-=0.45');
};

export const clearSection = slide => {
  const lines = slide.find('.js-section-line');
  const items = slide.find('[data-animation-from]');
  TweenMax.set( [ slide, lines, items ], { clearProps: 'all' } );
};

export const clearSections = slides => slides.each((i, slide) => clearSection( $(slide) ));
