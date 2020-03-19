const MODULE_PREFIX = 'filestack-';

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
  let namespace: Namespace;

  if (typeof window === 'object') {
    // @ts-ignore
    namespace = window.filestackInternals;

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
  }
  
  return namespace;
};

const filestackInternals = initializeGlobalNamespace();
const modules = filestackInternals && filestackInternals.modules;

/**
 * Load multiple modules
 * 
 * @param {*} modules 
 */
export const loadModules = (modules) => Promise.all(modules.map(({ id, url }) => loadModule(id, url)));

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
    const embedScript = () => {
      moduleDefinition.resolvePromise = resolve;
      const script = document.createElement('script');
      script.src = url;
      script.onerror = reject;

      if (id) {
        script.id = MODULE_PREFIX + id;
      }

      document.body.appendChild(script);
    };

    const checkIfDomReady = () => {
      if (document.readyState === 'complete') {
        return embedScript();
      } 

      setTimeout(checkIfDomReady, 50);
    };

    checkIfDomReady();
  });
};

/**
 * Register that module is ready
 * 
 * @param {string} id 
 * @param {any} instance 
 * @param {any} metadata - additional module metadata like version
 */
export const registerModule = (id: string, instance: any, metadata: any) => {
  if (!id) {
    throw new Error('Module id is required')
  }

  if (!modules) {
    throw new Error('Loader is not initialized')
  }

  const moduleDefinition = modules[id];

  if (moduleDefinition && moduleDefinition.resolvePromise) {
    moduleDefinition.instance = instance;
    moduleDefinition.metadata = metadata;

    moduleDefinition.resolvePromise(instance);
    delete moduleDefinition.promise;
    delete moduleDefinition.resolvePromise;
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
