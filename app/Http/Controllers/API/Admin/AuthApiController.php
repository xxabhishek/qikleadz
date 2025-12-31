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
    //Login API
    public function apiLogin(Request $request)
    {
        $request->validate([
            'user_id' => 'required|string|max:10',
            'pin' => 'required|numeric|digits:4'
        ]);

        $user = User::where('user_id', $request->user_id)->first();

        if (!$user || !Hash::check($request->pin, $user->pin)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // ✅ Spatie role check
        if (!$user->hasRole('Sales Executive')) {
            return response()->json([
                'error' => 'Access denied. Only Sales Executive users can login.'
            ], 403);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'message' => 'Login successful'
        ], 200);
    }



    //Logout API
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
    //     $request->validate(['user_id'=>'required|string']);
    //     // Logic to send reset link to the email associated with user_id
    //     return response()->json(['message'=>'Reset Link Sent to your Email']);

    // }

    // public function resetPin(Request $request){
    //     $request->validate([
    //         'token'=>'required',
    //         'user_id'=>'required|string',
    //         'pin'=>'required|numeric|digits:4|confirmed'
    //     ]);
    //     // Logic to reset PIN
    //     return response()->json(['message'=>'PIN has been reset successfully']);

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
                'message' => 'PIN reset link sent to your email.'
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Unable to send reset link.'
        ], 400);
    }

    // Reset PIN
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'pin' => 'nullable|numeric|digits:4|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $status = Password::reset(
            $request->only('email', 'pin', 'pin_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'pin' => Hash::make($request->pin)
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'status' => true,
                'message' => 'PIN has been reset successfully.',
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Invalid token or email.'
        ], 400);
    }

}
