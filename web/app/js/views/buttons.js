/**
 * Various buttons
 *
 * @requires app.js
 * @requires controller/events_controller.js
 * @provides ZWVR.sortButtons
 * @provides ZWVR.nextButton
 * @provides ZWVR.previousButton
 */
(function(ZWVR, Ember) {
  /**
   * local only. Base class for sort buttons.
   */
  var SortButtonClass = Ember.View.extend({
    clicked: false,
    _buttonClass: 'button',
    classNameBindings: ['_buttonClass', 'clicked'],
    click: function() {
      if(!this.get('clicked')) {
        ZWVR.sortButtons.get('childViews').setEach('clicked', false);
        this.set('clicked', true);
        ZWVR.eventsController.sortBy(this.get('sortParam'));
      }
    }
  });

   /**
   * Buttons for sorting events, only one of which is in the 'clicked' state
   * 'date' is clicked by default.
   */
  ZWVR.sortButtons = Ember.View.create({
    templateName: 'sort-buttons',
    dateButton: SortButtonClass.extend({
      clicked: true, //clicked by default
      sortParam: ZWVR.sorts.DATE
    }),
    distanceButton: SortButtonClass.extend({
      sortParam: ZWVR.sorts.DISTANCE
    })
  });

  ZWVR.switchButtons = Ember.View.create({
    template: Ember.Handlebars.compile(
      '<img id="map-switcher" {{action switchToMap}} {{bindAttr src="mapImg"}}></img>' +
      '<img id="list-switcher" {{action switchToList}} {{bindAttr src="listImg"}}></img>'
    ),
    classNames: ['switch-buttons'],
    current: 'list',
    //url for map image
    mapImg: function() {
      if(this.get('current') === 'map') {
        return '/images/map-selected.png';
      } else {
        return '/images/map-unselected.png';
      }
    }.property('current'),
    //url for list img
    listImg: function() {
      if(this.get('current') === 'list') {
        return '/images/list-selected.png';
      } else {
        return '/images/list-unselected.png';
      }
    }.property('current'),
    removeViews: function(viewName) {
      ZWVR.listView.remove();
      ZWVR.mapView.remove();
    },
    switchToMap: function() {
      this._switchTo('map', ZWVR.mapView, '#map');
    },
    switchToList: function() {
      this._switchTo('list', ZWVR.listView, '#list-container');
    },
    /**
     * Private. Switch to the provided view
     *
     * @param name: the name to use as the 'current' property
     * @param view: the view object to append
     * @param target: jquery selector string for the view's target dom element
     */
    _switchTo: function(name, view, target) {
      if(name !== this.get('current')) {
        this.set('current', name);
        this.removeViews();
        view.appendTo(target);
      }
    }
 });
})(ZWVR, Ember);
