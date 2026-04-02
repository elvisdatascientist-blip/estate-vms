import React, { forwardRef, useEffect, useRef, useState } from 'react';

/* ─── Button ──────────────────────────────────────────────────── */
const variantStyles = {
  primary:   'bg-brand-800 text-white hover:bg-brand-900 border-brand-800 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200',
  secondary: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200',
  accent:    'btn-gradient text-white border-accent shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200',
  success:   'bg-success text-white hover:bg-success-dk border-transparent shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200',
  danger:    'bg-danger text-white hover:bg-danger-dk border-transparent shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200',
  ghost:     'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent hover:text-gray-800 transition-all duration-200',
  outline:   'bg-transparent text-brand-700 hover:bg-brand-50 border-brand-200 hover:border-brand-300 transition-all duration-200',
};
const sizeStyles = {
  xs: 'px-2.5 py-1 text-xs rounded-md gap-1',
  sm: 'px-3.5 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
};

export const Button = forwardRef(({ variant = 'secondary', size = 'md', className = '', children, loading, icon, ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center font-medium border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? <Spinner size="sm" /> : icon && <span className="shrink-0">{icon}</span>}
    {children}
  </button>
));

/* ─── Badge ───────────────────────────────────────────────────── */
const badgeVariants = {
  pending:     'bg-orange-50 text-orange-700 border-orange-200',
  'checked-in':'bg-emerald-50 text-emerald-700 border-emerald-200',
  'checked-out':'bg-gray-100 text-gray-600 border-gray-200',
  resolved:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  high:        'bg-red-50 text-red-700 border-red-200',
  medium:      'bg-amber-50 text-amber-700 border-amber-200',
  low:         'bg-sky-50 text-sky-700 border-sky-200',
  'on-duty':   'bg-emerald-50 text-emerald-700 border-emerald-200',
  'off-duty':  'bg-gray-100 text-gray-500 border-gray-200',
  info:        'bg-sky-50 text-sky-700 border-sky-200',
  accent:      'bg-accent-bg text-amber-800 border-amber-200',
};

