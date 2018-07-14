export default {
  init() {
    $('.js-select').each((i, select) => {
		  select = $(select);
		  select.select2({
		    minimumResultsForSearch: -1,
		    placeholder: select.data('placeholder'),
		    width: '100%',
		    // dropdownParent: select.parent()
		  });
    });
  }
};
