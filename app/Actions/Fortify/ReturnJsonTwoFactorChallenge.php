<?php

namespace App\Actions\Fortify;

use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
use Laravel\Fortify\Events\TwoFactorAuthenticationChallenged;

class ReturnJsonTwoFactorChallenge extends RedirectIfTwoFactorAuthenticatable
{
    /**
     * Get the two factor authentication enabled response.
     *
     * @param  mixed  $user
     */
    protected function twoFactorChallengeResponse($request, $user)
    {
        $request->session()->put([
            'login.id' => $user->getKey(),
            'login.remember' => $request->boolean('remember'),
        ]);

        TwoFactorAuthenticationChallenged::dispatch($user);

        return response()->json(['two_factor' => true]);
    }
}
