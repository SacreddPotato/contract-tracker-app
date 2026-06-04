<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Config;
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
}
