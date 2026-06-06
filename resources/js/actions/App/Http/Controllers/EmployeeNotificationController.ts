import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\EmployeeNotificationController::index
 * @see app/Http/Controllers/EmployeeNotificationController.php:19
 * @route '/api/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/api/notifications',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::index
 * @see app/Http/Controllers/EmployeeNotificationController.php:19
 * @route '/api/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::index
 * @see app/Http/Controllers/EmployeeNotificationController.php:19
 * @route '/api/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::index
 * @see app/Http/Controllers/EmployeeNotificationController.php:19
 * @route '/api/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::index
 * @see app/Http/Controllers/EmployeeNotificationController.php:19
 * @route '/api/notifications'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::index
 * @see app/Http/Controllers/EmployeeNotificationController.php:19
 * @route '/api/notifications'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::index
 * @see app/Http/Controllers/EmployeeNotificationController.php:19
 * @route '/api/notifications'
 */
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

index.form = indexForm;

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::sync
 * @see app/Http/Controllers/EmployeeNotificationController.php:28
 * @route '/api/notifications/sync'
 */
export const sync = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
});

sync.definition = {
    methods: ['post'],
    url: '/api/notifications/sync',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::sync
 * @see app/Http/Controllers/EmployeeNotificationController.php:28
 * @route '/api/notifications/sync'
 */
sync.url = (options?: RouteQueryOptions) => {
    return sync.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::sync
 * @see app/Http/Controllers/EmployeeNotificationController.php:28
 * @route '/api/notifications/sync'
 */
sync.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::sync
 * @see app/Http/Controllers/EmployeeNotificationController.php:28
 * @route '/api/notifications/sync'
 */
const syncForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: sync.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::sync
 * @see app/Http/Controllers/EmployeeNotificationController.php:28
 * @route '/api/notifications/sync'
 */
syncForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sync.url(options),
    method: 'post',
});

sync.form = syncForm;

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::unreadCount
 * @see app/Http/Controllers/EmployeeNotificationController.php:37
 * @route '/api/notifications/unread-count'
 */
export const unreadCount = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
});

unreadCount.definition = {
    methods: ['get', 'head'],
    url: '/api/notifications/unread-count',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::unreadCount
 * @see app/Http/Controllers/EmployeeNotificationController.php:37
 * @route '/api/notifications/unread-count'
 */
unreadCount.url = (options?: RouteQueryOptions) => {
    return unreadCount.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::unreadCount
 * @see app/Http/Controllers/EmployeeNotificationController.php:37
 * @route '/api/notifications/unread-count'
 */
unreadCount.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::unreadCount
 * @see app/Http/Controllers/EmployeeNotificationController.php:37
 * @route '/api/notifications/unread-count'
 */
unreadCount.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unreadCount.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::unreadCount
 * @see app/Http/Controllers/EmployeeNotificationController.php:37
 * @route '/api/notifications/unread-count'
 */
const unreadCountForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: unreadCount.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::unreadCount
 * @see app/Http/Controllers/EmployeeNotificationController.php:37
 * @route '/api/notifications/unread-count'
 */
unreadCountForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: unreadCount.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::unreadCount
 * @see app/Http/Controllers/EmployeeNotificationController.php:37
 * @route '/api/notifications/unread-count'
 */
unreadCountForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: unreadCount.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

unreadCount.form = unreadCountForm;

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::markAllRead
 * @see app/Http/Controllers/EmployeeNotificationController.php:55
 * @route '/api/notifications/read-all'
 */
export const markAllRead = (
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: markAllRead.url(options),
    method: 'patch',
});

markAllRead.definition = {
    methods: ['patch'],
    url: '/api/notifications/read-all',
} satisfies RouteDefinition<['patch']>;

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::markAllRead
 * @see app/Http/Controllers/EmployeeNotificationController.php:55
 * @route '/api/notifications/read-all'
 */
markAllRead.url = (options?: RouteQueryOptions) => {
    return markAllRead.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::markAllRead
 * @see app/Http/Controllers/EmployeeNotificationController.php:55
 * @route '/api/notifications/read-all'
 */
markAllRead.patch = (
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: markAllRead.url(options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::markAllRead
 * @see app/Http/Controllers/EmployeeNotificationController.php:55
 * @route '/api/notifications/read-all'
 */
const markAllReadForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: markAllRead.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::markAllRead
 * @see app/Http/Controllers/EmployeeNotificationController.php:55
 * @route '/api/notifications/read-all'
 */
markAllReadForm.patch = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: markAllRead.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

markAllRead.form = markAllReadForm;

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::markRead
 * @see app/Http/Controllers/EmployeeNotificationController.php:46
 * @route '/api/notifications/{notification}/read'
 */
export const markRead = (
    args:
        | { notification: string | number }
        | [notification: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: markRead.url(args, options),
    method: 'patch',
});

markRead.definition = {
    methods: ['patch'],
    url: '/api/notifications/{notification}/read',
} satisfies RouteDefinition<['patch']>;

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::markRead
 * @see app/Http/Controllers/EmployeeNotificationController.php:46
 * @route '/api/notifications/{notification}/read'
 */
markRead.url = (
    args:
        | { notification: string | number }
        | [notification: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args };
    }

    if (Array.isArray(args)) {
        args = {
            notification: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        notification: args.notification,
    };

    return (
        markRead.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::markRead
 * @see app/Http/Controllers/EmployeeNotificationController.php:46
 * @route '/api/notifications/{notification}/read'
 */
markRead.patch = (
    args:
        | { notification: string | number }
        | [notification: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: markRead.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::markRead
 * @see app/Http/Controllers/EmployeeNotificationController.php:46
 * @route '/api/notifications/{notification}/read'
 */
const markReadForm = (
    args:
        | { notification: string | number }
        | [notification: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: markRead.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\EmployeeNotificationController::markRead
 * @see app/Http/Controllers/EmployeeNotificationController.php:46
 * @route '/api/notifications/{notification}/read'
 */
markReadForm.patch = (
    args:
        | { notification: string | number }
        | [notification: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: markRead.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

markRead.form = markReadForm;

const EmployeeNotificationController = {
    index,
    sync,
    unreadCount,
    markAllRead,
    markRead,
};

export default EmployeeNotificationController;
