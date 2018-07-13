import { WIN, widthMD, getMediaMaxWidth, ACTIVE } from '../constants';
import {
  clearAnimation,
  animateSection,
  showHeader,
  clearSection
} from './sections';

const header = $('.js-header');
const watch = [];

const showOnScroll = () => {
  const scrollTop = WIN.scrollTop();
  const scrollBottom = scrollTop + WIN.outerHeight();

  watch.forEach(fn => fn(scrollTop, scrollBottom));
};


WIN.on('scroll resize', () => {
  if (getMediaMaxWidth(widthMD)) {
    showHeader();
    showOnScroll();
    header.addClass(ACTIVE);
  } else {
    header.removeClass(ACTIVE);
  }
});

export default {
  init() {
    watch.length = 0;
    $('.js-section').each((i, section) => {
      section = $(section);
      const toggle = new TimelineMax({ paused: true })
        .to(section, 0.7, {
          opacity: 1
        })
        .eventCallback('onComplete', () => animateSection({ currentSlide: section }))
        .eventCallback('onReverseComplete', () => {
          clearSection(section);
          clearAnimation();
          TweenMax.set(section, { clearProps: 'all' });
        });

      watch.push((scrollTop, scrollPoint) => {
        const offsetTop = section.offset().top;
        const offsetBottom = section.offset().top + section.outerHeight();

        if (offsetTop <= scrollPoint && !section.hasClass(ACTIVE)) {
          section.addClass(ACTIVE);
          toggle.play(0);
        } else if (offsetTop > scrollPoint && section.hasClass(ACTIVE)) {
          section.removeClass(ACTIVE);
          toggle.reverse();
        }

        if (offsetTop <= scrollTop && offsetBottom > scrollTop) {
          const colorBlocks = $('.js-color-block');
          const theme = section.data('theme');
          theme ? colorBlocks.attr('data-theme', theme) : colorBlocks.removeAttr('data-theme');
        }
      });
    });

    if (getMediaMaxWidth(widthMD)) {
      showHeader();
      showOnScroll();
      header.addClass(ACTIVE);
    } else {
      header.removeClass(ACTIVE);
    }
  }
};
