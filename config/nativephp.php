<?php

use App\Providers\NativeAppServiceProvider;

return [
    'version' => env('NATIVEPHP_APP_VERSION', '0.0.0'),
    'app_id' => env('NATIVEPHP_APP_ID', 'com.contracttracker.app'),
    'deeplink_scheme' => env('NATIVEPHP_DEEPLINK_SCHEME'),
    'author' => env('NATIVEPHP_APP_AUTHOR'),
    'copyright' => env('NATIVEPHP_APP_COPYRIGHT'),
    'description' => env('NATIVEPHP_APP_DESCRIPTION', 'Contract Tracker'),
    'website' => env('NATIVEPHP_APP_WEBSITE'),
    'provider' => NativeAppServiceProvider::class,

    'cleanup_env_keys' => [
        'AWS_*',
        'AZURE_*',
        'GITHUB_TOKEN',
        'GITHUB_AUTOUPDATE_TOKEN',
        '*_SECRET',
        '*_PRIVATE_KEY',
        '*_CREDENTIALS',
        '*_CREDENTIALS_PATH',
        'FIREBASE_ADMIN_*',
        'GOOGLE_APPLICATION_CREDENTIALS',
        'NATIVEPHP_UPDATER_PATH',
    ],

    'cleanup_exclude_files' => [
        'build',
        'temp',
        'content',
        'node_modules',
        '*/tests',
        '*.firebase-adminsdk-*.json',
        '*-firebase-adminsdk-*.json',
    ],

    'updater' => [
        'enabled' => env('NATIVEPHP_UPDATER_ENABLED', true),
        'default' => env('NATIVEPHP_UPDATER_PROVIDER', 'github'),
        'providers' => [
            'github' => [
                'driver' => 'github',
                'repo' => env('GITHUB_REPO'),
                'owner' => env('GITHUB_OWNER'),
                'token' => env('GITHUB_TOKEN'),
                'vPrefixedTagName' => env('GITHUB_V_PREFIXED_TAG_NAME', true),
                'private' => env('GITHUB_PRIVATE', false),
                'channel' => env('GITHUB_CHANNEL', 'latest'),
                'releaseType' => env('GITHUB_RELEASE_TYPE', 'latest'),
            ],
        ],
    ],

    'queue_workers' => [],

    'prebuild' => [
        'npm run build',
    ],

    'postbuild' => [],

    'nsis' => [
        'delete_app_data_on_uninstall' => env('NATIVEPHP_NSIS_DELETE_APP_DATA', false),
    ],

    'binary_path' => env('NATIVEPHP_PHP_BINARY_PATH', null),
];
