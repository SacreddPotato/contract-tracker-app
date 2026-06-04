<?php

namespace App\Http\Controllers;

use App\Services\AppVersionService;
use Illuminate\Http\JsonResponse;

class AppVersionController extends Controller
{
    public function __construct(
        private readonly AppVersionService $versions,
    ) {}

    public function show(): JsonResponse
    {
        return response()->json($this->versions->version());
    }

    public function checkForUpdates(): JsonResponse
    {
        return response()->json([
            'status' => $this->versions->checkForUpdates(),
        ]);
    }
}
