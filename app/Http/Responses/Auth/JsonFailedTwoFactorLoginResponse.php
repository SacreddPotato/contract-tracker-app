<?php

namespace App\Http\Responses\Auth;

use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\FailedTwoFactorLoginResponse;

class JsonFailedTwoFactorLoginResponse implements FailedTwoFactorLoginResponse
{
    public function toResponse($request)
    {
        [$key, $message] = $request->filled('recovery_code')
            ? ['recovery_code', __('The provided two factor recovery code was invalid.')]
            : ['code', __('The provided two factor authentication code was invalid.')];

        throw ValidationException::withMessages([
            $key => [$message],
        ]);
    }
}
