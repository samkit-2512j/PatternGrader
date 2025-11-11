import { singletonPattern } from '../data/singletonPattern';
import { factoryPattern } from '../data/factoryPattern'
import { builderPattern } from '../data/builderPattern';
import { prototypePattern } from '../data/prototypePattern';
import { abstractFactoryPattern } from '../data/abstractFactoryPattern';
import { adapterPattern } from '../data/adapterPattern';
import { bridgePattern } from '../data/bridgePattern';
import { compositePattern } from '../data/compositePattern';
import { decoratorPattern } from '../data/decoratorPattern';
import { facadePattern } from '../data/facadePattern';
import { observerPattern } from '../data/observerPattern';
import { strategyPattern } from '../data/strategyPattern';
import { commandPattern } from '../data/commandPattern';
import { statePattern } from '../data/statePattern';
import { templatePattern } from '../data/templatePattern';

export interface PatternProgress {
  userId: string;
  patternId: string;
  completedSections: string[];
  quizAnswers: { [key: string]: string };
  quizScore: number;
  isCompleted: boolean;
  lastUpdated: Date;
}

export interface Pattern {
  name: string;
  category: string;
  description: string;
  sections: {
    title: string;
    content: string;
    code?: string;
    completed: boolean;
  }[];
  questions: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

const patterns: { [key: string]: Pattern } = {
  singleton: singletonPattern,
  factory: factoryPattern,
  builder: builderPattern,
  proto: prototypePattern,
  abstract: abstractFactoryPattern,
  adapter: adapterPattern,
  bridge: bridgePattern,
  composite: compositePattern,
  decorator: decoratorPattern,
  facade: facadePattern,
  observer: observerPattern,
  strategy: strategyPattern,
  command: commandPattern,
  state: statePattern,
  template: templatePattern
};

// Mock user progress data
const mockUserProgress: { [key: string]: PatternProgress } = {
  'mock-user-123_singleton': {
    userId: 'mock-user-123',
    patternId: 'singleton',
    completedSections: ['Understanding the Singleton Pattern'],
    quizAnswers: {},
    quizScore: 0,
    isCompleted: false,
    lastUpdated: new Date()
  },
  'mock-user-123_factory': {
    userId: 'mock-user-123',
    patternId: 'factory',
    completedSections: [],
    quizAnswers: {},
    quizScore: 0,
    isCompleted: false,
    lastUpdated: new Date()
  }
};

export const patternService = {
  async getPattern(patternId: string): Promise<Pattern | null> {
    // Return static pattern data
    return patterns[patternId] || null;
  },

  async getUserProgress(userId: string, patternId: string): Promise<PatternProgress | null> {
    console.log(`Getting progress for user ${userId} on pattern ${patternId}`);

    // Return static progress or create new mock progress
    const key = `${userId}_${patternId}`;
    if (mockUserProgress[key]) {
      return mockUserProgress[key];
    }

    // Create new mock progress if not found
    const initialProgress: PatternProgress = {
      userId,
      patternId,
      completedSections: [],
      quizAnswers: {},
      quizScore: 0,
      isCompleted: false,
      lastUpdated: new Date()
    };

    mockUserProgress[key] = initialProgress;
    return initialProgress;
  },

  async updateSectionProgress(
    userId: string,
    patternId: string,
    sectionTitle: string,
    completed: boolean
  ): Promise<void> {
    console.log(`Updating section progress: ${sectionTitle} to ${completed}`);

    const key = `${userId}_${patternId}`;
    if (!mockUserProgress[key]) {
      await this.getUserProgress(userId, patternId);
    }

    if (completed) {
      if (!mockUserProgress[key].completedSections.includes(sectionTitle)) {
        mockUserProgress[key].completedSections.push(sectionTitle);
      }
    } else {
      mockUserProgress[key].completedSections = mockUserProgress[key].completedSections.filter(
        title => title !== sectionTitle
      );
    }

    mockUserProgress[key].lastUpdated = new Date();
  },

  async submitQuiz(
    userId: string,
    patternId: string,
    answers: { [key: string]: string }
  ): Promise<number> {
    console.log(`Submitting quiz for pattern ${patternId}:`, answers);

    const pattern = await this.getPattern(patternId);
    if (!pattern) return 0;

    let score = 0;
    const totalQuestions = pattern.questions.length;

    // Calculate score
    pattern.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    // Update mock progress data
    const key = `${userId}_${patternId}`;
    if (mockUserProgress[key]) {
      mockUserProgress[key].quizAnswers = answers;
      mockUserProgress[key].quizScore = score;
      mockUserProgress[key].isCompleted = score / totalQuestions >= 0.7;
      mockUserProgress[key].lastUpdated = new Date();
    }

    return score;
  }
};