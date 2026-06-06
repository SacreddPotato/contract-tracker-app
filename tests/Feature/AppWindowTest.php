<?php

namespace Tests\Feature;

use App\Providers\NativeAppServiceProvider;
use Illuminate\Support\Facades\Config;
use ReflectionMethod;
use Tests\TestCase;

class AppWindowTest extends TestCase
{
    public function test_it_reports_window_controls_as_unavailable_outside_nativephp(): void
    {
        Config::set('nativephp-internal.running', false);

        $this->postJson('/api/app/window/minimize')
            ->assertOk()
            ->assertJson([
                'status' => 'unavailable',
            ]);

        $this->postJson('/api/app/window/maximize')
            ->assertOk()
            ->assertJson([
                'status' => 'unavailable',
            ]);

        $this->postJson('/api/app/window/restore')
            ->assertOk()
            ->assertJson([
                'status' => 'unavailable',
            ]);

        $this->postJson('/api/app/window/close')
            ->assertOk()
            ->assertJson([
                'status' => 'unavailable',
            ]);
    }

    public function test_native_window_startup_uses_screen_bounds_before_work_area(): void
    {
        $method = new ReflectionMethod(NativeAppServiceProvider::class, 'activeScreenBounds');
        $bounds = $method->invoke(new NativeAppServiceProvider, NativeAppServiceProviderScreenFake::class);

        $this->assertSame([
            'height' => 1080,
            'width' => 1920,
            'x' => 10,
            'y' => 20,
        ], $bounds);
    }
}

class NativeAppServiceProviderScreenFake
{
    /**
     * @return array<string, array<string, int>>
     */
    public static function active(): array
    {
        return [
            'bounds' => [
                'height' => 1080,
                'width' => 1920,
                'x' => 10,
                'y' => 20,
            ],
            'workArea' => [
                'height' => 1040,
                'width' => 1880,
                'x' => 30,
                'y' => 40,
            ],
        ];
    }
}
