<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\Features;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_security_settings_are_returned_as_api_json()
    {
        $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

        Features::twoFactorAuthentication([
            'confirm' => true,
            'confirmPassword' => true,
        ]);
        Features::passkeys([
            'confirmPassword' => true,
        ]);

        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this
            ->withSession(['auth.password_confirmed_at' => time()])
            ->getJson(route('api.settings.security.show'))
            ->assertOk()
            ->assertJsonPath('data.can_manage_passkeys', true)
            ->assertJsonPath('data.passkeys', [])
            ->assertJsonPath('data.can_manage_two_factor', true)
            ->assertJsonPath('data.two_factor_enabled', false)
            ->assertJsonStructure([
                'data' => [
                    'can_manage_two_factor',
                    'can_manage_passkeys',
                    'passkeys',
                    'password_rules',
                ],
            ]);
    }

    public function test_security_settings_require_password_confirmation_when_enabled()
    {
        $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

        $user = User::factory()->create();

        Sanctum::actingAs($user);

        Features::twoFactorAuthentication([
            'confirm' => true,
            'confirmPassword' => true,
        ]);

        $response = $this->getJson(route('api.settings.security.show'));

        $response->assertStatus(423);
    }

    public function test_security_settings_render_without_two_factor_when_feature_is_disabled()
    {
        $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

        config(['fortify.features' => []]);

        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this
            ->withSession(['auth.password_confirmed_at' => time()])
            ->getJson(route('api.settings.security.show'))
            ->assertOk()
            ->assertJsonPath('data.can_manage_passkeys', false)
            ->assertJsonPath('data.passkeys', [])
            ->assertJsonPath('data.can_manage_two_factor', false)
            ->assertJsonMissingPath('data.two_factor_enabled')
            ->assertJsonMissingPath('data.requires_confirmation');
    }

    public function test_password_can_be_updated()
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this
            ->putJson(route('api.settings.security.password.update'), [
                'current_password' => 'password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response->assertNoContent();

        $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
    }

    public function test_correct_password_must_be_provided_to_update_password()
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this
            ->putJson(route('api.settings.security.password.update'), [
                'current_password' => 'wrong-password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('current_password');
    }
}
