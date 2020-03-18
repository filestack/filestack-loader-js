"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MODULE_PREFIX = 'filestack-';
var initializeGlobalNamespace = function () {
    var namespace;
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
var filestackInternals = initializeGlobalNamespace();
var modules = filestackInternals && filestackInternals.modules;
/**
 * Load multiple modules
 *
 * @param {*} modules
 */
exports.loadModules = function (modules) { return Promise.all(modules.map(function (_a) {
    var url = _a.url, id = _a.id;
    return exports.loadModule(url, id);
})); };
/**
 * Load single module from url with given id
 *
 * @param {*} id - module id
 * @param {*} url
 */
exports.loadModule = function (id, url) {
    if (!id) {
        throw new Error('Module id is required');
    }
    var moduleDefinition = modules[id];
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
    return moduleDefinition.promise = new Promise(function (resolve, reject) {
        var embedScript = function () {
            moduleDefinition.resolvePromise = resolve;
            var script = document.createElement('script');
            script.src = url;
            script.onerror = reject;
            if (id) {
                script.id = MODULE_PREFIX + id;
            }
            document.body.appendChild(script);
        };
        var checkIfDomReady = function () {
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
exports.registerModule = function (id, instance, metadata) {
    if (!id) {
        throw new Error('Module id is required');
    }
    if (!modules) {
        throw new Error('Loader is not initialized');
    }
    var moduleDefinition = modules[id];
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
exports.loadCss = function (url) {
    var alreadyAddedThisTag = document.querySelector("link[href=\"" + url + "\"]");
    if (alreadyAddedThisTag !== null) {
        return Promise.resolve();
    }
    return new Promise(function (resolve) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        var loaded = function () {
            resolve();
            link.removeEventListener('load', loaded);
        };
        link.rel = 'stylesheet';
        link.href = url;
        link.addEventListener('load', loaded);
        head.appendChild(link);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLGFBQWEsR0FBRyxZQUFZLENBQUM7QUFlbkMsSUFBTSx5QkFBeUIsR0FBRztJQUNoQyxJQUFJLFNBQW9CLENBQUM7SUFFekIsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7UUFDOUIsYUFBYTtRQUNiLFNBQVMsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUM7UUFFdEMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLFNBQVMsR0FBRztnQkFDVixPQUFPLEVBQUUsRUFBRTthQUNaLENBQUM7WUFFRixhQUFhO1lBQ2IsTUFBTSxDQUFDLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztTQUN2QztRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO1lBQ3RCLFNBQVMsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1NBQ3hCO0tBQ0Y7SUFFRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDLENBQUM7QUFFRixJQUFNLGtCQUFrQixHQUFHLHlCQUF5QixFQUFFLENBQUM7QUFDdkQsSUFBTSxPQUFPLEdBQUcsa0JBQWtCLElBQUksa0JBQWtCLENBQUMsT0FBTyxDQUFDO0FBRWpFOzs7O0dBSUc7QUFDVSxRQUFBLFdBQVcsR0FBRyxVQUFDLE9BQU8sSUFBSyxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQVc7UUFBVCxZQUFHLEVBQUUsVUFBRTtJQUFPLE9BQUEsa0JBQVUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO0FBQW5CLENBQW1CLENBQUMsQ0FBQyxFQUE5RCxDQUE4RCxDQUFDO0FBRXZHOzs7OztHQUtHO0FBQ1UsUUFBQSxVQUFVLEdBQUcsVUFBQyxFQUFVLEVBQUUsR0FBVztJQUNoRCxJQUFJLENBQUMsRUFBRSxFQUFFO1FBQ1AsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0tBQ3pDO0lBRUQsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFbkMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1FBQ3JCLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDakIsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2hDO0lBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUU7UUFDN0IsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ25EO0lBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUU7UUFDNUIsT0FBTyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7S0FDakM7SUFFRCxPQUFPLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1FBQzVELElBQU0sV0FBVyxHQUFHO1lBQ2xCLGdCQUFnQixDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUM7WUFDMUMsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUNqQixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUV4QixJQUFJLEVBQUUsRUFBRTtnQkFDTixNQUFNLENBQUMsRUFBRSxHQUFHLGFBQWEsR0FBRyxFQUFFLENBQUM7YUFDaEM7WUFFRCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUM7UUFFRixJQUFNLGVBQWUsR0FBRztZQUN0QixJQUFJLFFBQVEsQ0FBQyxVQUFVLEtBQUssVUFBVSxFQUFFO2dCQUN0QyxPQUFPLFdBQVcsRUFBRSxDQUFDO2FBQ3RCO1lBRUQsVUFBVSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUM7UUFFRixlQUFlLEVBQUUsQ0FBQztJQUNwQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUVGOzs7Ozs7R0FNRztBQUNVLFFBQUEsY0FBYyxHQUFHLFVBQUMsRUFBVSxFQUFFLFFBQWEsRUFBRSxRQUFhO0lBQ3JFLElBQUksQ0FBQyxFQUFFLEVBQUU7UUFDUCxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUE7S0FDekM7SUFFRCxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO0tBQzdDO0lBRUQsSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFckMsSUFBSSxnQkFBZ0IsSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUU7UUFDdkQsZ0JBQWdCLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUNyQyxnQkFBZ0IsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXJDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQyxPQUFPLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztRQUNoQyxPQUFPLGdCQUFnQixDQUFDLGNBQWMsQ0FBQztLQUN4QztBQUNILENBQUMsQ0FBQztBQUVGOzs7O0dBSUc7QUFDVSxRQUFBLE9BQU8sR0FBRyxVQUFDLEdBQUc7SUFDekIsSUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGlCQUFjLEdBQUcsUUFBSSxDQUFDLENBQUM7SUFDMUUsSUFBSSxtQkFBbUIsS0FBSyxJQUFJLEVBQUU7UUFDaEMsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDMUI7SUFFRCxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTztRQUN6QixJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU1QyxJQUFNLE1BQU0sR0FBRztZQUNiLE9BQU8sRUFBRSxDQUFDO1lBQ1YsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBNT0RVTEVfUFJFRklYID0gJ2ZpbGVzdGFjay0nO1xuXG5leHBvcnQgdHlwZSBNb2R1bGVEZWYgPSB7XG4gIHByb21pc2U/OiBQcm9taXNlPGFueT5cbiAgcmVzb2x2ZVByb21pc2U/OiBhbnk7XG4gIGluc3RhbmNlPzogYW55O1xuICBtZXRhZGF0YT86IGFueTtcbn1cblxuZXhwb3J0IHR5cGUgTmFtZXNwYWNlID0ge1xuICAgIG1vZHVsZXM6IHtcbiAgICAgW2tleTogc3RyaW5nXTogTW9kdWxlRGVmXG4gICAgfVxufTtcblxuY29uc3QgaW5pdGlhbGl6ZUdsb2JhbE5hbWVzcGFjZSA9ICgpID0+IHtcbiAgbGV0IG5hbWVzcGFjZTogTmFtZXNwYWNlO1xuXG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBuYW1lc3BhY2UgPSB3aW5kb3cuZmlsZXN0YWNrSW50ZXJuYWxzO1xuXG4gICAgaWYgKCFuYW1lc3BhY2UpIHtcbiAgICAgIG5hbWVzcGFjZSA9IHtcbiAgICAgICAgbW9kdWxlczoge30sXG4gICAgICB9O1xuXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB3aW5kb3cuZmlsZXN0YWNrSW50ZXJuYWxzID0gbmFtZXNwYWNlO1xuICAgIH1cblxuICAgIGlmICghbmFtZXNwYWNlLm1vZHVsZXMpIHtcbiAgICAgIG5hbWVzcGFjZS5tb2R1bGVzID0ge307XG4gICAgfVxuICB9XG4gIFxuICByZXR1cm4gbmFtZXNwYWNlO1xufTtcblxuY29uc3QgZmlsZXN0YWNrSW50ZXJuYWxzID0gaW5pdGlhbGl6ZUdsb2JhbE5hbWVzcGFjZSgpO1xuY29uc3QgbW9kdWxlcyA9IGZpbGVzdGFja0ludGVybmFscyAmJiBmaWxlc3RhY2tJbnRlcm5hbHMubW9kdWxlcztcblxuLyoqXG4gKiBMb2FkIG11bHRpcGxlIG1vZHVsZXNcbiAqIFxuICogQHBhcmFtIHsqfSBtb2R1bGVzIFxuICovXG5leHBvcnQgY29uc3QgbG9hZE1vZHVsZXMgPSAobW9kdWxlcykgPT4gUHJvbWlzZS5hbGwobW9kdWxlcy5tYXAoKHsgdXJsLCBpZCB9KSA9PiBsb2FkTW9kdWxlKHVybCwgaWQpKSk7XG5cbi8qKlxuICogTG9hZCBzaW5nbGUgbW9kdWxlIGZyb20gdXJsIHdpdGggZ2l2ZW4gaWRcbiAqXG4gKiBAcGFyYW0geyp9IGlkIC0gbW9kdWxlIGlkIFxuICogQHBhcmFtIHsqfSB1cmxcbiAqL1xuZXhwb3J0IGNvbnN0IGxvYWRNb2R1bGUgPSAoaWQ6IHN0cmluZywgdXJsOiBzdHJpbmcpID0+IHtcbiAgaWYgKCFpZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTW9kdWxlIGlkIGlzIHJlcXVpcmVkJylcbiAgfVxuXG4gIGxldCBtb2R1bGVEZWZpbml0aW9uID0gbW9kdWxlc1tpZF07XG5cbiAgaWYgKCFtb2R1bGVEZWZpbml0aW9uKSB7XG4gICAgbW9kdWxlc1tpZF0gPSB7fTtcbiAgICBtb2R1bGVEZWZpbml0aW9uID0gbW9kdWxlc1tpZF07XG4gIH1cblxuICBpZiAobW9kdWxlRGVmaW5pdGlvbi5pbnN0YW5jZSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobW9kdWxlRGVmaW5pdGlvbi5pbnN0YW5jZSk7XG4gIH1cblxuICBpZiAobW9kdWxlRGVmaW5pdGlvbi5wcm9taXNlKSB7XG4gICAgcmV0dXJuIG1vZHVsZURlZmluaXRpb24ucHJvbWlzZTtcbiAgfVxuXG4gIHJldHVybiBtb2R1bGVEZWZpbml0aW9uLnByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgZW1iZWRTY3JpcHQgPSAoKSA9PiB7XG4gICAgICBtb2R1bGVEZWZpbml0aW9uLnJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgc2NyaXB0LnNyYyA9IHVybDtcbiAgICAgIHNjcmlwdC5vbmVycm9yID0gcmVqZWN0O1xuXG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgc2NyaXB0LmlkID0gTU9EVUxFX1BSRUZJWCArIGlkO1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGNoZWNrSWZEb21SZWFkeSA9ICgpID0+IHtcbiAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICAgIHJldHVybiBlbWJlZFNjcmlwdCgpO1xuICAgICAgfSBcblxuICAgICAgc2V0VGltZW91dChjaGVja0lmRG9tUmVhZHksIDUwKTtcbiAgICB9O1xuXG4gICAgY2hlY2tJZkRvbVJlYWR5KCk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBSZWdpc3RlciB0aGF0IG1vZHVsZSBpcyByZWFkeVxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgXG4gKiBAcGFyYW0ge2FueX0gaW5zdGFuY2UgXG4gKiBAcGFyYW0ge2FueX0gbWV0YWRhdGEgLSBhZGRpdGlvbmFsIG1vZHVsZSBtZXRhZGF0YSBsaWtlIHZlcnNpb25cbiAqL1xuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyTW9kdWxlID0gKGlkOiBzdHJpbmcsIGluc3RhbmNlOiBhbnksIG1ldGFkYXRhOiBhbnkpID0+IHtcbiAgaWYgKCFpZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTW9kdWxlIGlkIGlzIHJlcXVpcmVkJylcbiAgfVxuXG4gIGlmICghbW9kdWxlcykge1xuICAgIHRocm93IG5ldyBFcnJvcignTG9hZGVyIGlzIG5vdCBpbml0aWFsaXplZCcpXG4gIH1cblxuICBjb25zdCBtb2R1bGVEZWZpbml0aW9uID0gbW9kdWxlc1tpZF07XG5cbiAgaWYgKG1vZHVsZURlZmluaXRpb24gJiYgbW9kdWxlRGVmaW5pdGlvbi5yZXNvbHZlUHJvbWlzZSkge1xuICAgIG1vZHVsZURlZmluaXRpb24uaW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICBtb2R1bGVEZWZpbml0aW9uLm1ldGFkYXRhID0gbWV0YWRhdGE7XG5cbiAgICBtb2R1bGVEZWZpbml0aW9uLnJlc29sdmVQcm9taXNlKGluc3RhbmNlKTtcbiAgICBkZWxldGUgbW9kdWxlRGVmaW5pdGlvbi5wcm9taXNlO1xuICAgIGRlbGV0ZSBtb2R1bGVEZWZpbml0aW9uLnJlc29sdmVQcm9taXNlO1xuICB9XG59O1xuXG4vKipcbiAqIExvYWQgZXh0ZXJuYWwgY3NzIGZyb20gZ2l2ZW4gdXJsXG4gKiBcbiAqIEBwYXJhbSB7Kn0gdXJsIFxuICovXG5leHBvcnQgY29uc3QgbG9hZENzcyA9ICh1cmwpID0+IHtcbiAgY29uc3QgYWxyZWFkeUFkZGVkVGhpc1RhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGxpbmtbaHJlZj1cIiR7dXJsfVwiXWApO1xuICBpZiAoYWxyZWFkeUFkZGVkVGhpc1RhZyAhPT0gbnVsbCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG5cbiAgICBjb25zdCBsb2FkZWQgPSAoKSA9PiB7XG4gICAgICByZXNvbHZlKCk7XG4gICAgICBsaW5rLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkZWQpO1xuICAgIH07XG5cbiAgICBsaW5rLnJlbCA9ICdzdHlsZXNoZWV0JztcbiAgICBsaW5rLmhyZWYgPSB1cmw7XG4gICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZGVkKTtcbiAgICBoZWFkLmFwcGVuZENoaWxkKGxpbmspO1xuICB9KTtcbn07XG4iXX0=