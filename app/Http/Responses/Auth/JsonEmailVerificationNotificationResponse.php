<?php

namespace App\Http\Responses\Auth;

use Laravel\Fortify\Contracts\EmailVerificationNotificationSentResponse;

class JsonEmailVerificationNotificationResponse implements EmailVerificationNotificationSentResponse
{
    public function toResponse($request)
    {
        return response()->json([
            'message' => __('A new verification link has been sent to the email address you provided during registration.'),
        ], 202);
    }
}
