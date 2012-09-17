/**
 * Define test utiltiy functions.
 *
 * @exports QUnit.Mock class for mocking functions
 * @exports QUnit.delay wrapper around setTimeout
 */
(function($, QUnit) {
  /**
   * Holds pointers to originals for stubbed out functions.
   *
   * @see QUnit.stub
   * @see QUnit.release
   */
  var _stubs = {
    keyFor: function(holder, target) {
      return holder.toString() + target;
    }
  };
  /**
   * Stub out a target function with a replacement. Release the stub (return function to its original) with <code>QUnit.relase(holder, target);</code>
   *
   * example: 
   * <code>
   *  QUnit.stub(ZWVR.eventsController, 'sortBy', function(arg) {
   *    alert('called SortBy with argument ' + arg);
   *  });
   *  ZWVR.eventsController.sortBy(ZWVR.sorts.DATE); //alerts
   *  QUnit.release(ZWVR.eventsController, 'sortBy');
   * </code>
   * @param holder reference to the object holding the function to be replaced. Required
   * @param target string naming the target function. Required 
   * @param replacement the function with which to replace target. Required.
   */
  QUnit.stub = function(holder, target, replacement) {
    var key = _stubs.keyFor(holder, target);
    _stubs[key] = holder[target];
    holder[target] = replacement;
    replacement.toString = function() {
      return 'Stub for ' + key;
    };
    return QUnit;
  };

  /**
   * Release the stub replacing a function.
   *
   * @param holder reference to the object holding the replaced function
   * @param target string naming the replaced function
   */
  QUnit.release = function(holder, target) {
    var key = _stubs.keyFor(holder, target);
    holder[target] = _stubs[key];
    delete(_stubs[key]);
    return QUnit;
  }
 
  /**
   * Set a delay for a function, ensuring that <code>QUnit.stop()</code> and <code>QUnit.start()</code> are called appropriately.
   *
   * @param delay number of milliseconds to wait before executing the target function. Optional. Defaults to 20
   * @param after the function to execute after the delay. Required.
   * @param cleanup any cleanup work to be performed after the target function. Optional.
   */
  QUnit.delay = function(delay, after, cleanup) {
    if(typeof(arguments[0]) === 'function') {
      cleanup = arguments[1],
      after = arguments[0],
      delay = 20;
    }
    QUnit.stop()
    setTimeout(function() {
      try {
        after();
      } finally {
        QUnit.start();
        if(cleanup) {
          cleanup();
        }
      }
    }, delay);
    return QUnit;
  }
})(jQuery, QUnit);
