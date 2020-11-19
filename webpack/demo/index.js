const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");

 const hook = new SyncHook(["arg1", "arg2", "arg3"]);

 class Car {
	constructor() {
		this.hooks = {
			brake: new SyncLoopHook(['k']),
			brakeAsync: new AsyncParallelHook(['k']),
		};
	}
    /* ... */
    brakeAsyncCall() {
        this.hooks.brakeAsync.callAsync('callAsync', function () {
            console.log('callAsync > %s', ...arguments);
        });
    }
    brakeCall() {
        this.hooks.brake.call('callSync');
    }
}


const myCar = new Car();
function Plugin(name, type, cb) {
    let n=3;

    while (n) {
        console.log('> %s', ...arguments, n);
    if (cb) cb();
    n --;
    }

}

myCar.hooks.brake.tap("Plugin1", Plugin.bind(this, 'Plugin1'));
myCar.hooks.brake.tap("Plugin2", Plugin.bind(this, 'Plugin2'));
myCar.hooks.brake.tap("Plugin3", Plugin.bind(this, 'Plugin3'));

myCar.hooks.brakeAsync.tapAsync("Plugin1", Plugin.bind(this, 'Plugin1'));
myCar.hooks.brakeAsync.tapAsync("Plugin2", Plugin.bind(this, 'Plugin2'));
myCar.hooks.brakeAsync.tapAsync("Plugin3", Plugin.bind(this, 'Plugin3'));

myCar.brakeAsyncCall();
myCar.brakeCall();
