<?php

namespace App\Http\Responses\Auth;

use Laravel\Fortify\Contracts\RegisterResponse;

class JsonRegisterResponse implements RegisterResponse
{
    public function toResponse($request)
    {
        return response()->json([
            'registered' => true,
        ], 201);
    }
}
