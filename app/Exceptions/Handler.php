<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

//    public function render($request, Throwable $exception)
// {
//     $status = 500;
//     $title = 'Server Error';
//     $message = 'Something went wrong.';

//     if ($this->isHttpException($exception)) {
//         $status = $exception->getStatusCode();
//         switch ($status) {
//             case 404:
//                 $title = 'Lost in Space';
//                 $message = 'The page you requested could not be found.';
//                 break;
//             case 403:
//                 $title = 'Access Denied';
//                 $message = 'You do not have permission to access this page.';
//                 break;
//             case 419:
//                 $title = 'Session Expired';
//                 $message = 'Please refresh and try again.';
//                 break;
//             case 500:
//             default:
//                 $title = 'Server Error';
//                 $message = 'Something went wrong on our side.';
//                 break;
//         }
//     }

//     return response()->view('errors.general', [
//         'status' => $status,
//         'title' => $title,
//         'message' => $message,
//     ], $status);
// }



}