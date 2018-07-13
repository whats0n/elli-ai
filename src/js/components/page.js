const USELESS = 'is-useless';

export default {
  show() {
    const page = $('.js-page');
    const lines = page.find('.js-page-line');
    page.addClass(USELESS);

    new TimelineMax()
      .to(lines, 1, {
        scaleY: 1
      })
      .staggerTo(items, 0.6, {
        opacity: 1,
        y: 0,
        ease: Power2.easeOut
      }, 0.15, '-=0.8')
      .eventCallback('onComplete', () => {
        page.removeClass(USELESS);
      });
  }
};