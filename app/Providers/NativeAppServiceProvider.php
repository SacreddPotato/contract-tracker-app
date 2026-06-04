<?php

namespace App\Providers;

class NativeAppServiceProvider
{
    public function boot(): void
    {
        $menu = 'Native\\Desktop\\Facades\\Menu';
        $window = 'Native\\Desktop\\Facades\\Window';

        if (class_exists($menu)) {
            $menu::default();
        }

        if (class_exists($window)) {
            $window::open()
                ->route('home')
                ->title(config('app.name'));
        }
    }
}
