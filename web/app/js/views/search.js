(function($, ZWVR, Ember) {
  ZWVR.searchForm = Ember.View.create({
    template: Ember.Handlebars.compile(
      '{{#view view.textField}}{{/view}}' + 
      '{{#view view.button}}Search{{/view}}'
    ),
    textField: Ember.TextField.extend({
      attributeBindings: ['name'],
      name: 'search-keywords',
      insertNewline: function() {
        var value = this.get('value');
        ZWVR.eventsController.search(value);
      }
    }),
    button: Ember.View.extend({
      classNames: ['button'],
      click: function() {
        var textField = this.getPath('parentView.childViews')[0];
        ZWVR.eventsController.search(textField.get('value'));
      }
    })
  });
})(jQuery, ZWVR, Ember);
