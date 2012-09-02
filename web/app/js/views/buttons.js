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

  ZWVR.nextButton = Ember.View.create({
    templateName: 'next-button',
    clickable: function() {
      return ZWVR.eventsController.get('nextUrl') != null;
    }.property('ZWVR.eventsController.nextUrl'),
    click: function() {
      ZWVR.eventsController.loadNext();
    }
  });


  ZWVR.prevButton = Ember.View.create({
    templateName: 'prev-button',

    clickable: function() {
      return ZWVR.eventsController.get('previousUrl') != null;
    }.property('ZWVR.eventsController.previousUrl'),

    click: function() {
      if(this.get('clickable')) {
        ZWVR.eventsController.loadPrevious();
      }
    }
  });
})(ZWVR, Ember);
