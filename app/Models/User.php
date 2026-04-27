<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'phone', 'password', 'role',
        'unit', 'block', 'lease_start', 'approved',
        'badge', 'shift', 'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'lease_start' => 'date',
            'approved' => 'boolean',
        ];
    }

    public function visitors()  { return $this->hasMany(Visitor::class); }
    public function incidents() { return $this->hasMany(Incident::class); }
}
