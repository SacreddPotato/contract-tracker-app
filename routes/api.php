<?php

use App\Http\Controllers\AppStartupController;
use App\Http\Controllers\AppVersionController;
use App\Http\Controllers\AppWindowController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeeNotificationController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use App\Http\Resources\UserResource;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('employees', EmployeeController::class)
    ->only(['index', 'store', 'update', 'destroy']);

Route::prefix('notifications')->name('api.notifications.')->group(function () {
    Route::get('/', [EmployeeNotificationController::class, 'index'])->name('index');
    Route::post('/sync', [EmployeeNotificationController::class, 'sync'])->name('sync');
    Route::get('/unread-count', [EmployeeNotificationController::class, 'unreadCount'])->name('unread-count');
    Route::patch('/read-all', [EmployeeNotificationController::class, 'markAllRead'])->name('read-all');
    Route::patch('/{notification}/read', [EmployeeNotificationController::class, 'markRead'])->name('read');
});

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
    Route::get('/startup', [AppStartupController::class, 'show'])->name('startup.show');
    Route::put('/startup', [AppStartupController::class, 'update'])->name('startup.update');
    Route::get('/updates/status', [AppVersionController::class, 'updateStatus'])
        ->name('updates.status');
    Route::post('/updates/check', [AppVersionController::class, 'checkForUpdates'])
        ->middleware('throttle:6,1')
        ->name('updates.check');
    Route::post('/updates/install', [AppVersionController::class, 'installUpdate'])
        ->middleware('throttle:6,1')
        ->name('updates.install');
    Route::post('/window/minimize', [AppWindowController::class, 'minimize'])
        ->name('window.minimize');
    Route::post('/window/maximize', [AppWindowController::class, 'maximize'])
        ->name('window.maximize');
    Route::post('/window/restore', [AppWindowController::class, 'restore'])
        ->name('window.restore');
    Route::post('/window/close', [AppWindowController::class, 'close'])
        ->name('window.close');
});
