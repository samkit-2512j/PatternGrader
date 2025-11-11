export const compositePattern = {
    name: 'Composite Pattern',
    category: 'structural-patterns',
    description: 'The Composite Pattern allows you to compose objects into tree-like structures to represent part-whole hierarchies.',
    sections: [
        {
            title: 'Understanding the Composite Pattern',
            content: `The Composite Pattern is a structural pattern that allows you to treat individual objects and composites (objects made up of other objects) uniformly. It is especially useful for representing part-whole hierarchies, such as file systems, organizational structures, and graphical objects.
  
  Key Concepts:
  • Component: Defines the common interface for both leaf and composite objects
  • Leaf: Represents the individual objects (e.g., file)
  • Composite: Represents the composite objects (e.g., folders or groupings of files)
  
  The Composite pattern enables you to manage individual objects and their compositions in the same way, simplifying client code.
  
  Use Cases:
  • File systems (folders and files)
  • Graphic systems (shapes and groups of shapes)
  • Organizational hierarchies (employees and departments)
  • UI components (buttons, panels, and containers)`,
            completed: false
        },
        {
            title: 'Structure of the Composite Pattern',
            content: `The pattern involves the following participants:
  1. Component – an interface or abstract class that defines the common methods for leaf and composite objects.
  2. Leaf – an object that has no children and implements the Component interface.
  3. Composite – an object that contains child components (either leaves or other composites).
  4. Client – uses the Component interface to work with both Leaf and Composite objects.
  
  The key idea is that both leaf and composite objects are treated uniformly through the Component interface, making it easy to handle complex tree structures.`,
            completed: false
        },
        {
            title: 'Implementation Example',
            content: `Here’s a TypeScript example to demonstrate the Composite Pattern:`,
            code: `// Component
  interface Graphic {
    draw(): void;
  }
  
  // Leaf
  class Circle implements Graphic {
    draw(): void {
      console.log('Drawing a Circle');
    }
  }
  
  class Square implements Graphic {
    draw(): void {
      console.log('Drawing a Square');
    }
  }
  
  // Composite
  class Group implements Graphic {
    private graphics: Graphic[] = [];
  
    add(graphic: Graphic): void {
      this.graphics.push(graphic);
    }
  
    remove(graphic: Graphic): void {
      const index = this.graphics.indexOf(graphic);
      if (index > -1) {
        this.graphics.splice(index, 1);
      }
    }
  
    draw(): void {
      console.log('Drawing Group:');
      this.graphics.forEach(graphic => graphic.draw());
    }
  }
  
  // Client code
  const circle1 = new Circle();
  const square1 = new Square();
  const circle2 = new Circle();
  const group = new Group();
  
  group.add(circle1);
  group.add(square1);
  group.add(circle2);
  
  group.draw(); // Drawing Group: Circle, Square, Circle`,
            completed: false
        },
        {
            title: 'Real-World Example',
            content: `A good real-world example of the Composite pattern is a graphical user interface (GUI) where elements such as buttons, text boxes, and labels can be grouped into containers (like panels or windows). These containers can be treated as single components, simplifying the client code that interacts with the UI structure.`,
            completed: false
        },
        {
            title: 'Best Practices and Considerations',
            content: `Best Practices:
  • Use the Composite pattern when you need to treat individual objects and compositions of objects uniformly.
  • Ensure that the Component interface is designed carefully to accommodate both leaf and composite objects.
  • Keep the Composite class flexible so that it can handle varying numbers of children.
  
  Considerations:
  • The Composite pattern can increase the complexity of the code due to its recursive structure.
  • It may lead to inefficient structures when too many objects are involved, as it can make traversal more expensive.
  
  Avoid:
  • Overusing the pattern for simple cases, as the added complexity may not be necessary.
  • Making the Composite structure too deep or complicated, leading to performance issues.`,
            completed: false
        }
    ],
    questions: [
        {
            id: 'composite-1',
            text: 'What is the main benefit of using the Composite pattern?',
            options: [
                'It simplifies the management of part-whole hierarchies',
                'It ensures objects cannot be added to a collection',
                'It allows for easier debugging of tree-like structures',
                'It provides a way to clone complex objects'
            ],
            correctAnswer: 'It simplifies the management of part-whole hierarchies',
            explanation: 'The Composite pattern allows for easy management of part-whole hierarchies by treating both individual and composite objects uniformly.'
        },
        {
            id: 'composite-2',
            text: 'Which of the following is NOT a participant in the Composite pattern?',
            options: [
                'Component',
                'Leaf',
                'Composite',
                'Handler'
            ],
            correctAnswer: 'Handler',
            explanation: 'Handler is not a participant in the Composite pattern. The key participants are Component, Leaf, Composite, and Client.'
        },
        {
            id: 'composite-3',
            text: 'What is a Leaf in the context of the Composite pattern?',
            options: [
                'An object that contains other objects',
                'An object that has no children and implements the Component interface',
                'An object that manages the drawing of all components',
                'An object that defines the operations on its children'
            ],
            correctAnswer: 'An object that has no children and implements the Component interface',
            explanation: 'A Leaf object is an individual object in the Composite pattern that does not contain any child objects and directly implements the Component interface.'
        },
        {
            id: 'composite-4',
            text: 'What is the role of the Composite class in the Composite pattern?',
            options: [
                'It defines the common interface for all objects',
                'It represents a part of a hierarchy and contains child objects',
                'It provides the operations for drawing individual objects',
                'It implements the operations for all leaf objects'
            ],
            correctAnswer: 'It represents a part of a hierarchy and contains child objects',
            explanation: 'The Composite class is responsible for holding and managing child objects in a part-whole hierarchy and provides operations that apply to its children.'
        },
        {
            id: 'composite-5',
            text: 'In the Composite pattern, how are individual objects and compositions of objects treated?',
            options: [
                'They are treated differently based on their type',
                'They are treated uniformly through the same interface',
                'Individual objects are treated as leaf nodes only',
                'Compositions are treated as special cases'
            ],
            correctAnswer: 'They are treated uniformly through the same interface',
            explanation: 'In the Composite pattern, both individual objects (leaves) and compositions of objects (composites) are treated uniformly through the Component interface, making the client code simpler.'
        }
    ]
};
