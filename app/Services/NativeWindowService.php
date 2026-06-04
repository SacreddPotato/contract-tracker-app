<?php

namespace App\Services;

use Throwable;

class NativeWindowService
{
    public function control(string $action): string
    {
        if (! (bool) config('nativephp-internal.running')) {
            return 'unavailable';
        }

        $window = 'Native\\Desktop\\Facades\\Window';

        if (! class_exists($window)) {
            return 'unavailable';
        }

        try {
            match ($action) {
                'minimize' => $window::minimize('main'),
                'maximize' => $window::maximize('main'),
                'close' => $window::close('main'),
                default => null,
            };
        } catch (Throwable) {
            return 'unavailable';
        }

        return 'handled';
    }
}
