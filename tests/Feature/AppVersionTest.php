<?php

namespace Tests\Feature;

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

    public function test_it_reports_updates_as_disabled_when_the_updater_is_off(): void
    {
        Config::set('release.updater.enabled', false);

        $this->postJson('/api/app/updates/check')
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
    }
}
