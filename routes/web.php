<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::prefix('api')->group(function () {
    Route::middleware('auth')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('api.users.index');
        Route::post('/users', [UserController::class, 'store'])->name('api.users.store');
        Route::get('/users/{id}', [UserController::class, 'show'])->name('api.users.detail');
        Route::post('/users/{id}/update', [UserController::class, 'update'])->name('api.users.update');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('api.users.delete');

        Route::post('/schedules', [ScheduleController::class, 'store'])->name('api.schedules.store');
        Route::get('/schedules/{id}', [ScheduleController::class, 'show'])->name('api.schedules.detail');
        Route::post('/schedules/{id}/update', [ScheduleController::class, 'update'])->name('api.schedules.update');
        Route::delete('/schedules/{id}', [ScheduleController::class, 'destroy'])->name('api.schedules.delete');

        Route::post('/contents', [AppController::class, 'store']);
        Route::get('/contents/{id}', [AppController::class, 'show']);
        Route::post('/contents/{id}/update', [AppController::class, 'update']);
        Route::post('/contents/update', [AppController::class, 'updateByName']);
        Route::delete('/contents/{id}', [AppController::class, 'destroy']);

        Route::post('/promos', [PromoController::class, 'store'])->name('api.promos.store');
        Route::get('/promos/{id}', [PromoController::class, 'show'])->name('api.promos.detail');
        Route::post('/promos/{id}/update', [PromoController::class, 'update'])->name('api.promos.update');
        Route::delete('/promos/{id}', [PromoController::class, 'destroy'])->name('api.promos.delete');

        Route::post('/logout', [Controller::class, 'logout'])->name('logout');
    });

    Route::get('/contents', [AppController::class, 'indexAdmin']);
    Route::get('/schedules', [ScheduleController::class, 'index'])->name('api.schedules.index');
    Route::get('/promos', [PromoController::class, 'index']);

    Route::post('/login', [Controller::class, 'login']);

    Route::get('/auth-check', function () {
        if (Auth::check()) {
            $user = Auth::user();

            return response()->json([
                'authenticated' => true,
                'user' => $user
            ]);
        } else {
            return response()->json([
                'authenticated' => false,
                'user' => null
            ]);
        }
    });

});

Route::get('/{any}', [AppController::class, 'index'])->where('any', '.*');


