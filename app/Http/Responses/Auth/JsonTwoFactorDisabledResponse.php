<?php

namespace App\Http\Responses\Auth;

use Laravel\Fortify\Contracts\TwoFactorDisabledResponse;

class JsonTwoFactorDisabledResponse implements TwoFactorDisabledResponse
{
    public function toResponse($request)
    {
        return response()->json(['enabled' => false]);
    }
}
