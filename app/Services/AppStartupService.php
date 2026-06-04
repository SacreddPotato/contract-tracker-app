<?php

namespace App\Services;

use Throwable;

class AppStartupService
{
    /**
     * @return array{enabled: bool, status: string}
     */
    public function preference(): array
    {
        if (! $this->nativeRuntimeAvailable()) {
            return $this->unavailable();
        }

        $app = 'Native\\Desktop\\Facades\\App';

        try {
            return [
                'enabled' => (bool) $app::openAtLogin(),
                'status' => 'handled',
            ];
        } catch (Throwable) {
            return $this->unavailable();
        }
    }

    /**
     * @return array{enabled: bool, status: string}
     */
    public function setPreference(bool $enabled): array
    {
        if (! $this->nativeRuntimeAvailable()) {
            return $this->unavailable();
        }

        $app = 'Native\\Desktop\\Facades\\App';

        try {
            return [
                'enabled' => (bool) $app::openAtLogin($enabled),
                'status' => 'handled',
            ];
        } catch (Throwable) {
            return $this->unavailable();
        }
    }

    private function nativeRuntimeAvailable(): bool
    {
        return (bool) config('nativephp-internal.running')
            && class_exists('Native\\Desktop\\Facades\\App');
    }

    /**
     * @return array{enabled: bool, status: string}
     */
    private function unavailable(): array
    {
        return [
            'enabled' => false,
            'status' => 'unavailable',
        ];
    }
}
