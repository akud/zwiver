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
    current: '#list-container',
    //url for map image
    mapImg: function() {
      if(this.get('current') === '#map-container') {
        return '/images/map-selected.png';
      } else {
        return '/images/map-unselected.png';
      }
    }.property('current'),
    //url for list img
    listImg: function() {
      if(this.get('current') === '#list-container') {
        return '/images/list-selected.png';
      } else {
        return '/images/list-unselected.png';
      }
    }.property('current'),
    //selectors for all the views that are managed by the switcher buttons
    selectors: ['#list-container', '#map-container'],
    switchToMap: function() {
      this._switchTo('#map-container');
    },
    switchToList: function() {
      this._switchTo('#list-container');
    },
    /**
     * Private. Switch to the provided view
     *
     * @param selector - a jQuery selector for the view to show
     */
    _switchTo: function(selector) {
      this.set('current', selector);
      this.get('selectors').filter(function(otherSelector) {
        return otherSelector !== selector;
      }).forEach(function(otherSelector) {
        $(otherSelector).hide(); 
      });
      $(selector).show();
    }
 });
})(ZWVR, Ember);
