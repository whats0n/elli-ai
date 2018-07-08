import { EVENTS, ACTIVE, WIN, DOC, touchDetect } from '../constants';
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

    this.callEvent(EVENTS.FULLSCREEN_INIT, { currentSlide: this.cache.slides.filter(`.${ACTIVE}`) });
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
      clickable: true
    };
  }

  initDOM() {
    this.cache.container.addClass('fullscreen');
    this.cache.slides.addClass('fullscreen__slide');
    this.cache.slides.eq(this.cache.currentIndex).addClass(ACTIVE);
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
    this.cache.btns.eq(this.cache.currentIndex).addClass(ACTIVE);
  }

  initEvents() {
    this.onScroll();
    !touchDetect && this.onWheel();
    touchDetect && this.onSwipe();
    this.onKeys();
    this.onClick();
  }

  //events
  onSwipe() {
    let start = 0;
    let end = 0;
    let threshold = 50;

    DOC.on('touchstart', e => {
      start = e.originalEvent.touches[0].pageY;
    });

    DOC.on('touchend', e => {
      end = e.originalEvent.changedTouches[0].clientY;

      if (start - end > threshold) {
        this.goDown();
      } else if (end - start > threshold) {
        this.goUp();
      }
    });

  }

  onWheel() {
    WIN.on('wheel', e => {
      if (!this.trigger.scrollable) return;

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
        if (!this.trigger.clickable) return;
        this.trigger.clickable = false;
        this.cache.currentIndex = i;
        this.goNext(i);
      });
    });
  }

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

      // if (touchDetect) {
      //   this.timer = setTimeout(() => {
      //     this.trigger.scrollable = true;
      //     this.trigger.scrollUp = true;
      //     this.trigger.scrollDown = true;
      //   }, dur || DURATION);
      //   return;
      // }

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
    connect.call(eventName, Object.assign({
      currentSlide: props.currentSlide
    }, this.api));
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
