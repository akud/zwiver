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
