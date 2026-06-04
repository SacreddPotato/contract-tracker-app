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

const version = {
    show: Object.assign(show, show),
};

export default version;
