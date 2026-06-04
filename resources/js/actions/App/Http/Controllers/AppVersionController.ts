import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\AppVersionController::show
 * @see app/Http/Controllers/AppVersionController.php:14
 * @route '/api/app/version'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/api/app/version',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\AppVersionController::show
 * @see app/Http/Controllers/AppVersionController.php:14
 * @route '/api/app/version'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppVersionController::show
 * @see app/Http/Controllers/AppVersionController.php:14
 * @route '/api/app/version'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AppVersionController::show
 * @see app/Http/Controllers/AppVersionController.php:14
 * @route '/api/app/version'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\AppVersionController::show
 * @see app/Http/Controllers/AppVersionController.php:14
 * @route '/api/app/version'
 */
const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AppVersionController::show
 * @see app/Http/Controllers/AppVersionController.php:14
 * @route '/api/app/version'
 */
showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AppVersionController::show
 * @see app/Http/Controllers/AppVersionController.php:14
 * @route '/api/app/version'
 */
showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

show.form = showForm;

/**
 * @see \App\Http\Controllers\AppVersionController::checkForUpdates
 * @see app/Http/Controllers/AppVersionController.php:19
 * @route '/api/app/updates/check'
 */
export const checkForUpdates = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: checkForUpdates.url(options),
    method: 'post',
});

checkForUpdates.definition = {
    methods: ['post'],
    url: '/api/app/updates/check',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AppVersionController::checkForUpdates
 * @see app/Http/Controllers/AppVersionController.php:19
 * @route '/api/app/updates/check'
 */
checkForUpdates.url = (options?: RouteQueryOptions) => {
    return checkForUpdates.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppVersionController::checkForUpdates
 * @see app/Http/Controllers/AppVersionController.php:19
 * @route '/api/app/updates/check'
 */
checkForUpdates.post = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: checkForUpdates.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppVersionController::checkForUpdates
 * @see app/Http/Controllers/AppVersionController.php:19
 * @route '/api/app/updates/check'
 */
const checkForUpdatesForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: checkForUpdates.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppVersionController::checkForUpdates
 * @see app/Http/Controllers/AppVersionController.php:19
 * @route '/api/app/updates/check'
 */
checkForUpdatesForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: checkForUpdates.url(options),
    method: 'post',
});

checkForUpdates.form = checkForUpdatesForm;

const AppVersionController = { show, checkForUpdates };

export default AppVersionController;
