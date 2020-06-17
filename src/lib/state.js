const subject = require('./subject');

module.exports = class state extends subject {
    constructor() {
    super();
    this.state = {};
  }
  
  // Update the state.
  // Calls the update method on each observer.
  update(data = {}) {
    console.log(data);
    this.state = Object.assign(this.state, data);
    this.notify(this.state);
  }

  // Get the state.
  get() {
    return this.state;
  }
}