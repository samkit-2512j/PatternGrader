export const adapterPattern = {
    name: 'Adapter Pattern',
    category: 'structural-patterns',
    description: 'The Adapter Pattern allows incompatible interfaces to work together by converting the interface of a class into another interface expected by the client.',
    sections: [
        {
            title: 'Understanding the Adapter Pattern',
            content: `The Adapter Pattern is a structural design pattern that allows objects with incompatible interfaces to collaborate. It acts as a bridge between two incompatible interfaces, making them compatible without changing their source code.
  
  Key Points:
  • Translates one interface into another
  • Enables reusability of legacy or third-party code
  • Promotes single responsibility and open/closed principles
  
  Common Use Cases:
  1. Integrating legacy components with new systems
  2. Working with third-party libraries with different interfaces
  3. Implementing interfaces expected by client code`,
            completed: false
        },
        {
            title: 'Types of Adapters',
            content: `There are two common forms of adapters:
  
  1. Object Adapter (uses composition)
     • The adapter contains an instance of the class it wraps
     • Most flexible and commonly used in TypeScript/JavaScript
  
  2. Class Adapter (uses inheritance)
     • Inherits from both the target interface and adaptee
     • Not idiomatic in TypeScript as it doesn't support multiple inheritance`,
            completed: false
        },
        {
            title: 'Implementation Example',
            content: `Here's a TypeScript implementation of the Adapter pattern using object composition:`,
            code: `// Adaptee - Existing class with incompatible interface
  class OldPrinter {
    public printOldFormat(message: string): void {
      console.log(\`Old printer: \${message}\`);
    }
  }
  
  // Target Interface - Desired interface expected by the client
  interface NewPrinter {
    print(message: string): void;
  }
  
  // Adapter - Converts OldPrinter to match NewPrinter interface
  class PrinterAdapter implements NewPrinter {
    private oldPrinter: OldPrinter;
  
    constructor(oldPrinter: OldPrinter) {
      this.oldPrinter = oldPrinter;
    }
  
    public print(message: string): void {
      this.oldPrinter.printOldFormat(message);
    }
  }
  
  // Client Code
  const legacyPrinter = new OldPrinter();
  const modernPrinter: NewPrinter = new PrinterAdapter(legacyPrinter);
  modernPrinter.print('Hello, Adapter!');`,
            completed: false
        },
        {
            title: 'Real-World Example',
            content: `Consider integrating a third-party API that uses a different data format than your application expects. You can use an Adapter to convert between formats without modifying the API or your client code.`,
            completed: false
        },
        {
            title: 'Best Practices and Considerations',
            content: `Best Practices:
  • Use object adapters to favor composition over inheritance
  • Ensure adapters do not alter business logic
  • Keep adapters small and focused
  
  Considerations:
  • Avoid excessive use, which may indicate design inconsistencies
  • Document adapter behavior clearly for maintainability
  • Adapters should be easily swappable or testable
  
  Anti-patterns to avoid:
  • Modifying the adaptee instead of writing an adapter
  • Adding unrelated responsibilities to the adapter`,
            completed: false
        }
    ],
    questions: [
        {
            id: 'adapter-1',
            text: 'What is the primary purpose of the Adapter pattern?',
            options: [
                'To allow multiple instances of a class',
                'To inherit behavior from another class',
                'To convert one interface into another expected by the client',
                'To create a family of related objects'
            ],
            correctAnswer: 'To convert one interface into another expected by the client',
            explanation: 'The Adapter pattern enables incompatible interfaces to work together by translating one interface into another.'
        },
        {
            id: 'adapter-2',
            text: 'Which of the following is a key benefit of using the Adapter pattern?',
            options: [
                'Increases code duplication',
                'Allows incompatible interfaces to collaborate',
                'Encourages tight coupling',
                'Makes code harder to test'
            ],
            correctAnswer: 'Allows incompatible interfaces to collaborate',
            explanation: 'By converting interfaces, the Adapter pattern helps integrate existing components with new systems without modifying the existing code.'
        },
        {
            id: 'adapter-3',
            text: 'What is a common use case for the Adapter pattern?',
            options: [
                'Implementing lazy initialization',
                'Managing singleton instances',
                'Integrating legacy systems with new interfaces',
                'Cloning complex objects'
            ],
            correctAnswer: 'Integrating legacy systems with new interfaces',
            explanation: 'Adapter is often used to adapt old systems to work with modern client expectations or APIs.'
        },
        {
            id: 'adapter-4',
            text: 'Which technique does an object adapter use in TypeScript?',
            options: [
                'Inheritance',
                'Multiple inheritance',
                'Composition',
                'Reflection'
            ],
            correctAnswer: 'Composition',
            explanation: 'Object adapters use composition by containing an instance of the adaptee class and delegating calls to it.'
        },
        {
            id: 'adapter-5',
            text: 'Which of the following is NOT an appropriate use of the Adapter pattern?',
            options: [
                'Wrapping a legacy class with a new interface',
                'Bridging APIs with different method names',
                'Modifying the original adaptee class directly',
                'Integrating third-party libraries with custom interfaces'
            ],
            correctAnswer: 'Modifying the original adaptee class directly',
            explanation: 'The Adapter pattern is meant to avoid modifying existing code. Directly modifying the adaptee breaks encapsulation and violates open/closed principle.'
        }
    ]
};
