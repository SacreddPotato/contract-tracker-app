<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;

class SpaController extends Controller
{
    public function __invoke(Request $request)
    {
        $appearance = $request->cookie('appearance') ?? 'system';
        $appearanceJson = json_encode($appearance, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT);
        $darkClass = $appearance === 'dark' ? ' class="dark"' : '';
        $frontendConfigJson = json_encode([
            'firebase' => config('firebase.web'),
            'native' => [
                'running' => (bool) config('nativephp-internal.running'),
            ],
        ], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT);
        $locale = e(str_replace('_', '-', app()->getLocale()));
        $title = e(config('app.name', 'Laravel'));
        $viteTags = Vite::reactRefresh()?->toHtml().Vite::withEntryPoints([
            'resources/css/app.css',
            'resources/js/app.tsx',
        ])->toHtml();

        $html = <<<HTML
        <!DOCTYPE html>
        <html lang="{$locale}"{$darkClass}>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">

                <script>
                    (function() {
                        const appearance = {$appearanceJson};

                        if (appearance === 'system') {
                            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                            if (prefersDark) {
                                document.documentElement.classList.add('dark');
                            }
                        }
                    })();
                </script>

                <script>
                    window.__contractTrackerConfig = {$frontendConfigJson};
                </script>

                <style>
                    html {
                        background-color: oklch(1 0 0);
                    }

                    html.dark {
                        background-color: oklch(0.145 0 0);
                    }
                </style>

                <link rel="icon" href="/favicon.ico" sizes="any">
                <link rel="icon" href="/favicon.svg" type="image/svg+xml">
                <link rel="apple-touch-icon" href="/apple-touch-icon.png">

                {$viteTags}
                <title>{$title}</title>
            </head>
            <body class="font-sans antialiased">
                <div id="root"></div>
            </body>
        </html>
        HTML;

        return response($html)->header('Content-Type', 'text/html');
    }
}
