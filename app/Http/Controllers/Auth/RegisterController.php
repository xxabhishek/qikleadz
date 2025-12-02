<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    use RegistersUsers;

    protected $redirectTo = RouteServiceProvider::HOME;

    public function __construct()
    {
        $this->middleware('guest');
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'pin' => ['required', 'numeric', 'digits:4', 'confirmed'],
        ]);
    }

    protected function create(array $data)
    {
        dd($data);
        return User::create([
            'user_id' => User::generateUserId(),
            'name' => $data['name'],
            'email' => $data['email'],
            'pin' => Hash::make($data['pin']),
        ]);
    }
}
