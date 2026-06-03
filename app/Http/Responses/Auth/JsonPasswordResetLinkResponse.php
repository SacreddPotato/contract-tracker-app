<?php

namespace App\Http\Responses\Auth;

use Laravel\Fortify\Contracts\SuccessfulPasswordResetLinkRequestResponse;

class JsonPasswordResetLinkResponse implements SuccessfulPasswordResetLinkRequestResponse
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
