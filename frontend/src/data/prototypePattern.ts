export const prototypePattern = {
    name: 'Prototype Pattern',
    category: 'creational-patterns',
    description: 'The Prototype Pattern allows you to create new objects by copying an existing object (a prototype), rather than creating new instances from scratch.',
    sections: [
        {
            title: 'Understanding the Prototype Pattern',
            content: `The Prototype Pattern is a creational design pattern that enables object creation by cloning an existing object, known as the prototype. Instead of instantiating a class directly, you make a copy of an existing object that serves as a prototype.
  
  Key Concepts:
  • Avoids the cost of creating new objects from scratch
  • Useful when object creation is expensive or complex
  • Cloning can be shallow or deep
  • Cloned objects can be customized after copying
  
  Common Use Cases:
  1. Object initialization is expensive (e.g., parsing or setup)
  2. You want to decouple client code from concrete classes
  3. Need to preserve object structure while creating variations`,
            completed: false
        },
        {
            title: 'Key Characteristics',
            content: `Core elements of the Prototype pattern include:
  
  1. Prototype Interface
     • Declares a clone method to be implemented
     • Typically named 'clone' or 'cloneSelf'
  
  2. Concrete Prototype
     • Implements the clone method
     • Performs the cloning logic (shallow or deep copy)
  
  3. Client
     • Uses the prototype's clone method to create new objects
  
  Benefits:
  • Reduces subclassing
  • Improves performance for expensive object creation
  • Hides the complexity of object construction
  
  Drawbacks:
  • Cloning complexity if object graph is deep
  • Maintaining prototype integrity (e.g., cyclic references)`,
            completed: false
        },
        {
            title: 'Implementation Example',
            content: 'Here is a basic implementation of the Prototype Pattern in TypeScript:',
            code: `interface Prototype<T> {
    clone(): T;
  }
  
  class Person implements Prototype<Person> {
    constructor(
      public name: string,
      public age: number,
      public address: { city: string, country: string }
    ) {}
  
    clone(): Person {
      return new Person(
        this.name,
        this.age,
        { ...this.address } // Shallow copy
      );
    }
  }
  
  // Usage
  const original = new Person('Alice', 30, { city: 'New York', country: 'USA' });
  const copy = original.clone();
  
  console.log(copy); // New object with same values
  console.log(original === copy); // false - different instances
  console.log(original.address === copy.address); // false - shallow cloned address`,
            completed: false
        },
        {
            title: 'Real-World Example',
            content: `A practical use of the Prototype pattern could be in creating graphical UI elements with shared base styles or settings.`,
            code: `class Shape {
    constructor(public type: string, public color: string) {}
  }
  
  class ShapePrototype implements Prototype<ShapePrototype> {
    constructor(public shape: Shape) {}
  
    clone(): ShapePrototype {
      return new ShapePrototype(
        new Shape(this.shape.type, this.shape.color)
      );
    }
  }
  
  // Client
  const circle = new ShapePrototype(new Shape('circle', 'blue'));
  const redCircle = circle.clone();
  redCircle.shape.color = 'red';
  
  console.log(circle.shape.color); // blue
  console.log(redCircle.shape.color); // red`,
            completed: false
        },
        {
            title: 'Best Practices and Considerations',
            content: `When using the Prototype pattern, follow these guidelines:
  
  Best Practices:
  • Use when object creation is costly or complex
  • Use clone methods consistently across objects
  • Favor deep cloning if shared references are risky
  
  Considerations:
  • For deep cloning, consider using structuredClone (in modern JS) or external libraries like lodash
  • Ensure that circular references are handled properly
  • Avoid prototype misuse that leads to confusing object hierarchies
  
  Common Pitfalls:
  • Unintended shared state in shallow clones
  • Overuse where simpler instantiation would suffice
  • Lack of clarity about what clone does (document behavior)
  
  Modern JavaScript Tip:
  • JSON.parse(JSON.stringify(obj)) can be used for deep copying, but it doesn't handle methods, undefined, or complex objects like Date or RegExp.`,
            completed: false
        }
    ],
    questions: [
        {
            id: 'prototype-1',
            text: 'What is the main purpose of the Prototype pattern?',
            options: [
                'To create new objects by extending a base class',
                'To ensure that a class has only one instance',
                'To clone existing objects instead of creating new ones from scratch',
                'To encapsulate object construction logic'
            ],
            correctAnswer: 'To clone existing objects instead of creating new ones from scratch',
            explanation: 'The Prototype pattern is used to create new objects by copying existing ones (prototypes) rather than creating them anew.'
        },
        {
            id: 'prototype-2',
            text: 'Which method is central to the Prototype pattern?',
            options: [
                'initialize()',
                'getInstance()',
                'clone()',
                'build()'
            ],
            correctAnswer: 'clone()',
            explanation: 'The clone() method is the core of the Prototype pattern, used to create a copy of the prototype object.'
        },
        {
            id: 'prototype-3',
            text: 'What type of copy does NOT replicate nested object structures fully?',
            options: [
                'Shallow copy',
                'Deep copy',
                'Recursive copy',
                'Manual copy'
            ],
            correctAnswer: 'Shallow copy',
            explanation: 'A shallow copy duplicates the top-level structure only; nested objects are still shared references.'
        },
        {
            id: 'prototype-4',
            text: 'Which scenario is a good candidate for using the Prototype pattern?',
            options: [
                'Creating an object with multiple optional parameters',
                'Cloning an object to avoid expensive creation steps',
                'Enforcing a single global instance of a class',
                'Converting one interface into another'
            ],
            correctAnswer: 'Cloning an object to avoid expensive creation steps',
            explanation: 'Prototype is ideal when object creation is costly, and you want to duplicate an existing object instead.'
        },
        {
            id: 'prototype-5',
            text: 'What is a potential drawback of using the Prototype pattern?',
            options: [
                'Too much memory usage',
                'Excessive reliance on inheritance',
                'Complexity in managing object cloning (e.g., deep copies)',
                'Limited flexibility in object configuration'
            ],
            correctAnswer: 'Complexity in managing object cloning (e.g., deep copies)',
            explanation: 'Deep cloning can be complex, especially when dealing with nested objects or circular references.'
        }
    ]
};
