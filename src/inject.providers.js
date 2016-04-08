/* globals Injector: false */
/* globals _: false */
/* globals window: false */
/* globals jasmine: false */


function map_dependencies(dependency_providers, adhoc_dependencies, current_template, injector_instance) {
    var _this = this;
    adhoc_dependencies = adhoc_dependencies || {};

    return _.map(dependency_providers, function (provider, key) {
        if (provider) {
            return provider.call(_this, adhoc_dependencies, current_template);
        } else if (adhoc_dependencies.hasOwnProperty(key)) {
            return adhoc_dependencies[key];
        } else if (injector_instance.strict_dependency_providers) {
            throw 'There is no dependency named "' + key + '" registered.';
        }
        return null;
    });
}

var create_object = Object.create;
Injector.prototype._provide_transient = function (current_template) {
    var type = current_template.descriptor.type,
        dependency_providers = current_template.providers,
        injector_instance = this;

    return function (adhoc_dependencies, current_template) {
        var instance = create_object(type.prototype);

        type.apply(instance, map_dependencies.call(this, dependency_providers, adhoc_dependencies, current_template, injector_instance));
        return instance;
    };
};
Injector.prototype._provide_cached = function (current_template, cache) {
    var name = current_template.descriptor.name;

    if (!cache[name]) {
        var dependency_to_cache = this._provide_transient(current_template);

        cache[name] = function (adhoc_dependencies) {
            var cached;
            if (typeof dependency_to_cache === 'function') {
                dependency_to_cache = dependency_to_cache.call(this, adhoc_dependencies);
                cached = function () {
                    return dependency_to_cache;
                };
                cached.hashCode = cache[name].hashCode;
                cache[name] = cached;
            }
            return dependency_to_cache;
        };
    }
    return cache[name];
};

Injector.prototype._provide_root = function (template) {
    var name = template.descriptor.name,
        _this = this;

    return function (adhoc_dependencies, current_template) {
        var roots = current_template.root.roots = current_template.root.roots || {};

        if (!roots[name]) {
            roots[name] = _this._provide_transient(template).call(this, adhoc_dependencies, current_template);
        }
        return roots[name];
    };
};

Injector.prototype._provide_provider = function(template) {
    var injector_instance = this;
    return function (adhoc_dependencies, current_template) {
        var dependencies = map_dependencies.call(this, template.providers, adhoc_dependencies, current_template, injector_instance);
        return template.descriptor.type.apply(this, dependencies);
    };
};

Injector.prototype._provide_parent = function (template) {
    var _this = this;

    return function (adhoc_dependencies, current_template) {
        var parent_template = current_template,
            topmost_parent = parent_template,
            dependency_name = template.descriptor.name;
        while (parent_template = parent_template.parent) {
            if (parent_template.children && parent_template.children[dependency_name]) {
                topmost_parent = parent_template;
                break;
            } else if (parent_template.descriptor.dependencies && ~parent_template.descriptor.dependencies.indexOf(dependency_name)) {
                topmost_parent = parent_template;
            }
        }

        parent_template = topmost_parent;

        parent_template.children = parent_template.children || {};


        if (!parent_template.children[dependency_name] || parent_template.children[dependency_name] === 'building') {
            parent_template.children[dependency_name] = 'building';
            parent_template.children[dependency_name] = _this._provide_transient(template).call(this, adhoc_dependencies, current_template);
        }
        return parent_template.children[dependency_name];
    };

};

(function () {
    var singletons = {};
    if (window['jasmine'] && jasmine.getEnv) {
        jasmine.getEnv().addReporter({
            specStarted: function () {
                singletons = {};
            }
        });
    }
    Injector.prototype._build_provider = function (current_template) {
        var item,
            descriptor = current_template.descriptor,
            name = descriptor.name,
            provider_name,
            cache = null;

        if (!descriptor.lifetime) {
            provider_name = 'provide_provider';
        } else {
            switch (descriptor.lifetime) {
                case 'singleton':
                    provider_name = 'provide_cached';
                    cache = singletons;
                    break;
                case 'state':
                    provider_name = 'provide_cached';
                    cache = this.state;
                    break;
                default:
                    provider_name = 'provide_' + descriptor.lifetime;
            }
        }
        item = this['_' + provider_name](current_template, cache);
        item.hashCode = descriptor.hashCode;
        if (name && !descriptor.provider) {
            this.cache[name] = item;
        }
        return item;
    };
}());
