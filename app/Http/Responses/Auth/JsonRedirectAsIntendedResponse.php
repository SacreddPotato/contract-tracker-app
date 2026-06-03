<?php

namespace App\Http\Responses\Auth;

use Illuminate\Contracts\Support\Responsable;

class JsonRedirectAsIntendedResponse implements Responsable
{
    public function __construct(public string $name)
    {
        //
    }

    public function toResponse($request)
    {
        return response()->json(null, 204);
    }
}
