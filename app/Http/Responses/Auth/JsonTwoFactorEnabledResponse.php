<?php

namespace App\Http\Responses\Auth;

use Laravel\Fortify\Contracts\TwoFactorEnabledResponse;

class JsonTwoFactorEnabledResponse implements TwoFactorEnabledResponse
{
    public function toResponse($request)
    {
        return response()->json(['enabled' => true]);
    }
}
