<?php

namespace App\Http\Responses\Auth\Passkeys;

use Laravel\Passkeys\Contracts\PasskeyLoginResponse;

class JsonPasskeyLoginResponse implements PasskeyLoginResponse
{
    public function toResponse($request)
    {
        return response()->json(['authenticated' => true]);
    }
}
