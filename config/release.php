<?php

return [
    'version' => env('NATIVEPHP_APP_VERSION', env('APP_VERSION', '0.0.0-dev')),
    'channel' => env('GITHUB_CHANNEL', 'local'),
    'provider' => env('NATIVEPHP_UPDATER_PROVIDER', 'github'),

    'updater' => [
        'enabled' => (bool) env('NATIVEPHP_UPDATER_ENABLED', false),
    ],
];
