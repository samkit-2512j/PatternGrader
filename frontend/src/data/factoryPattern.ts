export const factoryPattern = {
    name: 'Factory Pattern',
    category: 'creational-patterns',
    description: 'The Factory Pattern provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.',
    sections: [
        {
            title: 'Understanding the Factory Pattern',
            content: `The Factory Pattern is a creational design pattern that defines an interface for creating an object, but allows subclasses to alter the type of objects that will be created.
  
  Key points about the Factory pattern:
  • Promotes loose coupling between client classes and the objects they instantiate
  • Delegates the responsibility of instantiation to subclasses or factory classes
  • Makes code more flexible and easier to extend
  
  Common use cases for Factory:
  1. Frameworks where library users need to supply specific implementations
  2. Plugin architectures
  3. UI toolkits that create widgets based on configuration
  4. Object creation based on user input or environment`,
            completed: false
        },
        {
            title: 'Key Characteristics',
            content: `The Factory Pattern is characterized by the following elements:
  
  1. Creator (Factory)
     • Defines a method (often abstract or virtual) for creating an object
     • May provide a default implementation
  
  2. Product (Interface or Abstract Class)
     • Represents the object to be created
     • Concrete products implement this interface
  
  3. Concrete Creators
     • Override the factory method to create specific product instances
     • Implement logic to decide which product to return
  
  Benefits:
  • Encapsulates object creation logic
  • Adheres to the Open/Closed Principle
  • Makes code easier to test and maintain`,
            completed: false
        },
        {
            title: 'Implementation Example',
            content: 'Here\'s an example implementation of the Factory pattern in TypeScript:',
            code: `// Product interface
  interface Button {
    render(): void;
  }
  
  // Concrete products
  class WindowsButton implements Button {
    render() {
      console.log('Rendering Windows button');
    }
  }
  
  class MacOSButton implements Button {
    render() {
      console.log('Rendering MacOS button');
    }
  }
  
  // Creator class
  abstract class Dialog {
    abstract createButton(): Button;
  
    renderWindow() {
      const button = this.createButton();
      button.render();
    }
  }
  
  // Concrete creators
  class WindowsDialog extends Dialog {
    createButton(): Button {
      return new WindowsButton();
    }
  }
  
  class MacOSDialog extends Dialog {
    createButton(): Button {
      return new MacOSButton();
    }
  }
  
  // Usage
  const dialog: Dialog = new WindowsDialog();
  dialog.renderWindow(); // Output: Rendering Windows button`,
            completed: false
        },
        {
            title: 'Real-World Example',
            content: `Here's a real-world example using a NotificationFactory to create different types of notifications based on context:`,
            code: `interface Notification {
    notify(message: string): void;
  }
  
  class EmailNotification implements Notification {
    notify(message: string): void {
      console.log(\`Sending EMAIL: \${message}\`);
    }
  }
  
  class SMSNotification implements Notification {
    notify(message: string): void {
      console.log(\`Sending SMS: \${message}\`);
    }
  }
  
  class NotificationFactory {
    static createNotification(type: 'email' | 'sms'): Notification {
      switch (type) {
        case 'email':
          return new EmailNotification();
        case 'sms':
          return new SMSNotification();
        default:
          throw new Error('Unsupported notification type');
      }
    }
  }
  
  // Usage
  const notifier = NotificationFactory.createNotification('sms');
  notifier.notify('Your OTP is 123456');`,
            completed: false
        },
        {
            title: 'Best Practices and Considerations',
            content: `When using the Factory Pattern, keep in mind:
  
  1. Favor interfaces over concrete classes
     • Enables flexibility and future extensibility
  
  2. Apply when:
     • You need to delegate object creation
     • You anticipate future object variants
  
  3. Maintain separation of concerns
     • Keep business logic separate from instantiation logic
  
  4. Don't overuse
     • Not every object requires a factory
     • Consider simple constructors when object creation is trivial
  
  Common Anti-patterns:
  • Creating factories with too many responsibilities
  • Hardcoding product types within the client
  • Not using polymorphism properly
  
  Best Use Cases:
  • UI toolkit elements
  • Notification systems
  • Object creation based on user input or config
  • Plugin/module instantiation`,
            completed: false
        }
    ],
    questions: [
        {
            id: 'factory-1',
            text: 'What is the main purpose of the Factory pattern?',
            options: [
                'To create a single instance of a class',
                'To clone objects from a prototype',
                'To delegate object creation to subclasses or separate classes',
                'To manage database connections'
            ],
            correctAnswer: 'To delegate object creation to subclasses or separate classes',
            explanation: 'The Factory pattern delegates the instantiation logic to a subclass or another class, providing flexibility and adhering to the Open/Closed Principle.'
        },
        {
            id: 'factory-2',
            text: 'Which of the following is a benefit of using the Factory pattern?',
            options: [
                'Encapsulates state logic',
                'Reduces testing complexity',
                'Encapsulates object creation logic and promotes flexibility',
                'Creates tight coupling between components'
            ],
            correctAnswer: 'Encapsulates object creation logic and promotes flexibility',
            explanation: 'One of the key benefits of the Factory pattern is the encapsulation of object creation, which makes the system more flexible and maintainable.'
        },
        {
            id: 'factory-3',
            text: 'What does a typical Factory class contain?',
            options: [
                'A method to define a family of related products',
                'A method that always returns a Singleton instance',
                'An abstract method or switch-case to decide which product to create',
                'A method that directly creates every possible object'
            ],
            correctAnswer: 'An abstract method or switch-case to decide which product to create',
            explanation: 'Factory classes usually have a method—either abstract or conditional—that determines which specific product class to instantiate.'
        },
        {
            id: 'factory-4',
            text: 'What design principle does the Factory pattern help follow?',
            options: [
                'Don’t Repeat Yourself (DRY)',
                'Open/Closed Principle',
                'Law of Demeter',
                'KISS Principle'
            ],
            correctAnswer: 'Open/Closed Principle',
            explanation: 'The Factory pattern allows adding new product types without changing existing code, adhering to the Open/Closed Principle.'
        },
        {
            id: 'factory-5',
            text: 'What is a common anti-pattern when using the Factory pattern?',
            options: [
                'Delegating instantiation',
                'Using polymorphism',
                'Hardcoding object types in the client',
                'Creating multiple factory classes'
            ],
            correctAnswer: 'Hardcoding object types in the client',
            explanation: 'Hardcoding object types in the client defeats the purpose of the Factory pattern, which aims to abstract and encapsulate object creation.'
        }
    ]
};
