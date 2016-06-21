# es6-modules

ES6 Module Implementation

## Overview

This project provides an es6 module loader implementation for the typescript generated polyfill.

Typescript 1.8 adds the new jsconfig.json format. When the compilerOptions.module field 
is set to 'system' or 'amd' and compilerOptions.outFile is also so, typescript will 
bundle multiple files, transpiling import/export polyfils. This project supplies an
implementation for those polyfils.

My project consumes globals, such as PIXI.js. And to expose my API to scala.js, my library
needs to be a global. But within my library, I want to use all the new es6 features, including
import and export. So only the modules assembled into the ourput by typescript are available. 

Typescript normalizes the interface, so no parameter checking is needed. For amd modules, the define
function is less than 10 lines of code:

jsconfig.json:
```
{
    "compilerOptions": {
        "target": "es6",
        "module": "amd",
        "rootDir": "src",
        "outFile": "js/app.js"
    },
    "files": [
        "src/define.js",
        "src/lib/lib.js",
        "src/lib/shapes/Circle.js",
        "src/lib/utils/functions.js"
    ]
}
``` 
After running tsc, the outFile js/app.js:
```
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
define("lib/lib", ["require", "exports", "lib/shapes/Circle", "lib/utils/functions"], function (require, exports, Circle_1, functions) {
    "use strict";
    /**
     * Re-export it all to a namespace-like object hierarchy
     */
    window.lib = {
        shapes: {
            Circle: Circle_1.default
        },
        utils: {
            functions: functions
        }
    };
});

```


