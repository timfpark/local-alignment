type SimularityFunction = (e1: any, e2: any) => number;

function* enumerate(sequence: any[]) {
    // index starts at 1 because 0th column is used for initial values.
    let index = 1;

    for (const element of sequence) {
        yield [index, element];
        index += 1;
    }
}

interface IScoringCell {
    row: number;
    column: number;
    score: number;
    anticedent: IScoringCell | undefined;
}

interface IAlignment {
    start: number | undefined;
    finish: number | undefined;
    score: number | undefined;
    entries: any[];
}

function createScoringMatrix(rows: number, columns: number): IScoringCell[][] {
    const scoringMatrix = [];
    for (let row = 0; row <= rows; row += 1) {
        const scoringRow = [];
        for (let column = 0; column <= columns; column += 1) {
            const scoringCell: IScoringCell = {
                row,
                column,
                score: 0,
                anticedent: undefined
            };

            scoringRow.push(scoringCell);
        }

        scoringMatrix.push(scoringRow);
    }

    return scoringMatrix;
}

function buildScoringMatrix(A: any[], B: any[], simularity: SimularityFunction) {
    const scoringMatrix: IScoringCell[][] = createScoringMatrix(A.length, B.length);

    let largestCell: IScoringCell = {
        row: 0,
        column: 0,
        score: 0,
        anticedent: undefined
    };

    // a = element of s1 at s1[row]
    // b = element of s2 at s2[column]
    for (const [row, a] of enumerate(A)) {
        for (const [column, b] of enumerate(B)) {
            const cell = scoringMatrix[row][column];

            // compute H(i - 1, j - 1) + s(a,b)
            const diagScore = scoringMatrix[row - 1][column - 1].score + simularity(a, b);

            // compute H(i - 1, j) + s(a, _)
            const upperScore = scoringMatrix[row - 1][column].score + simularity(a, undefined);

            // compute H(i, j - 1) + s(_, b)
            const leftScore = scoringMatrix[row][column - 1].score + simularity(undefined, b);

            const score = Math.max(diagScore, upperScore, leftScore, 0.0);

            // console.log(`processing ${row}, ${column}: diagScore: ${diagScore} upperScore: ${upperScore} leftScore: ${leftScore} score: ${score}`);

            if (score === diagScore) {
                cell.anticedent = scoringMatrix[row - 1][column - 1];
            } else if (score === upperScore) {
                cell.anticedent = scoringMatrix[row - 1][column];
            } else if (score === leftScore) {
                cell.anticedent = scoringMatrix[row][column - 1];
            } else { // 0 case
                cell.anticedent = undefined;
            }

            cell.score = score;

            if (cell.score > largestCell.score) {
                largestCell = cell;
            }
        }
    }

    return { scoringMatrix, largestCell };
}

function backtraceScoringMatrix(A: any[], B: any[], largestCell: IScoringCell) {
    // backtrace path
    let currentCell: IScoringCell | undefined = largestCell;
    const alignmentA: IAlignment = {
        start: undefined,
        finish: undefined,
        score: undefined,
        entries: []
    };

    const alignmentB: IAlignment = {
        start: undefined,
        finish: undefined,
        score: undefined,
        entries: []
    };

    while (currentCell) {
        const nextCell: IScoringCell | undefined = currentCell.anticedent;

        if (!nextCell) {
            break;
        }

        if (!alignmentA.finish) {
            alignmentA.finish = currentCell.row - 1;
            alignmentA.score = currentCell.score;
        }

        alignmentA.start = currentCell.row - 1;

        if (!alignmentB.finish) {
            alignmentB.finish = currentCell.column - 1;
            alignmentB.score = currentCell.score;
        }

        alignmentB.start = currentCell.column - 1;

        if (nextCell.row !== currentCell.row) {
            alignmentA.entries.unshift(A[currentCell.row - 1]);
        } else {
            alignmentA.entries.unshift(undefined);
        }

        if (nextCell.column !== currentCell.column) {
            alignmentB.entries.unshift(B[currentCell.column - 1]);
        } else {
            alignmentB.entries.unshift(undefined);
        }

        currentCell = nextCell;
    }

    return [ alignmentA, alignmentB ];

}

export default function localAlignment(A: any[], B: any[], simularity: SimularityFunction) {
    const { scoringMatrix, largestCell } = buildScoringMatrix(A, B, simularity);

    return backtraceScoringMatrix(A, B, largestCell);
}
