export const templatePattern = {
    name: 'Template Pattern',
    category: 'behavioral-patterns',
    description: 'The Template Pattern defines the skeleton of an algorithm in a method, deferring some steps to subclasses. It lets subclasses redefine certain steps of an algorithm without changing the algorithm’s structure.',
    sections: [
        {
            title: 'Understanding the Template Pattern',
            content: `The Template Pattern is a behavioral design pattern that defines the structure of an algorithm in a method, called a "template method." Some steps of the algorithm are deferred to subclasses, allowing them to redefine certain steps without changing the overall structure.
  
  Key Concepts:
  • Template Method: A method that defines the skeleton of an algorithm.
  • Steps: The specific steps of the algorithm that can be customized or implemented by subclasses.
  • ConcreteClass: A subclass that implements or overrides specific steps of the algorithm.
  
  Use Cases:
  • When you have a common algorithm structure with specific variations that can be implemented by subclasses.
  • When you want to avoid code duplication by factoring out the common steps and allowing subclasses to focus on specific variations.
  • When you need to define an algorithm skeleton and leave specific details to subclasses.`,
            completed: false
        },
        {
            title: 'Structure of the Template Pattern',
            content: `The Template Pattern has the following components:
  1. AbstractClass: Contains the template method that defines the algorithm and may contain abstract methods that subclasses must implement.
  2. Template Method: The method that defines the skeleton of the algorithm. Some steps may call abstract methods that are implemented by subclasses.
  3. ConcreteClass: Implements the abstract methods and provides specific behavior for the algorithm steps.
  
  The Template Pattern allows subclasses to provide their own implementation for some steps, but the overall algorithm’s structure is unchanged.`,
            completed: false
        },
        {
            title: 'Implementation Example',
            content: `Here’s a TypeScript example of how to implement the Template Pattern:`,
            code: `// Abstract Class
  abstract class Game {
    // Template Method
    public play(): void {
      this.initialize();
      this.startPlay();
      this.endPlay();
    }
  
    // Abstract methods
    protected abstract initialize(): void;
    protected abstract startPlay(): void;
    protected abstract endPlay(): void;
  }
  
  // Concrete Class 1
  class Cricket extends Game {
    protected initialize(): void {
      console.log('Cricket Game Initialized!');
    }
  
    protected startPlay(): void {
      console.log('Cricket Game Started!');
    }
  
    protected endPlay(): void {
      console.log('Cricket Game Finished!');
    }
  }
  
  // Concrete Class 2
  class Football extends Game {
    protected initialize(): void {
      console.log('Football Game Initialized!');
    }
  
    protected startPlay(): void {
      console.log('Football Game Started!');
    }
  
    protected endPlay(): void {
      console.log('Football Game Finished!');
    }
  }
  
  // Client Code
  const cricket = new Cricket();
  cricket.play(); // Cricket Game Initialized!, Cricket Game Started!, Cricket Game Finished!
  
  const football = new Football();
  football.play(); // Football Game Initialized!, Football Game Started!, Football Game Finished!`,
            completed: false
        },
        {
            title: 'Real-World Example',
            content: `A typical use case of the Template Pattern is a process that needs to follow a common structure but can have different behaviors in certain steps. For example, consider an online transaction process:
  - The overall steps of the transaction (e.g., authentication, payment processing, and confirmation) are the same, but the details of each step may vary depending on the payment method (credit card, PayPal, etc.).
  - The Template Pattern can define the algorithm structure while deferring the payment method details to subclasses.`,
            completed: false
        },
        {
            title: 'Best Practices and Considerations',
            content: `Best Practices:
  • Use the Template Pattern when you have common algorithm steps with some specific variations that need to be defined in subclasses.
  • Ensure that the Template Method has a well-defined algorithm and only defers specific steps to subclasses.
  • Avoid making the Template Method too complex; keep the flow easy to follow and maintain.
  
  Considerations:
  • The Template Pattern is not suitable if the algorithm has too many variations in its structure, as this could lead to an overly complex template method.
  • Ensure that the common steps are defined in the abstract class, and only the variable steps are left to subclasses to implement.
  
  Avoid:
  • Overusing the Template Pattern for algorithms that are too simple or don’t require varying behavior in specific steps.`,
            completed: false
        }
    ],
    questions: [
        {
            id: 'template-1',
            text: 'What is the main purpose of the Template Pattern?',
            options: [
                'To allow subclasses to redefine certain steps of an algorithm without changing the overall structure',
                'To manage the flow of execution in a program',
                'To define a fixed set of steps that cannot be changed',
                'To create multiple algorithms for different use cases'
            ],
            correctAnswer: 'To allow subclasses to redefine certain steps of an algorithm without changing the overall structure',
            explanation: 'The Template Pattern allows subclasses to redefine specific steps of an algorithm while maintaining the overall structure of the algorithm.'
        },
        {
            id: 'template-2',
            text: 'Which of the following is a key component of the Template Pattern?',
            options: [
                'Template Method',
                'Factory Method',
                'Builder Class',
                'Abstract Factory'
            ],
            correctAnswer: 'Template Method',
            explanation: 'The Template Method defines the skeleton of the algorithm, deferring some steps to concrete classes that can customize them.'
        },
        {
            id: 'template-3',
            text: 'In the Template Pattern, which class defines the algorithm skeleton?',
            options: [
                'ConcreteClass',
                'AbstractClass',
                'TemplateMethod',
                'State'
            ],
            correctAnswer: 'AbstractClass',
            explanation: 'The AbstractClass defines the algorithm skeleton and may contain abstract methods that are implemented by the ConcreteClass.'
        },
        {
            id: 'template-4',
            text: 'What is a typical use case for the Template Pattern?',
            options: [
                'When you want to define the structure of an algorithm and allow subclasses to implement specific steps',
                'When you need to create a state machine with complex transitions',
                'When you need to allow clients to create objects using a builder pattern',
                'When you want to provide a single point of entry for multiple algorithms'
            ],
            correctAnswer: 'When you want to define the structure of an algorithm and allow subclasses to implement specific steps',
            explanation: 'The Template Pattern is useful when you have a common algorithm with some variations that need to be implemented by subclasses, while keeping the overall structure intact.'
        },
        {
            id: 'template-5',
            text: 'Which of the following statements is true about the Template Pattern?',
            options: [
                'The Template Method is implemented in the concrete class and defines the steps of the algorithm.',
                'The Template Pattern is used to change the overall structure of an algorithm.',
                'The Template Method defines the skeleton of the algorithm, and specific steps are implemented in subclasses.',
                'The Template Pattern uses if-else statements to control the flow of execution.'
            ],
            correctAnswer: 'The Template Method defines the skeleton of the algorithm, and specific steps are implemented in subclasses.',
            explanation: 'In the Template Pattern, the Template Method defines the skeleton of the algorithm, and subclasses implement the specific steps that can vary.'
        }
    ]
};
