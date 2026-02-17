export interface Attempt {
  topic: string;
  concept: string;
  importance: "A" | "B" | "C";
  difficulty: "H" | "M" | "E";
  type: "Theory" | "Practical";
  case_based: boolean;
  correct: boolean;
  marks: number;
  neg_marks: number;
  expected_time_sec: number;
  time_spent_sec: number;
  marked_review: boolean;
  revisits: number;
}

export interface SQIPayload {
  student_id: string;
  overall_sqi: number;
  topic_scores: { topic: string; sqi: number }[];
  concept_scores: { topic: string; concept: string; sqi: number }[];
  ranked_concepts_for_summary: {
    topic: string;
    concept: string;
    weight: number;
    reasons: string[];
  }[];
  metadata: {
    diagnostic_prompt_version: string;
    computed_at: string;
    engine: string;
  };
}