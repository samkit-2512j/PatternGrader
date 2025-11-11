export const decoratorPattern = {
    name: 'Decorator Pattern',
    category: 'structural-patterns',
    description: 'The Decorator Pattern allows for adding functionality to an object dynamically without altering its structure.',
    sections: [
        {
            title: 'Understanding the Decorator Pattern',
            content: `The Decorator Pattern is a structural design pattern that allows you to dynamically add behavior to an object without modifying its class. This is achieved by creating a decorator class that wraps the original class and enhances its functionality.
  
  Key Concepts:
  • Component: Defines the common interface for objects that can have additional functionality added to them.
  • ConcreteComponent: A class that implements the Component interface, representing the object being decorated.
  • Decorator: A class that implements the Component interface and contains a reference to a ConcreteComponent. The decorator class adds additional behavior to the component.
  • Client: Uses the decorated component to access its functionality.
  
  Use Cases:
  • Adding functionalities to UI components (e.g., adding borders, tooltips, etc.)
  • Extending the behavior of objects dynamically in runtime
  • Wrapping classes with additional responsibilities like logging, caching, etc.`,
            completed: false
        },
        {
            title: 'Structure of the Decorator Pattern',
            content: `The structure involves the following participants:
  1. Component: An interface or abstract class that defines the common interface for concrete objects and decorators.
  2. ConcreteComponent: The original object that is being decorated.
  3. Decorator: A wrapper class that implements the same interface as Component and adds new functionality.
  4. Client: The client code interacts with the component, which may be decorated at runtime.
  
  The key idea is that the decorator classes are used to add responsibilities to objects dynamically, without modifying the objects themselves.`,
            completed: false
        },
        {
            title: 'Implementation Example',
            content: `Here’s a TypeScript example to demonstrate the Decorator Pattern:`,
            code: `// Component Interface
  interface Coffee {
    cost(): number;
    description(): string;
  }
  
  // ConcreteComponent
  class SimpleCoffee implements Coffee {
    cost(): number {
      return 5;
    }
  
    description(): string {
      return 'Simple Coffee';
    }
  }
  
  // Decorator
  class MilkDecorator implements Coffee {
    private coffee: Coffee;
  
    constructor(coffee: Coffee) {
      this.coffee = coffee;
    }
  
    cost(): number {
      return this.coffee.cost() + 1;
    }
  
    description(): string {
      return this.coffee.description() + ', Milk';
    }
  }
  
  class SugarDecorator implements Coffee {
    private coffee: Coffee;
  
    constructor(coffee: Coffee) {
      this.coffee = coffee;
    }
  
    cost(): number {
      return this.coffee.cost() + 0.5;
    }
  
    description(): string {
      return this.coffee.description() + ', Sugar';
    }
  }
  
  // Client Code
  let myCoffee: Coffee = new SimpleCoffee();
  console.log(myCoffee.description(), myCoffee.cost()); // Simple Coffee 5
  
  myCoffee = new MilkDecorator(myCoffee);
  console.log(myCoffee.description(), myCoffee.cost()); // Simple Coffee, Milk 6
  
  myCoffee = new SugarDecorator(myCoffee);
  console.log(myCoffee.description(), myCoffee.cost()); // Simple Coffee, Milk, Sugar 6.5`,
            completed: false
        },
        {
            title: 'Real-World Example',
            content: `A real-world example of the Decorator pattern is a windowing system, where you may have a base window object that represents a basic window. You can then dynamically add additional features such as scrollbars, borders, or title bars by decorating the base window with these additional components. Each decorator adds new functionality without modifying the base window's code.`,
            completed: false
        },
        {
            title: 'Best Practices and Considerations',
            content: `Best Practices:
  • Use the Decorator pattern when you need to add responsibilities to objects at runtime, particularly when subclassing is not practical.
  • Keep your decorators focused on a single responsibility to ensure maintainability.
  • Chain multiple decorators to build up complex functionality by combining simple decorators.
  
  Considerations:
  • Too many decorators can lead to a complex and difficult-to-manage system.
  • You may end up with many small classes that can become difficult to track and maintain.
  • Decorators may also lead to performance issues when applied excessively.
  
  Avoid:
  • Over-decorating objects with many layers of decorators, which can lead to code that is hard to debug and maintain.
  • Using decorators for behaviors that should be part of the original class itself.`,
            completed: false
        }
    ],
    questions: [
        {
            id: 'decorator-1',
            text: 'What is the main advantage of using the Decorator pattern?',
            options: [
                'It allows adding functionality to an object dynamically without altering its structure',
                'It allows creating subclasses for different types of behavior',
                'It allows for replacing objects at runtime',
                'It allows for removing behaviors from objects dynamically'
            ],
            correctAnswer: 'It allows adding functionality to an object dynamically without altering its structure',
            explanation: 'The Decorator pattern is designed to allow adding new functionality to an object without modifying its structure, which promotes flexibility and maintainability.'
        },
        {
            id: 'decorator-2',
            text: 'Which of the following is NOT a key participant in the Decorator pattern?',
            options: [
                'Component',
                'ConcreteComponent',
                'Decorator',
                'Handler'
            ],
            correctAnswer: 'Handler',
            explanation: 'Handler is not a participant in the Decorator pattern. The main participants are Component, ConcreteComponent, Decorator, and Client.'
        },
        {
            id: 'decorator-3',
            text: 'What is the role of the Decorator class in the Decorator pattern?',
            options: [
                'It provides the interface for adding new responsibilities to objects',
                'It implements the original object’s behavior',
                'It adds new behavior to the component without modifying its code',
                'It replaces the functionality of the original component'
            ],
            correctAnswer: 'It adds new behavior to the component without modifying its code',
            explanation: 'The Decorator class adds new functionality to the component by wrapping it and enhancing its behavior, without changing the original object.'
        },
        {
            id: 'decorator-4',
            text: 'In the Decorator pattern, how are multiple decorators typically applied to an object?',
            options: [
                'One decorator at a time, starting with the most basic',
                'Multiple decorators are applied simultaneously',
                'Decorators are applied in reverse order',
                'Decorators are applied in a chain, each wrapping the previous one'
            ],
            correctAnswer: 'Decorators are applied in a chain, each wrapping the previous one',
            explanation: 'Decorators are applied in a chain, where each decorator wraps the previous one, adding new functionality step-by-step.'
        },
        {
            id: 'decorator-5',
            text: 'What is a common use case for the Decorator pattern?',
            options: [
                'Adding additional features to a component at runtime',
                'Creating a hierarchy of related classes',
                'Replacing one class with another at runtime',
                'Cloning objects dynamically'
            ],
            correctAnswer: 'Adding additional features to a component at runtime',
            explanation: 'The Decorator pattern is often used to add new features or responsibilities to an object at runtime without modifying its existing code or creating new subclasses.'
        }
    ]
};
