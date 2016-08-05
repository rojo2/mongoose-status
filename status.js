/**
 * Plugin that adds a status property to the object. This property
 * allows works as a FSM.
 *
 * @param {mongoose.Schema} schema
 * @param {Object} options
 */
module.exports = function(schema, options) {

  if (!options.default) {
    throw new TypeError("You need to pass the default (or initial) state using options.default");
  }

  if (!options.enum) {
    throw new TypeError("You need to pass the valid status using options.enum");
  }

  if (!options.transitions) {
    throw new TypeError("You need to pass the valid transitions between states using options.transitions");
  }

  schema.add({
    status: {
      type: String,
      default: options.default,
      enum: options.enum
    }
  });

  schema.method("transitionTo", function(newStatus) {
    const currentStatus = this.status;
    const transitions = options.transitions[currentStatus];
    if (transitions === undefined) {
      return false;
    }
    if (transitions.indexOf(newStatus) < 0) {
      return false;
    }
    this.status = newStatus;
    return true;
  });

};
