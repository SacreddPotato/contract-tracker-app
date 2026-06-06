<?php

namespace App\Providers;

use Throwable;

class NativeAppServiceProvider
{
    public function boot(): void
    {
        $menu = 'Native\\Desktop\\Facades\\Menu';
        $screen = 'Native\\Desktop\\Facades\\Screen';
        $window = 'Native\\Desktop\\Facades\\Window';

        if (class_exists($menu)) {
            $menu::create();
        }

        if (class_exists($window)) {
            $bounds = $this->activeScreenBounds($screen);
            $width = min((int) floor($bounds['width'] / 2) + 200, $bounds['width']);
            $height = min((int) floor($bounds['height'] / 2) + 150, $bounds['height']);
            $x = max($bounds['x'], (int) floor($bounds['x'] + (($bounds['width'] - $width) / 2)));
            $y = max($bounds['y'], (int) floor($bounds['y'] + (($bounds['height'] - $height) / 2)));

            $window::open()
                ->route('home')
                ->title(config('app.name'))
                ->width($width)
                ->height($height)
                ->position($x, $y)
                ->frameless()
                ->hideMenu();
        }
    }

    /**
     * @return array{x: int, y: int, width: int, height: int}
     */
    private function activeScreenBounds(string $screen): array
    {
        $fallback = [
            'height' => 800,
            'width' => 1200,
            'x' => 0,
            'y' => 0,
        ];

        if (! class_exists($screen)) {
            return $fallback;
        }

        try {
            $activeScreen = $screen::active();
        } catch (Throwable) {
            return $fallback;
        }

        $bounds = $activeScreen['bounds'] ?? $activeScreen['workArea'] ?? $fallback;

        return [
            'height' => (int) ($bounds['height'] ?? $fallback['height']),
            'width' => (int) ($bounds['width'] ?? $fallback['width']),
            'x' => (int) ($bounds['x'] ?? $fallback['x']),
            'y' => (int) ($bounds['y'] ?? $fallback['y']),
        ];
    }
}
