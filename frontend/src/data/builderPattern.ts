export const builderPattern = {
  name: 'Builder Pattern',
  category: 'creational-patterns',
  description: 'The Builder Pattern separates the construction of a complex object from its representation, allowing the same construction process to create different representations.',
  sections: [
    {
      title: 'Understanding the Builder Pattern',
      content: `The Builder Pattern is used to construct a complex object step by step. It separates the construction logic from the representation, allowing the same construction process to create different types of objects.
  
  Key points:
  • Encapsulates construction logic
  • Supports step-by-step object creation
  • Helps create immutable objects
  • Useful when object creation has multiple optional parameters
  
  Use cases:
  1. Creating complex UI components
  2. Building configurations
  3. Constructing documents or data parsers
  4. Creating test data objects`,
      completed: false
    },
    {
      title: 'Key Components',
      content: `1. **Product** - The complex object being built.
  2. **Builder** - Abstract interface that defines the steps for building the product.
  3. **ConcreteBuilder** - Implements the Builder interface and constructs the parts.
  4. **Director** (optional) - Controls the building process using the builder interface.
  
  Benefits:
  • Cleaner code with better separation of concerns
  • More control over the object creation process
  • Easier to create different representations of the product`,
      completed: false
    },
    {
      title: 'Implementation Example',
      content: 'Here\'s an example implementation of the Builder pattern in TypeScript:',
      code: `// Product
  class Computer {
    public cpu: string;
    public ram: string;
    public storage: string;
  
    constructor(cpu: string, ram: string, storage: string) {
      this.cpu = cpu;
      this.ram = ram;
      this.storage = storage;
    }
  }
  
  // Builder Interface
  interface ComputerBuilder {
    setCPU(cpu: string): this;
    setRAM(ram: string): this;
    setStorage(storage: string): this;
    build(): Computer;
  }
  
  // Concrete Builder
  class GamingComputerBuilder implements ComputerBuilder {
    private cpu: string = '';
    private ram: string = '';
    private storage: string = '';
  
    setCPU(cpu: string): this {
      this.cpu = cpu;
      return this;
    }
  
    setRAM(ram: string): this {
      this.ram = ram;
      return this;
    }
  
    setStorage(storage: string): this {
      this.storage = storage;
      return this;
    }
  
    build(): Computer {
      return new Computer(this.cpu, this.ram, this.storage);
    }
  }
  
  // Usage
  const gamingPC = new GamingComputerBuilder()
    .setCPU('Intel i9')
    .setRAM('32GB')
    .setStorage('2TB SSD')
    .build();
  
  console.log(gamingPC);`,
      completed: false
    },
    {
      title: 'Real-World Example',
      content: `A real-world application of the Builder pattern could be in building HTTP requests or configuring forms with optional fields.`,
      code: `class HttpRequest {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: string;
  
    constructor(method: string, url: string, headers: Record<string, string>, body?: string) {
      this.method = method;
      this.url = url;
      this.headers = headers;
      this.body = body;
    }
  }
  
  class HttpRequestBuilder {
    private method = 'GET';
    private url = '';
    private headers: Record<string, string> = {};
    private body?: string;
  
    setMethod(method: string): this {
      this.method = method;
      return this;
    }
  
    setUrl(url: string): this {
      this.url = url;
      return this;
    }
  
    setHeader(key: string, value: string): this {
      this.headers[key] = value;
      return this;
    }
  
    setBody(body: string): this {
      this.body = body;
      return this;
    }
  
    build(): HttpRequest {
      return new HttpRequest(this.method, this.url, this.headers, this.body);
    }
  }
  
  const request = new HttpRequestBuilder()
    .setMethod('POST')
    .setUrl('https://api.example.com/data')
    .setHeader('Content-Type', 'application/json')
    .setBody(JSON.stringify({ name: 'ChatGPT' }))
    .build();
  
  console.log(request);`,
      completed: false
    },
    {
      title: 'Best Practices and Considerations',
      content: `• Use Builder when an object has many optional parameters
  • Combine with Fluent Interface for better readability
  • Ideal for creating test data or complex nested structures
  • Avoid overcomplicating with too many builder classes if object is simple
  • Builder works well with immutable objects or configurations`,
      completed: false
    }
  ],
  questions: [
    {
      id: 'builder-1',
      text: 'What is the main purpose of the Builder pattern?',
      options: [
        'To enforce a single instance of a class',
        'To create a family of related objects',
        'To construct complex objects step-by-step',
        'To clone objects dynamically at runtime'
      ],
      correctAnswer: 'To construct complex objects step-by-step',
      explanation: 'The Builder pattern separates the construction of a complex object from its representation, allowing the same construction process to create different representations.'
    },
    {
      id: 'builder-2',
      text: 'Which of the following is NOT a component of the Builder pattern?',
      options: [
        'Director',
        'Product',
        'Builder',
        'Factory'
      ],
      correctAnswer: 'Factory',
      explanation: 'The Factory is a separate design pattern. The main components of the Builder pattern are Builder, ConcreteBuilder, Product, and optionally, Director.'
    },
    {
      id: 'builder-3',
      text: 'Which benefit is commonly associated with the Builder pattern?',
      options: [
        'Automatic instance sharing',
        'Simplified object inheritance',
        'Step-by-step construction of complex objects',
        'Encapsulation of object cloning'
      ],
      correctAnswer: 'Step-by-step construction of complex objects',
      explanation: 'The Builder pattern allows you to construct complex objects one step at a time, especially when there are many optional parameters.'
    },
    {
      id: 'builder-4',
      text: 'In which scenario would you most likely use the Builder pattern?',
      options: [
        'When a class must not have more than one instance',
        'When the object has many optional configuration parameters',
        'When you need to implement object cloning',
        'When converting one interface into another'
      ],
      correctAnswer: 'When the object has many optional configuration parameters',
      explanation: 'Builder is ideal for cases where you need to construct objects that have many optional parameters, especially to avoid constructor overloading.'
    },
    {
      id: 'builder-5',
      text: 'Which of the following is a common implementation style for Builder?',
      options: [
        'Factory method',
        'Fluent interface',
        'Static initialization',
        'Abstract class inheritance'
      ],
      correctAnswer: 'Fluent interface',
      explanation: 'The Builder pattern is often implemented using a fluent interface, allowing method chaining for setting properties.'
    }
  ]
};
