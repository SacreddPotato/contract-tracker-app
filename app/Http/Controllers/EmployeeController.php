<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Services\Employees\EmployeeService;
use App\Services\Supabase\SupabaseAuthService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class EmployeeController extends Controller
{
    public function __construct(
        private readonly EmployeeService $employees,
        private readonly SupabaseAuthService $auth,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->auth->userFromRequest($request);

        return EmployeeResource::collection(
            $this->employees->list((string) $request->bearerToken()),
        );
    }

    public function store(EmployeeRequest $request): EmployeeResource
    {
        $user = $this->auth->userFromRequest($request);

        return EmployeeResource::make(
            $this->employees->create(
                (string) $request->bearerToken(),
                '0',
                $request->normalizedEmployeeData(),
            ),
        );
    }

    public function update(EmployeeRequest $request, string $employee): EmployeeResource
    {
        $this->auth->userFromRequest($request);

        return EmployeeResource::make(
            $this->employees->update(
                (string) $request->bearerToken(),
                $employee,
                $request->normalizedEmployeeData(),
            ),
        );
    }

    public function destroy(Request $request, string $employee): Response
    {
        $this->auth->userFromRequest($request);
        $this->employees->delete((string) $request->bearerToken(), $employee);

        return response()->noContent();
    }
}
