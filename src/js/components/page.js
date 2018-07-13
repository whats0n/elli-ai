const USELESS = 'is-useless';

const MAIN_START = 'main start';
const SECONDARY_START = 'secondary start';

const DURATION = 0.6;
const FADE_BOTTOM = { y: 0, opacity: 1, ease: Power2.easeOut };

const buildMainTimeLine = page => {
  page.addClass(USELESS);
  return new TimelineMax({ paused: true })
    .to(page.find('.js-page-line'), 1, {
      scaleY: 1
    })
    .addLabel(MAIN_START, '-=0.8')
    .addLabel(SECONDARY_START, '-=0.4')
    .eventCallback('onComplete', () => {
      page.removeClass(USELESS);
    });
};

const showMain = (title, underline, description, label) => {
  const timeline = new TimelineMax({ paused: true })
    .addLabel(MAIN_START)
    .addLabel(SECONDARY_START, '+=0.15');

  title && timeline.to(title, DURATION, FADE_BOTTOM, MAIN_START);
  underline && timeline.to(underline, DURATION, { scaleX: 1, ease: Power2.easeInOut }, MAIN_START);
  description && timeline.to(description, DURATION, FADE_BOTTOM, SECONDARY_START);
  label && timeline.to(label, DURATION, { opacity: 1 }, SECONDARY_START);

  return timeline.play(0);
};

const showItems = items => new TimelineMax()
  .staggerTo(items, DURATION, {
    opacity: 1,
    y: 0,
    ease: Power2.easeOut
  }, 0.12);

const showNews = (img, date, description) => new TimelineMax()
  .addLabel(MAIN_START)
  .to(img, DURATION, {
    opacity: 1
  }, MAIN_START)
  .staggerTo([date, description], DURATION, FADE_BOTTOM, 0.12, MAIN_START);

const animations = {
  about(page) {
    const secondaryTimeline = new TimelineMax({ paused: true });

    page.find('.js-about-item').each((i, item) => {
      item = $(item);
      secondaryTimeline.add(
        showMain(
          item.find('.js-about-title'), 
          item.find('.js-about-underline'),
          item.find('.js-about-description')
        ),
        '-=0.4'
      );
    });

    buildMainTimeLine(page)
      .add(showMain(
        page.find('.js-page-title'), 
        page.find('.js-page-underline'),
        null,
        page.find('.js-page-label')
      ), MAIN_START)
      .add(showItems(page.find('.js-page-item')), SECONDARY_START)
      .add(secondaryTimeline.play(0), MAIN_START)
      .play(0);
  },

  news(page) {
    const secondaryTimeline = new TimelineMax({ paused: true });

    page.find('.js-news-item').each((i, item) => {
      item = $(item);
      secondaryTimeline.add(
        showNews(
          item.find('.js-news-img'), 
          item.find('.js-news-date'),
          item.find('.js-news-description')
        ),
        '-=0.4'
      );
    });

    buildMainTimeLine(page)
      .add(showMain(
        page.find('.js-page-title'), 
        page.find('.js-page-underline'),
        page.find('.js-page-description'),
        page.find('.js-page-label')
      ), MAIN_START)
      .add(secondaryTimeline.play(0), SECONDARY_START)
      .play(0);
  },

  blog(page) {
    buildMainTimeLine(page)
      .add(showMain(
        page.find('.js-page-title'), 
        null,
        page.find('.js-page-description'),
        page.find('.js-page-label')
      ), MAIN_START)
      .staggerTo(page.find('.js-page-content [data-animation-from]'), DURATION, FADE_BOTTOM, 0.15, SECONDARY_START)
      .staggerTo(page.find('.js-page-aside [data-animation-from]'), DURATION, FADE_BOTTOM, 0.15, SECONDARY_START)
      .play(0);
  }
};

export default {
  show() {
    const page = $('.js-page');
    if (!page.length) return;
    const name = page.data('animation');
    animations[name] && animations[name](page);
  }
};
