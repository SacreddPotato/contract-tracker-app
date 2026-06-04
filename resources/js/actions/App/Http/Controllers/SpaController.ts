import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
const SpaController980bb49ee7ae63891f1d891d2fbcf1c9 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
});

SpaController980bb49ee7ae63891f1d891d2fbcf1c9.definition = {
    methods: ['get', 'head'],
    url: '/',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
SpaController980bb49ee7ae63891f1d891d2fbcf1c9.url = (
    options?: RouteQueryOptions,
) => {
    return (
        SpaController980bb49ee7ae63891f1d891d2fbcf1c9.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
SpaController980bb49ee7ae63891f1d891d2fbcf1c9.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
SpaController980bb49ee7ae63891f1d891d2fbcf1c9.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: SpaController980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
const SpaController980bb49ee7ae63891f1d891d2fbcf1c9Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
SpaController980bb49ee7ae63891f1d891d2fbcf1c9Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/'
 */
SpaController980bb49ee7ae63891f1d891d2fbcf1c9Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController980bb49ee7ae63891f1d891d2fbcf1c9.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

SpaController980bb49ee7ae63891f1d891d2fbcf1c9.form =
    SpaController980bb49ee7ae63891f1d891d2fbcf1c9Form;
/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
const SpaController42a740574ecbfbac32f8cc353fc32db9 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
});

SpaController42a740574ecbfbac32f8cc353fc32db9.definition = {
    methods: ['get', 'head'],
    url: '/dashboard',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
SpaController42a740574ecbfbac32f8cc353fc32db9.url = (
    options?: RouteQueryOptions,
) => {
    return (
        SpaController42a740574ecbfbac32f8cc353fc32db9.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
SpaController42a740574ecbfbac32f8cc353fc32db9.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
SpaController42a740574ecbfbac32f8cc353fc32db9.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: SpaController42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
const SpaController42a740574ecbfbac32f8cc353fc32db9Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
SpaController42a740574ecbfbac32f8cc353fc32db9Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/dashboard'
 */
SpaController42a740574ecbfbac32f8cc353fc32db9Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController42a740574ecbfbac32f8cc353fc32db9.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

SpaController42a740574ecbfbac32f8cc353fc32db9.form =
    SpaController42a740574ecbfbac32f8cc353fc32db9Form;
/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
const SpaControllerb6041c76e8e1cd791f8f89d035d48611 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaControllerb6041c76e8e1cd791f8f89d035d48611.url(options),
    method: 'get',
});

SpaControllerb6041c76e8e1cd791f8f89d035d48611.definition = {
    methods: ['get', 'head'],
    url: '/login',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
SpaControllerb6041c76e8e1cd791f8f89d035d48611.url = (
    options?: RouteQueryOptions,
) => {
    return (
        SpaControllerb6041c76e8e1cd791f8f89d035d48611.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
SpaControllerb6041c76e8e1cd791f8f89d035d48611.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaControllerb6041c76e8e1cd791f8f89d035d48611.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
SpaControllerb6041c76e8e1cd791f8f89d035d48611.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: SpaControllerb6041c76e8e1cd791f8f89d035d48611.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
const SpaControllerb6041c76e8e1cd791f8f89d035d48611Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaControllerb6041c76e8e1cd791f8f89d035d48611.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
SpaControllerb6041c76e8e1cd791f8f89d035d48611Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaControllerb6041c76e8e1cd791f8f89d035d48611.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/login'
 */
SpaControllerb6041c76e8e1cd791f8f89d035d48611Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaControllerb6041c76e8e1cd791f8f89d035d48611.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

SpaControllerb6041c76e8e1cd791f8f89d035d48611.form =
    SpaControllerb6041c76e8e1cd791f8f89d035d48611Form;
/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
const SpaControllere9819db9819a1d19b38dd89a0c4218c4 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaControllere9819db9819a1d19b38dd89a0c4218c4.url(options),
    method: 'get',
});

SpaControllere9819db9819a1d19b38dd89a0c4218c4.definition = {
    methods: ['get', 'head'],
    url: '/register',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
SpaControllere9819db9819a1d19b38dd89a0c4218c4.url = (
    options?: RouteQueryOptions,
) => {
    return (
        SpaControllere9819db9819a1d19b38dd89a0c4218c4.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
SpaControllere9819db9819a1d19b38dd89a0c4218c4.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaControllere9819db9819a1d19b38dd89a0c4218c4.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
SpaControllere9819db9819a1d19b38dd89a0c4218c4.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: SpaControllere9819db9819a1d19b38dd89a0c4218c4.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
const SpaControllere9819db9819a1d19b38dd89a0c4218c4Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaControllere9819db9819a1d19b38dd89a0c4218c4.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
SpaControllere9819db9819a1d19b38dd89a0c4218c4Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaControllere9819db9819a1d19b38dd89a0c4218c4.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/register'
 */
SpaControllere9819db9819a1d19b38dd89a0c4218c4Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaControllere9819db9819a1d19b38dd89a0c4218c4.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

SpaControllere9819db9819a1d19b38dd89a0c4218c4.form =
    SpaControllere9819db9819a1d19b38dd89a0c4218c4Form;
/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/forgot-password'
 */
const SpaController19019de5652af051dc199e877d041d33 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController19019de5652af051dc199e877d041d33.url(options),
    method: 'get',
});

SpaController19019de5652af051dc199e877d041d33.definition = {
    methods: ['get', 'head'],
    url: '/forgot-password',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/forgot-password'
 */
SpaController19019de5652af051dc199e877d041d33.url = (
    options?: RouteQueryOptions,
) => {
    return (
        SpaController19019de5652af051dc199e877d041d33.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/forgot-password'
 */
SpaController19019de5652af051dc199e877d041d33.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController19019de5652af051dc199e877d041d33.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/forgot-password'
 */
SpaController19019de5652af051dc199e877d041d33.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: SpaController19019de5652af051dc199e877d041d33.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/forgot-password'
 */
const SpaController19019de5652af051dc199e877d041d33Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController19019de5652af051dc199e877d041d33.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/forgot-password'
 */
SpaController19019de5652af051dc199e877d041d33Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController19019de5652af051dc199e877d041d33.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/forgot-password'
 */
SpaController19019de5652af051dc199e877d041d33Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController19019de5652af051dc199e877d041d33.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

SpaController19019de5652af051dc199e877d041d33.form =
    SpaController19019de5652af051dc199e877d041d33Form;
/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/reset-password/{token}'
 */
const SpaController784bb30b123acd5cf553758712ebb4d6 = (
    args:
        | { token: string | number }
        | [token: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController784bb30b123acd5cf553758712ebb4d6.url(args, options),
    method: 'get',
});

SpaController784bb30b123acd5cf553758712ebb4d6.definition = {
    methods: ['get', 'head'],
    url: '/reset-password/{token}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/reset-password/{token}'
 */
SpaController784bb30b123acd5cf553758712ebb4d6.url = (
    args:
        | { token: string | number }
        | [token: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args };
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        token: args.token,
    };

    return (
        SpaController784bb30b123acd5cf553758712ebb4d6.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/reset-password/{token}'
 */
SpaController784bb30b123acd5cf553758712ebb4d6.get = (
    args:
        | { token: string | number }
        | [token: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController784bb30b123acd5cf553758712ebb4d6.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/reset-password/{token}'
 */
SpaController784bb30b123acd5cf553758712ebb4d6.head = (
    args:
        | { token: string | number }
        | [token: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: SpaController784bb30b123acd5cf553758712ebb4d6.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/reset-password/{token}'
 */
const SpaController784bb30b123acd5cf553758712ebb4d6Form = (
    args:
        | { token: string | number }
        | [token: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController784bb30b123acd5cf553758712ebb4d6.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/reset-password/{token}'
 */
SpaController784bb30b123acd5cf553758712ebb4d6Form.get = (
    args:
        | { token: string | number }
        | [token: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController784bb30b123acd5cf553758712ebb4d6.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/reset-password/{token}'
 */
SpaController784bb30b123acd5cf553758712ebb4d6Form.head = (
    args:
        | { token: string | number }
        | [token: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController784bb30b123acd5cf553758712ebb4d6.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

SpaController784bb30b123acd5cf553758712ebb4d6.form =
    SpaController784bb30b123acd5cf553758712ebb4d6Form;
/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/verify-email'
 */
const SpaController8c3ba70f7c164aec5ec59d449e581883 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController8c3ba70f7c164aec5ec59d449e581883.url(options),
    method: 'get',
});

SpaController8c3ba70f7c164aec5ec59d449e581883.definition = {
    methods: ['get', 'head'],
    url: '/verify-email',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/verify-email'
 */
SpaController8c3ba70f7c164aec5ec59d449e581883.url = (
    options?: RouteQueryOptions,
) => {
    return (
        SpaController8c3ba70f7c164aec5ec59d449e581883.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/verify-email'
 */
SpaController8c3ba70f7c164aec5ec59d449e581883.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController8c3ba70f7c164aec5ec59d449e581883.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/verify-email'
 */
SpaController8c3ba70f7c164aec5ec59d449e581883.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: SpaController8c3ba70f7c164aec5ec59d449e581883.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/verify-email'
 */
const SpaController8c3ba70f7c164aec5ec59d449e581883Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController8c3ba70f7c164aec5ec59d449e581883.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/verify-email'
 */
SpaController8c3ba70f7c164aec5ec59d449e581883Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController8c3ba70f7c164aec5ec59d449e581883.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/verify-email'
 */
SpaController8c3ba70f7c164aec5ec59d449e581883Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController8c3ba70f7c164aec5ec59d449e581883.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

SpaController8c3ba70f7c164aec5ec59d449e581883.form =
    SpaController8c3ba70f7c164aec5ec59d449e581883Form;
/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/confirm-password'
 */
const SpaController80954449d08918a64e010cb0312cc579 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController80954449d08918a64e010cb0312cc579.url(options),
    method: 'get',
});

SpaController80954449d08918a64e010cb0312cc579.definition = {
    methods: ['get', 'head'],
    url: '/confirm-password',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/confirm-password'
 */
SpaController80954449d08918a64e010cb0312cc579.url = (
    options?: RouteQueryOptions,
) => {
    return (
        SpaController80954449d08918a64e010cb0312cc579.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/confirm-password'
 */
SpaController80954449d08918a64e010cb0312cc579.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController80954449d08918a64e010cb0312cc579.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/confirm-password'
 */
SpaController80954449d08918a64e010cb0312cc579.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: SpaController80954449d08918a64e010cb0312cc579.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/confirm-password'
 */
const SpaController80954449d08918a64e010cb0312cc579Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController80954449d08918a64e010cb0312cc579.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/confirm-password'
 */
SpaController80954449d08918a64e010cb0312cc579Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController80954449d08918a64e010cb0312cc579.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/confirm-password'
 */
SpaController80954449d08918a64e010cb0312cc579Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController80954449d08918a64e010cb0312cc579.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

SpaController80954449d08918a64e010cb0312cc579.form =
    SpaController80954449d08918a64e010cb0312cc579Form;
/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/two-factor-challenge'
 */
const SpaController94955f36ab52d35b615164d0e594d6d6 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController94955f36ab52d35b615164d0e594d6d6.url(options),
    method: 'get',
});

SpaController94955f36ab52d35b615164d0e594d6d6.definition = {
    methods: ['get', 'head'],
    url: '/two-factor-challenge',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/two-factor-challenge'
 */
SpaController94955f36ab52d35b615164d0e594d6d6.url = (
    options?: RouteQueryOptions,
) => {
    return (
        SpaController94955f36ab52d35b615164d0e594d6d6.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/two-factor-challenge'
 */
SpaController94955f36ab52d35b615164d0e594d6d6.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaController94955f36ab52d35b615164d0e594d6d6.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/two-factor-challenge'
 */
SpaController94955f36ab52d35b615164d0e594d6d6.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: SpaController94955f36ab52d35b615164d0e594d6d6.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/two-factor-challenge'
 */
const SpaController94955f36ab52d35b615164d0e594d6d6Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController94955f36ab52d35b615164d0e594d6d6.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/two-factor-challenge'
 */
SpaController94955f36ab52d35b615164d0e594d6d6Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController94955f36ab52d35b615164d0e594d6d6.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/two-factor-challenge'
 */
SpaController94955f36ab52d35b615164d0e594d6d6Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaController94955f36ab52d35b615164d0e594d6d6.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

SpaController94955f36ab52d35b615164d0e594d6d6.form =
    SpaController94955f36ab52d35b615164d0e594d6d6Form;
/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
const SpaControllere82770d06df9f3de57e12c6f4a3eb557 = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaControllere82770d06df9f3de57e12c6f4a3eb557.url(args, options),
    method: 'get',
});

SpaControllere82770d06df9f3de57e12c6f4a3eb557.definition = {
    methods: ['get', 'head'],
    url: '/{path}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
SpaControllere82770d06df9f3de57e12c6f4a3eb557.url = (
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
        SpaControllere82770d06df9f3de57e12c6f4a3eb557.definition.url
            .replace('{path}', parsedArgs.path.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
SpaControllere82770d06df9f3de57e12c6f4a3eb557.get = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: SpaControllere82770d06df9f3de57e12c6f4a3eb557.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
SpaControllere82770d06df9f3de57e12c6f4a3eb557.head = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: SpaControllere82770d06df9f3de57e12c6f4a3eb557.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
const SpaControllere82770d06df9f3de57e12c6f4a3eb557Form = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaControllere82770d06df9f3de57e12c6f4a3eb557.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
SpaControllere82770d06df9f3de57e12c6f4a3eb557Form.get = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaControllere82770d06df9f3de57e12c6f4a3eb557.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SpaController::__invoke
 * @see app/Http/Controllers/SpaController.php:10
 * @route '/{path}'
 */
SpaControllere82770d06df9f3de57e12c6f4a3eb557Form.head = (
    args: { path: string | number } | [path: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: SpaControllere82770d06df9f3de57e12c6f4a3eb557.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

SpaControllere82770d06df9f3de57e12c6f4a3eb557.form =
    SpaControllere82770d06df9f3de57e12c6f4a3eb557Form;

/**
 * Multiple routes resolve to \App\Http\Controllers\SpaController::SpaController, so this export is a
 * dictionary keyed by URI rather than a callable. Call a specific route with `SpaController['<uri>'](...)`,
 * or import the route by name from your generated `routes/` directory.
 */
const SpaController = {
    '/': SpaController980bb49ee7ae63891f1d891d2fbcf1c9,
    '/dashboard': SpaController42a740574ecbfbac32f8cc353fc32db9,
    '/login': SpaControllerb6041c76e8e1cd791f8f89d035d48611,
    '/register': SpaControllere9819db9819a1d19b38dd89a0c4218c4,
    '/forgot-password': SpaController19019de5652af051dc199e877d041d33,
    '/reset-password/{token}': SpaController784bb30b123acd5cf553758712ebb4d6,
    '/verify-email': SpaController8c3ba70f7c164aec5ec59d449e581883,
    '/confirm-password': SpaController80954449d08918a64e010cb0312cc579,
    '/two-factor-challenge': SpaController94955f36ab52d35b615164d0e594d6d6,
    '/{path}': SpaControllere82770d06df9f3de57e12c6f4a3eb557,
};

export default SpaController;