export const Badge = ({ variant = 'info', children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide ${badgeVariants[variant] || badgeVariants.info} ${className}`}>
    {children}
  </span>
);

/* ─── Card ────────────────────────────────────────────────────── */
export const Card = ({ className = '', children, padding = true, hover = false }) => (
  <div className={`bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-hidden ${hover ? 'card-hover cursor-pointer' : ''} ${padding ? 'p-6' : ''} ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-5">
    <div>
      <h3 className="text-sm font-bold text-gray-800 tracking-wide uppercase" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0 ml-4">{action}</div>}
  </div>
);

/* ─── Stat Card ───────────────────────────────────────────────── */
export const StatCard = ({ label, value, icon, color = 'blue', trend, loading = false }) => {
  const colors = {
    blue:   'bg-sky-50 text-sky-600',
    green:  'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    red:    'bg-red-50 text-red-600',
    slate:  'bg-gray-100 text-gray-600',
    gold:   'bg-accent-bg text-amber-700',
  };
  
  if (loading) {
    return (
      <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="skeleton h-3 w-20 rounded"></span>
          <div className="skeleton w-9 h-9 rounded-lg"></div>
        </div>
        <div className="skeleton h-8 w-16 rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 card-hover">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        {icon && <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${colors[color]} transition-transform duration-200 hover:scale-110`}>{icon}</div>}
      </div>
      <div className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
      {trend && <p className="text-xs text-gray-400 mt-1.5">{trend}</p>}
    </div>
  );
};

/* ─── Input ───────────────────────────────────────────────────── */
export const Input = forwardRef(({ label, error, hint, icon, className = '', floating = false, ...props }, ref) => {
  if (floating) {
    return (
      <div className={`input-group ${className}`}>
        <input
          ref={ref}
          className={`w-full px-3.5 py-3 text-sm border rounded-xl bg-white text-gray-900 placeholder-transparent
            transition-all duration-200
            focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100
            disabled:bg-gray-50 disabled:text-gray-400
            ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 hover:border-gray-300'}
            ${icon ? 'pl-10' : ''}`}
          placeholder=" "
          {...props}
        />
        <label className="floating-label text-xs font-semibold text-gray-600 tracking-wide">
          {label}
        </label>
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{icon}</span>}
        {error && <p className="text-xs text-red-500 font-medium mt-1">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-gray-600 tracking-wide">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{icon}</span>}
        <input
          ref={ref}
          className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-white text-gray-900 placeholder-gray-400
            transition-all duration-200
            focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100
            disabled:bg-gray-50 disabled:text-gray-400
            ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 hover:border-gray-300'}
            ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
});

/* ─── Select ──────────────────────────────────────────────────── */
export const Select = forwardRef(({ label, error, className = '', children, ...props }, ref) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-xs font-semibold text-gray-600 tracking-wide">{label}</label>}
    <select
      ref={ref}
      className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-gray-900
        transition-all duration-200
        focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100
        ${error ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
));

/* ─── Textarea ────────────────────────────────────────────────── */
export const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-xs font-semibold text-gray-600 tracking-wide">{label}</label>}
    <textarea
      ref={ref}
      rows={4}
      className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-gray-900 placeholder-gray-400 resize-y
        transition-all duration-200
        focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100
        ${error ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
));

/* ─── Modal ───────────────────────────────────────────────────── */
export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  const sizeClass = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }[size];
  const overlayRef = useRef();

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(26,26,46,.65)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClass} max-h-[90vh] overflow-y-auto animate-modal`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 text-lg leading-none hover:rotate-90"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

/* ─── Avatar ──────────────────────────────────────────────────── */
export const Avatar = ({ name = '', size = 'md', color = 'brand', status = null }) => {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div className={`rounded-full flex items-center justify-center font-bold shrink-0 relative ${sizes[size]} ${status ? 'status-dot status-' + status : ''}`}
      style={{ background: 'var(--brand-800)', color: '#c9a84c', fontFamily: 'var(--font-display)' }}>
      {initials}
    </div>
  );
};

/* ─── Spinner ─────────────────────────────────────────────────── */
export const Spinner = ({ size = 'md' }) => {
  const s = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' }[size];
  return <div className={`${s} border-2 border-current border-t-transparent rounded-full animate-spin opacity-60`} />;
};

/* ─── Empty State ─────────────────────────────────────────────── */
export const EmptyState = ({ icon = '📭', title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    <span className="text-4xl mb-3 opacity-40">{icon}</span>
    <p className="text-sm font-semibold text-gray-600">{title}</p>
    {description && <p className="text-xs text-gray-400 mt-1.5 max-w-xs">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

/* ─── Alert ───────────────────────────────────────────────────── */
export const Alert = ({ type = 'info', children, onClose }) => {
  const styles = {
    info:    'bg-sky-50 border-sky-200 text-sky-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    danger:  'bg-red-50 border-red-200 text-red-800',
  };
  const icons = { info: 'i', success: '✓', warning: '!', danger: '✕' };
  return (
    <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border text-sm ${styles[type]}`}>
      <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-current/10 mt-0.5">{icons[type]}</span>
      <span className="flex-1">{children}</span>
      {onClose && <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 ml-1">&times;</button>}
    </div>
  );
};

/* ─── Table ───────────────────────────────────────────────────── */
export const Table = ({ columns, data, emptyState, hover = true }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200/80">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          {columns.map((col, i) => (
            <th key={i} className="text-left py-3.5 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0
          ? <tr><td colSpan={columns.length}>{emptyState || <EmptyState title="No records found" />}</td></tr>
          : data.map((row, ri) => (
            <tr key={ri} className={`border-b border-gray-100 ${hover ? 'table-row-hover' : ''}`}>
              {columns.map((col, ci) => (
                <td key={ci} className="py-3.5 px-4 text-gray-700">{col.cell(row)}</td>
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

/* ─── Tabs ────────────────────────────────────────────────────── */
export const Tabs = ({ tabs, active, onChange }) => (
  <div className="flex gap-1 border-b border-gray-200 mb-6">
    {tabs.map(tab => (
      <button
        key={tab.value}
        onClick={() => onChange(tab.value)}
        className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 -mb-px ${
          active === tab.value
            ? 'border-brand-800 text-brand-800'
            : 'border-transparent text-gray-400 hover:text-gray-600'
        }`}
      >
        {tab.label}
        {tab.count !== undefined && (
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${active === tab.value ? 'bg-brand-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {tab.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

/* ─── QR Code (SVG pattern) ───────────────────────────────────── */
export const QRCode = ({ value = '', size = 80 }) => {
  const cells = [];
  const grid = 11;
  const cell = Math.floor(size / grid);
  const seed = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const pseudo = (r, c) => ((seed * 31 + r * 17 + c * 7) % 100) > 40;
  const isFinder = (r, c) => (r < 4 && c < 4) || (r < 4 && c >= grid - 4) || (r >= grid - 4 && c < 4);

  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      if (isFinder(r, c) || pseudo(r, c)) {
        cells.push(<rect key={`${r}-${c}`} x={c * cell + 1} y={r * cell + 1} width={cell - 1} height={cell - 1} rx="1.5" fill="var(--brand-800)" />);
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-sm">
      <rect width={size} height={size} fill="white" rx="8" />
      {cells}
    </svg>
  );
};

/* ─── Progress Bar ───────────────────────────────────────────── */
export const ProgressBar = ({ value = 0, max = 100, color = 'brand', size = 'md', showLabel = false }) => {
  const colors = {
    brand: 'bg-brand-600',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={`w-full ${sizes[size]} bg-gray-200 rounded-full overflow-hidden`}>
      <div 
        className={`h-full ${colors[color]} transition-all duration-500 ease-out rounded-full`}
        style={{ width: `${percentage}%` }}
      />
      {showLabel && (
        <span className="text-xs text-gray-600 mt-1 block text-center">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

/* ─── Skeleton Card ───────────────────────────────────────────── */
export const SkeletonCardOld = ({ lines = 3 }) => (
  <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm animate-pulse">
    <div className="space-y-3">
      <div className="skeleton h-4 w-3/4 rounded"></div>
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <div key={i} className="skeleton h-3 w-full rounded"></div>
      ))}
    </div>
  </div>
);

/* ─── Search Input ─────────────────────────────────────────────── */
export const SearchInput = forwardRef(({ placeholder = 'Search...', className = '', onClear, ...props }, ref) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-xl bg-white text-gray-900 placeholder-gray-400
          transition-all duration-200
          focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100
          ${focused ? 'border-brand-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {props.value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});

/* ─── Dropdown Menu ───────────────────────────────────────────── */
export const DropdownMenu = ({ trigger, children, position = 'bottom-right' }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  
  const positions = {
    'bottom-right': 'top-full right-0 mt-1',
    'bottom-left': 'top-full left-0 mt-1',
    'top-right': 'bottom-full right-0 mb-1',
    'top-left': 'bottom-full left-0 mb-1',
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setOpen(!open)}>
        {trigger}
      </div>
      {open && (
        <div className={`absolute ${positions[position]} z-50 min-w-48 bg-white rounded-xl shadow-lg border border-gray-200/80 py-2 animate-slide-down`}>
          {children}
        </div>
      )}
    </div>
  );
};

/* ─── Tooltip ─────────────────────────────────────────────────── */
export const Tooltip = ({ text, children, position = 'top' }) => {
  const [show, setShow] = useState(false);
  
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };
  
  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className={`absolute ${positions[position]} z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-lg whitespace-nowrap animate-fade-in`}>
          {text}
          <div className={`absolute ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : 'right-full top-1/2 -translate-y-1/2 -mr-1'} w-2 h-2 bg-gray-900 rotate-45`}></div>
        </div>
      )}
    </div>
  );
};

/* ─── Loading States ───────────────────────────────────────────── */
export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div className={`${sizes[size]} border-3 border-gray-200 border-t-brand-600 rounded-full animate-spin`}></div>
      {text && <p className="text-sm text-gray-500 animate-pulse">{text}</p>}
    </div>
  );
};

/* ─── Skeleton Components ───────────────────────────────────────── */
export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className={`skeleton rounded ${i === 0 ? 'h-4 w-3/4' : 'h-3 w-full'}`}
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  return <div className={`${sizes[size]} skeleton rounded-full`}></div>;
};

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="skeleton h-4 rounded" style={{ animationDelay: `${i * 0.05}s` }} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div 
            key={colIndex} 
            className="skeleton h-3 rounded" 
            style={{ animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s` }}
          />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonCard = ({ lines = 3, showAvatar = false }) => (
  <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm">
    {showAvatar && (
      <div className="flex items-center gap-3 mb-4">
        <SkeletonAvatar size="md" />
        <div className="flex-1">
          <div className="skeleton h-4 w-24 rounded mb-1"></div>
          <div className="skeleton h-3 w-32 rounded"></div>
        </div>
      </div>
    )}
    <SkeletonText lines={lines} />
  </div>
);

/* ─── Page Loading State ───────────────────────────────────────── */
export const PageLoading = ({ title = 'Loading page...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg font-medium text-gray-700">{title}</p>
      <p className="text-sm text-gray-500 mt-1">Please wait a moment...</p>
    </div>
  </div>
);

/* ─── Content Placeholder ─────────────────────────────────────── */
export const ContentPlaceholder = ({ type = 'card', count = 1 }) => {
  const renderPlaceholder = () => {
    switch (type) {
      case 'stat':
        return (
          <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm">
            <div className="skeleton h-3 w-20 rounded mb-3"></div>
            <div className="skeleton h-8 w-16 rounded"></div>
            <div className="skeleton h-3 w-24 rounded mt-2"></div>
          </div>
        );
      case 'table':
        return <SkeletonTable rows={5} columns={4} />;
      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <SkeletonAvatar size="sm" />
                <div className="flex-1">
                  <div className="skeleton h-4 w-32 rounded mb-1"></div>
                  <div className="skeleton h-3 w-48 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <SkeletonCard lines={3} showAvatar />;
    }
  };

  if (count > 1) {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            {renderPlaceholder()}
          </div>
        ))}
      </div>
    );
  }

  return renderPlaceholder();
};

/* ─── Lazy Loading Wrapper ─────────────────────────────────────── */
export const LazyLoad = ({ children, fallback = <ContentPlaceholder type="card" /> }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={elementRef}>
      {isVisible ? children : fallback}
    </div>
  );
};
