<?php

namespace App\Http\Responses\Auth;

use Laravel\Fortify\Contracts\PasswordResetResponse;

class JsonPasswordResetResponse implements PasswordResetResponse
{
    public function __construct(private readonly string $status)
    {
        //
    }

    public function toResponse($request)
    {
        return response()->json([
            'message' => trans($this->status),
        ]);
    }
}
