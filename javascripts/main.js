var __evalExpression__ = function(expression) {
    var fn = eval('(function() { return ' + expression + ' });');
    return fn();
};

var rEmit = {};
var rReduce = [];
var rFinalize = [];

function emit(key, val) {
    var k = JSON.stringify(key);
    rEmit[k] = rEmit[k] || [];
    rEmit[k].push(val);
}

function run(mrObj) {

    return function(src) {
        rEmit = {};
        rReduce = [];
        rFinalize = [];

        for (var s = 0; s < src.length; s++) {
            mrObj.map.call(src[s]);
        }

        for (var k in rEmit) {
            if (rEmit.hasOwnProperty(k)) {
                var key = JSON.parse(k);
                var reducedValue = mrObj.reduce.call(null, key, rEmit[k]);
                rReduce.push({
                    _id: key,
                    value: reducedValue
                });
            }
        }

        if (!mrObj.finalize) {
            return rReduce;
        }

        var rReduceClone = JSON.parse(JSON.stringify(rReduce));
        for (var f = 0; f < rReduceClone.length; f++) {
            var kv = rReduceClone[f];
            var finalizedValue = mrObj.finalize.call(null, kv._id, kv.value);
            rFinalize.push({
                _id: kv._id,
                value: finalizedValue
            });
        }

        return rFinalize;
    };
}

function printResults($result, res, isError) {

    $result.text(JSON.stringify(res, null, 2));

    $result.css({
        backgroundColor: (isError ? 'pink' : 'lightgreen')
    });
}

function markErrorContainer($node, isError) {
    $node.css({
        backgroundColor: (isError ? 'pink' : '')
    });
}