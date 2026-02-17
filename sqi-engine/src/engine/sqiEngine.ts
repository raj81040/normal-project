import type { Attempt, SQIPayload } from "./types"


const WEIGHTS = {
    importance: { A: 1.0, B: 0.7, C: 0.5 },
    difficulty: { H: 1.4, M: 1.0, E: 0.6 },
    type: { Practical: 1.1, Theory: 1.0 }
} as const;

export const calculateSQI = (student_id: string, attempts: Attempt[], promptContext: string): SQIPayload => {
  const conceptStats = new Map<string, any>();

  attempts.forEach(attr => {
    const key = `${attr.topic}|${attr.concept}`;
    if (!conceptStats.has(key)) {
      conceptStats.set(key, { topic: attr.topic, concept: attr.concept, data: [] });
    }
    conceptStats.get(key).data.push(attr);
  });

  const concept_scores = Array.from(conceptStats.values()).map(group => {
    const d = group.data[0]; 
    
   
    let baseScore = d.correct ? 100 : 0;
    
    
    const timeRatio = d.time_spent_sec / d.expected_time_sec;
    if (timeRatio > 1.2) baseScore *= 0.8; 
    
  
    const impWeight = WEIGHTS.importance[d.importance as keyof typeof WEIGHTS.importance];
    const finalSqi = Number((baseScore * impWeight).toFixed(1));

    return { topic: d.topic, concept: d.concept, sqi: finalSqi };
  });

  const ranked_concepts = concept_scores.map(cs => {
    const stats = conceptStats.get(`${cs.topic}|${cs.concept}`);
    const d = stats.data[0];

   
    const errorFactor = d.correct ? 0 : 0.5; 
    const impFactor = d.importance === 'A' ? 0.25 : 0.1;
    const diagFactor = (100 - cs.sqi) / 100 * 0.15;
    
    const weight = Number((errorFactor + impFactor + diagFactor).toFixed(2));

    const reasons = [];
    if (!d.correct) reasons.push("Wrong earlier");
    if (d.importance === 'A') reasons.push("High importance (A)");
    if (cs.sqi < 70) reasons.push("Low diagnostic score");

    return {
      topic: cs.topic,
      concept: cs.concept,
      weight,
      reasons
    };
  }).sort((a, b) => b.weight - a.weight);

 
  const overall_sqi = Number((concept_scores.reduce((acc, curr) => acc + curr.sqi, 0) / concept_scores.length).toFixed(1));

  return {
    student_id,
    overall_sqi,
    topic_scores: [{ topic: "Borrowing Costs", sqi: overall_sqi }],
    concept_scores,
    ranked_concepts_for_summary: ranked_concepts,
    metadata: {
      diagnostic_prompt_version: "v1",
      computed_at: new Date().toISOString(),
      engine: "sqi-v0.1"
    }
  };
};