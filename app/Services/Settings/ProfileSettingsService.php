<?php

namespace App\Services\Settings;

use App\Models\User;

class ProfileSettingsService
{
    /**
     * @param  array{name: string, email: string}  $data
     */
    public function update(User $user, array $data): User
    {
        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return $user->refresh();
    }

    public function delete(User $user): void
    {
        $user->delete();
    }
}
