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
  topicDetailsId?: number
}

export class Answer {
  answer: string;
  type: string;
  answerOption: string;
  noOfCorrectAnswer: number
}

export class QuestionLine {
  questionLn: string;
  format: string
}

export class Problem {
  rank: number;
  questionHeading: string;
  questionSubHeading: string;
  picturePath: string;
  questionLines: QuestionLine[];
  answer: Answer;
  geometryObject: any
}
