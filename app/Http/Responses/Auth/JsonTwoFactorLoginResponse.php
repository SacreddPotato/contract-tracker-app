<?php

namespace App\Http\Responses\Auth;

use Laravel\Fortify\Contracts\TwoFactorLoginResponse;

class JsonTwoFactorLoginResponse implements TwoFactorLoginResponse
{
    public function toResponse($request)
    {
        return response()->json(null, 204);
    }
}
