<?php

namespace Tests\Feature;

use App\Services\AppStartupService;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class AppStartupTest extends TestCase
{
    public function test_it_reports_startup_preference_as_unavailable_outside_nativephp(): void
    {
        Config::set('nativephp-internal.running', false);

        $this->getJson('/api/app/startup')
            ->assertOk()
            ->assertJson([
                'enabled' => false,
                'status' => 'unavailable',
            ]);

        $this->putJson('/api/app/startup', ['enabled' => true])
            ->assertOk()
            ->assertJson([
                'enabled' => false,
                'status' => 'unavailable',
            ]);
    }

    public function test_it_accepts_boolean_startup_preference_payloads(): void
    {
        $this->app->instance(AppStartupService::class, new class extends AppStartupService
        {
            private bool $enabled = false;

            /**
             * @return array{enabled: bool, status: string}
             */
            public function preference(): array
            {
                return [
                    'enabled' => $this->enabled,
                    'status' => 'handled',
                ];
            }

            /**
             * @return array{enabled: bool, status: string}
             */
            public function setPreference(bool $enabled): array
            {
                $this->enabled = $enabled;

                return $this->preference();
            }
        });

        $this->putJson('/api/app/startup', ['enabled' => true])
            ->assertOk()
            ->assertJson([
                'enabled' => true,
                'status' => 'handled',
            ]);
    }
}
