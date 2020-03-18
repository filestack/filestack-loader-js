export declare type ModuleDef = {
    promise?: Promise<any>;
    resolvePromise?: any;
    instance?: any;
    metadata?: any;
};
export declare type Namespace = {
    modules: {
        [key: string]: ModuleDef;
    };
};
/**
 * Load multiple modules
 *
 * @param {*} modules
 */
export declare const loadModules: (modules: any) => Promise<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
/**
 * Load single module from url with given id
 *
 * @param {*} id - module id
 * @param {*} url
 */
export declare const loadModule: (id: string, url: string) => Promise<any>;
/**
 * Register that module is ready
 *
 * @param {string} id
 * @param {any} instance
 * @param {any} metadata - additional module metadata like version
 */
export declare const registerModule: (id: string, instance: any, metadata: any) => void;
/**
 * Load external css from given url
 *
 * @param {*} url
 */
export declare const loadCss: (url: any) => Promise<unknown>;
