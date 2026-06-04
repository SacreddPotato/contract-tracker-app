import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AppVersionController::check
* @see app/Http/Controllers/AppVersionController.php:19
* @route '/api/app/updates/check'
*/
export const check = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: check.url(options),
    method: 'post',
})

check.definition = {
    methods: ["post"],
    url: '/api/app/updates/check',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AppVersionController::check
* @see app/Http/Controllers/AppVersionController.php:19
* @route '/api/app/updates/check'
*/
check.url = (options?: RouteQueryOptions) => {




    return check.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppVersionController::check
* @see app/Http/Controllers/AppVersionController.php:19
* @route '/api/app/updates/check'
*/
check.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: check.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AppVersionController::check
* @see app/Http/Controllers/AppVersionController.php:19
* @route '/api/app/updates/check'
*/
const checkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: check.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AppVersionController::check
* @see app/Http/Controllers/AppVersionController.php:19
* @route '/api/app/updates/check'
*/
checkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: check.url(options),
    method: 'post',
})

check.form = checkForm



const updates = {
    check: Object.assign(check, check),
}

export default updates