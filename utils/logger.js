function pass(msg) {
    console.log(`✔ ${msg}`);
}

function fail(msg) {
    console.log(`✖ ${msg}`);
}

function info(msg) {
    console.log(`ℹ ${msg}`);
}

async function logErrors(fn) {
    try {
        return await fn();
    } catch (err) {
        fail(err);
        throw err;
    }
}
// usage await logError(()=> fn())

module.exports = {
    pass,
    fail,
    info,
    logErrors
};