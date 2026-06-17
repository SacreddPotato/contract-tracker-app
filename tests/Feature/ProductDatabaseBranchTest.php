<?php

namespace Tests\Feature;

use App\Http\Middleware\UseProductDatabaseBranch;
use Illuminate\Http\Request;
use Tests\TestCase;

class ProductDatabaseBranchTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config()->set('app.env', 'local');
        config()->set('database.default', 'pgsql');
        config()->set('database.connections.pgsql.url', null);
        config()->set('neon.default_branch', 'testing');
        config()->set('neon.dev_branch_toggle_enabled', true);
        config()->set('neon.branch_urls.testing', 'postgresql://testing.example/neondb?sslmode=require');
        config()->set('neon.branch_urls.production', 'postgresql://production.example/neondb?sslmode=require');
    }

    public function test_product_database_branch_defaults_to_testing_in_local_development(): void
    {
        $middleware = new UseProductDatabaseBranch;
        $request = Request::create('/api/employees');

        $middleware->handle($request, fn () => response()->noContent());

        $this->assertSame(
            'postgresql://testing.example/neondb?sslmode=require',
            config('database.connections.pgsql.url'),
        );
    }

    public function test_product_database_branch_can_switch_to_production_in_local_development(): void
    {
        $middleware = new UseProductDatabaseBranch;
        $request = Request::create('/api/employees');
        $request->headers->set('X-App-Database-Branch', 'production');

        $middleware->handle($request, fn () => response()->noContent());

        $this->assertSame(
            'postgresql://production.example/neondb?sslmode=require',
            config('database.connections.pgsql.url'),
        );
    }

    public function test_product_database_branch_ignores_invalid_branch_headers(): void
    {
        $middleware = new UseProductDatabaseBranch;
        $request = Request::create('/api/employees');
        $request->headers->set('X-App-Database-Branch', 'staging');

        $middleware->handle($request, fn () => response()->noContent());

        $this->assertSame(
            'postgresql://testing.example/neondb?sslmode=require',
            config('database.connections.pgsql.url'),
        );
    }

    public function test_product_database_branch_ignores_dev_toggle_outside_local_development(): void
    {
        config()->set('app.env', 'production');
        config()->set('neon.default_branch', 'production');
        config()->set('neon.dev_branch_toggle_enabled', false);

        $middleware = new UseProductDatabaseBranch;
        $request = Request::create('/api/employees');
        $request->headers->set('X-App-Database-Branch', 'testing');

        $middleware->handle($request, fn () => response()->noContent());

        $this->assertSame(
            'postgresql://production.example/neondb?sslmode=require',
            config('database.connections.pgsql.url'),
        );
    }

    public function test_product_database_branch_does_not_apply_neon_urls_to_non_postgres_connections(): void
    {
        config()->set('database.default', 'sqlite');
        config()->set('database.connections.sqlite.url', null);

        $middleware = new UseProductDatabaseBranch;
        $request = Request::create('/api/employees');

        $middleware->handle($request, fn () => response()->noContent());

        $this->assertNull(config('database.connections.sqlite.url'));
    }
}
