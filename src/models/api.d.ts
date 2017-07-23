type PlayerCategory = 'regular' | 'playoffs' | 'qualifiers';
type PlayerGender = 'men' | 'women';

interface ICountOptions {
    category: PlayerCategory;
    gender: PlayerGender;
    filterExpressions?: any[];
    playerSearchByName?: string;
}

interface IDataOptions extends ICountOptions {
    maximumRows: number;
    startIndex?: number;
    sortExpressions?: string;
}
