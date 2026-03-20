export default function SearchBar({ value, onChange, placeholder = 'Search foods...' }) {
  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-tertiary">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full font-body text-lg text-text-primary
          bg-surface-sunken border border-border-default rounded-lg
          py-4 px-4 pl-11
          placeholder:text-text-tertiary
          focus:outline-none focus:border-moss focus:ring-2 focus:ring-moss-light
          transition-all duration-200 ease-in-out
        "
      />
    </div>
  )
}
