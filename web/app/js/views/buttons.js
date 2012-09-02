/**
 * Various buttons
 *
 * @requires app.js
 * @requires controller/events_controller.js
 */
(function(EV, Ember) {
/**
  * Base class for buttons. Sets selected state on click; subclasses should 
  * override <code>doClick()</code>
  */
  EV.Button = Ember.View.extend({
    clicked: false,
    _buttonClass: 'button',
    classNameBindings: ['_buttonClass', 'clicked'],
    click: function() {
      this.set('clicked', !this.get('clicked'));
      this.doClick();
    },
    unClick: function() {
      this.set('clicked', false);
    },
    doClick: function() {
      console.warn(this + " should override doClick()"); 
    }
  });


  /**
   * Buttons for sorting events, only one of which is in the 'clicked' state
   * 'date' is clicked by default.
   */
  EV.sortButtons = Ember.View.create({
    templateName: 'sort-buttons',
    _unclickOthers: function(button) {
      this.get('childViews').filter(function(view) {
        return view !== button;
      }).invoke('unclick');
    },
    dateButton: EV.Button.extend({
      clicked: true, //clicked by default
      doClick: function() {
        EV.sortButtons._unclickOthers(this);
        EV.eventsController.sortBy(EV.sorts.DATE);
      }
    }),
    distanceButton: EV.Button.extend({
      doClick: function() {
        EV.sortButtons._unclickOthers(this);
        EV.eventsController.sortBy(EV.sorts.DISTANCE);
      }
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
