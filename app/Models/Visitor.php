<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Visitor extends Model
{
    protected $fillable = [
        'user_id','checked_in_by','name','id_number','phone',
        'purpose','date','time_in','time_out',
        'type','status','token','arrived_at','left_at',
    ];

    protected $casts = [
        'date'        => 'date',
        'arrived_at'  => 'datetime',
        'left_at'     => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Visitor $visitor) {
            if ($visitor->type === 'invited' && !$visitor->token) {
                $visitor->token = Str::random(48);
            }
        });
    }

    public function tenant()    { return $this->belongsTo(User::class, 'user_id'); }
    public function checkedInBy() { return $this->belongsTo(User::class, 'checked_in_by'); }
    public function getUnitAttribute() { return $this->tenant->unit; }
}
