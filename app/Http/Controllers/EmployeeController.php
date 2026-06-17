<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Services\Employees\EmployeeService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class EmployeeController extends Controller
{
    public function __construct(private readonly EmployeeService $employees) {}

    public function index(): AnonymousResourceCollection
    {
        return EmployeeResource::collection(
            $this->employees->list(),
        );
    }

    public function store(EmployeeRequest $request): EmployeeResource
    {
        return EmployeeResource::make(
            $this->employees->create(
                '0',
                $request->normalizedEmployeeData(),
            ),
        );
    }

    public function update(EmployeeRequest $request, string $employee): EmployeeResource
    {
        return EmployeeResource::make(
            $this->employees->update(
                $employee,
                $request->normalizedEmployeeData(),
            ),
        );
    }

    public function destroy(string $employee): Response
    {
        $this->employees->delete($employee);

        return response()->noContent();
    }
}
