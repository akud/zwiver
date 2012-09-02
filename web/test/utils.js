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
   *  var mock = new Mock(EV.eventsController, 'sortBy');
   *  mock.apply(function(arg) {
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
})(window);
