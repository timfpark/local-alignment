import localAlignment from "./localAlignment";

function simpleSim(a: number | undefined, b: number | undefined) {
    if (!a || !b || a !== b) {
        return -1;
    }

    return 2;
}

describe("localAlignment", () => {
    it("can do an alignment", async () => {
        const A = [1, 2, 3, 8, 10, 11, 12, 13];
        const B = [8, 10];

        const alignments = localAlignment(A, B, simpleSim);

        expect(alignments.length).toBe(2);
        expect(alignments[0]).not.toBeUndefined();
        expect(alignments[1]).not.toBeUndefined();

        const alignmentA = alignments[0];
        expect(alignmentA.score).toBe(4);
        expect(alignmentA.entries).toEqual([8, 10]);

        const alignmentB = alignments[0];
        expect(alignmentB.score).toBe(4);
        expect(alignmentB.entries).toEqual([8, 10]);
    });
});
