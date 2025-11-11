export const bridgePattern = {
    name: 'Bridge Pattern',
    category: 'structural-patterns',
    description: 'The Bridge Pattern decouples an abstraction from its implementation so that the two can vary independently.',
    sections: [
        {
            title: 'Understanding the Bridge Pattern',
            content: `The Bridge Pattern is a structural design pattern that splits a large class or a closely related set of classes into two separate hierarchies—abstraction and implementation—which can be developed independently of each other.
  
  Key Concepts:
  • Abstraction: The high-level control layer
  • Implementation: The low-level operations
  • The abstraction contains a reference to an implementation
  
  Use Cases:
  • When you want to avoid a permanent binding between an abstraction and its implementation
  • When both abstraction and implementation may vary independently
  • To eliminate code duplication across multiple classes that share similar functionality`,
            completed: false
        },
        {
            title: 'Structure of the Bridge Pattern',
            content: `The pattern involves four main participants:
  1. Abstraction – defines the abstraction's interface and maintains a reference to the implementor
  2. RefinedAbstraction – extends the abstraction interface
  3. Implementor – defines the interface for implementation classes
  4. ConcreteImplementor – implements the Implementor interface
  
  This separation allows flexibility in switching or extending either abstraction or implementation without affecting the other.`,
            completed: false
        },
        {
            title: 'Implementation Example',
            content: `Here's how the Bridge pattern can be implemented in TypeScript:`,
            code: `// Implementor interface
  interface Device {
    isEnabled(): boolean;
    enable(): void;
    disable(): void;
    setVolume(volume: number): void;
    getVolume(): number;
  }
  
  // Concrete Implementor
  class Radio implements Device {
    private enabled = false;
    private volume = 50;
  
    isEnabled(): boolean {
      return this.enabled;
    }
  
    enable(): void {
      this.enabled = true;
      console.log('Radio enabled');
    }
  
    disable(): void {
      this.enabled = false;
      console.log('Radio disabled');
    }
  
    setVolume(volume: number): void {
      this.volume = volume;
    }
  
    getVolume(): number {
      return this.volume;
    }
  }
  
  // Abstraction
  class RemoteControl {
    protected device: Device;
  
    constructor(device: Device) {
      this.device = device;
    }
  
    togglePower(): void {
      if (this.device.isEnabled()) {
        this.device.disable();
      } else {
        this.device.enable();
      }
    }
  
    volumeDown(): void {
      this.device.setVolume(this.device.getVolume() - 10);
    }
  
    volumeUp(): void {
      this.device.setVolume(this.device.getVolume() + 10);
    }
  }
  
  // Refined Abstraction
  class AdvancedRemote extends RemoteControl {
    mute(): void {
      this.device.setVolume(0);
    }
  }
  
  // Client code
  const radio = new Radio();
  const remote = new AdvancedRemote(radio);
  remote.togglePower();
  remote.volumeUp();
  remote.mute();`,
            completed: false
        },
        {
            title: 'Real-World Example',
            content: `A good real-world example of the Bridge pattern is a universal remote control. The remote (abstraction) can work with any device (TV, radio, etc.) as long as it follows the same interface (implementor). This allows you to add new devices without modifying the remote's abstraction layer.`,
            completed: false
        },
        {
            title: 'Best Practices and Considerations',
            content: `Best Practices:
  • Use interfaces or abstract classes to separate abstraction and implementation
  • Favor composition over inheritance
  • Keep abstraction and implementation layers loosely coupled
  
  Considerations:
  • Introduces additional complexity
  • Best suited when you expect both abstraction and implementation to vary
  
  Avoid:
  • Overengineering for simple problems
  • Tight coupling between the abstraction and implementation layers
  
  Benefits:
  • Improved code maintainability and flexibility
  • Promotes open/closed principle
  • Reduces the number of classes in complex hierarchies`,
            completed: false
        }
    ],
    questions: [
        {
            id: 'bridge-1',
            text: 'What is the primary purpose of the Bridge pattern?',
            options: [
                'To restrict a class to a single instance',
                'To clone complex objects',
                'To decouple an abstraction from its implementation',
                'To compose objects into tree structures'
            ],
            correctAnswer: 'To decouple an abstraction from its implementation',
            explanation: 'The Bridge pattern separates the abstraction from its implementation so that they can evolve independently.'
        },
        {
            id: 'bridge-2',
            text: 'Which of the following is a benefit of using the Bridge pattern?',
            options: [
                'Tightly couples implementation and abstraction',
                'Reduces flexibility in code',
                'Allows abstraction and implementation to vary independently',
                'Enforces compile-time implementation binding'
            ],
            correctAnswer: 'Allows abstraction and implementation to vary independently',
            explanation: 'The pattern allows changes in abstraction and implementation without affecting each other.'
        },
        {
            id: 'bridge-3',
            text: 'Which component defines the interface for implementation classes in the Bridge pattern?',
            options: [
                'Abstraction',
                'ConcreteAbstraction',
                'Implementor',
                'Client'
            ],
            correctAnswer: 'Implementor',
            explanation: 'The Implementor defines the interface for all implementation classes in the Bridge pattern.'
        },
        {
            id: 'bridge-4',
            text: 'What is the preferred composition relationship used in the Bridge pattern?',
            options: [
                'Aggregation',
                'Inheritance',
                'Composition (has-a)',
                'Delegation'
            ],
            correctAnswer: 'Composition (has-a)',
            explanation: 'The abstraction maintains a reference to the implementor, favoring composition over inheritance.'
        },
        {
            id: 'bridge-5',
            text: 'Which of the following is NOT a reason to use the Bridge pattern?',
            options: [
                'You want to reduce class hierarchy complexity',
                'You want to tightly couple client code with device-specific logic',
                'You want to vary abstraction and implementation independently',
                'You want to separate high-level logic from platform-specific operations'
            ],
            correctAnswer: 'You want to tightly couple client code with device-specific logic',
            explanation: 'The Bridge pattern promotes decoupling and flexibility, avoiding tight coupling.'
        }
    ]
};
