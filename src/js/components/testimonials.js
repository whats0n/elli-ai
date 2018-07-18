export default {
  init() {
    const slider = $('.js-testimonials');
    slider.hasClass('slick-initialized') && slider.slick('unslick');
    slider.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      autoplay: true,
      autoplaySpeed: 3000,
      dots: true,
      dotsClass: 'testimonials__dots',
      arrows: false
    });
  }
};
