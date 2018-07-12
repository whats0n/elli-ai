import {OPEN} from '../constants';
const USELESS = 'is-useless';
const nav = $('.js-nav');
const navElements = nav.find('[data-animation-from]');
const show = new TimelineMax({paused: true})
  .to(nav, 0.6, {
    opacity: 1
  })
  .staggerTo(navElements, 0.6, {
    opacity: 1,
    y: 0
  }, 0.15)
  .eventCallback('onComplete', () => nav.removeClass(USELESS))
  .eventCallback('onReverseComplete', () => {
    nav.removeClass(USELESS);
    nav.removeClass(OPEN);
  });


$('.js-nav-open').on('click', e => {
  nav.addClass(OPEN);
  nav.addClass(USELESS);
  show.play();
});


$('.js-nav-close').on('click', e => {
  nav.addClass(USELESS);
  show.reverse();
});

$('.js-nav').on('click', e => {
  if ($(e.target).closest('.js-nav-container').length) return;
  nav.addClass(USELESS);
  show.reverse();
});

