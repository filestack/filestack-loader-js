const MODULE_PREFIX = 'fs-loader-';
const globalHolder: any = {};

export type ModuleDef = {
  promise?: Promise<any>
  resolvePromise?: any;
  instance?: any;
  metadata?: any;
}

export type Namespace = {
    modules: {
     [key: string]: ModuleDef
    }
};

const initializeGlobalNamespace = () => {
  let holder = window;

  // if there is no window obj use nodejs global lib variable
  if (typeof holder !== 'object') {
    holder = globalHolder;
  }

  // @ts-ignore
  let namespace: Namespace = holder.filestackInternals;

  if (!namespace) {
    namespace = {
      modules: {},
    };

    // @ts-ignore
    window.filestackInternals = namespace;
  }

  if (!namespace.modules) {
    namespace.modules = {};
  }
  
  return namespace;
};

const filestackInternals = initializeGlobalNamespace();
const modules = filestackInternals && filestackInternals.modules;

/**
 * Remove listeners (browser compatible)
 * 
 * @param node 
 * @param func 
 * @param name 
 */
const removeListener = (node, func, name, ) => {
  if (node.detachEvent) {
    node.detachEvent('onreadystatechange', func);
  } else {
    node.removeEventListener(name, func, false);
  }
}

/**
 * Load multiple modules
 * 
 * @param {*} modules 
 */
export const loadModules = (modulesList) => Promise.all(modulesList.map(({ id, url }) => loadModule(id, url))).then((res) => {
  const toReturn = {};

  res.forEach((mod, idx) => {
    const el = modulesList[idx];
    toReturn[el.id] = mod;
  });

  return toReturn;
});

/**
 * Load single module from url with given id
 *
 * @param {*} id - module id 
 * @param {*} url
 */
export const loadModule = (id: string, url: string) => {
  if (!id) {
    throw new Error('Module id is required')
  }

  let moduleDefinition = modules[id];

  id =  MODULE_PREFIX + id;

  if (!moduleDefinition) {
    modules[id] = {};
    moduleDefinition = modules[id];
  }

  if (moduleDefinition.instance) {
    return Promise.resolve(moduleDefinition.instance);
  }

  if (moduleDefinition.promise) {
    return moduleDefinition.promise;
  }

  return moduleDefinition.promise = new Promise((resolve, reject) => {
    const readyStateChange = (evt: any) => {
      if (evt.type === 'load' || (/^(complete|loaded)$/.test((evt.currentTarget || evt.srcElement).readyState))) {
        const node =  evt.currentTarget || evt.srcElement;

        removeListener(node, readyStateChange, 'load');
        removeListener(node, reject, 'error');

        // slow dow checking if module is loaded to ensure that script that  register module is called
        setTimeout(() => resolve(modules[id] ? modules[id].instance : undefined), 10);
      }
    }

    const script = document.createElement('script');
    
    script.id = id;

    // @ts-ignore fix for IE
    if (script.attachEvent && !(script.attachEvent.toString && script.attachEvent.toString().indexOf('[native code') < 0)) {
      // @ts-ignore
      script.attachEvent('onreadystatechange', readyStateChange);
    } else {
      script.addEventListener('load', readyStateChange, false);
      script.addEventListener('onerror', reject, false);
    }

    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('charset', 'utf-8');
    script.setAttribute('async', 'true');

    script.src = url;

    document.body.appendChild(script);
  });
};

/**
 * Register that module is ready
 * 
 * @param {string} id 
 * @param {any} instance 
 * @param {any} metadata - additional module metadata like version
 */
export const registerModule = (id: string, instance: any, metadata?: any) => {
  if (!id) {
    throw new Error('Module id is required')
  }

  if (!modules) {
    throw new Error('Loader is not initialized')
  }

  id = MODULE_PREFIX + id;

  if (modules[id]) {
    modules[id] = { instance, metadata }
  }
};

/**
 * Load external css from given url
 * 
 * @param {*} url 
 */
export const loadCss = (url) => {
  const alreadyAddedThisTag = document.querySelector(`link[href="${url}"]`);
  if (alreadyAddedThisTag !== null) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');

    const loaded = () => {
      resolve();
      link.removeEventListener('load', loaded);
    };

    link.rel = 'stylesheet';
    link.href = url;
    link.addEventListener('load', loaded);
    head.appendChild(link);
  });
};

/**
 * Enum just for unify filestack module names
 */
export enum FILESTACK_MODULES {
  FILESTACK_SDK = 'filestack-sdk',
  TRANSFORMS_UI = 'transforms-ui',
  PICKER = 'picker',
};
