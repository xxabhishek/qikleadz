<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Executive extends Model
{
    use HasFactory;

    public function getNotifications()
    {
        $executive = Auth::user();

        if ($executive->role != 2) { // Executive role ID adjust kar
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notifications = Notification::where('user_id', $executive->id)
            ->latest()
            ->take(10)
            ->get();

        return response()->json($notifications);
    }
}
