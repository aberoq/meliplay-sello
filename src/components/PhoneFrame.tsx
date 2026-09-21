import type { ReactNode } from 'react'
import './PhoneFrame.css'

type PhoneFrameProps = {
  children: ReactNode
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="phone-shell">
      <div className="phone-frame">{children}</div>
    </div>
  )
}
