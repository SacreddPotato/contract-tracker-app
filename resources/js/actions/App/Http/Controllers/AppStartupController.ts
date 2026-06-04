import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\AppStartupController::show
 * @see app/Http/Controllers/AppStartupController.php:15
 * @route '/api/app/startup'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/api/app/startup',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\AppStartupController::show
 * @see app/Http/Controllers/AppStartupController.php:15
 * @route '/api/app/startup'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppStartupController::show
 * @see app/Http/Controllers/AppStartupController.php:15
 * @route '/api/app/startup'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AppStartupController::show
 * @see app/Http/Controllers/AppStartupController.php:15
 * @route '/api/app/startup'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\AppStartupController::show
 * @see app/Http/Controllers/AppStartupController.php:15
 * @route '/api/app/startup'
 */
const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AppStartupController::show
 * @see app/Http/Controllers/AppStartupController.php:15
 * @route '/api/app/startup'
 */
showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AppStartupController::show
 * @see app/Http/Controllers/AppStartupController.php:15
 * @route '/api/app/startup'
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
 * @see \App\Http\Controllers\AppStartupController::update
 * @see app/Http/Controllers/AppStartupController.php:20
 * @route '/api/app/startup'
 */
export const update = (
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
});

update.definition = {
    methods: ['put'],
    url: '/api/app/startup',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\AppStartupController::update
 * @see app/Http/Controllers/AppStartupController.php:20
 * @route '/api/app/startup'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppStartupController::update
 * @see app/Http/Controllers/AppStartupController.php:20
 * @route '/api/app/startup'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\AppStartupController::update
 * @see app/Http/Controllers/AppStartupController.php:20
 * @route '/api/app/startup'
 */
const updateForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppStartupController::update
 * @see app/Http/Controllers/AppStartupController.php:20
 * @route '/api/app/startup'
 */
updateForm.put = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

update.form = updateForm;

const AppStartupController = { show, update };

export default AppStartupController;
