export interface RevisionScore {
	sha: string;
	score: number;
	timestamp: number;
}

export interface ComparisonResult {
	winner: string | null;
	delta: number;
	regression: boolean;
	older: RevisionScore;
	newer: RevisionScore;
}

export function compareRevisions(a: RevisionScore, b: RevisionScore): ComparisonResult {
	const [older, newer] = a.timestamp < b.timestamp ? [a, b] : [b, a];
	const delta = Math.abs(a.score - b.score);

	if (a.score === b.score) {
		return { winner: null, delta: 0, regression: false, older, newer };
	}

	const winner = a.score > b.score ? a.sha : b.sha;
	const regression = newer.score < older.score;

	return { winner, delta, regression, older, newer };
}
