<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_settings_are_returned_as_api_json()
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this->getJson(route('api.settings.profile.show'))
            ->assertOk()
            ->assertJsonPath('data.user.id', $user->id)
            ->assertJsonPath('data.user.name', $user->name)
            ->assertJsonPath('data.user.email', $user->email)
            ->assertJsonStructure([
                'data' => [
                    'user' => ['id', 'name', 'email', 'email_verified_at'],
                    'must_verify_email',
                ],
            ]);
    }

    public function test_profile_information_can_be_updated()
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this
            ->patchJson(route('api.settings.profile.update'), [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.user.name', 'Test User')
            ->assertJsonPath('data.user.email', 'test@example.com');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged()
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this
            ->patchJson(route('api.settings.profile.update'), [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response->assertOk();

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account()
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this
            ->deleteJson(route('api.settings.profile.destroy'), [
                'password' => 'password',
            ]);

        $response->assertNoContent();

        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account()
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this
            ->deleteJson(route('api.settings.profile.destroy'), [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('password');

        $this->assertNotNull($user->fresh());
    }
}
