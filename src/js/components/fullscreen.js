import { EVENTS, ACTIVE, WIN, DOC, touchDetect, widthMD, getMediaMaxWidth } from '../constants';
import connect from '../connect';

const DURATION = 1500;
const keys = {
  up: 38,
  down: 40
};

let oldKeys = null;
let oldWheel = null;
let oldResize = null;

class FullScreen {

  constructor(props) {
    this.props = props;

    this.onWheel = this.onWheel.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onKeys = this.onKeys.bind(this);
    this.onClick = this.onClick.bind(this);
    this.reinitOnResize = this.reinitOnResize.bind(this);

    this.initCache();
    this.initDOM();
    this.removeEvents();
    this.initEvents();
    this.disable = this.disable.bind(this);
    this.enable = this.enable.bind(this);
    this.toggle = this.toggle.bind(this);

    this.api = {
      toggle: this.toggle,
      disable: this.disable,
      enable: this.enable
    };

    !getMediaMaxWidth(widthMD) && this.init();

    this.reinitOnResize();

    connect.on(EVENTS.NAV_OPEN, () => this.toggle(false));
    connect.on(EVENTS.NAV_CLOSE, () => this.toggle(true));
  }

  initCache() {
    this.cache = {};

    this.cache.timer = null;
    this.cache.currentIndex = 0;

    this.cache.container = $(this.props.container);
    this.cache.slides = this.cache.container.find(this.props.slides);
    this.cache.length = this.cache.slides.length;

    this.enabled = true;

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
    this.cache.container.append(`<div class="fullscreen__nav js-fullscreen-nav js-color-block" data-animation-from="fade">
      <ul class="fullscreen__nav-list js-color-block">${(() => {
    let items = '';
    for (let i = 0; i < this.cache.length; i++) {
      items += '<li><button class="fullscreen__nav-btn js-fullscreen-btn"></button></li>';
    }
    return items;
  })()}</ul>
      <div class="fullscreen__counter">
        <div class="fullscreen__counter-main js-fullscreen-counter">1</div>
        <div class="fullscreen__counter-dots">
          <i></i>
          <i></i>
          <i></i>
        </div>
        <div class="fullscreen__counter-total">/${this.cache.length}</div>
        <div class="fullscreen__arrows">
          <button class="fullscreen__arr fullscreen__next js-fullscreen-next">
            <svg class="icon icon-down fullscreen__arr-icon"><use xlink:href="img/sprite.svg#icon-down"></use></svg>
          </button>
        </div>
      </div>
    </div>`);
    this.cache.btns = this.cache.container.find('.js-fullscreen-btn');
    this.cache.nav = this.cache.container.find('.js-fullscreen-nav');
    this.cache.counter = this.cache.container.find('.js-fullscreen-counter');
    this.cache.next = this.cache.container.find('.js-fullscreen-next');
  }

  initEvents() {
    this.onScroll();
    this.onClick();
    this.enableOnResize = !getMediaMaxWidth(widthMD);
    oldWheel = this.onWheel;
    oldKeys = this.onKeys;
    oldResize = this.reinitOnResize;
    WIN.on('wheel', this.onWheel);
    DOC.on('keyup', this.onKeys);
    WIN.on('resize', this.reinitOnResize);
    this.cache.next.on('click', e => {
      e.preventDefault();
      this.goDown();
    });
  }

  removeEvents() {
    oldWheel && WIN.off('wheel', oldWheel);
    oldKeys && DOC.off('keyup', oldKeys);
    oldResize && WIN.off('resize', oldResize);
  }

  //Event listeners
  onWheel(e) {
    if (!this.trigger.scrollable || getMediaMaxWidth(widthMD)) return;

    const deltaY = e.originalEvent.deltaY;

    if (deltaY < 0) {
      this.goUp();
    } else if (deltaY > 0) {
      this.goDown();
    }
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

  onKeys(e) {
    if (getMediaMaxWidth(widthMD)) return;
    console.log('click');
    this.trigger.clickable = false;
    switch (e.keyCode) {
      case keys.up:
        this.goUp();
        break;
      case keys.down:
        this.goDown();
        break;
    }
  }

  onClick() {
    this.cache.btns.each((i, btn) => {
      $(btn).on('click', e => {
        e.preventDefault();
        if (!this.enabled) return;
        if (!this.trigger.clickable || getMediaMaxWidth(widthMD)) return;
        this.trigger.clickable = false;
        this.cache.currentIndex = i;
        this.goNext(i);
      });
    });
  }

  reinitOnResize() {
    const mediaWidth = getMediaMaxWidth(widthMD);
    if (mediaWidth && this.enableOnResize) {
      this.enableOnResize = false;
      this.destroy();
    } else if (!mediaWidth && !this.enableOnResize) {
      this.enableOnResize = true;
      this.init();
    }
  }

  destroy() {
    this.trigger.scrollable = false;
    this.trigger.scrollUp = false;
    this.trigger.scrollDown = false;
    this.trigger.clickable = false;
    this.cache.currentIndex = 0;
    this.cache.slides.removeClass(ACTIVE);
    this.removeEvents();
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
    this.cache.counter.text(1);
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
      this.trigger.clickable = false;
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
    if (!this.enabled) return;
    if (!this.trigger.scrollable || !this.trigger.scrollDown || this.cache.currentIndex + 1 >= this.cache.length) return;
    this.cache.currentIndex++;
    this.goNext(this.cache.currentIndex);
  }

  goUp() {
    if (!this.enabled) return;
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
    this.cache.counter.text(i + 1);
    if (prevSlide.get(0) !== currentSlide.get(0)) this.callEvent(EVENTS.FULLSCREEN_AFTER_CHANGE, { currentSlide });
  }

  callEvent(eventName, props) {
    connect.call(eventName, Object.assign(props, this.api, { nav: this.cache.nav }));
  }

  //API
  toggle(state) {
    this.enabled = state;
  }

  disable() {
    this.timer && clearTimeout(this.timer);
  }

  enable() {
    this.enableTriggers(this.cache.currentIndex, this.cache.slides.eq(this.cache.currentIndex), 100);
  }

};

export default {
  init() {
    if ($('.js-fullscreen').length) {
      new FullScreen({
        container: '.js-fullscreen',
        slides: '.js-fullscreen-section',
        scrollableContainer: '.js-fullscreen-section-scrollable'
      });
    }
  }
};
