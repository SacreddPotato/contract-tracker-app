<?php

namespace App\Services;

use Throwable;

class AppVersionService
{
    /**
     * @return array{version: string, channel: string, provider: string}
     */
    public function version(): array
    {
        return [
            'version' => (string) config('release.version'),
            'channel' => (string) config('release.channel'),
            'provider' => (string) config('release.provider'),
        ];
    }

    public function checkForUpdates(): string
    {
        if (! (bool) config('release.updater.enabled')) {
            return 'disabled';
        }

        if (! app()->isProduction()) {
            return 'unavailable';
        }

        $autoUpdater = 'Native\\Desktop\\Facades\\AutoUpdater';

        if (! class_exists($autoUpdater)) {
            return 'unavailable';
        }

        try {
            $autoUpdater::checkForUpdates();
        } catch (Throwable) {
            return 'unavailable';
        }

        return 'checking';
    }
}
