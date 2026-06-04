<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Throwable;

class AppVersionService
{
    private const UPDATE_STATUS_CACHE_KEY = 'app-updates.status';

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
            $this->recordUpdateStatus('disabled');

            return 'disabled';
        }

        if (! app()->isProduction()) {
            $this->recordUpdateStatus('unavailable');

            return 'unavailable';
        }

        $autoUpdater = 'Native\\Desktop\\Facades\\AutoUpdater';

        if (! class_exists($autoUpdater)) {
            $this->recordUpdateStatus('unavailable');

            return 'unavailable';
        }

        try {
            $autoUpdater::checkForUpdates();
        } catch (Throwable) {
            $this->recordUpdateStatus('unavailable');

            return 'unavailable';
        }

        $this->recordUpdateStatus('checking');

        return 'checking';
    }

    public function updateStatus(): string
    {
        return (string) Cache::get(self::UPDATE_STATUS_CACHE_KEY, 'unavailable');
    }

    public function installDownloadedUpdate(): string
    {
        if (! (bool) config('release.updater.enabled')) {
            $this->recordUpdateStatus('disabled');

            return 'disabled';
        }

        if (! app()->isProduction()) {
            $this->recordUpdateStatus('unavailable');

            return 'unavailable';
        }

        $autoUpdater = 'Native\\Desktop\\Facades\\AutoUpdater';

        if (! class_exists($autoUpdater)) {
            $this->recordUpdateStatus('unavailable');

            return 'unavailable';
        }

        try {
            $autoUpdater::quitAndInstall();
        } catch (Throwable) {
            $this->recordUpdateStatus('unavailable');

            return 'unavailable';
        }

        $this->recordUpdateStatus('installing');

        return 'installing';
    }

    public function recordUpdateStatus(string $status): void
    {
        Cache::put(self::UPDATE_STATUS_CACHE_KEY, $status, now()->addDay());
    }
}
