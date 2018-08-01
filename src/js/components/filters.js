export default {
  init() {
    $('.js-filters').each((i, container) => {
      container = $(container);
      const controls = container.find('.js-filters-control');
      const items = container.find('.js-filters-item');

      controls.on('click', e => {
        e.preventDefault();
        const target = $(e.currentTarget).data('filter');
        if (target === 'All') items.show();
        else {
          items
            .hide()
            .filter(`[data-filter="${target}"]`)
            .show();
        }
      });
    });
  }
};
