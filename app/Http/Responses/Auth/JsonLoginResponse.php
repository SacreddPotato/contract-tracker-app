<?php

namespace App\Http\Responses\Auth;

use Laravel\Fortify\Contracts\LoginResponse;

class JsonLoginResponse implements LoginResponse
{
    public function toResponse($request)
    {
        return response()->json([
            'authenticated' => true,
            'two_factor' => false,
        ]);
    }
}
