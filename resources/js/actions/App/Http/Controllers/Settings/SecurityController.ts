import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Settings\SecurityController::show
 * @see app/Http/Controllers/Settings/SecurityController.php:20
 * @route '/api/settings/security'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/api/settings/security',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Settings\SecurityController::show
 * @see app/Http/Controllers/Settings/SecurityController.php:20
 * @route '/api/settings/security'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Settings\SecurityController::show
 * @see app/Http/Controllers/Settings/SecurityController.php:20
 * @route '/api/settings/security'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Settings\SecurityController::show
 * @see app/Http/Controllers/Settings/SecurityController.php:20
 * @route '/api/settings/security'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Settings\SecurityController::show
 * @see app/Http/Controllers/Settings/SecurityController.php:20
 * @route '/api/settings/security'
 */
const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Settings\SecurityController::show
 * @see app/Http/Controllers/Settings/SecurityController.php:20
 * @route '/api/settings/security'
 */
showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Settings\SecurityController::show
 * @see app/Http/Controllers/Settings/SecurityController.php:20
 * @route '/api/settings/security'
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
 * @see \App\Http\Controllers\Settings\SecurityController::update
 * @see app/Http/Controllers/Settings/SecurityController.php:31
 * @route '/api/settings/security/password'
 */
export const update = (
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
});

update.definition = {
    methods: ['put'],
    url: '/api/settings/security/password',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\Settings\SecurityController::update
 * @see app/Http/Controllers/Settings/SecurityController.php:31
 * @route '/api/settings/security/password'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Settings\SecurityController::update
 * @see app/Http/Controllers/Settings/SecurityController.php:31
 * @route '/api/settings/security/password'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\Settings\SecurityController::update
 * @see app/Http/Controllers/Settings/SecurityController.php:31
 * @route '/api/settings/security/password'
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
 * @see \App\Http\Controllers\Settings\SecurityController::update
 * @see app/Http/Controllers/Settings/SecurityController.php:31
 * @route '/api/settings/security/password'
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

const SecurityController = { show, update };

export default SecurityController;
