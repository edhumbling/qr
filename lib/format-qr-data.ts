import type { ContactInfo, WiFiInfo } from "./types"

export function formatContactVCard(contact: ContactInfo): string {
  let vcard = "BEGIN:VCARD\nVERSION:3.0\n"
  vcard += `FN:${contact.name}\n`
  if (contact.organization) vcard += `ORG:${contact.organization}\n`
  if (contact.title) vcard += `TITLE:${contact.title}\n`
  vcard += `TEL:${contact.phone}\n`
  vcard += `EMAIL:${contact.email}\n`
  vcard += "END:VCARD"
  return vcard
}

export function formatWiFiConfig(wifi: WiFiInfo): string {
  return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};;`
}

