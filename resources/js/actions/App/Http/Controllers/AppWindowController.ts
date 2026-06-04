import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\AppWindowController::minimize
 * @see app/Http/Controllers/AppWindowController.php:14
 * @route '/api/app/window/minimize'
 */
export const minimize = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: minimize.url(options),
    method: 'post',
});

minimize.definition = {
    methods: ['post'],
    url: '/api/app/window/minimize',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AppWindowController::minimize
 * @see app/Http/Controllers/AppWindowController.php:14
 * @route '/api/app/window/minimize'
 */
minimize.url = (options?: RouteQueryOptions) => {
    return minimize.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppWindowController::minimize
 * @see app/Http/Controllers/AppWindowController.php:14
 * @route '/api/app/window/minimize'
 */
minimize.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: minimize.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppWindowController::minimize
 * @see app/Http/Controllers/AppWindowController.php:14
 * @route '/api/app/window/minimize'
 */
const minimizeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: minimize.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppWindowController::minimize
 * @see app/Http/Controllers/AppWindowController.php:14
 * @route '/api/app/window/minimize'
 */
minimizeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: minimize.url(options),
    method: 'post',
});

minimize.form = minimizeForm;

/**
 * @see \App\Http\Controllers\AppWindowController::maximize
 * @see app/Http/Controllers/AppWindowController.php:19
 * @route '/api/app/window/maximize'
 */
export const maximize = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: maximize.url(options),
    method: 'post',
});

maximize.definition = {
    methods: ['post'],
    url: '/api/app/window/maximize',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AppWindowController::maximize
 * @see app/Http/Controllers/AppWindowController.php:19
 * @route '/api/app/window/maximize'
 */
maximize.url = (options?: RouteQueryOptions) => {
    return maximize.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppWindowController::maximize
 * @see app/Http/Controllers/AppWindowController.php:19
 * @route '/api/app/window/maximize'
 */
maximize.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: maximize.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppWindowController::maximize
 * @see app/Http/Controllers/AppWindowController.php:19
 * @route '/api/app/window/maximize'
 */
const maximizeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: maximize.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppWindowController::maximize
 * @see app/Http/Controllers/AppWindowController.php:19
 * @route '/api/app/window/maximize'
 */
maximizeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: maximize.url(options),
    method: 'post',
});

maximize.form = maximizeForm;

/**
 * @see \App\Http\Controllers\AppWindowController::restore
 * @see app/Http/Controllers/AppWindowController.php:24
 * @route '/api/app/window/restore'
 */
export const restore = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: restore.url(options),
    method: 'post',
});

restore.definition = {
    methods: ['post'],
    url: '/api/app/window/restore',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AppWindowController::restore
 * @see app/Http/Controllers/AppWindowController.php:24
 * @route '/api/app/window/restore'
 */
restore.url = (options?: RouteQueryOptions) => {
    return restore.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppWindowController::restore
 * @see app/Http/Controllers/AppWindowController.php:24
 * @route '/api/app/window/restore'
 */
restore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppWindowController::restore
 * @see app/Http/Controllers/AppWindowController.php:24
 * @route '/api/app/window/restore'
 */
const restoreForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: restore.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppWindowController::restore
 * @see app/Http/Controllers/AppWindowController.php:24
 * @route '/api/app/window/restore'
 */
restoreForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: restore.url(options),
    method: 'post',
});

restore.form = restoreForm;

/**
 * @see \App\Http\Controllers\AppWindowController::close
 * @see app/Http/Controllers/AppWindowController.php:29
 * @route '/api/app/window/close'
 */
export const close = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: close.url(options),
    method: 'post',
});

close.definition = {
    methods: ['post'],
    url: '/api/app/window/close',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AppWindowController::close
 * @see app/Http/Controllers/AppWindowController.php:29
 * @route '/api/app/window/close'
 */
close.url = (options?: RouteQueryOptions) => {
    return close.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppWindowController::close
 * @see app/Http/Controllers/AppWindowController.php:29
 * @route '/api/app/window/close'
 */
close.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppWindowController::close
 * @see app/Http/Controllers/AppWindowController.php:29
 * @route '/api/app/window/close'
 */
const closeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: close.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppWindowController::close
 * @see app/Http/Controllers/AppWindowController.php:29
 * @route '/api/app/window/close'
 */
closeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: close.url(options),
    method: 'post',
});

close.form = closeForm;

const AppWindowController = { minimize, maximize, restore, close };

export default AppWindowController;
