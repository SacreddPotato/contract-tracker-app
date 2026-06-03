<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\ReturnJsonTwoFactorChallenge;
use App\Http\Responses\Auth\JsonEmailVerificationNotificationResponse;
use App\Http\Responses\Auth\JsonFailedTwoFactorLoginResponse;
use App\Http\Responses\Auth\JsonLoginResponse;
use App\Http\Responses\Auth\JsonLogoutResponse;
use App\Http\Responses\Auth\JsonPasswordConfirmedResponse;
use App\Http\Responses\Auth\JsonPasswordResetLinkResponse;
use App\Http\Responses\Auth\JsonPasswordResetResponse;
use App\Http\Responses\Auth\JsonRecoveryCodesGeneratedResponse;
use App\Http\Responses\Auth\JsonRedirectAsIntendedResponse;
use App\Http\Responses\Auth\JsonRegisterResponse;
use App\Http\Responses\Auth\JsonTwoFactorConfirmedResponse;
use App\Http\Responses\Auth\JsonTwoFactorDisabledResponse;
use App\Http\Responses\Auth\JsonTwoFactorEnabledResponse;
use App\Http\Responses\Auth\JsonTwoFactorLoginResponse;
use App\Http\Responses\Auth\JsonVerifyEmailResponse;
use App\Http\Responses\Auth\Passkeys\JsonPasskeyConfirmationResponse;
use App\Http\Responses\Auth\Passkeys\JsonPasskeyDeletedResponse;
use App\Http\Responses\Auth\Passkeys\JsonPasskeyLoginResponse;
use App\Http\Responses\Auth\Passkeys\JsonPasskeyRegistrationResponse;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\EmailVerificationNotificationSentResponse;
use Laravel\Fortify\Contracts\FailedTwoFactorLoginResponse;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Contracts\LogoutResponse;
use Laravel\Fortify\Contracts\PasswordConfirmedResponse;
use Laravel\Fortify\Contracts\PasswordResetResponse;
use Laravel\Fortify\Contracts\RecoveryCodesGeneratedResponse;
use Laravel\Fortify\Contracts\RedirectsIfTwoFactorAuthenticatable;
use Laravel\Fortify\Contracts\RegisterResponse;
use Laravel\Fortify\Contracts\SuccessfulPasswordResetLinkRequestResponse;
use Laravel\Fortify\Contracts\TwoFactorConfirmedResponse;
use Laravel\Fortify\Contracts\TwoFactorDisabledResponse;
use Laravel\Fortify\Contracts\TwoFactorEnabledResponse;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse;
use Laravel\Fortify\Contracts\VerifyEmailResponse;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Http\Responses\RedirectAsIntended;
use Laravel\Passkeys\Contracts\PasskeyConfirmationResponse;
use Laravel\Passkeys\Contracts\PasskeyDeletedResponse;
use Laravel\Passkeys\Contracts\PasskeyLoginResponse;
use Laravel\Passkeys\Contracts\PasskeyRegistrationResponse;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(EmailVerificationNotificationSentResponse::class, JsonEmailVerificationNotificationResponse::class);
        $this->app->singleton(FailedTwoFactorLoginResponse::class, JsonFailedTwoFactorLoginResponse::class);
        $this->app->singleton(LoginResponse::class, JsonLoginResponse::class);
        $this->app->singleton(LogoutResponse::class, JsonLogoutResponse::class);
        $this->app->singleton(PasskeyConfirmationResponse::class, JsonPasskeyConfirmationResponse::class);
        $this->app->singleton(PasskeyDeletedResponse::class, JsonPasskeyDeletedResponse::class);
        $this->app->singleton(PasskeyLoginResponse::class, JsonPasskeyLoginResponse::class);
        $this->app->singleton(PasskeyRegistrationResponse::class, JsonPasskeyRegistrationResponse::class);
        $this->app->singleton(PasswordConfirmedResponse::class, JsonPasswordConfirmedResponse::class);
        $this->app->singleton(PasswordResetResponse::class, JsonPasswordResetResponse::class);
        $this->app->singleton(RecoveryCodesGeneratedResponse::class, JsonRecoveryCodesGeneratedResponse::class);
        $this->app->singleton(RedirectAsIntended::class, JsonRedirectAsIntendedResponse::class);
        $this->app->singleton(RedirectsIfTwoFactorAuthenticatable::class, ReturnJsonTwoFactorChallenge::class);
        $this->app->singleton(RegisterResponse::class, JsonRegisterResponse::class);
        $this->app->singleton(SuccessfulPasswordResetLinkRequestResponse::class, JsonPasswordResetLinkResponse::class);
        $this->app->singleton(TwoFactorConfirmedResponse::class, JsonTwoFactorConfirmedResponse::class);
        $this->app->singleton(TwoFactorDisabledResponse::class, JsonTwoFactorDisabledResponse::class);
        $this->app->singleton(TwoFactorEnabledResponse::class, JsonTwoFactorEnabledResponse::class);
        $this->app->singleton(TwoFactorLoginResponse::class, JsonTwoFactorLoginResponse::class);
        $this->app->singleton(VerifyEmailResponse::class, JsonVerifyEmailResponse::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('passkeys', function (Request $request) {
            return Limit::perMinute(10)->by(
                ($request->input('credential.id') ?: $request->session()->getId()).'|'.$request->ip(),
            );
        });
    }
}
