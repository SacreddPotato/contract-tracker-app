<?php

namespace App\Http\Responses\Auth;

use Laravel\Fortify\Contracts\TwoFactorConfirmedResponse;

class JsonTwoFactorConfirmedResponse implements TwoFactorConfirmedResponse
{
    public function toResponse($request)
    {
        return response()->json(['confirmed' => true]);
    }
}
