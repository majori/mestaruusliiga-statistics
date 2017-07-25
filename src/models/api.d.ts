type PlayerCategory = 'regular' | 'playoffs' | 'qualifiers';
type PlayerGender = 'men' | 'women';

type PlayerOptions = {
    category: PlayerCategory;
    gender: PlayerGender;
}

declare enum GenderEnum {
    men = 'men',
    women = 'women'
}

declare enum CategoryEnum {
    regular = 'regular',
    playoffs = 'playoffs',
    qualifiers = 'qualifiers'
}

interface ICountOptions {
    options: PlayerOptions;
    filterExpressions?: any[];
    playerSearchByName?: string;
}

interface IDataOptions extends ICountOptions {
    maximumRows: number;
    startIndex?: number;
    sortExpressions?: string;
}

type SearchParams = { [key: string]: string | number | { min: number; max: number} }
