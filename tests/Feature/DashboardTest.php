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

    public function test_dashboard_shell_includes_runtime_supabase_web_config()
    {
        config()->set('supabase.url', 'https://test-project.supabase.co');
        config()->set('supabase.publishable_key', 'test-publishable-key');

        $response = $this->get(route('dashboard'));

        $response
            ->assertOk()
            ->assertSee('window.__contractTrackerConfig', false)
            ->assertSee('"url":"https:\/\/test-project.supabase.co"', false)
            ->assertSee('"publishableKey":"test-publishable-key"', false);
    }

    public function test_dashboard_shell_omits_empty_runtime_supabase_web_config_values()
    {
        config()->set('supabase.url', '   ');
        config()->set('supabase.publishable_key', '');

        $response = $this->get(route('dashboard'));

        $response
            ->assertOk()
            ->assertSee('window.__contractTrackerConfig', false)
            ->assertSee('"supabase":[]', false);
    }
}
