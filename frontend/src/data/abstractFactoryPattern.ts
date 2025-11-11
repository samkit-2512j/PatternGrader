export const abstractFactoryPattern = {
    name: 'Abstract Factory Pattern',
    category: 'creational-patterns',
    description: 'The Abstract Factory Pattern provides an interface for creating families of related or dependent objects without specifying their concrete classes.',
    sections: [
        {
            title: 'Understanding the Abstract Factory Pattern',
            content: `The Abstract Factory Pattern is used when there are interrelated dependencies with not just one product, but multiple families of products. It provides a way to encapsulate a group of individual factories that have a common theme.
  
  Key Points:
  • Defines an interface for creating related objects
  • Does not specify concrete classes
  • Helps enforce consistency among products
  • Useful when objects must be used together in a consistent way
  
  Common Use Cases:
  1. Cross-platform UI toolkits
  2. Theme management systems
  3. Object families requiring interrelated instances
  4. Plugin architectures`,
            completed: false
        },
        {
            title: 'Structure and Participants',
            content: `The main components of the Abstract Factory Pattern include:
  
  1. AbstractFactory
     • Declares a set of methods for creating abstract products
  
  2. ConcreteFactory
     • Implements the creation methods for a specific product family
  
  3. AbstractProduct
     • Declares an interface for a type of product object
  
  4. ConcreteProduct
     • Defines a product object to be created by the corresponding concrete factory
  
  5. Client
     • Uses only interfaces declared by AbstractFactory and AbstractProduct`,
            completed: false
        },
        {
            title: 'Implementation Example',
            content: `Here's a TypeScript implementation of the Abstract Factory Pattern for a UI component system:`,
            code: `// Abstract Products
  interface Button {
    render(): void;
  }
  
  interface Checkbox {
    render(): void;
  }
  
  // Concrete Products
  class MacButton implements Button {
    render() {
      console.log('Render Mac-style button');
    }
  }
  
  class WinButton implements Button {
    render() {
      console.log('Render Windows-style button');
    }
  }
  
  class MacCheckbox implements Checkbox {
    render() {
      console.log('Render Mac-style checkbox');
    }
  }
  
  class WinCheckbox implements Checkbox {
    render() {
      console.log('Render Windows-style checkbox');
    }
  }
  
  // Abstract Factory
  interface GUIFactory {
    createButton(): Button;
    createCheckbox(): Checkbox;
  }
  
  // Concrete Factories
  class MacFactory implements GUIFactory {
    createButton(): Button {
      return new MacButton();
    }
    createCheckbox(): Checkbox {
      return new MacCheckbox();
    }
  }
  
  class WinFactory implements GUIFactory {
    createButton(): Button {
      return new WinButton();
    }
    createCheckbox(): Checkbox {
      return new WinCheckbox();
    }
  }
  
  // Client Code
  function renderUI(factory: GUIFactory) {
    const button = factory.createButton();
    const checkbox = factory.createCheckbox();
    button.render();
    checkbox.render();
  }
  
  // Usage
  const factory = new MacFactory();
  renderUI(factory);`,
            completed: false
        },
        {
            title: 'Real-World Example',
            content: `Imagine a cross-platform application that must support both Windows and Mac themes. You can use the Abstract Factory to create related UI elements (buttons, checkboxes, scrollbars) depending on the user's platform, ensuring a consistent look and feel.`,
            completed: false
        },
        {
            title: 'Best Practices and Considerations',
            content: `Best Practices:
  • Use interfaces or abstract classes for all products and factories
  • Decouple client code from concrete classes
  • Group related product variants
  
  Considerations:
  • May increase number of classes in your codebase
  • Abstract factories are best used when object families must be consistent
  • Can be combined with Singleton or Factory Method if needed
  
  Anti-patterns to avoid:
  • Hard-coding product creation inside the client
  • Tight-coupling factories to specific product classes`,
            completed: false
        }
    ],
    questions: [
        {
            id: 'abstract-factory-1',
            text: 'What is the primary purpose of the Abstract Factory pattern?',
            options: [
                'To create a single instance of a class',
                'To clone objects efficiently',
                'To provide an interface for creating related objects without specifying their concrete classes',
                'To encapsulate one object creation process'
            ],
            correctAnswer: 'To provide an interface for creating related objects without specifying their concrete classes',
            explanation: 'The Abstract Factory pattern is used to create families of related or dependent objects without knowing their concrete implementations.'
        },
        {
            id: 'abstract-factory-2',
            text: 'Which of the following is NOT a component of the Abstract Factory pattern?',
            options: [
                'AbstractFactory',
                'ConcreteFactory',
                'ObjectPool',
                'AbstractProduct'
            ],
            correctAnswer: 'ObjectPool',
            explanation: 'ObjectPool is not part of the Abstract Factory pattern. The pattern involves abstract and concrete factories and products.'
        },
        {
            id: 'abstract-factory-3',
            text: 'What is a common use case for the Abstract Factory pattern?',
            options: [
                'Managing a single database connection',
                'Providing consistent UI components across platforms',
                'Serializing objects',
                'Reducing memory usage through shared instances'
            ],
            correctAnswer: 'Providing consistent UI components across platforms',
            explanation: 'Abstract Factory is ideal when the application needs to use consistent components (e.g., buttons, checkboxes) across different platforms or themes.'
        },
        {
            id: 'abstract-factory-4',
            text: 'How does the client interact with the objects created using the Abstract Factory pattern?',
            options: [
                'By calling new on each concrete product',
                'By using factory methods that return abstract products',
                'By accessing them directly from global variables',
                'By manually setting the properties of the product'
            ],
            correctAnswer: 'By using factory methods that return abstract products',
            explanation: 'The client interacts with abstract factories through factory methods, without depending on the concrete product implementations.'
        },
        {
            id: 'abstract-factory-5',
            text: 'What is a disadvantage of using the Abstract Factory pattern?',
            options: [
                'It breaks the open-closed principle',
                'It increases code complexity and number of classes',
                'It does not support multiple products',
                'It couples code to concrete implementations'
            ],
            correctAnswer: 'It increases code complexity and number of classes',
            explanation: 'While it offers flexibility, the Abstract Factory pattern may lead to more boilerplate code and a larger number of classes.'
        }
    ]
};
