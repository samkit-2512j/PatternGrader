export const observerPattern = {
    name: 'Observer Pattern',
    category: 'behavioral-patterns',
    description: 'The Observer Pattern defines a one-to-many dependency between objects, where a state change in one object automatically notifies all dependent objects.',
    sections: [
        {
            title: 'Understanding the Observer Pattern',
            content: `The Observer Pattern is a behavioral design pattern that allows one object (the subject) to notify multiple dependent objects (observers) of any changes to its state, without needing to know who or what those observers are. This pattern is commonly used in event handling systems, where the subject is the event source and observers are the listeners or handlers.
  
  Key Concepts:
  • Subject: The object that maintains a list of observers and notifies them of state changes.
  • Observer: The object that subscribes to the subject and receives updates when the subject's state changes.
  • ConcreteObserver: A concrete implementation of the observer that reacts to the notifications.
  
  Use Cases:
  • Event-driven systems (e.g., user interface components, game engines)
  • Implementing publish-subscribe systems
  • Real-time systems (e.g., stock price notifications, news updates)`,
            completed: false
        },
        {
            title: 'Structure of the Observer Pattern',
            content: `The Observer Pattern typically involves the following participants:
  1. Subject (Observable): The object whose state is being observed. It maintains a list of observers and provides methods to add, remove, or notify observers.
  2. Observer: The objects that are interested in changes to the subject. They register themselves with the subject and react to state changes.
  3. ConcreteSubject: A specific implementation of the subject that holds the state to be monitored and notifies observers when it changes.
  4. ConcreteObserver: A specific implementation of the observer that reacts to notifications from the subject.
  
  In practice, when the state of the subject changes, it triggers a notification to all observers that have registered interest in the subject's state.`,
            completed: false
        },
        {
            title: 'Implementation Example',
            content: `Here's a TypeScript example to demonstrate the Observer Pattern:`,
            code: `// Observer Interface
  interface Observer {
    update(state: string): void;
  }
  
  // Subject Interface
  interface Subject {
    addObserver(observer: Observer): void;
    removeObserver(observer: Observer): void;
    notifyObservers(): void;
  }
  
  // Concrete Subject
  class NewsAgency implements Subject {
    private observers: Observer[] = [];
    private news: string = '';
  
    public addObserver(observer: Observer): void {
      this.observers.push(observer);
    }
  
    public removeObserver(observer: Observer): void {
      this.observers = this.observers.filter(o => o !== observer);
    }
  
    public notifyObservers(): void {
      for (let observer of this.observers) {
        observer.update(this.news);
      }
    }
  
    public setNews(news: string): void {
      this.news = news;
      this.notifyObservers(); // Notify observers of the state change
    }
  }
  
  // Concrete Observer
  class NewsChannel implements Observer {
    private name: string;
  
    constructor(name: string) {
      this.name = name;
    }
  
    public update(state: string): void {
      console.log(\`\${this.name} received news: \${state}\`);
    }
  }
  
  // Client Code
  const newsAgency = new NewsAgency();
  const channel1 = new NewsChannel('Channel 1');
  const channel2 = new NewsChannel('Channel 2');
  
  newsAgency.addObserver(channel1);
  newsAgency.addObserver(channel2);
  
  newsAgency.setNews('Breaking News: Observer Pattern Implemented!');
  newsAgency.setNews('More Updates: Design Patterns in Software Engineering!');`,
            completed: false
        },
        {
            title: 'Real-World Example',
            content: `A real-world example of the Observer pattern is seen in a weather station. The weather station acts as the subject and sends updates (like temperature, humidity, etc.) to various devices such as smartphones, desktops, and weather apps. When the weather changes, all subscribed devices (observers) are notified with the updated information.`,
            completed: false
        },
        {
            title: 'Best Practices and Considerations',
            content: `Best Practices:
  • Ensure that observers are properly removed to prevent memory leaks.
  • Use the Observer pattern in situations where you have multiple subscribers that need to be notified of state changes.
  • Keep observers independent of one another to avoid tight coupling.
  
  Considerations:
  • Use the Observer pattern judiciously to avoid unnecessary complexity, especially if there are only a few objects that need to be notified.
  • The number of observers can grow dynamically, and this could impact performance if not managed correctly.
  
  Avoid:
  • Failing to unsubscribe observers when they are no longer needed, which could cause memory leaks in a long-running application.`,
            completed: false
        }
    ],
    questions: [
        {
            id: 'observer-1',
            text: 'What is the main purpose of the Observer pattern?',
            options: [
                'To define a one-to-one relationship between objects',
                'To define a one-to-many dependency between objects',
                'To allow objects to communicate synchronously',
                'To allow a single object to notify all other objects at once'
            ],
            correctAnswer: 'To define a one-to-many dependency between objects',
            explanation: 'The Observer pattern defines a one-to-many relationship where one object (subject) notifies multiple dependent objects (observers) when its state changes.'
        },
        {
            id: 'observer-2',
            text: 'Which of the following is NOT a participant in the Observer pattern?',
            options: [
                'Subject',
                'Observer',
                'ConcreteObserver',
                'Mediator'
            ],
            correctAnswer: 'Mediator',
            explanation: 'The Mediator pattern is a separate pattern used for object interaction. In the Observer pattern, the participants include Subject, Observer, ConcreteObserver, and ConcreteSubject.'
        },
        {
            id: 'observer-3',
            text: 'Which of the following is a typical use case for the Observer pattern?',
            options: [
                'Event-driven systems',
                'Single object interaction',
                'Singleton object management',
                'Prototype object creation'
            ],
            correctAnswer: 'Event-driven systems',
            explanation: 'The Observer pattern is commonly used in event-driven systems, where multiple observers need to react to changes in the subject or event source.'
        },
        {
            id: 'observer-4',
            text: 'What happens when the state of the subject changes in the Observer pattern?',
            options: [
                'The observers are notified and update themselves',
                'The subject is destroyed and a new one is created',
                'The subject changes all the observers’ states simultaneously',
                'The subject waits until the next update cycle to notify the observers'
            ],
            correctAnswer: 'The observers are notified and update themselves',
            explanation: 'When the state of the subject changes, it notifies all the registered observers, and each observer updates its state based on the change.'
        },
        {
            id: 'observer-5',
            text: 'What is a potential downside of using the Observer pattern?',
            options: [
                'Observers may not receive notifications if they are not registered properly',
                'It can lead to tight coupling between the subject and observers',
                'It is difficult to implement if there are multiple subjects involved',
                'Memory leaks may occur if observers are not unsubscribed'
            ],
            correctAnswer: 'Memory leaks may occur if observers are not unsubscribed',
            explanation: 'If observers are not properly unsubscribed from the subject when they are no longer needed, it can result in memory leaks as the observers continue to hold references to the subject.'
        }
    ]
};
