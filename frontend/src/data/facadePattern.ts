export const facadePattern = {
    name: 'Facade Pattern',
    category: 'structural-patterns',
    description: 'The Facade Pattern provides a simplified interface to a complex subsystem, making it easier to interact with.',
    sections: [
        {
            title: 'Understanding the Facade Pattern',
            content: `The Facade Pattern is a structural design pattern that provides a simplified interface to a complex subsystem. It hides the complexities of the subsystem and provides a higher-level interface that makes the system easier to use.
  
  Key Concepts:
  • Facade: A class that provides a simple interface to a complex subsystem of classes.
  • Subsystem: The classes and components that make up the complex system, often with intricate interactions.
  • Client: The code that interacts with the Facade, not directly with the subsystem.
  
  Use Cases:
  • Simplifying the usage of a complex library or framework
  • Integrating multiple services in a complex system
  • Encapsulating complex interactions for client ease of use`,
            completed: false
        },
        {
            title: 'Structure of the Facade Pattern',
            content: `The Facade pattern involves the following participants:
  1. Facade: A class that provides a simple interface to a complex system. It delegates client requests to the appropriate subsystem classes.
  2. Subsystem Classes: The classes that make up the complex subsystem. They perform the actual work but are hidden from the client.
  3. Client: The class that interacts with the Facade and is unaware of the underlying complexities of the subsystem.
  
  The main idea is that the Facade provides a higher-level interface that shields the client from the subsystem's complexity.`,
            completed: false
        },
        {
            title: 'Implementation Example',
            content: `Here’s a TypeScript example to demonstrate the Facade Pattern:`,
            code: `// Subsystem Classes
  class CPU {
    public freeze(): void {
      console.log("Freezing CPU");
    }
  
    public jump(): void {
      console.log("Jumping to address");
    }
  
    public execute(): void {
      console.log("Executing instructions");
    }
  }
  
  class Memory {
    public load(): void {
      console.log("Loading data into memory");
    }
  }
  
  class HardDrive {
    public read(): void {
      console.log("Reading data from hard drive");
    }
  }
  
  // Facade
  class ComputerFacade {
    private cpu: CPU;
    private memory: Memory;
    private hardDrive: HardDrive;
  
    constructor() {
      this.cpu = new CPU();
      this.memory = new Memory();
      this.hardDrive = new HardDrive();
    }
  
    public start(): void {
      this.cpu.freeze();
      this.memory.load();
      this.cpu.jump();
      this.cpu.execute();
      this.hardDrive.read();
    }
  }
  
  // Client Code
  const computer = new ComputerFacade();
  computer.start(); // Simplified interface to start the computer`,
            completed: false
        },
        {
            title: 'Real-World Example',
            content: `A real-world example of the Facade pattern can be seen in modern home theater systems. The home theater may involve multiple components such as a TV, DVD player, speakers, and lights. Instead of the user needing to interact with each component separately, a home theater system could provide a simple interface (the Facade) that allows the user to simply press a "Power On" button, and the system will take care of turning on the TV, speakers, and adjusting the lights automatically.`,
            completed: false
        },
        {
            title: 'Best Practices and Considerations',
            content: `Best Practices:
  • Use the Facade pattern when the system is complex and you want to provide a simpler interface to the client.
  • Keep the Facade interface clean and focused on high-level operations.
  • Avoid placing too much functionality into the Facade class itself. It should delegate complex operations to the subsystem classes.
  
  Considerations:
  • While the Facade pattern simplifies usage, it can also introduce an additional layer, making the system more rigid if not designed properly.
  • Avoid overusing the Facade pattern if it leads to a bloated class with too much responsibility.
  
  Avoid:
  • Making the Facade class responsible for too many things. It should only simplify access to the underlying subsystem, not handle complex logic itself.`,
            completed: false
        }
    ],
    questions: [
        {
            id: 'facade-1',
            text: 'What is the main purpose of the Facade pattern?',
            options: [
                'To provide a simplified interface to a complex subsystem',
                'To hide the client code from the system',
                'To allow complex subsystems to interact directly with the client',
                'To split the subsystem into multiple small classes'
            ],
            correctAnswer: 'To provide a simplified interface to a complex subsystem',
            explanation: 'The Facade pattern is designed to simplify the interface to a complex subsystem, making it easier to use for clients.'
        },
        {
            id: 'facade-2',
            text: 'Which of the following is a key participant in the Facade pattern?',
            options: [
                'Facade',
                'Subsystem',
                'Client',
                'All of the above'
            ],
            correctAnswer: 'All of the above',
            explanation: 'In the Facade pattern, the Facade provides a simple interface to the complex subsystem, while the Subsystem performs the detailed work and the Client interacts with the Facade.'
        },
        {
            id: 'facade-3',
            text: 'Which of the following is a common use case for the Facade pattern?',
            options: [
                'Simplifying the usage of a complex system or library',
                'Adding behaviors to objects dynamically',
                'Creating complex class hierarchies',
                'Cloning objects at runtime'
            ],
            correctAnswer: 'Simplifying the usage of a complex system or library',
            explanation: 'The Facade pattern is commonly used to simplify the usage of complex systems by providing a higher-level interface.'
        },
        {
            id: 'facade-4',
            text: 'How does the Facade pattern help reduce the complexity for the client?',
            options: [
                'It provides a single, unified interface to a complex set of classes',
                'It replaces all the subsystem classes with simpler versions',
                'It hides the client code from being able to interact with the system',
                'It delegates all client requests to external services'
            ],
            correctAnswer: 'It provides a single, unified interface to a complex set of classes',
            explanation: 'The Facade pattern reduces complexity by offering a simplified interface that abstracts away the underlying subsystem complexities from the client.'
        },
        {
            id: 'facade-5',
            text: 'What is a potential downside of using the Facade pattern?',
            options: [
                'It may create an additional layer of abstraction that could make the system less flexible',
                'It hides the complexity too much and may prevent system optimizations',
                'It encourages overuse of complex subsystems',
                'It makes the subsystem less extensible'
            ],
            correctAnswer: 'It may create an additional layer of abstraction that could make the system less flexible',
            explanation: 'While the Facade pattern simplifies usage, it can add an extra layer of abstraction that may hinder flexibility if not designed properly.'
        }
    ]
};
