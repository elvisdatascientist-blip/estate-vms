<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('checked_in_by')->nullable()->constrained('users')->nullOnDelete();

            $table->string('name');
            $table->string('id_number', 30);
            $table->string('phone', 20);
            $table->string('purpose');
            $table->date('date');
            $table->time('time_in');
            $table->time('time_out');

            $table->enum('type', ['invited', 'walkin'])->default('invited');
            $table->enum('status', ['pending', 'checked-in', 'checked-out'])->default('pending');

            $table->string('token', 64)->unique()->nullable();

            $table->timestamp('arrived_at')->nullable();
            $table->timestamp('left_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'date']);
            $table->index(['date', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
