import './events';
import './nav';

import Barba from 'barba.js';
import FullScreen from './fullscreen';

import nav from './nav';
import onScroll from './onscroll';

import { showHeader } from './sections';

Barba.Pjax.init();
Barba.Prefetch.init();

FullScreen.init();
onScroll.init();

showHeader();

const FadeTransition = Barba.BaseTransition.extend({
  start: function() {
    Promise
      .all([this.newContainerLoading, this.fadeOut()])
      .then(this.fadeIn.bind(this));
  },

  fadeOut: function() {
    console.log('fade out', $(this.oldContainer).find('.js-fullscreen').length);
    nav.close();
    $('.js-color-block').removeAttr('data-theme');
    return $(this.oldContainer).animate({ opacity: 0 }).promise();
  },

  fadeIn: function() {
    const _this = this;
    const newContainer = $(this.newContainer);
    const oldContainer = $(this.oldContainer);

    oldContainer.hide();

    newContainer
      .css({
        visibility : 'visible',
        opacity : 0
      })
      .animate({ opacity: 1 }, 400, function() {
        _this.done();
        FullScreen.init();
        onScroll.init();
      });
  }
});

Barba.Pjax.getTransition = function() {
  return FadeTransition;
};
