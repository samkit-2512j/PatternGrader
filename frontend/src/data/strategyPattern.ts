export const strategyPattern = {
    name: 'Strategy Pattern',
    category: 'behavioral-patterns',
    description: 'The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. The Strategy pattern lets the algorithm vary independently from clients that use it.',
    sections: [
        {
            title: 'Understanding the Strategy Pattern',
            content: `The Strategy Pattern is a behavioral design pattern that allows the algorithm to be selected at runtime. It defines a family of algorithms, encapsulates each one, and makes them interchangeable. The key idea is to separate the algorithm (strategy) from the context in which it is used. This allows a client to choose the appropriate algorithm dynamically at runtime without modifying the context.
  
  Key Concepts:
  • Context: The object that uses a strategy.
  • Strategy: A family of algorithms that can be used interchangeably.
  • ConcreteStrategy: A specific implementation of a strategy.
  • Client: The object that selects the appropriate strategy for use.
  
  Use Cases:
  • When multiple algorithms can be used to solve a problem and you want to choose one at runtime.
  • When you want to define a class that uses one of several algorithms but doesn't want to modify the class every time the algorithm changes.
  • When you want to avoid large conditionals (like if-else or switch statements).`,
            completed: false
        },
        {
            title: 'Structure of the Strategy Pattern',
            content: `The Strategy Pattern has the following participants:
  1. Context: The object that contains a reference to a strategy and delegates the algorithm execution to it.
  2. Strategy: The common interface that defines the behavior of the algorithm.
  3. ConcreteStrategy: The actual implementation of the algorithm that adheres to the Strategy interface.
  4. Client: The object that selects the strategy and uses it.
  
  The pattern allows clients to choose which strategy to use at runtime without altering the context or the strategies themselves.`,
            completed: false
        },
        {
            title: 'Implementation Example',
            content: `Here’s a TypeScript example of how to implement the Strategy Pattern:`,
            code: `// Strategy Interface
  interface Strategy {
    execute(a: number, b: number): number;
  }
  
  // Concrete Strategies
  class AddStrategy implements Strategy {
    execute(a: number, b: number): number {
      return a + b;
    }
  }
  
  class SubtractStrategy implements Strategy {
    execute(a: number, b: number): number {
      return a - b;
    }
  }
  
  class MultiplyStrategy implements Strategy {
    execute(a: number, b: number): number {
      return a * b;
    }
  }
  
  // Context
  class Calculator {
    private strategy: Strategy;
  
    constructor(strategy: Strategy) {
      this.strategy = strategy;
    }
  
    public setStrategy(strategy: Strategy): void {
      this.strategy = strategy;
    }
  
    public calculate(a: number, b: number): number {
      return this.strategy.execute(a, b);
    }
  }
  
  // Client Code
  const add = new AddStrategy();
  const subtract = new SubtractStrategy();
  const multiply = new MultiplyStrategy();
  
  const calculator = new Calculator(add);
  console.log(calculator.calculate(5, 3)); // 8
  
  calculator.setStrategy(subtract);
  console.log(calculator.calculate(5, 3)); // 2
  
  calculator.setStrategy(multiply);
  console.log(calculator.calculate(5, 3)); // 15`,
            completed: false
        },
        {
            title: 'Real-World Example',
            content: `A real-world example of the Strategy pattern is a navigation system in a car. The system can use different strategies for routing, such as fastest route, shortest route, or a route that avoids tolls. The user can choose the desired routing strategy, and the system will apply it without changing the underlying code that calculates the route.`,
            completed: false
        },
        {
            title: 'Best Practices and Considerations',
            content: `Best Practices:
  • Use the Strategy pattern when you have multiple algorithms that are interchangeable.
  • Keep the Strategy interface generic and independent of the context, allowing new strategies to be added easily.
  • Ensure that the context has a way to change the strategy at runtime.
  
  Considerations:
  • The Strategy pattern is ideal for replacing complex conditional logic (if-else or switch statements).
  • If the number of strategies becomes large, managing them can become challenging, and other design patterns (such as the Chain of Responsibility) may be more appropriate.
  
  Avoid:
  • Overusing the Strategy pattern for trivial cases where simple conditionals would suffice.`,
            completed: false
        }
    ],
    questions: [
        {
            id: 'strategy-1',
            text: 'What is the main purpose of the Strategy pattern?',
            options: [
                'To define a family of algorithms and make them interchangeable',
                'To hide the complexity of an algorithm',
                'To simplify the client code by adding new algorithms',
                'To ensure that an algorithm is only used once'
            ],
            correctAnswer: 'To define a family of algorithms and make them interchangeable',
            explanation: 'The Strategy pattern allows multiple algorithms to be defined and used interchangeably within a given context, enabling flexibility and easier maintenance.'
        },
        {
            id: 'strategy-2',
            text: 'Which of the following is NOT a participant in the Strategy pattern?',
            options: [
                'Context',
                'Strategy',
                'ConcreteStrategy',
                'Observer'
            ],
            correctAnswer: 'Observer',
            explanation: 'The Observer pattern is a separate pattern. The Strategy pattern involves Context, Strategy, and ConcreteStrategy participants.'
        },
        {
            id: 'strategy-3',
            text: 'What is a typical use case for the Strategy pattern?',
            options: [
                'Replacing if-else or switch-case statements',
                'Sharing data between multiple objects',
                'Modifying the state of an object in a flexible way',
                'Handling multiple inheritance'
            ],
            correctAnswer: 'Replacing if-else or switch-case statements',
            explanation: 'The Strategy pattern is commonly used to eliminate complex conditionals, making the code more maintainable and flexible by allowing algorithms to be swapped dynamically.'
        },
        {
            id: 'strategy-4',
            text: 'What does the Context class do in the Strategy pattern?',
            options: [
                'It encapsulates a specific algorithm and prevents others from accessing it',
                'It contains a reference to the strategy and delegates the algorithm execution to it',
                'It defines the interface for strategies to follow',
                'It allows the strategy to modify its own behavior dynamically'
            ],
            correctAnswer: 'It contains a reference to the strategy and delegates the algorithm execution to it',
            explanation: 'The Context class holds a reference to the strategy and is responsible for calling the strategy’s algorithm without needing to know the exact details of how it works.'
        },
        {
            id: 'strategy-5',
            text: 'What is a common benefit of using the Strategy pattern?',
            options: [
                'It reduces the number of objects involved in the system',
                'It helps to avoid tight coupling by separating the algorithm from the context',
                'It simplifies the process of adding new concrete classes',
                'It ensures that the client always uses the most efficient algorithm'
            ],
            correctAnswer: 'It helps to avoid tight coupling by separating the algorithm from the context',
            explanation: 'The Strategy pattern decouples the algorithm from the context by allowing the client to switch between different algorithms without modifying the context or strategies themselves.'
        }
    ]
};
