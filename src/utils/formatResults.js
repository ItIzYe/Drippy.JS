const pb = {
    le: '<:_le:1194078627353083945>',
    me: '<:_me:1194078620545712168>',
    re: '<:_re:1194078622621909092>',
    lf: '<:_lf:1194078628527472700>',
    mf: '<:_mf:1194078625021046824>',
    rf: '<:_rf:1194078623775338607>',
};

function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 14;
    const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
    const emptySquares = progressBarLength - filledSquares || 0;

    if (!filledSquares && !emptySquares) {
        let emptySquares = progressBarLength;
    }

    const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
    const downPercentage = (downvotes.length / totalVotes) * 100 || 0;

    const progressBar =
        (filledSquares ? pb.lf : pb.le) +
        (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
        (filledSquares === progressBarLength ? pb.rf : pb.re);

    const results = [];
    results.push(
        `👍 ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • 👎 ${
            downvotes.length
        } downvotes (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar);

    return results.join('\n');
}

module.exports = formatResults;