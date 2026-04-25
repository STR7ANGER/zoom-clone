import type { ReactNode } from "react"
import { ChevronLeft, Monitor, Plus, TriangleAlert } from "lucide-react"

import { AccountShell } from "@/components/shared/account-shell"

const inputClass =
  "h-[30px] rounded-md border border-[#b8c0cc] bg-white px-2.5 text-[14px] text-[#232333] outline-none focus:border-[#0b5cff]"

function Row({
  label,
  children,
  required = false,
}: {
  label: string
  children: ReactNode
  required?: boolean
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[135px_minmax(0,1fr)] sm:items-start">
      <label className="pt-1.5 text-[14px] text-[#232333]">
        {required ? <span className="text-[#d93025]">* </span> : null}
        {label}
      </label>
      <div>{children}</div>
    </div>
  )
}

function Check({ label, muted = false, defaultChecked = false }: { label: string; muted?: boolean; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-[14px] text-[#232333]">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        disabled={muted}
        className="size-3.5 accent-[#0b5cff]"
      />
      <span className={muted ? "text-[#9aa3b2]" : ""}>{label}</span>
    </label>
  )
}

function Radio({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-[14px] text-[#232333]">
      <input type="radio" name="meeting-id" defaultChecked={defaultChecked} className="size-3.5 accent-[#0b5cff]" />
      {label}
    </label>
  )
}

export default function SchedulePage() {
  return (
    <AccountShell active="meetings">
      <div className="min-h-[calc(100vh-94px)] px-5 py-7 lg:px-7">
        <div className="max-w-[895px]">
          <a className="inline-flex items-center gap-1 text-[14px] font-medium text-[#005bff]" href="#">
            <ChevronLeft className="size-4" />
            Back to Meetings
          </a>

          <h1 className="mt-5 text-xl font-bold text-[#232333]">Schedule Meeting</h1>

          <form className="mt-7 space-y-5">
            <Row label="Topic" required>
              <input className={`${inputClass} w-full max-w-[442px]`} defaultValue="My Meeting" />
            </Row>

            <Row label="">
              <button type="button" className="inline-flex items-center gap-1 text-[14px] font-medium text-[#005bff]">
                <Plus className="size-4" />
                Add Description
              </button>
            </Row>

            <Row label="When">
              <div className="flex flex-wrap items-center gap-2">
                <input className={`${inputClass} w-[215px]`} defaultValue="04/25/2026" />
                <select className={`${inputClass} w-[160px]`} defaultValue="6:30">
                  <option>6:30</option>
                </select>
                <select className={`${inputClass} w-[82px]`} defaultValue="PM">
                  <option>PM</option>
                </select>
              </div>
            </Row>

            <Row label="Duration">
              <div className="flex flex-wrap items-center gap-2">
                <select className={`${inputClass} w-[135px] text-[#9aa3b2]`} defaultValue="0">
                  <option>0</option>
                </select>
                <span className="text-[14px]">hr</span>
                <select className={`${inputClass} w-[135px]`} defaultValue="40">
                  <option>40</option>
                </select>
                <span className="text-[14px]">min</span>
              </div>
              <div className="mt-5 flex max-w-[730px] gap-2 rounded-md bg-[#fff8ef] px-3 py-2.5 text-[14px] leading-snug">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 fill-[#ffc400] text-[#d99a00]" />
                <p>
                  You can schedule meetings for up to 40 minutes each with your current Basic plan. Need more time?
                  <br />
                  <a className="font-semibold text-[#005bff]" href="#">
                    Upgrade to Zoom Workplace Pro
                  </a>
                </p>
              </div>
            </Row>

            <Row label="Time Zone">
              <select className={`${inputClass} w-full max-w-[442px]`} defaultValue="(GMT+5:30) India">
                <option>(GMT+5:30) India</option>
              </select>
            </Row>

            <Row label="">
              <Check label="Recurring meeting" />
            </Row>

            <Row label="Invitees">
              <input className={`${inputClass} w-full max-w-[442px]`} placeholder="Enter user names or email addresses" />
              <div className="mt-2 flex max-w-[442px] gap-2 rounded-md border border-[#efb16e] bg-[#fffaf4] px-4 py-3 text-[12px] leading-snug">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 fill-[#ffc400] text-[#d99a00]" />
                <p>
                  Invitations won&apos;t be sent until your calendar is connected.
                  <br />
                  <a className="font-medium text-[#005bff]" href="#">
                    Connect calendar
                  </a>
                </p>
              </div>
            </Row>

            <Row label="Meeting ID">
              <div className="flex flex-wrap gap-6 pt-1">
                <Radio label="Generate Automatically" defaultChecked />
                <Radio label="Personal Meeting ID 844 093 3566" />
              </div>
            </Row>

            <Row label="Template">
              <select className={`${inputClass} w-full max-w-[442px] text-[#5f6477]`} defaultValue="Select a template">
                <option>Select a template</option>
              </select>
            </Row>

            <Row label="Whiteboard">
              <button type="button" className="inline-flex h-[30px] items-center gap-1 rounded-md border border-[#9aa4b4] px-2.5 text-[14px]">
                <Monitor className="size-4" />
                Add Whiteboard
              </button>
            </Row>

            <Row label="Docs">
              <button type="button" className="inline-flex h-[30px] items-center gap-1 rounded-md border border-[#9aa4b4] px-2.5 text-[14px]">
                <Plus className="size-4" />
                Add Docs
              </button>
            </Row>

            <Row label="Security">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Check label="Passcode" defaultChecked muted />
                  <input className={`${inputClass} w-[135px]`} defaultValue="sc2Mni" />
                </div>
                <p className="max-w-[520px] text-[12px] text-[#5f6477]">
                  Only users who have the invite link or passcode can join the meeting.
                </p>
                <Check label="Waiting Room" />
                <p className="max-w-[520px] text-[12px] text-[#5f6477]">
                  Only users admitted by the host can join the meeting.
                </p>
              </div>
            </Row>

            <Row label="Encryption">
              <div className="space-y-3 pt-1">
                <label className="flex items-center gap-2 text-[14px]">
                  <input type="radio" name="encryption" defaultChecked className="size-3.5 accent-[#0b5cff]" />
                  Enhanced encryption
                </label>
                <label className="flex items-center gap-2 text-[14px]">
                  <input type="radio" name="encryption" className="size-3.5 accent-[#0b5cff]" />
                  End-to-end encryption
                </label>
              </div>
            </Row>

            <Row label="AI Companion">
              <div className="space-y-3">
                <Check label="Automatically start AI Companion" />
                <Check label="Automatically start meeting questions" />
                <Check label="Automatically start meeting summary" />
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[14px]">Meeting summary template</span>
                  <select className={`${inputClass} w-[220px]`} defaultValue="General template">
                    <option>General template</option>
                  </select>
                  <a className="text-[13px] font-medium text-[#005bff]" href="#">
                    Change default summary template
                  </a>
                </div>
                <Check label="Allow everyone to use meeting transcript with My notes" />
              </div>
            </Row>

            <Row label="Meeting chat">
              <Check label="Enable Continuous Meeting Chat" />
            </Row>

            <Row label="Video">
              <div className="space-y-3">
                {["Host", "Participant"].map((item) => (
                  <div key={item} className="flex items-center gap-6 text-[14px]">
                    <span className="w-24">{item}</span>
                    <label className="flex items-center gap-2">
                      <input type="radio" name={item} className="size-3.5 accent-[#0b5cff]" />
                      on
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name={item} defaultChecked className="size-3.5 accent-[#0b5cff]" />
                      off
                    </label>
                  </div>
                ))}
              </div>
            </Row>

            <Row label="Options">
              <div className="space-y-3">
                <button type="button" className="text-[14px] font-semibold text-[#232333]">
                  Hide
                </button>
                <Check label="Allow participants to join anytime" />
                <Check label="Mute participants upon entry" />
                <Check label="Automatically record meeting on the local computer" />
                <Check label="Approve or block entry to users from specific regions/countries" />
              </div>
            </Row>

            <div className="flex gap-2 pt-1 sm:pl-[135px]">
              <button type="button" className="rounded-md bg-[#0b5cff] px-4 py-2 text-[14px] font-semibold text-white">
                Save
              </button>
              <button type="button" className="rounded-md border border-[#9aa4b4] px-4 py-2 text-[14px]">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AccountShell>
  )
}
