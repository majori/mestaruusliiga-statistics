interface PlayerStatistic extends BaseStatistic {
    ImageUrl?: string;
    Captain: boolean;
}

interface RawStatistic extends BaseStatistic {
    __type: string;
    PlayerSurnameName: string; // HTML String
    Captain: boolean;
}

interface CacheStatistic extends BaseStatistic {
    Captain: 0 | 1; // Redis does not allow booleans
}

interface BaseStatistic {
    PlayerMatchID: number;
    RankingTypeID: number;
    ChampionshipMatchID: number;
    ChampionshipID: number;
    TeamID: number;
    PlayerID: number;
    PositionID: number;

    PointsTot_ForAllPlayerStats: number;
    SpikePerf: string; // Percent (xx %)
    SpikePos: string; // Percent (xx %)
    RecPos: string; // Percent (xx %)
    RecPerf: string; // Percent (xx %)
    PointsW_P: number;
    Libero: number;
    SpikeTot: number;
    RecTot: number;
    PlayedMatches: number;
    PlayedSet: number;
    SpikeWin_MatchWin: number;
    SpikeWin_MatchLose: number;
    BlockWin_MatchWin: number;
    BlockWin_MatchLose: number;
    ServeWin_MatchWin: number;
    ServeWin_MatchLose: number;
    RecEffPerc: number;
    RecWinPerc: number;
    ServeWinMatch: number;
    ServeWinSet: number;
    BlockWinSet: number;
    SpikerEff: number;
    SpikerPos: number;
    SpikerPerSet: number;
    PointsTot: number;
    MatchName: string;
    PointsPerMatch: number;
    PointsPerSet: number;
    PlayerSetData: string; // ?
    PlayedSets: number;
    Points: number;
    SideOut: number;
    ServeErr: number;
    ServeWin: number;
    ServeMinus: number;
    ServePlus: number;
    ServeHP: number;
    ServeEx: number;
    RecErr: number;
    RecWin: number;
    RecMinus: number;
    RecPlus: number;
    RecHP: number;
    RecEx: number;
    SpikeErr: number;
    SpikeWin: number;
    SpikeMinus: number;
    SpikePlus: number;
    SpikeHP: number;
    SpikeEx: number;
    BlockErr: number;
    BlockWin: number;
    BlockMinus: number;
    BlockPlus: number;
    BlockHP: number;
    BlockEx: number;

    Number: number;
    Vote: number;
    Surname: string;
    Name: string;
    Team: string;
    Match: string;
}