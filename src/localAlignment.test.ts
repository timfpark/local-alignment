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

        expect(alignments.A).not.toBeUndefined();
        expect(alignments.B).not.toBeUndefined();
    });

});
