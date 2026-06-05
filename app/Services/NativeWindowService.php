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
                'minimize' => $this->minimize($window),
                'maximize' => $window::maximize('main'),
                'restore' => $this->restore($window),
                'close' => $window::close('main'),
                default => null,
            };
        } catch (Throwable) {
            return 'unavailable';
        }

        return 'handled';
    }

    /**
     * NativePHP 2.2 exposes maximize/minimize but not unmaximize. Resizing the
     * main window gives the custom titlebar a reliable restored state.
     */
    private function restore(string $window): void
    {
        $window::resize(1200, 800, 'main');
        $window::position(80, 80, false, 'main');
    }

    private function minimize(string $window): void
    {
        $this->restore($window);
        $window::minimize('main');
    }
}
