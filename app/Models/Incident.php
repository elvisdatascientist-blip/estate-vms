<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    protected $fillable = [
        'user_id','resolved_by','type','title',
        'description','severity','status','resolved_at',
    ];

    protected $casts = ['resolved_at' => 'datetime'];

    public function tenant()   { return $this->belongsTo(User::class, 'user_id'); }
    public function resolver() { return $this->belongsTo(User::class, 'resolved_by'); }
    public function getTenantNameAttribute() { return $this->tenant->name; }
}
