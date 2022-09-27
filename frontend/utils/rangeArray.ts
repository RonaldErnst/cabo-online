const rangeArray = (start: number, end: number): number[] => {
    return [...Array.from(Array(end - start + 1).keys())].map(x => x + start);
}

export default rangeArray;