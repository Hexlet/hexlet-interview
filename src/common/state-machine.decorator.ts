import * as JSM from 'javascript-state-machine';

declare global {
  interface Function {
    clone(): any;
  }
}

Function.prototype.clone = function() {
  var that = this;
  var temp = function temporary() { return that.apply(this, arguments); };
  for(var key in this) {
    if (this.hasOwnProperty(key)) {
      temp[key] = this[key];
    }
  }
  return temp;
};

export function StateMachine(definition: any) {
  return function<T extends { new (...args: any[]): {} }>(target: T): T {
    return class extends target {
      constructor(...args: any[]) {
        super(args);
        const cstorcopy = this.constructor.clone();
        let e = JSM.factory(cstorcopy, definition);
        for (let [key, value] of Object.entries(e.prototype)) {
          if (key !== 'state') {
            this.constructor.prototype[key] = value;
          }
        }
        //e = undefined;
        Object.defineProperties(this.constructor.prototype, {
          state: {
            configurable: true,
            enumerable:   true,
            get: function() {
              return this._fsm.state;
            },
            set: function(state) {
              this._fsm.state = state;
            }
          }
        });
        this.constructor.prototype._fsm();
      }
    };
  };
}
