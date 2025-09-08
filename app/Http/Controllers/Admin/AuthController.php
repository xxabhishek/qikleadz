<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //
    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');
            $user = \App\Models\User::where('email', $credentials['email'])->first();

            if (!$user) {
                return redirect()->back()->withErrors([
                    'login' => 'Invalid email address.'
                ]);
            }

            if (!Hash::check($credentials['password'], $user->password)) {
                return redirect()->back()->withErrors([
                    'login' => 'Incorrect password.'
                ]);
            }

            if ($user->status !== 'Active') {
                return redirect()->back()->withErrors([
                    'login' => 'Your account is inactive. Please contact the administrator.'
                ]);
            }

            Auth::login($user);
            return redirect()->route('home');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'login' => 'An error occurred while processing your request. Please try again later.'
            ]);
        }
    }
}
