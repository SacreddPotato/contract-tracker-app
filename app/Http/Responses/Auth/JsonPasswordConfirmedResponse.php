<?php

namespace App\Http\Responses\Auth;

use Laravel\Fortify\Contracts\PasswordConfirmedResponse;

class JsonPasswordConfirmedResponse implements PasswordConfirmedResponse
{
    public function toResponse($request)
    {
        return response()->json(['confirmed' => true], 201);
    }
}
