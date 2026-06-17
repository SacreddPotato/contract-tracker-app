<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_load_the_react_owned_dashboard_shell()
    {
        $response = $this->get(route('dashboard'));
        $response
            ->assertOk()
            ->assertSee('id="root"', false)
            ->assertDontSee('data-page', false);
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response
            ->assertOk()
            ->assertSee('id="root"', false)
            ->assertDontSee('data-page', false);
    }

    public function test_dashboard_shell_includes_runtime_app_api_token()
    {
        config()->set('app.api_token', 'test-local-token');
        config()->set('neon.default_branch', 'testing');
        config()->set('neon.dev_branch_toggle_enabled', true);

        $response = $this->get(route('dashboard'));

        $response
            ->assertOk()
            ->assertSee('window.__contractTrackerConfig', false)
            ->assertSee('"databaseBranch":"testing"', false)
            ->assertSee('"databaseBranchToggleEnabled":true', false)
            ->assertSee('"token":"test-local-token"', false);
    }

    public function test_dashboard_shell_omits_empty_runtime_app_api_token()
    {
        config()->set('app.api_token', '   ');

        $response = $this->get(route('dashboard'));

        $response
            ->assertOk()
            ->assertSee('window.__contractTrackerConfig', false)
            ->assertSee('"databaseBranch"', false)
            ->assertDontSee('"token"', false);
    }
}
