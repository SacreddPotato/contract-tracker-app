<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class EnsureAppApiToken
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $configuredToken = config('app.api_token');

        if (! is_string($configuredToken) || trim($configuredToken) === '') {
            throw new ServiceUnavailableHttpException(null, 'The app API token is not configured.');
        }

        $requestToken = $request->bearerToken();

        if (! is_string($requestToken) || ! hash_equals($configuredToken, $requestToken)) {
            throw new UnauthorizedHttpException('Bearer', 'A valid app API token is required.');
        }

        return $next($request);
    }
}
