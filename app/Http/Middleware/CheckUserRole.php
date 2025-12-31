<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckUserRole
{
    // public function handle(Request $request, Closure $next, ...$roles)
    // {
    //     if (!Auth::check()) {
    //         return redirect()->route('login');
    //     }

    //     $user = Auth::user();

    //     foreach ($roles as $role) {
    //         if ($user->hasRole($role)) {
    //             return $next($request);
    //         }
    //     }

    //     // If user doesn't have required role, redirect to appropriate dashboard or home
    //     if ($user->hasRole('Distributor')) {
    //         return redirect()->route('distributor.dashboard');
    //     } elseif ($user->hasRole('Dealer')) {
    //         return redirect()->route('dealer.dashboard');
    //     }

    //     return redirect()->route('home')->with('error', 'Unauthorized access.');
    // }

    public function handle($request, Closure $next, $role)
{
    if (!Auth::check() || Auth::user()->role != $role) {
        return redirect()->route('login'); // or abort(403)
    }

    return $next($request);
}
}
