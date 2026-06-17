<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class UseProductDatabaseBranch
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $branch = $this->resolveBranch($request);
        $url = config("neon.branch_urls.{$branch}");

        if (is_string($url) && trim($url) !== '') {
            $connection = config('database.default');

            if (is_string($connection) && $connection !== '') {
                $connectionConfig = config("database.connections.{$connection}");

                if (! is_array($connectionConfig) || ($connectionConfig['driver'] ?? null) !== 'pgsql') {
                    return $next($request);
                }

                config(["database.connections.{$connection}.url" => trim($url)]);
                DB::purge($connection);
            }
        }

        return $next($request);
    }

    private function resolveBranch(Request $request): string
    {
        $defaultBranch = config('neon.default_branch', 'production');

        if (! is_string($defaultBranch) || ! in_array($defaultBranch, ['testing', 'production'], true)) {
            $defaultBranch = 'production';
        }

        if (config('neon.dev_branch_toggle_enabled') !== true) {
            return $defaultBranch;
        }

        $headerName = config('neon.branch_header', 'X-App-Database-Branch');
        $requestedBranch = is_string($headerName) ? $request->headers->get($headerName) : null;

        if (in_array($requestedBranch, ['testing', 'production'], true)) {
            return $requestedBranch;
        }

        return $defaultBranch;
    }
}
