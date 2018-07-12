import { EVENTS, ACTIVE, WIN, DOC, touchDetect, widthMD, getMediaMaxWidth } from '../constants';
import connect from '../connect';

const DURATION = 1500;

class FullScreen {

  constructor(props) {
    this.props = props;

    this.initCache();
    this.initDOM();
    this.initEvents();

    this.api = {
      disable: this.disable.bind(this),
      enable: this.enable.bind(this)
    };

    // this.callEvent(EVENTS.FULLSCREEN_INIT, { slides: this.cache.slides, currentSlide: this.cache.slides.filter(`.${ACTIVE}`) });

    !getMediaMaxWidth(widthMD) && this.init();

    this.reinitOnResize();
  }

  initCache() {
    this.cache = {};

    this.cache.timer = null;
    this.cache.currentIndex = 0;

    this.cache.container = $(this.props.container);
    this.cache.slides = this.cache.container.find(this.props.slides);
    this.cache.length = this.cache.slides.length;

    this.trigger = {
      scrollable: false,
      scrollUp: false,
      scrollDown: false,
      clickable: false
    };
  }

  initDOM() {
    this.cache.container.addClass('fullscreen');
    this.cache.slides.addClass('fullscreen__slide');
    this.cache.container.append(`<ul class="fullscreen__nav js-color-block">${
      (() => {
        let items = '';
        for (let i = 0; i < this.cache.length; i++) {
          items += '<li><button class="fullscreen__nav-btn js-fullscreen-btn"></button></li>';
        }
        return items;
      })()
    }</ul>`);
    this.cache.btns = this.cache.container.find('.js-fullscreen-btn');
  }

  initEvents() {
    this.onScroll();
    this.onWheel();
    this.onKeys();
    this.onClick();
  }

  //Event listeners
  onWheel() {
    WIN.on('wheel', e => {
      if (!this.trigger.scrollable || getMediaMaxWidth(widthMD)) return;

      const deltaY = e.originalEvent.deltaY;

      if (deltaY < 0) {
        this.goUp();
      } else if (deltaY > 0) {
        this.goDown();
      }
    });
  }

  onScroll() {
    this.cache.slides.each((i, slide) => {
      if (getMediaMaxWidth(widthMD)) return;
      slide = $(slide);
      this.enableTriggers(i, slide);
      if (this.props.scrollableContainer) {
        slide.find(this.props.scrollableContainer).on('load scroll', e => this.enableTriggers(i, slide));
      } else {
        slide.on('load scroll', e => this.enableTriggers(i, slide));
      }
    });
  }

  onKeys() {
    const keys = {
      up: 38,
      down: 40
    };

    DOC.on('keyup', e => {
      if (getMediaMaxWidth(widthMD)) return;
      this.trigger.clickable = false;
      switch (e.keyCode) {
        case keys.up:
          this.goUp();
          break;
        case keys.down:
          this.goDown();
          break;
      }
    });
  }

  onClick() {
    this.cache.btns.each((i, btn) => {
      $(btn).on('click', e => {
        e.preventDefault();
        if (!this.trigger.clickable || getMediaMaxWidth(widthMD)) return;
        this.trigger.clickable = false;
        this.cache.currentIndex = i;
        this.goNext(i);
      });
    });
  }

  reinitOnResize() {
    let enable = !getMediaMaxWidth(widthMD);
    WIN.on('resize', () => {
      const mediaWidth = getMediaMaxWidth(widthMD);
      if (mediaWidth && enable) {
        enable = false;
        this.destroy();
        console.log('destroy on resize');
      } else if (!mediaWidth && !enable) {
        enable = true;
        this.init();
        console.log('init on resize');
      }
    });
  }

  destroy() {
    this.trigger.scrollable = false;
    this.trigger.scrollUp = false;
    this.trigger.scrollDown = false;
    this.trigger.clickable = false;
    this.cache.currentIndex = 0;
    this.cache.slides.removeClass(ACTIVE);
    this.callEvent(EVENTS.FULLSCREEN_DESTROY, { slides: this.cache.slides });
  }

  init() {
    const currentSlide = this.cache.slides.eq(0);
    this.cache.slides.removeClass(ACTIVE);
    currentSlide.addClass(ACTIVE);
    this.cache.btns
      .removeClass(ACTIVE)
      .eq(0)
      .addClass(ACTIVE);
    this.callEvent(EVENTS.FULLSCREEN_INIT, { slides: this.cache.slides, currentSlide });
    this.enableTriggers(0, currentSlide);
  }

  //!Event listeners

  //helpers
  checkTiggers() {
    console.log(`scrollable ${this.trigger.scrollable}`);
    console.log(`scrollUp ${this.trigger.scrollUp}`);
    console.log(`scrollDown ${this.trigger.scrollDown}`);
  }

  enableTriggers(i, slide, dur) {
    if (slide.hasClass(ACTIVE)) {
      if (this.props.scrollableContainer) slide = slide.find(this.props.scrollableContainer);
      this.trigger.scrollable = false;
      this.trigger.scrollUp = i > 0 && slide.scrollTop() <= 0;
      this.trigger.scrollDown = i < this.cache.length && slide.scrollTop() + slide.outerHeight() >= slide.get(0).scrollHeight;

      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.trigger.scrollable = this.trigger.scrollUp || this.trigger.scrollDown;
        this.trigger.clickable = true;
      }, dur || (touchDetect && 500) || DURATION);
    }
  }

  goDown() {
    if (!this.trigger.scrollable || !this.trigger.scrollDown || this.cache.currentIndex + 1 >= this.cache.length) return;
    this.cache.currentIndex++;
    this.goNext(this.cache.currentIndex);
  }

  goUp() {
    if (!this.trigger.scrollable || !this.trigger.scrollUp || this.cache.currentIndex <= 0) return;
    this.cache.currentIndex--;
    this.goNext(this.cache.currentIndex);
  }

  goNext(i) {
    const prevSlide = this.cache.slides.filter(`.${ACTIVE}`);
    const currentSlide = this.cache.slides.removeClass(ACTIVE).eq(i);
    const currentBtn = this.cache.btns.removeClass(ACTIVE).eq(i);

    currentSlide.addClass(ACTIVE);
    currentBtn.addClass(ACTIVE);

    this.callEvent(EVENTS.FULLSCREEN_BEFORE_CHANGE, { currentSlide: prevSlide });
    this.enableTriggers(i, currentSlide);

    if (prevSlide.get(0) !== currentSlide.get(0)) this.callEvent(EVENTS.FULLSCREEN_AFTER_CHANGE, { currentSlide });
  }

  callEvent(eventName, props) {
    connect.call(eventName, Object.assign(props, this.api));
  }

  //API
  disable() {
    this.timer && clearTimeout(this.timer);
  }

  enable() {
    this.enableTriggers(this.cache.currentIndex, this.cache.slides.eq(this.cache.currentIndex), 100);
  }

};

new FullScreen({
  container: '.js-fullscreen',
  slides: '.js-fullscreen-section',
  scrollableContainer: '.js-fullscreen-section-scrollable'
});
