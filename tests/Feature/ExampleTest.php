<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_root_route_returns_the_react_app_shell()
    {
        $response = $this->get('/');

        $response
            ->assertOk()
            ->assertSee('id="root"', false)
            ->assertDontSee('data-page', false);
    }

    public function test_frontend_routes_are_owned_by_the_react_app_shell()
    {
        foreach (['/dashboard', '/settings/profile', '/settings/security', '/login'] as $path) {
            $this->get($path)
                ->assertOk()
                ->assertSee('id="root"', false)
                ->assertDontSee('data-page', false);
        }
    }
}
