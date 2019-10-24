import { Machine, interpret } from 'xstate';

const interviewStateMachine = Machine({
  id: 'interview',
  initial: 'waitForInterview',
  states: {
    waitForInterview: {
      on: { cancel: 'cancelled', assign: 'assigned' },
    },
    assigned: {
      on: { cancel: 'cancelled', pass: 'passed' },
    },
    passed: { type: 'final' },
    cancelled: { type: 'final' },
  },
});


const { initialState } = interviewStateMachine;

//console.log(initialState);
const state = interviewStateMachine.transition(initialState, 'pass');
console.log(state.value);
