<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use App\Http\Requests\Settings\TwoFactorAuthenticationRequest;
use App\Http\Resources\SecuritySettingsResource;
use App\Services\Settings\SecuritySettingsService;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Features;

class SecurityController extends Controller
{
    public function __construct(private readonly SecuritySettingsService $security)
    {
        //
    }

    public function show(TwoFactorAuthenticationRequest $request): SecuritySettingsResource
    {
        if (Features::canManageTwoFactorAuthentication()) {
            $request->ensureStateIsValid();
        }

        return SecuritySettingsResource::make(
            $this->security->settingsFor($request->user()),
        );
    }

    public function update(PasswordUpdateRequest $request): JsonResponse
    {
        $this->security->updatePassword($request->user(), $request->password);

        return response()->json(null, 204);
    }
}
