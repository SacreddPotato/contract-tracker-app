<?php

namespace App\Services\Settings;

use App\Models\User;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Features;

class SecuritySettingsService
{
    /**
     * @return array<string, mixed>
     */
    public function settingsFor(User $user): array
    {
        $settings = [
            'can_manage_two_factor' => Features::canManageTwoFactorAuthentication(),
            'can_manage_passkeys' => Features::canManagePasskeys(),
            'passkeys' => Features::canManagePasskeys()
                ? $this->passkeysFor($user)
                : [],
            'password_rules' => Password::defaults()->toPasswordRulesString(),
        ];

        if (Features::canManageTwoFactorAuthentication()) {
            $settings['two_factor_enabled'] = $user->hasEnabledTwoFactorAuthentication();
            $settings['requires_confirmation'] = Features::optionEnabled(
                Features::twoFactorAuthentication(),
                'confirm',
            );
        }

        return $settings;
    }

    public function updatePassword(User $user, string $password): void
    {
        $user->update([
            'password' => $password,
        ]);
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function passkeysFor(User $user): array
    {
        return $user
            ->passkeys()
            ->select(['id', 'name', 'credential', 'created_at', 'last_used_at'])
            ->latest()
            ->get()
            ->map(fn ($passkey) => [
                'id' => $passkey->id,
                'name' => $passkey->name,
                'authenticator' => $passkey->authenticator,
                'created_at_diff' => $passkey->created_at->diffForHumans(),
                'last_used_at_diff' => $passkey->last_used_at?->diffForHumans(),
            ])
            ->values()
            ->all();
    }
}
