export type Age = '0-6' | '7-12' | '13-17' | 'Adult';

export interface BibleContent {
  id: string; // Unique identifier for this verse + age combination
  verseRef: string;
  ageGroup: Age;
  content: {
    summary: string;
    story: string;
    lesson: string;
    prayer: string;
    activities: string[];
    questions: string[];
  };
  fromCache?: boolean; // Track if content was retrieved from storage
  createdAt: Date;
  updatedAt: Date;
}

export interface AgeGroup {
  age: Age;
  label: string;
  description: string;
  color: string;
  imageFolder: string;
  currentImage: string;
}

export interface AIGenerationRequest {
  verseRef: string;
  ageGroup: Age;
  ageDescription: string;
}
