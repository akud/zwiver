/**
 * Various buttons
 *
 * @requires app.js
 * @requires controller/events_controller.js
 * @provides EV.sortButtons
 * @provides EV.nextButton
 * @provides EV.previousButton
 */
(function(EV, Ember) {
  /**
   * local only. Base class for sort buttons.
   */
  var SortButtonClass = Ember.View.extend({
    clicked: false,
    _buttonClass: 'button',
    classNameBindings: ['_buttonClass', 'clicked'],
    click: function() {
      if(!this.get('clicked')) {
        EV.sortButtons.get('childViews').setEach('clicked', false);
        this.set('clicked', true);
        EV.eventsController.sortBy(this.get('sortParam'));
      }
    }
  });

   /**
   * Buttons for sorting events, only one of which is in the 'clicked' state
   * 'date' is clicked by default.
   */
  EV.sortButtons = Ember.View.create({
    templateName: 'sort-buttons',
    dateButton: SortButtonClass.extend({
      clicked: true, //clicked by default
      sortParam: EV.sorts.DATE
    }),
    distanceButton: SortButtonClass.extend({
      sortParam: EV.sorts.DISTANCE
    })
  });

  EV.nextButton = Ember.View.create({
    templateName: 'next-button',
    clickable: function() {
      return EV.eventsController.get('nextUrl') != null;
    }.property('EV.eventsController.nextUrl'),
    click: function() {
      EV.eventsController.loadNext();
    }
  });


  EV.prevButton = Ember.View.create({
    templateName: 'prev-button',

    clickable: function() {
      return EV.eventsController.get('previousUrl') != null;
    }.property('EV.eventsController.previousUrl'),

    click: function() {
      if(this.get('clickable')) {
        EV.eventsController.loadPrevious();
      }
    }
  });
})(EV, Ember);
