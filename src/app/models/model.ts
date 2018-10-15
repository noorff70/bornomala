export class Grade {
  gradeName: string;
  gradeId: number;
  subjects: Subject[];
}

export class Subject {
  subjectName: string;
  id: number
}

export class GradeSubject {
  gradeId: number;
  subjectId: number;
  subjectName: string
}

export class Topic {
  topicName?: string;
  topicDetail?: TopicDetail[];
}

export class TopicDetail {
  topicDetailName?: string;
  topicDetailsId?: number;
  topicName: string;
}

export class Answer {
  answer: string;
  type: string;
  answerOption: string;
  noOfCorrectAnswer: number;
  answerList: string[]
}

export class QuestionLine {
  questionLn: string;
  format: string;
  latexFormat: string
}

export class AnswerLine {
  answerLn: string;
  format: string
}

export class Problem {
  rank: number;
  questionHeading: string;
  questionSubHeading: string;
  picturePath: string;
  questionLines: QuestionLine[];
  answer: Answer;
  geometryObject: any;
  questionType: any
}

export class MultipleQuestion {
  question: string;
  answer: string;
  label: string;
  lookAndFeel: string;
}

export class Score{
  correct: number;
  wrong: number;
  total: number;
  remaining: number;
}

export class Lesson {
  lessonHeader: string;
  lessonBody: string;
}