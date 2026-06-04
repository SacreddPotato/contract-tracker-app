<?php

namespace App\Http\Controllers;

use App\Services\NativeWindowService;
use Illuminate\Http\JsonResponse;

class AppWindowController extends Controller
{
    public function __construct(
        private readonly NativeWindowService $windows,
    ) {}

    public function minimize(): JsonResponse
    {
        return $this->responseFor('minimize');
    }

    public function maximize(): JsonResponse
    {
        return $this->responseFor('maximize');
    }

    public function restore(): JsonResponse
    {
        return $this->responseFor('restore');
    }

    public function close(): JsonResponse
    {
        return $this->responseFor('close');
    }

    private function responseFor(string $action): JsonResponse
    {
        return response()->json([
            'status' => $this->windows->control($action),
        ]);
    }
}
