/**
 * SystemJs Compatible module loader
 * culled from git://github.com/systemjs/systemjs.git
 *
 *
 */
var System = (function (registry, modules) {
    return {
        /**
         * register a module
         *
         * @param name
         * @param deps
         * @param declare
         */
        register(name, deps, declare) {
            registry[name] = createEntry(name, deps, declare);
        },
        /**
         * import a module
         *
         * @param name
         * @retruns Promise
         */
        import(name) {
            return new Promise((resolve, reject) => {
                if (registry[name]) {
                    linkModule(registry[name]);
                    ensureEvaluated(registry[name]);
                    resolve(registry[name].module.exports);
                }
                else {
                    reject(new Error(`Module "${name}" not found`));
                }
            });
        }
    };
    /**
     * Represents a lexical module definitiob
     */
    function createEntry(name, deps, declare) {
        return { name: name, deps: deps, declare: declare, execute: null, setters: null, module: null, indices: null, evaluated: false };
    }
    /**
     * A loaded module
     */
    function getOrCreateModule(name) {
        return modules[name] || (modules[name] = {
            name: name, locked: false, dependencies: [], exports: {}, importers: [] });
    }
    /**
     * Collate dependencies by name into
     * a tuple of 2 arrays
     */
    function group(deps) {
        let names = [];
        let indices = [];
        for (let i = 0, l = deps.length; i < l; i++) {
            let index = names.indexOf(deps[i]);
            if (index === -1) {
                names.push(deps[i]);
                indices.push([i]);
            }
            else {
                indices[index].push(i);
            }
        }
        return { names: names, indices: indices };
    }
    /**
     * Load all the required modules
     */
    function ensureEvaluated(entry) {
        for (let i = 0, l = entry.deps.length; i < l; i++) {
            let depName = entry.deps[i];
            let depEntry = registry[depName];
            ensureEvaluated(depEntry);
        }
        if (entry.evaluated)
            return;
        entry.evaluated = true;
        entry.module.execute();
    }
    /**
     * Link module dependencies
     */
    function linkModule(entry) {
        let grouped = group(entry.deps);
        entry.deps = grouped.names;
        entry.indices = grouped.indices;
        let module = entry.module = getOrCreateModule(entry.name);
        let exports = entry.module.exports;
        let declaration = entry.declare(function (name, value) {
            module.locked = true;
            if (typeof name === 'object') {
                for (let p in name)
                    exports[p] = name[p];
            }
            else {
                exports[name] = value;
            }
            for (let i = 0, l = module.importers.length; i < l; i++) {
                let importerModule = module.importers[i];
                if (!importerModule.locked) {
                    let importerIndex = importerModule.dependencies.indexOf(module);
                    importerModule.setters[importerIndex](exports);
                }
            }
            module.locked = false;
            return value;
        }, { id: name });
        module.setters = declaration.setters;
        module.execute = declaration.execute;
        if (!module.setters || !module.execute) {
            throw new TypeError('Invalid System.register form for ' + entry.name);
        }
        // now link all the module dependencies
        for (let i = 0, l = entry.deps.length; i < l; i++) {
            let depName = entry.deps[i];
            let depEntry = registry[depName];
            let depModule = modules[depName];
            // work out how to set depExports based on scenarios...
            let depExports;
            if (depModule) {
                depExports = depModule.exports;
            }
            else {
                linkModule(depEntry);
                depModule = depEntry.module;
                depExports = depModule.exports;
            }
            // only declarative modules have dynamic bindings
            if (depModule && depModule.importers) {
                depModule.importers.push(module);
                module.dependencies.push(depModule);
            }
            else {
                module.dependencies.push(null);
            }
            // run setters for all entries with the matching dependency name
            let originalIndices = entry.indices[i];
            for (let j = 0, len = originalIndices.length; j < len; ++j) {
                let index = originalIndices[j];
                if (module.setters[index]) {
                    module.setters[index](depExports);
                }
            }
        }
    }
}({}, {}));
System.register("lib/shapes/Circle", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Circle;
    return {
        setters:[],
        execute: function() {
            //------ lib.js ------
            class Circle {
                constructor(radius) {
                    this.radius = radius;
                }
            }
            exports_1("default", Circle);
        }
    }
});
System.register("lib/utils/Gdx", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Gdx;
    return {
        setters:[],
        execute: function() {
            Gdx = {
                one: 1
            };
            exports_2("default", Gdx);
        }
    }
});
System.register("lib/utils/functions", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var sqrt;
    function square(x) {
        return x * x;
    }
    exports_3("square", square);
    function diag(x, y) {
        return sqrt(square(x) + square(y));
    }
    exports_3("diag", diag);
    return {
        setters:[],
        execute: function() {
            //------ lib2.js ------
            exports_3("sqrt", sqrt = Math.sqrt);
        }
    }
});
System.register("lib/lib", ["lib/shapes/Circle", "lib/utils/Gdx", "lib/utils/functions"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var Circle_1, Gdx_1, functions;
    return {
        setters:[
            function (Circle_1_1) {
                Circle_1 = Circle_1_1;
            },
            function (Gdx_1_1) {
                Gdx_1 = Gdx_1_1;
            },
            function (functions_1) {
                functions = functions_1;
            }],
        execute: function() {
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
        }
    }
});
/**
 * Import the lib namespace and make it global
 */
System.import('lib/lib');
