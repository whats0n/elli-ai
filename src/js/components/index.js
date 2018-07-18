import {WIN} from '../constants';

import './events';
import './nav';

import Barba from 'barba.js';
import FullScreen from './fullscreen';

import nav from './nav';
import onScroll from './onscroll';
import page from './page';
import select from './select';
import testimonials from './testimonials';

import { showHeader } from './sections';

Barba.Pjax.init();
Barba.Prefetch.init();

const updateLinks = container => {
  const lang = {
    href:  container.data('lang-href'),
    title:  container.data('lang-title'),
    folder: container.data('lang-folder'),
    path: container.data('path')
  };

  $('.js-lang')
    .attr('href', lang.href + location.pathname.substring(location.pathname.lastIndexOf('/') + 1))
    .html(lang.title);

  $('.js-nav-link').each((i, link) => {
    link = $(link);
    const href = link.data('href');
    link.attr('href', lang.folder + href);
  });

  window.rootPath = lang.path;
};

updateLinks($('.js-barba-container'));

FullScreen.init();
onScroll.init();

showHeader();
page.show();
select.init();

testimonials.init();

const FadeTransition = Barba.BaseTransition.extend({
  start: function() {
    Promise
      .all([this.newContainerLoading, this.fadeOut()])
      .then(this.fadeIn.bind(this));
  },

  fadeOut: function() {
    nav.close();
    $('.js-color-block').removeAttr('data-theme');
    return $(this.oldContainer).animate({ opacity: 0 }).promise();
  },

  fadeIn: function() {
    updateLinks($(this.newContainer));
    $(this.oldContainer).hide();
    $(this.newContainer)
      .css({
        visibility : 'visible',
        opacity : 0
      })
      .animate({ opacity: 1 }, 400, () => {
        this.done();
        FullScreen.init();
        onScroll.init();
        page.show();
        select.init();
        WIN.scrollTop(0);
      });
  }
});

Barba.Pjax.getTransition = function() {
  return FadeTransition;
};
