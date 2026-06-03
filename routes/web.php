<?php

use App\Http\Controllers\SpaController;
use Illuminate\Support\Facades\Route;

Route::get('/', SpaController::class)->name('home');
Route::get('/dashboard', SpaController::class)->name('dashboard');
Route::get('/login', SpaController::class)->name('login');
Route::get('/register', SpaController::class)->name('register');
Route::get('/forgot-password', SpaController::class)->name('password.request');
Route::get('/reset-password/{token}', SpaController::class)->name('password.reset');
Route::get('/verify-email', SpaController::class)->name('verification.notice');
Route::get('/confirm-password', SpaController::class)->name('password.confirm');
Route::get('/two-factor-challenge', SpaController::class)->name('two-factor.login');

Route::get('/{path}', SpaController::class)
    ->where('path', '.*')
    ->name('spa');
