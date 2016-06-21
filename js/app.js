/**
 * AMD Compatible module loader
 *
 * @param root object
 * @returns module loader function define
 *
 */
var define = (function (modules) {
    return (name, deps, callback) => {
        modules[name] = { id: name, exports: {} };
        let args = [(name) => modules[name].exports, modules[name].exports];
        for (let i = 2; i < deps.length; i++)
            args.push(modules[deps[i]].exports);
        callback.apply(modules[name].exports, args);
    };
}({}));
define("lib/shapes/Circle", ["require", "exports"], function (require, exports) {
    "use strict";
    //------ lib.js ------
    class Circle {
        constructor(radius) {
            this.radius = radius;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Circle;
});
define("lib/utils/Gdx", ["require", "exports"], function (require, exports) {
    "use strict";
    const Gdx = {
        one: 1
    };
    exports.default = Gdx;
});
define("lib/utils/functions", ["require", "exports"], function (require, exports) {
    "use strict";
    //------ lib2.js ------
    exports.sqrt = Math.sqrt;
    function square(x) {
        return x * x;
    }
    exports.square = square;
    function diag(x, y) {
        return exports.sqrt(square(x) + square(y));
    }
    exports.diag = diag;
});
define("lib/lib", ["require", "exports", "lib/shapes/Circle", "lib/utils/Gdx", "lib/utils/functions"], function (require, exports, Circle_1, Gdx_1, functions) {
    "use strict";
    /**
     * Re-export it all to a namespace-like object hierarchy
     */
    window.lib = {
        shapes: {
            Circle: Circle_1.default
        },
        utils: {
            Gdx: Gdx_1.default,
            functions: functions
        }
    };
});
