export const singletonPattern = {
  name: 'Singleton Pattern',
  category: 'creational-patterns',
  description: 'The Singleton Pattern ensures a class has only one instance and provides a global point of access to it.',
  sections: [
    {
      title: 'Understanding the Singleton Pattern',
      content: `The Singleton pattern is one of the simplest yet most powerful design patterns in software engineering. It ensures that a class has only one instance throughout the application's lifecycle and provides a global point of access to that instance.

Key points about the Singleton pattern:
• It guarantees that a class has only one instance
• It provides a global access point to that instance
• The instance is created only when it's first needed (lazy initialization)
• All subsequent requests return the same instance

Common use cases for Singleton:
1. Database connections
2. Configuration settings
3. Logging services
4. Cache management
5. Thread pools
6. Device drivers (e.g., printer spooler)`,
      completed: false
    },
    {
      title: 'Key Characteristics',
      content: `The Singleton pattern is characterized by several key elements that work together to ensure single instance creation and global access:

1. Private Constructor
   • Prevents direct instantiation using the 'new' keyword
   • Makes it impossible to create instances from outside the class

2. Private Static Instance
   • Holds the single instance of the class
   • Usually marked as static to ensure it belongs to the class itself
   • Often initialized as null until first use

3. Public Static Access Method
   • Usually named getInstance() or similar
   • Creates the instance if it doesn't exist
   • Returns the existing instance if already created
   • Must be thread-safe in concurrent environments

4. Optional Initialization Parameters
   • Can be passed through the getInstance method
   • Should be handled carefully to maintain consistency`,
      completed: false
    },
    {
      title: 'Implementation Example',
      content: 'Here\'s a comprehensive implementation of the Singleton pattern in TypeScript, showing different variations and best practices:',
      code: `// Basic Singleton Implementation
class BasicSingleton {
  private static instance: BasicSingleton;
  
  private constructor() {
    // Private constructor prevents direct instantiation
  }
  
  public static getInstance(): BasicSingleton {
    if (!BasicSingleton.instance) {
      BasicSingleton.instance = new BasicSingleton();
    }
    return BasicSingleton.instance;
  }
}

// Thread-Safe Singleton with Initialization
class ThreadSafeSingleton {
  private static instance: ThreadSafeSingleton;
  private static isInitializing: boolean = false;
  
  private constructor() {
    if (!ThreadSafeSingleton.isInitializing) {
      throw new Error('Cannot instantiate singleton directly');
    }
  }
  
  public static getInstance(): ThreadSafeSingleton {
    if (!ThreadSafeSingleton.instance) {
      ThreadSafeSingleton.isInitializing = true;
      ThreadSafeSingleton.instance = new ThreadSafeSingleton();
      ThreadSafeSingleton.isInitializing = false;
    }
    return ThreadSafeSingleton.instance;
  }
}

// Singleton with Configuration
class ConfigSingleton {
  private static instance: ConfigSingleton;
  private config: Record<string, any>;
  
  private constructor(initialConfig: Record<string, any>) {
    this.config = initialConfig;
  }
  
  public static getInstance(config?: Record<string, any>): ConfigSingleton {
    if (!ConfigSingleton.instance && config) {
      ConfigSingleton.instance = new ConfigSingleton(config);
    }
    return ConfigSingleton.instance;
  }
  
  public getConfig(): Record<string, any> {
    return { ...this.config };
  }
  
  public updateConfig(newConfig: Partial<Record<string, any>>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Usage Examples
const singleton1 = BasicSingleton.getInstance();
const singleton2 = BasicSingleton.getInstance();
console.log(singleton1 === singleton2); // true

const config = ConfigSingleton.getInstance({
  apiUrl: 'https://api.example.com',
  timeout: 5000
});
console.log(config.getConfig()); // { apiUrl: '...', timeout: 5000 }`,
      completed: false
    },
    {
      title: 'Real-World Example',
      content: `Let's explore a practical example of using the Singleton pattern to implement a Logger service that can be used throughout an application:`,
      code: `class Logger {
  private static instance: Logger;
  private logs: string[] = [];
  private logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';
  
  private constructor() {
    // Initialize logger settings
    this.logs = [];
    console.log('Logger initialized');
  }
  
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  public setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.logLevel = level;
  }
  
  public log(message: string, level: 'debug' | 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const logEntry = \`[\${level.toUpperCase()}] \${timestamp}: \${message}\`;
    
    // Store log in memory
    this.logs.push(logEntry);
    
    // Output to console based on log level
    if (this.shouldLog(level)) {
      switch (level) {
        case 'debug':
          console.debug(logEntry);
          break;
        case 'warn':
          console.warn(logEntry);
          break;
        case 'error':
          console.error(logEntry);
          break;
        default:
          console.log(logEntry);
      }
    }
  }
  
  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
  
  public getLogs(): string[] {
    return [...this.logs];
  }
  
  public clearLogs(): void {
    this.logs = [];
  }
}

// Usage in different parts of the application
const logger = Logger.getInstance();
logger.setLogLevel('debug');

// In user service
logger.log('User logged in successfully', 'info');

// In error handler
logger.log('API request failed', 'error');

// In debug mode
logger.log('Processing request payload', 'debug');

// Get all logs
console.log(logger.getLogs());`,
      completed: false
    },
    {
      title: 'Best Practices and Considerations',
      content: `When implementing the Singleton pattern, consider these best practices and potential pitfalls:

1. Use Singleton Sparingly
   • Don't overuse the pattern - it can make code tightly coupled
   • Consider if global state is really necessary
   • Ask if dependency injection would be a better alternative

2. Thread Safety Considerations
   • Implement proper synchronization in multi-threaded environments
   • Consider using double-checked locking for better performance
   • Be aware of potential race conditions during initialization

3. Testing Challenges
   • Singletons can make unit testing difficult
   • Consider using dependency injection for better testability
   • Implement a reset mechanism for testing purposes

4. Lazy vs. Eager Initialization
   • Lazy initialization creates the instance when first needed
   • Eager initialization creates the instance when the class loads
   • Choose based on resource usage and startup time requirements

5. Maintenance and Evolution
   • Plan for future requirements and potential changes
   • Consider making the Singleton extensible if needed
   • Document usage patterns and limitations

Common Anti-patterns to Avoid:
• Using Singleton as a global variable container
• Creating multiple Singleton classes that depend on each other
• Implementing complex initialization logic in the constructor
• Not considering thread safety in concurrent environments

Best Use Cases:
• Configuration management
• Logging services
• Database connection pools
• File systems
• Print spoolers
• Thread pools`,
      completed: false
    }
  ],
  questions: [
    {
      id: 'singleton-1',
      text: 'What is the main purpose of the Singleton pattern?',
      options: [
        'To create multiple instances of a class',
        'To ensure a class has only one instance and provide global access to it',
        'To implement inheritance in a class',
        'To manage multiple database connections'
      ],
      correctAnswer: 'To ensure a class has only one instance and provide global access to it',
      explanation: 'The Singleton pattern is designed to ensure that a class has only one instance throughout the application lifecycle and provides a global point of access to that instance.'
    },
    {
      id: 'singleton-2',
      text: 'Which of the following is NOT a key characteristic of the Singleton pattern?',
      options: [
        'Private constructor',
        'Public constructor',
        'Static instance',
        'Global access point'
      ],
      correctAnswer: 'Public constructor',
      explanation: 'A Singleton pattern uses a private constructor to prevent direct instantiation. A public constructor would allow multiple instances to be created, violating the Singleton pattern.'
    },
    {
      id: 'singleton-3',
      text: 'What potential issue should you consider when implementing a Singleton in a multi-threaded environment?',
      options: [
        'Memory usage',
        'Thread safety',
        'Network connectivity',
        'Database performance'
      ],
      correctAnswer: 'Thread safety',
      explanation: 'In a multi-threaded environment, you need to ensure thread safety to prevent multiple instances from being created when multiple threads try to access the Singleton simultaneously.'
    },
    {
      id: 'singleton-4',
      text: 'Which initialization approach creates the Singleton instance only when it\'s first requested?',
      options: [
        'Lazy initialization',
        'Eager initialization',
        'Static initialization',
        'Dynamic initialization'
      ],
      correctAnswer: 'Lazy initialization',
      explanation: 'Lazy initialization creates the Singleton instance only when it\'s first requested through the getInstance() method, which can improve application startup time and resource usage.'
    },
    {
      id: 'singleton-5',
      text: 'What is a common anti-pattern when using the Singleton pattern?',
      options: [
        'Using private constructors',
        'Implementing thread safety',
        'Using it as a global variable container',
        'Providing a static getInstance method'
      ],
      correctAnswer: 'Using it as a global variable container',
      explanation: 'Using Singleton as a global variable container is an anti-pattern because it violates the single responsibility principle and can lead to tight coupling and maintenance issues.'
    }
  ]
}; 