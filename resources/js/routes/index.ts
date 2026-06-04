import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../wayfinder';
/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
export const logout = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
});

logout.definition = {
    methods: ['post'],
    url: '/logout',
} satisfies RouteDefinition<['post']>;

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options);
};

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
const logoutForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logoutForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
});

logout.form = logoutForm;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
});

home.definition = {
    methods: ['get', 'head'],
    url: '/',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

home.form = homeForm;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
export const dashboard = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
});

dashboard.definition = {
    methods: ['get', 'head'],
    url: '/dashboard',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
const dashboardForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
dashboardForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
dashboardForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

dashboard.form = dashboardForm;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
});

login.definition = {
    methods: ['get', 'head'],
    url: '/login',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
const loginForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

login.form = loginForm;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
export const register = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
});

register.definition = {
    methods: ['get', 'head'],
    url: '/register',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
const registerForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: register.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
registerForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: register.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
registerForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: register.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

register.form = registerForm;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
export const spa = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: spa.url(args, options),
    method: 'get',
});

spa.definition = {
    methods: ['get', 'head'],
    url: '/{path}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
spa.url = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { path: args };
    }

    if (Array.isArray(args)) {
        args = {
            path: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        path: args.path,
    };

    return (
        spa.definition.url
            .replace('{path}', parsedArgs.path.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
spa.get = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: spa.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
spa.head = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: spa.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
const spaForm = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: spa.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
spaForm.get = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: spa.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
spaForm.head = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: spa.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

spa.form = spaForm;
