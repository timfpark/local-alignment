# local-alignment

Performs local sequence alignment between two arrays of arbitrary type using the Smith-Waterman algorithm.

This algorithm is often utilized in bioinformatics to do alignment between two sequenced DNA segments. Local alignment signifies that
the algorithm strives to find the largest subsequence in the two arrays that be aligned subject to a similarity function
(versus a global alignment between the entirety of both arrays where large subsegments might vary greatly).

## Installation

```shell
npm install --save local-alignment
```

## Usage

```javascript
import { localAlignment } from "local-alignment";

function simularity(a: number | undefined, b: number | undefined) {
    if (!a || !b || a !== b) {
        return -1;
    }

    return 2;
}

const A = [1, 2, 3, 8, 10, 11, 12, 13];
const B = [8, 10];

const alignments = localAlignment(A, B, simularity);

// alignments is
// {"A":{"start":3,"finish":4,"entries":[8,10]},"B":{"start":0,"finish":1,"entries":[8,10]}}

const A = [7, 8, 9, 10, 11];
const B = [8, 10];

const alignments = localAlignment(A, B, simularity);

// alignments is
// {"A":{"start":1,"finish":3,"entries":[8,9,10]},"B":{"start":0,"finish":1,"entries":[8,null,10]}}
```

For more usage examples, see the tests.
