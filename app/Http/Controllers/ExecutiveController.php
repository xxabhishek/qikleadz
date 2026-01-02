<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Log;

class ExecutiveController extends Controller
{
    /**
     * Get only UNREAD notifications for the executive
     */
    public function getNotifications(Request $request)
    {
        $user = $request->user();

        Log::info('Fetching notifications for executive:', [
            'user_id' => $user?->id,
            'role' => $user?->role,
        ]);

        if (!$user || $user->role != 2) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Executive access required',
            ], 401);
        }

        $notifications = Notification::where('user_id', $user->id)
            ->where('read', 0)
            ->latest('created_at')
            ->take(15)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notifications,
            'count' => $notifications->count(),
        ]);
    }

    /**
     * Mark single or multiple notifications as read
     */
   public function markNotificationsRead(Request $request)
{
    $user = $request->user();

    if (!$user || $user->role != 2) {
        return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
    }

    $request->validate([
        'notification_id' => 'required|integer|exists:notifications,id',
    ]);

    $updated = Notification::where('id', $request->notification_id)
        ->where('executive_id', $user->id)  
        ->update(['read' => 1]);

    if ($updated) {
        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read'
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Notification not found or already read'
    ], 404);
}
    /**
     * Mark ALL notifications as read
     */
    public function markAllRead(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role != 2) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        Notification::where('user_id', $user->id)
            ->update(['read' => 1]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read'
        ]);
    }
}
