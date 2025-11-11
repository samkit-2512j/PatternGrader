export const commandPattern = {
    name: 'Command Pattern',
    category: 'behavioral-patterns',
    description: 'The Command Pattern turns a request into a stand-alone object. This object contains all the information about the request, allowing the request to be passed around and handled flexibly.',
    sections: [
        {
            title: 'Understanding the Command Pattern',
            content: `The Command Pattern is a behavioral design pattern that turns a request into a stand-alone object. This object contains all the information needed to execute the request, allowing for flexible handling of requests, undo functionality, logging, and queuing. The Command pattern decouples the sender and receiver of the request.
  
  Key Concepts:
  • Command: Encapsulates a request as an object.
  • Receiver: The object that knows how to perform the action.
  • Invoker: The object that calls the command.
  • Client: The object that creates and configures the command.
  • Invoker: Calls the command to execute it.
  
  Use Cases:
  • When you need to parameterize objects based on an action to execute.
  • When you want to allow undo/redo functionality.
  • When you want to decouple request senders from request receivers.`,
            completed: false
        },
        {
            title: 'Structure of the Command Pattern',
            content: `The Command Pattern has the following components:
  1. Command: An interface or abstract class that declares the execution method.
  2. ConcreteCommand: A subclass of Command that defines a binding between a Receiver and an action.
  3. Client: Creates and configures the ConcreteCommand object.
  4. Invoker: Asks the command to execute the request.
  5. Receiver: Knows how to perform the action to satisfy a request.
  
  This separation allows for the requests to be handled independently, supporting features like queuing and logging.`,
            completed: false
        },
        {
            title: 'Implementation Example',
            content: `Here’s a TypeScript example of how to implement the Command Pattern:`,
            code: `// Command Interface
  interface Command {
    execute(): void;
  }
  
  // Concrete Command - LightOnCommand
  class LightOnCommand implements Command {
    private light: Light;
  
    constructor(light: Light) {
      this.light = light;
    }
  
    execute(): void {
      this.light.turnOn();
    }
  }
  
  // Concrete Command - LightOffCommand
  class LightOffCommand implements Command {
    private light: Light;
  
    constructor(light: Light) {
      this.light = light;
    }
  
    execute(): void {
      this.light.turnOff();
    }
  }
  
  // Receiver
  class Light {
    turnOn(): void {
      console.log('The light is ON');
    }
  
    turnOff(): void {
      console.log('The light is OFF');
    }
  }
  
  // Invoker
  class RemoteControl {
    private command: Command;
  
    setCommand(command: Command): void {
      this.command = command;
    }
  
    pressButton(): void {
      this.command.execute();
    }
  }
  
  // Client Code
  const light = new Light();
  const lightOn = new LightOnCommand(light);
  const lightOff = new LightOffCommand(light);
  
  const remote = new RemoteControl();
  
  remote.setCommand(lightOn);
  remote.pressButton(); // The light is ON
  
  remote.setCommand(lightOff);
  remote.pressButton(); // The light is OFF`,
            completed: false
        },
        {
            title: 'Real-World Example',
            content: `A common example of the Command pattern in real life is a remote control. Each button on the remote corresponds to a command, and when a user presses a button, it invokes the corresponding command. The remote doesn't need to know the specific device or action it is controlling, just that it calls the command to be executed.`,
            completed: false
        },
        {
            title: 'Best Practices and Considerations',
            content: `Best Practices:
  • Use the Command pattern to decouple invocations of commands from the objects that execute them.
  • Ensure that the command object is flexible enough to represent different actions and commands.
  • Use the Command pattern when you need to support undo/redo functionality, or when you need to queue or log requests.
  
  Considerations:
  • Command patterns can lead to an increase in the number of classes, which can make the codebase more complex.
  • Use the Command pattern when you need to decouple the sender of the request from the receiver, and when requests can be handled asynchronously.
  
  Avoid:
  • Overusing the Command pattern in simple scenarios where a method call would suffice.`,
            completed: false
        }
    ],
    questions: [
        {
            id: 'command-1',
            text: 'What is the main purpose of the Command pattern?',
            options: [
                'To turn a request into a stand-alone object, allowing it to be handled flexibly',
                'To manage user interfaces in a modular way',
                'To simplify the process of sending requests to objects',
                'To optimize performance by caching commands'
            ],
            correctAnswer: 'To turn a request into a stand-alone object, allowing it to be handled flexibly',
            explanation: 'The Command pattern encapsulates a request as an object, allowing it to be passed around and executed in a flexible manner, decoupling the sender and receiver.'
        },
        {
            id: 'command-2',
            text: 'Which of the following is NOT a participant in the Command pattern?',
            options: [
                'Command',
                'Receiver',
                'Invoker',
                'Factory'
            ],
            correctAnswer: 'Factory',
            explanation: 'The Command pattern involves Command, Receiver, Invoker, and Client. The Factory pattern is unrelated to the Command pattern.'
        },
        {
            id: 'command-3',
            text: 'Which class in the Command pattern encapsulates the request and provides the execution method?',
            options: [
                'Invoker',
                'Receiver',
                'ConcreteCommand',
                'Client'
            ],
            correctAnswer: 'ConcreteCommand',
            explanation: 'The ConcreteCommand class binds a receiver object to an action and implements the execution method.'
        },
        {
            id: 'command-4',
            text: 'What does the Invoker do in the Command pattern?',
            options: [
                'It executes the command directly',
                'It stores a reference to the command and calls it to execute the request',
                'It creates and configures the command',
                'It stores the history of executed commands'
            ],
            correctAnswer: 'It stores a reference to the command and calls it to execute the request',
            explanation: 'The Invoker calls the command to execute the request, but it does not know the specifics of how the command works.'
        },
        {
            id: 'command-5',
            text: 'What is a typical use case for the Command pattern?',
            options: [
                'When you need to parameterize objects to execute a request',
                'When you want to share data between objects',
                'When you need to replace conditional logic with polymorphism',
                'When you need to keep track of objects that perform similar tasks'
            ],
            correctAnswer: 'When you need to parameterize objects to execute a request',
            explanation: 'The Command pattern allows you to decouple the sender of a request from the receiver by encapsulating the request in an object, making it flexible and reusable.'
        }
    ]
};
