<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppStartupUpdateRequest;
use App\Services\AppStartupService;
use Illuminate\Http\JsonResponse;

class AppStartupController extends Controller
{
    public function __construct(
        private readonly AppStartupService $startup,
    ) {}

    public function show(): JsonResponse
    {
        return response()->json($this->startup->preference());
    }

    public function update(AppStartupUpdateRequest $request): JsonResponse
    {
        return response()->json(
            $this->startup->setPreference($request->enabled()),
        );
    }
}
