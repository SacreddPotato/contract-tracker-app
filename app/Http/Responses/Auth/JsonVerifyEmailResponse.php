<?php

namespace App\Http\Responses\Auth;

use Laravel\Fortify\Contracts\VerifyEmailResponse;

class JsonVerifyEmailResponse implements VerifyEmailResponse
{
    public function toResponse($request)
    {
        return response()->json(null, 204);
    }
}
