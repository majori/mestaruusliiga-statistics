interface MatchPoints {
    home: TeamPoints;
    guest: TeamPoints;
}

interface TeamPoints {
    name: string,
    roundsWon: number,
    scores: number[],
    golden: string
}
