<?php

namespace App\Services\Supabase;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class SupabaseClient
{
    public function auth(string $accessToken): PendingRequest
    {
        return $this->request($accessToken)->baseUrl($this->url().'/auth/v1');
    }

    public function rest(string $accessToken): PendingRequest
    {
        return $this->request($accessToken)->baseUrl($this->url().'/rest/v1');
    }

    private function request(string $accessToken): PendingRequest
    {
        return Http::acceptJson()
            ->asJson()
            ->withHeaders([
                'Authorization' => 'Bearer '.$accessToken,
                'apikey' => $this->publishableKey(),
            ]);
    }

    private function url(): string
    {
        $url = config('supabase.url');

        if (! is_string($url) || trim($url) === '') {
            throw new RuntimeException('Supabase URL is not configured.');
        }

        return rtrim(trim($url), '/');
    }

    private function publishableKey(): string
    {
        $key = config('supabase.publishable_key');

        if (! is_string($key) || trim($key) === '') {
            throw new RuntimeException('Supabase publishable key is not configured.');
        }

        return trim($key);
    }
}
