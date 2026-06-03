<?php

namespace App\Http\Responses\Auth;

use Laravel\Fortify\Contracts\LogoutResponse;

class JsonLogoutResponse implements LogoutResponse
{
    public function toResponse($request)
    {
        return response()->json(null, 204);
    }
}
