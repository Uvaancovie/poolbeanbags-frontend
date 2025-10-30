"use client"
import { useEffect, useRef } from "react"

export default function PayfastForm({ pf }: { pf: Record<string,string> }) {
  const ref = useRef<HTMLFormElement>(null)
  useEffect(()=>{ ref.current?.submit() },[])
  return (
    <form ref={ref} method="post" action="https://www.payfast.co.za/eng/process">
      {Object.entries(pf).map(([k,v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <noscript>
        <button type="submit" className="btn-primary">Continue to PayFast</button>
      </noscript>
    </form>
  )
}