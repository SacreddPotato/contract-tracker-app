<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmployeeNotificationResource;
use App\Services\Employees\EmployeeNotificationService;
use App\Services\Supabase\SupabaseAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EmployeeNotificationController extends Controller
{
    public function __construct(
        private readonly EmployeeNotificationService $notifications,
        private readonly SupabaseAuthService $auth,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->auth->userFromRequest($request);

        return EmployeeNotificationResource::collection(
            $this->notifications->list((string) $request->bearerToken()),
        );
    }

    public function sync(Request $request): AnonymousResourceCollection
    {
        $this->auth->userFromRequest($request);

        return EmployeeNotificationResource::collection(
            $this->notifications->syncDueContractNotifications((string) $request->bearerToken()),
        );
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $this->auth->userFromRequest($request);

        return response()->json([
            'unreadCount' => $this->notifications->unreadCount((string) $request->bearerToken()),
        ]);
    }

    public function markRead(Request $request, string $notification): EmployeeNotificationResource
    {
        $this->auth->userFromRequest($request);

        return EmployeeNotificationResource::make(
            $this->notifications->markRead((string) $request->bearerToken(), $notification),
        );
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $this->auth->userFromRequest($request);

        return response()->json([
            'unreadCount' => $this->notifications->markAllRead((string) $request->bearerToken()),
        ]);
    }
}
