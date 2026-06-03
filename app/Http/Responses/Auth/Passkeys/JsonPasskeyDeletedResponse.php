<?php

namespace App\Http\Responses\Auth\Passkeys;

use Laravel\Passkeys\Contracts\PasskeyDeletedResponse;

class JsonPasskeyDeletedResponse implements PasskeyDeletedResponse
{
    public function toResponse($request)
    {
        return response()->json(['status' => 'passkey-deleted']);
    }
}
