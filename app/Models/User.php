<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticate;

class User extends Authenticate
{
    protected $guarded = [];
    protected $hidden = [
        'password',
        'remember_token',
    ];

    use HasFactory, Notifiable;
}
