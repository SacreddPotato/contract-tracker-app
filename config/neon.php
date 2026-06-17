<?php

$environment = env('APP_ENV', 'production');

return [
    'branch_header' => 'X-App-Database-Branch',
    'default_branch' => env(
        'NEON_DEFAULT_DATABASE_BRANCH',
        $environment === 'local' ? 'testing' : 'production',
    ),
    'branch_urls' => [
        'testing' => env('NEON_TESTING_DATABASE_URL', env('DB_URL')),
        'production' => env('NEON_PRODUCTION_DATABASE_URL', env('DB_URL')),
    ],
    'dev_branch_toggle_enabled' => $environment === 'local',
];
