const domain = require('domain')

var d = domain.create();
 
process.on('uncaughtException', function(err) {
    console.error(err);
});
 
d.on('error', function(err) {
    console.error('Error caught by domain:', err);
});
 
d.run(function() {
    process.nextTick(function() {
        throw new Error("test domain");
    });
});