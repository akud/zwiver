/**
 * Define global test utiltiy functions.
 *
 * @exports Mock
 */
(function(global) {
  /**
   * Defines a Mock class, to temporarily replace a target function.
   *
   * example: 
   * <code>
   *  var mock = new Mock(EV.eventsController, 'sortBy', function(arg) {
   *    alert('called SortBy with argument ' + arg);
   *  });
   *  EV.eventsController.sortBy(EV.sorts.DATE);
   *  mock.release();
   * </code>
   * @param holder reference to the object holding the function to be replaced. Required
   * @param target string naming the target function. Required 
   * @param replacement the function with which to replace target. Optional.
   */
  global.Mock = function(holder, target, replacement) {
    this.original = holder[target];
    if(replacement) {
      holder[target] = replacement;
    };
    /**
     * Replace the target function with the given replacement
     * @param replacement the function with which to replace the target
     */
    this.replaceWith = function(replacement) {
      holder[target] = replacement;
    }
    /**
     * Release the mock wrapper around target function.
     */
    this.release = function() {
      holder[target] = this.original;
    };
  };
})(window);
