interface ICountOptions {
    compID: number,
    phaseID: number,
    filterExpressions?: any[],
    playerSearchByName?: string,
}

interface IDataOptions extends ICountOptions {
    maximumRows: number;
    startIndex?: number;
    sortExpressions?: string;
}
