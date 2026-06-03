<?php

namespace App\Http\Responses\Auth\Passkeys;

use Laravel\Passkeys\Contracts\PasskeyConfirmationResponse;

class JsonPasskeyConfirmationResponse implements PasskeyConfirmationResponse
{
    public function toResponse($request)
    {
        return response()->json(['confirmed' => true]);
    }
}
