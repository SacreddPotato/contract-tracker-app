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
 * @see \App\Http\Controllers\AppVersionController::updateStatus
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
export const updateStatus = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: updateStatus.url(options),
    method: 'get',
});

updateStatus.definition = {
    methods: ['get', 'head'],
    url: '/api/app/updates/status',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\AppVersionController::updateStatus
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
updateStatus.url = (options?: RouteQueryOptions) => {
    return updateStatus.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppVersionController::updateStatus
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
updateStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: updateStatus.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AppVersionController::updateStatus
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
updateStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: updateStatus.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\AppVersionController::updateStatus
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
const updateStatusForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: updateStatus.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AppVersionController::updateStatus
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
updateStatusForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: updateStatus.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AppVersionController::updateStatus
 * @see app/Http/Controllers/AppVersionController.php:26
 * @route '/api/app/updates/status'
 */
updateStatusForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: updateStatus.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

updateStatus.form = updateStatusForm;

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

/**
 * @see \App\Http\Controllers\AppVersionController::installUpdate
 * @see app/Http/Controllers/AppVersionController.php:33
 * @route '/api/app/updates/install'
 */
export const installUpdate = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: installUpdate.url(options),
    method: 'post',
});

installUpdate.definition = {
    methods: ['post'],
    url: '/api/app/updates/install',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AppVersionController::installUpdate
 * @see app/Http/Controllers/AppVersionController.php:33
 * @route '/api/app/updates/install'
 */
installUpdate.url = (options?: RouteQueryOptions) => {
    return installUpdate.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppVersionController::installUpdate
 * @see app/Http/Controllers/AppVersionController.php:33
 * @route '/api/app/updates/install'
 */
installUpdate.post = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: installUpdate.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppVersionController::installUpdate
 * @see app/Http/Controllers/AppVersionController.php:33
 * @route '/api/app/updates/install'
 */
const installUpdateForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: installUpdate.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppVersionController::installUpdate
 * @see app/Http/Controllers/AppVersionController.php:33
 * @route '/api/app/updates/install'
 */
installUpdateForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: installUpdate.url(options),
    method: 'post',
});

installUpdate.form = installUpdateForm;

const AppVersionController = {
    show,
    updateStatus,
    checkForUpdates,
    installUpdate,
};

export default AppVersionController;
