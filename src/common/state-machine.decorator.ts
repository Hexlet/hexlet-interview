import * as JsStateMachine from 'javascript-state-machine';

export function StateMachine(definition: any) {
  return function <T extends {new(...args:any[]):{}}>(target: T): T {
    return class extends target {
      constructor(...args: any[]) {
        super(args);
        const e = JsStateMachine.factory(this.constructor, definition);
        e.prototype._fsm();
      }
    }
  };
}
