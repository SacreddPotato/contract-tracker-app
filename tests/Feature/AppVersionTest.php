<?php

namespace Tests\Feature;

use App\Services\AppVersionService;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class AppVersionTest extends TestCase
{
    public function test_it_returns_local_app_version_metadata(): void
    {
        Config::set('release.version', 'v0.1.123');
        Config::set('release.channel', 'latest');
        Config::set('release.provider', 'github');

        $this->getJson('/api/app/version')
            ->assertOk()
            ->assertJson([
                'version' => 'v0.1.123',
                'channel' => 'latest',
                'provider' => 'github',
            ]);
    }

    public function test_production_environment_template_does_not_pin_release_version_to_zero(): void
    {
        $template = file_get_contents(base_path('.env.production.example'));

        $this->assertIsString($template);
        $this->assertDoesNotMatchRegularExpression(
            '/^NATIVEPHP_APP_VERSION=0\.0\.0$/m',
            $template
        );
        $this->assertStringContainsString(
            'NATIVEPHP_APP_VERSION=0.0.0-dev',
            $template
        );
    }

    public function test_it_reports_updates_as_disabled_when_the_updater_is_off(): void
    {
        Config::set('release.updater.enabled', false);

        $this->postJson('/api/app/updates/check')
            ->assertOk()
            ->assertJson([
                'status' => 'disabled',
            ]);

        $this->postJson('/api/app/updates/install')
            ->assertOk()
            ->assertJson([
                'status' => 'disabled',
            ]);
    }

    public function test_it_does_not_run_desktop_update_checks_outside_production_builds(): void
    {
        Config::set('release.updater.enabled', true);

        $this->postJson('/api/app/updates/check')
            ->assertOk()
            ->assertJson([
                'status' => 'unavailable',
            ]);

        $this->postJson('/api/app/updates/install')
            ->assertOk()
            ->assertJson([
                'status' => 'unavailable',
            ]);
    }

    public function test_it_can_install_downloaded_native_updates_through_the_update_service(): void
    {
        $calls = [];

        $this->app->instance(AppVersionService::class, new class($calls) extends AppVersionService
        {
            public function __construct(private array &$calls) {}

            public function installDownloadedUpdate(): string
            {
                $this->calls[] = 'install';

                return 'installing';
            }
        });

        $this->postJson('/api/app/updates/install')
            ->assertOk()
            ->assertJson([
                'status' => 'installing',
            ]);

        $this->assertSame(['install'], $calls);
    }
}
