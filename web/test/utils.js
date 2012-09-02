/**
 * Define global test utiltiy functions.
 *
 * @exports Mock
 */
(function(ZWVR, $, QUnit) {
  /**
   * Defines a Mock class, to temporarily replace a target function.
   *
   * example: 
   * <code>
   *  var mock = new Mock(ZWVR.eventsController, 'sortBy');
   *  mock.apply(function(arg) {
   *    alert('called SortBy with argument ' + arg);
   *  });
   *  ZWVR.eventsController.sortBy(ZWVR.sorts.DATE);
   *  mock.release();
   * </code>
   * @param holder reference to the object holding the function to be replaced. Required
   * @param target string naming the target function. Required 
   * @param replacement the function with which to replace target. Optional.
   */
  ZWVR.Mock = function(holder, target, replacement) {
    this.original = holder[target];
    this.replacement = replacement;

    /**
     * Apply a replacement to the target function.
     * If no argument is given, then the replacment supplied when constructing this object will be used.
     */
    this.apply = function(replacement) {
      if(replacement) {
        holder[target] = replacement;
      } else if (this.replacement) {
        holder[target] = this.replacement;
      } else {
        console.warn("Called mock.apply() without a replacement defined");
      }
      return this;
    }
    /**
     * Release the mock wrapper around target function.
     */
    this.release = function() {
      holder[target] = this.original;
      return this;
    };
  };
 
  /**
   * Set a timeout for a function, ensuring that <code>QUnit.stop()</code> and <code>QUnit.start()</code> are called appropriately.
   *
   * @param timeout number of milliseconds to wait before executing the target function. Optional. Defaults to 20
   * @param after the function to execute after the timeout. Required.
   * @param cleanup any cleanup work to be performed after the target function. Optional.
   */
  ZWVR.timeout = function(timeout, after, cleanup) {
    if(typeof(timeout) === 'function') {
      //timeout argument wasn't supplied, set defaults
      after = arguments[0];
      cleanup = arguments[1];
      timeout = 20;
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
    }, timeout);
  }
})(ZWVR, jQuery, QUnit);
