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
  topicName ?: string;
  topicDetail ?: TopicDetail[];
}

export class TopicDetail {
  topicDetailName ?: string;
  topicDetailsId ?: number
}
