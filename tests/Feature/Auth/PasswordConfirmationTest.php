<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PasswordConfirmationTest extends TestCase
{
    use RefreshDatabase;

    public function test_confirm_password_screen_can_be_rendered()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('password.confirm'));

        $response
            ->assertOk()
            ->assertSee('id="root"', false)
            ->assertDontSee('data-page', false);
    }

    public function test_password_confirmation_screen_is_react_owned_for_guests()
    {
        $response = $this->get(route('password.confirm'));

        $response
            ->assertOk()
            ->assertSee('id="root"', false)
            ->assertDontSee('data-page', false);
    }
}
