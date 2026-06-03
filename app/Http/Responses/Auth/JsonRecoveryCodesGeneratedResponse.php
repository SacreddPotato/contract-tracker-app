<?php

namespace App\Http\Responses\Auth;

use Laravel\Fortify\Contracts\RecoveryCodesGeneratedResponse;

class JsonRecoveryCodesGeneratedResponse implements RecoveryCodesGeneratedResponse
{
    public function toResponse($request)
    {
        return response()->json(['generated' => true]);
    }
}
