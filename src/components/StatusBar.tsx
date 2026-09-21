import './StatusBar.css'

export function StatusBar() {
  return (
    <div className="status-bar" aria-hidden>
      <span className="status-bar__time">9:41</span>
      <span className="status-bar__icons">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0" y="7" width="3" height="4" rx="0.5" fill="white" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="white" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill="white" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="white" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path
            d="M7.5 2.8C9.3 2.8 10.9 3.5 12.1 4.7L13.2 3.6C11.7 2.1 9.7 1.2 7.5 1.2C5.3 1.2 3.3 2.1 1.8 3.6L2.9 4.7C4.1 3.5 5.7 2.8 7.5 2.8Z"
            fill="white"
          />
          <path
            d="M7.5 5.5C8.6 5.5 9.6 5.9 10.4 6.6L11.5 5.5C10.4 4.4 9 3.8 7.5 3.8C6 3.8 4.6 4.4 3.5 5.5L4.6 6.6C5.4 5.9 6.4 5.5 7.5 5.5Z"
            fill="white"
          />
          <circle cx="7.5" cy="9.2" r="1.4" fill="white" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="21"
            height="11"
            rx="2.5"
            stroke="white"
            strokeOpacity="0.35"
          />
          <rect x="2" y="2" width="16" height="8" rx="1.5" fill="white" />
          <path
            d="M23 4V8C23.8 7.6 24.2 6.9 24.2 6C24.2 5.1 23.8 4.4 23 4Z"
            fill="white"
            fillOpacity="0.4"
          />
        </svg>
      </span>
    </div>
  )
}
