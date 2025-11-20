<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;

use Illuminate\Support\Facades\Validator;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;


class AuthApiController extends Controller
{
    //

    public function apiLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = \App\Models\User::where('email', $request->email)->first();

        if (!$user || !\Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // Generate token using Laravel Sanctum or Passport
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['token' => $token], 200);
    }


    // Optional: Logout API
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.'
        ]);
    }


    // public function sendResetLink(Request $request)
    // {
    //     $request->validate(['email'=>'required|email']);
    //     // Logic to send reset link to the email
    //     return response()->json(['message'=>'Reset Link Sent to your Email']);

    // }

    // public function resetPassword(Request $request){
    //     $request->validate([
    //         'token'=>'required',
    //         'email'=>'required|email',
    //         'password'=>'required|confirmed|min:6'
    //     ]);
    //     // Logic to reset password
    //     return response()->json(['message'=>'Password has been reset successfully']);

    // }

    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'status' => true,
                'message' => 'Password reset link sent to your email.'
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Unable to send reset link.'
        ], 400);
    }

    // Reset Password
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password)
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'status' => true,
                'message' => 'Password has been reset successfully.',
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Invalid token or email.'
        ], 400);
    }

}