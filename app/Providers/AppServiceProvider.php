<?php

namespace App\Providers;

use App\Services\AppVersionService;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->listenForNativeUpdaterEvents();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    protected function listenForNativeUpdaterEvents(): void
    {
        $events = [
            'Native\\Desktop\\Events\\AutoUpdater\\CheckingForUpdate' => 'checking',
            'Native\\Desktop\\Events\\AutoUpdater\\UpdateAvailable' => 'checking',
            'Native\\Desktop\\Events\\AutoUpdater\\UpdateDownloaded' => 'downloaded',
            'Native\\Desktop\\Events\\AutoUpdater\\UpdateNotAvailable' => 'unavailable',
            'Native\\Desktop\\Events\\AutoUpdater\\UpdateCancelled' => 'unavailable',
            'Native\\Desktop\\Events\\AutoUpdater\\Error' => 'error',
        ];

        foreach ($events as $event => $status) {
            if (! class_exists($event)) {
                continue;
            }

            Event::listen($event, function () use ($status): void {
                app(AppVersionService::class)->recordUpdateStatus($status);
            });
        }
    }
}
