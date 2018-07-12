import { TimelineMax, TweenMax } from 'gsap';

import { EVENTS, WIN, widthMD, getMediaMaxWidth, ACTIVE } from '../constants';
import connect from '../connect';


const USELESS = 'is-useless';
let currentTimeLine = null;

const clearAnimation = () => currentTimeLine && currentTimeLine.kill();

const animateSection = props => {
  const {currentSlide, animationComplete, afterShow} = props;

  const lines = currentSlide.find('.js-section-line');
  const items = currentSlide.find('[data-animation-from]');
  const bg = currentSlide.find('.js-section-bg');
  const colorBlocks = $('.js-color-block');

  const theme = currentSlide.data('theme');
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

const showSection = props => {
  props.currentSlide.addClass(USELESS);
  props.currentSlide.fadeIn(700, () => {
    animateSection(props);
  });
};

const showHeader = () => {
  const navOpen = $('.js-nav-open');
  const logo = $('.js-logo');
  const features = $('.js-features');

  return new TimelineMax()
    .staggerTo([navOpen, logo], 0.6, {
      opacity: 1,
      y: 0,
      ease: Power2.easeOut
    }, 0.15)
    .to(features, 0.6, {
      opacity: 1
    }, '-=0.45');
};

const clearSection = slide => {
  const lines = slide.find('.js-section-line');
  const items = slide.find('[data-animation-from]');
  TweenMax.set( [ slide, lines, items ], { clearProps: 'all' } );
};

const clearSections = slides => slides.each((i, slide) => clearSection( $(slide) ));


//EVENTS
connect.on(EVENTS.FULLSCREEN_INIT, (props) => {
  clearAnimation();
  clearSections(props.slides);
  props.disable();
  showSection({
    currentSlide: props.currentSlide,
    afterShow: showHeader,
    // animationComplete: props.enable
  });
});

connect.on(EVENTS.FULLSCREEN_DESTROY, (props) => {
  clearAnimation();
  props.slides.show();
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

const sections = $('.js-fullscreen-section');

const showOnScroll = () => {
  const scrollTop = WIN.scrollTop();
  const scrollBottom = scrollTop + WIN.outerHeight();

  watch.forEach(fn => fn(scrollTop, scrollBottom));
};

const watch = [];

sections.each((i, section) => {
  section = $(section);
  let show = new TimelineMax({ paused: true })
    .to(section, 0.7, {
      opacity: 1
    })
    .eventCallback('onComplete', () => animateSection({ currentSlide: section }))
    .eventCallback('onReverseComplete', () => {
      clearSection(section);
      currentTimeLine.kill();
      TweenMax.set(section, { clearProps: 'all' });
    });

  watch.push((scrollTop, scrollPoint) => {
    const offsetTop = section.offset().top;
    const offsetBottom = section.offset().top + section.outerHeight();

    if (offsetTop <= scrollPoint && !section.hasClass(ACTIVE)) {
      section.addClass(ACTIVE);
      show.play(0);
    } else if (offsetTop > scrollPoint && section.hasClass(ACTIVE)) {
      section.removeClass(ACTIVE);
      show.reverse();
    }

    if (offsetTop <= scrollTop && offsetBottom > scrollTop) {
      const colorBlocks = $('.js-color-block');
      const theme = section.data('theme');
      theme ? colorBlocks.attr('data-theme', theme) : colorBlocks.removeAttr('data-theme');
    }

  });
});

const header = $('.js-header');

WIN.on('scroll load resize', () => {
  if (getMediaMaxWidth(widthMD)) {
    showHeader();
    showOnScroll();
  }
  if (getMediaMaxWidth(widthMD)) {
    header.addClass(ACTIVE);
  } else {
    header.removeClass(ACTIVE);
  }
});
