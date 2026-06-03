<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Http\Resources\ProfileSettingsResource;
use App\Services\Settings\ProfileSettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(private readonly ProfileSettingsService $profiles)
    {
        //
    }

    public function show(Request $request): ProfileSettingsResource
    {
        return ProfileSettingsResource::make($request->user());
    }

    public function update(ProfileUpdateRequest $request): ProfileSettingsResource
    {
        $user = $this->profiles->update($request->user(), $request->validated());

        return ProfileSettingsResource::make($user);
    }

    public function destroy(ProfileDeleteRequest $request): JsonResponse
    {
        $this->profiles->delete($request->user());

        return response()->json(null, 204);
    }
}
