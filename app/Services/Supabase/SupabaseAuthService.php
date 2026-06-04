<?php

namespace App\Services\Supabase;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Throwable;

class SupabaseAuthService
{
    public function __construct(private readonly SupabaseClient $client) {}

    /**
     * @return array{id: string}
     */
    public function userFromRequest(Request $request): array
    {
        $token = $request->bearerToken();

        if (! is_string($token) || trim($token) === '') {
            throw new UnauthorizedHttpException('Bearer', 'A Supabase access token is required.');
        }

        try {
            $response = $this->client->auth($token)->get('/user');
        } catch (ConnectionException) {
            throw new ServiceUnavailableHttpException(null, 'Supabase authentication is unavailable.');
        } catch (Throwable $exception) {
            throw new HttpException(503, $exception->getMessage(), $exception);
        }

        if ($response->unauthorized()) {
            throw new UnauthorizedHttpException('Bearer', 'The Supabase access token is invalid.');
        }

        if (! $response->successful()) {
            throw new ServiceUnavailableHttpException(null, 'Supabase authentication is unavailable.');
        }

        $user = $response->json();
        $userId = is_array($user) ? $user['id'] ?? null : null;

        if (! is_string($userId) || $userId === '') {
            throw new UnauthorizedHttpException('Bearer', 'The Supabase access token is invalid.');
        }

        return ['id' => $userId];
    }
}
