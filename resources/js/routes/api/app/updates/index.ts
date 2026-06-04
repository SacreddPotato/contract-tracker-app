import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\AppVersionController::status
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
export const status = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
});

status.definition = {
    methods: ['get', 'head'],
    url: '/api/app/updates/status',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\AppVersionController::status
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
status.url = (options?: RouteQueryOptions) => {
    return status.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppVersionController::status
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
status.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AppVersionController::status
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
status.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\AppVersionController::status
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
const statusForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: status.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AppVersionController::status
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
statusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AppVersionController::status
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
statusForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: status.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

status.form = statusForm;

/**
 * @see \App\Http\Controllers\AppVersionController::check
 * @see app/Http/Controllers/AppVersionController.php:19
 * @route '/api/app/updates/check'
 */
export const check = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: check.url(options),
    method: 'post',
});

check.definition = {
    methods: ['post'],
    url: '/api/app/updates/check',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AppVersionController::check
 * @see app/Http/Controllers/AppVersionController.php:19
 * @route '/api/app/updates/check'
 */
check.url = (options?: RouteQueryOptions) => {
    return check.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppVersionController::check
 * @see app/Http/Controllers/AppVersionController.php:19
 * @route '/api/app/updates/check'
 */
check.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: check.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppVersionController::check
 * @see app/Http/Controllers/AppVersionController.php:19
 * @route '/api/app/updates/check'
 */
const checkForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: check.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppVersionController::check
 * @see app/Http/Controllers/AppVersionController.php:19
 * @route '/api/app/updates/check'
 */
checkForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: check.url(options),
    method: 'post',
});

check.form = checkForm;

/**
 * @see \App\Http\Controllers\AppVersionController::install
 * @see app/Http/Controllers/AppVersionController.php:33
 * @route '/api/app/updates/install'
 */
export const install = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: install.url(options),
    method: 'post',
});

install.definition = {
    methods: ['post'],
    url: '/api/app/updates/install',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AppVersionController::install
 * @see app/Http/Controllers/AppVersionController.php:33
 * @route '/api/app/updates/install'
 */
install.url = (options?: RouteQueryOptions) => {
    return install.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppVersionController::install
 * @see app/Http/Controllers/AppVersionController.php:33
 * @route '/api/app/updates/install'
 */
install.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: install.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppVersionController::install
 * @see app/Http/Controllers/AppVersionController.php:33
 * @route '/api/app/updates/install'
 */
const installForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: install.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppVersionController::install
 * @see app/Http/Controllers/AppVersionController.php:33
 * @route '/api/app/updates/install'
 */
installForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: install.url(options),
    method: 'post',
});

install.form = installForm;

const updates = {
    status: Object.assign(status, status),
    check: Object.assign(check, check),
    install: Object.assign(install, install),
};

export default updates;
