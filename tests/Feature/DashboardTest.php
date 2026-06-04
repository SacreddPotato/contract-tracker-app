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

    public function test_dashboard_shell_includes_runtime_firebase_web_config()
    {
        config()->set('firebase.web', [
            'apiKey' => 'test-api-key',
            'authDomain' => 'test-project.firebaseapp.com',
            'projectId' => 'test-project',
            'storageBucket' => 'test-project.appspot.com',
            'messagingSenderId' => '123456789',
            'appId' => '1:123456789:web:abcdef',
        ]);

        $response = $this->get(route('dashboard'));

        $response
            ->assertOk()
            ->assertSee('window.__contractTrackerConfig', false)
            ->assertSee('"projectId":"test-project"', false);
    }
}
