interface ICountOptions {
    category: 'regular' | 'playoffs' | 'qualifiers';
    gender: 'men' | 'women';
    filterExpressions?: any[];
    playerSearchByName?: string;
}

interface IDataOptions extends ICountOptions {
    maximumRows: number;
    startIndex?: number;
    sortExpressions?: string;
}
