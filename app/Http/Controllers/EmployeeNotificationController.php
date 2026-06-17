<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmployeeNotificationResource;
use App\Services\Employees\EmployeeNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EmployeeNotificationController extends Controller
{
    public function __construct(private readonly EmployeeNotificationService $notifications) {}

    public function index(): AnonymousResourceCollection
    {
        return EmployeeNotificationResource::collection(
            $this->notifications->list(),
        );
    }

    public function sync(): AnonymousResourceCollection
    {
        return EmployeeNotificationResource::collection(
            $this->notifications->syncDueContractNotifications(),
        );
    }

    public function unreadCount(): JsonResponse
    {
        return response()->json([
            'unreadCount' => $this->notifications->unreadCount(),
        ]);
    }

    public function markRead(string $notification): EmployeeNotificationResource
    {
        return EmployeeNotificationResource::make(
            $this->notifications->markRead($notification),
        );
    }

    public function markAllRead(): JsonResponse
    {
        return response()->json([
            'unreadCount' => $this->notifications->markAllRead(),
        ]);
    }
}
