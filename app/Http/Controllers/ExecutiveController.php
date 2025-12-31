<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Log;

class ExecutiveController extends Controller
{
    // public function getNotifications(Request $request)
    // {
    //     // dd($request->user());
    //     $executive = $request->user(); // Sanctum se authenticated user

    //     if (!$executive || $executive->role != 2) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Unauthorized or not an executive',
    //         ], 401);
    //     }

    //     // Real notifications from DB
    //     $notifications = Notification::where('executive_id', $executive->id)
    //         ->latest()
    //         ->take(10)
    //         ->get();

    //     return response()->json([
    //         'success' => true,
    //         'data' => $notifications
    //     ]);
    // }


    public function getNotifications(Request $request)
    {
        // Authenticated user ko fetch karo (Sanctum se)
        $user = $request->user();

        Log::info('Auth debug for notifications:', [
            'user'       => $user ? 'Found' : 'NULL',
            'user_id'    => $user?->id,
            'role'       => $user?->role,
            'token'      => $request->bearerToken(),
            'headers'    => $request->headers->all(),
            'ip'         => $request->ip(),
        ]);

        if (!$user || $user->role != 2) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized ya executive nahi ho',
            ], 401);
        }

        $notifications = Notification::where('user_id', $user->id)
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $notifications
        ]);
    }

    public function markNotificationsRead(Request $request)
{
    $user = $request->user();

    if (!$user || $user->role != 2) {
        return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
    }

    $request->validate([
        'notification_ids' => 'required|array',
        'notification_ids.*' => 'exists:notifications,id',
    ]);

    Notification::whereIn('id', $request->notification_ids)
        ->where('user_id', $user->id)
        ->update(['read' => 1]);

    return response()->json(['success' => true, 'message' => 'Notifications marked as read']);
}

// Sab notifications read karo
public function markAllRead(Request $request)
{
    $user = $request->user();

    if (!$user || $user->role != 2) {
        return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
    }

    Notification::where('user_id', $user->id)
        ->update(['read' => 1]);

    return response()->json(['success' => true, 'message' => 'All notifications marked as read']);
}
}
