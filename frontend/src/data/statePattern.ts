export const statePattern = {
    name: 'State Pattern',
    category: 'behavioral-patterns',
    description: 'The State Pattern allows an object to change its behavior when its internal state changes. It is like an object having a memory of previous states that affect its behavior.',
    sections: [
        {
            title: 'Understanding the State Pattern',
            content: `The State Pattern is a behavioral design pattern that allows an object to alter its behavior when its internal state changes. The object will appear to change its class. This pattern is particularly useful when an object must change its behavior based on its internal state but the state transitions are not known in advance or are too complex for conditional statements.
  
  Key Concepts:
  • Context: The object that has state-dependent behavior.
  • State: An interface that represents a particular state of the context.
  • ConcreteState: A class that implements the State interface and represents a specific state.
  • State Transitions: The mechanism for changing the state of the context.
  
  Use Cases:
  • When an object should change its behavior depending on its state.
  • When you want to avoid using large conditional statements (e.g., if-else chains).
  • When an object has multiple states and its behavior depends on the current state.`,
            completed: false
        },
        {
            title: 'Structure of the State Pattern',
            content: `The State Pattern has the following components:
  1. Context: Maintains an instance of a ConcreteState subclass and allows it to change its state.
  2. State: An interface that defines the operations that can be performed in each state.
  3. ConcreteState: Concrete implementations of the State interface representing various states.
  4. Client: Initiates the request and changes the state of the context.
  
  The context object delegates its behavior to the current state object, allowing it to change its behavior dynamically.`,
            completed: false
        },
        {
            title: 'Implementation Example',
            content: `Here’s a TypeScript example of how to implement the State Pattern:`,
            code: `// State Interface
  interface State {
    handleRequest(context: Context): void;
  }
  
  // Concrete State - ConcreteStateA
  class ConcreteStateA implements State {
    public handleRequest(context: Context): void {
      console.log('Handling request in State A');
      context.setState(new ConcreteStateB());  // Transition to State B
    }
  }
  
  // Concrete State - ConcreteStateB
  class ConcreteStateB implements State {
    public handleRequest(context: Context): void {
      console.log('Handling request in State B');
      context.setState(new ConcreteStateA());  // Transition to State A
    }
  }
  
  // Context
  class Context {
    private state: State;
  
    constructor(state: State) {
      this.state = state;
    }
  
    public setState(state: State): void {
      this.state = state;
    }
  
    public request(): void {
      this.state.handleRequest(this);
    }
  }
  
  // Client Code
  const context = new Context(new ConcreteStateA());
  context.request(); // Handling request in State A
  context.request(); // Handling request in State B
  context.request(); // Handling request in State A
  context.request(); // Handling request in State B`,
            completed: false
        },
        {
            title: 'Real-World Example',
            content: `A common example of the State pattern in real life is an order processing system. Orders can have various states such as "Pending," "Shipped," "Delivered," and "Cancelled." Each state has different behaviors, such as accepting payments, processing shipments, or changing the order's status. The order's behavior changes dynamically depending on its state.`,
            completed: false
        },
        {
            title: 'Best Practices and Considerations',
            content: `Best Practices:
  • Use the State pattern when an object’s behavior depends on its state and it must change its behavior at runtime.
  • Avoid large conditionals or if-else statements by encapsulating state-specific behavior in separate classes.
  • Each state should represent a well-defined state transition.
  
  Considerations:
  • The State pattern is best used when an object has many possible states and the behavior changes depending on the state.
  • When implementing this pattern, ensure that state transitions are well-defined and predictable.
  
  Avoid:
  • Overusing the State pattern in simple cases where a few conditionals are enough.`,
            completed: false
        }
    ],
    questions: [
        {
            id: 'state-1',
            text: 'What is the main purpose of the State pattern?',
            options: [
                'To avoid using large conditional statements by encapsulating state-specific behavior in separate classes',
                'To manage the overall flow of the application',
                'To create complex state transitions using multiple states',
                'To change the class of an object dynamically'
            ],
            correctAnswer: 'To avoid using large conditional statements by encapsulating state-specific behavior in separate classes',
            explanation: 'The State pattern helps avoid large conditionals by encapsulating state-specific behavior in separate classes, making state transitions more flexible and easier to manage.'
        },
        {
            id: 'state-2',
            text: 'Which of the following is a key participant in the State pattern?',
            options: [
                'Context',
                'Factory',
                'Singleton',
                'Observer'
            ],
            correctAnswer: 'Context',
            explanation: 'The Context maintains a reference to a state object and delegates state-specific behavior to that object, changing its state dynamically.'
        },
        {
            id: 'state-3',
            text: 'What does the Context do in the State pattern?',
            options: [
                'It maintains a reference to the current state and delegates behavior to it',
                'It manages the state transitions',
                'It creates the ConcreteState objects',
                'It encapsulates the state-specific logic in one class'
            ],
            correctAnswer: 'It maintains a reference to the current state and delegates behavior to it',
            explanation: 'The Context object delegates state-specific behavior to the current state object and changes its state when needed.'
        },
        {
            id: 'state-4',
            text: 'Which of the following is true about the ConcreteState class in the State pattern?',
            options: [
                'It defines the behavior associated with a state and implements the State interface',
                'It holds a reference to the Context object and provides it with state transitions',
                'It manages the state transitions and changes the state dynamically',
                'It is responsible for maintaining the current state of the Context object'
            ],
            correctAnswer: 'It defines the behavior associated with a state and implements the State interface',
            explanation: 'The ConcreteState class defines the specific behavior for a given state and implements the State interface. It may also trigger state transitions by calling setState on the Context.'
        },
        {
            id: 'state-5',
            text: 'What is a typical use case for the State pattern?',
            options: [
                'When an object needs to change its behavior based on its internal state',
                'When you need to create a state machine with complex logic',
                'When an object’s state is likely to remain constant throughout its lifecycle',
                'When you want to use multiple inheritance in your classes'
            ],
            correctAnswer: 'When an object needs to change its behavior based on its internal state',
            explanation: 'The State pattern is used when an object’s behavior needs to change dynamically based on its internal state, avoiding complex conditional logic.'
        }
    ]
};
