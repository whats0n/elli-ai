const USELESS = 'is-useless';

const showHeading = (title, underline) => {
  return new TimelineMax()
    .addLabel('headingStart')
    .to(title, 0.6, {
      opacity: 1,
      ease: Power2.easeOut
    }, 'headingStart')
    .to(underline, 0.8, {
      scaleX: 1
    }, 'headingStart');
};

const animations = {
  about(page) {
    page.addClass(USELESS);
    const lines = page.find('.js-page-line');
    const items = page.find('.js-page-item[data-animation-from]');

    const timeline = new TimelineMax({ paused: true })
      .to(lines, 1, {
        scaleY: 1
      })
      .addLabel('start', '-=0.8');

    const team = page.find('.js-team');
    const teamItems = page.find('.js-team-items [data-animation-from]');
    const teamHeading = team.find('.js-team-heading');

    const teamTimeline = new TimelineMax({ paused: true })
      .add(showHeading(teamHeading.find('.js-team-title'), teamHeading.find('.js-team-underline')), 'start')
      .staggerTo(teamItems, 0.6, {
        opacity: 1,
        y: 0,
        ease: Power2.easeOut
      }, 0.15, '-=0.5');

    const about = page.find('.js-about');
    const aboutItems = about.find('.js-about-item');
    const aboutTimeline = new TimelineMax({ paused: true });

    aboutItems.each((i, item) => {
      item = $(item);
      const heading = item.find('.js-about-heading');
      const description = item.find('.js-about-description');

      console.log(heading, description);

      aboutTimeline.add(
        new TimelineMax()
          .add(showHeading(item.find('.js-about-title'), item.find('.js-about-underline')))
          .to(description, 0.6, {
            opacity: 1,
            y: 0,
            ease: Power2.easeOut
          }, 0.15, '-=0.5'),
        '-=0.4'
      );
    });

    timeline
      .add(teamTimeline.play(0), 'start')
      .add(aboutTimeline.play(0), 'start')
      .staggerTo(items, 0.6, {
        opacity: 1,
        y: 0,
        ease: Power2.easeOut
      }, 0.15, '-=0.8')
      .eventCallback('onComplete', () => {
        page.removeClass(USELESS);
      });

    timeline.play(0);
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
