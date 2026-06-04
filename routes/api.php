<?php

use App\Http\Controllers\AppVersionController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use App\Http\Resources\UserResource;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::get('/user', fn (Request $request) => UserResource::make($request->user()));

    Route::prefix('settings')->name('api.settings.')->group(function () {
        Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('/security', [SecurityController::class, 'show'])
            ->middleware(RequirePassword::class)
            ->name('security.show');

        Route::put('/security/password', [SecurityController::class, 'update'])
            ->middleware('throttle:6,1')
            ->name('security.password.update');
    });
});

Route::prefix('app')->name('api.app.')->group(function () {
    Route::get('/version', [AppVersionController::class, 'show'])->name('version.show');
    Route::post('/updates/check', [AppVersionController::class, 'checkForUpdates'])
        ->middleware('throttle:6,1')
        ->name('updates.check');
});
