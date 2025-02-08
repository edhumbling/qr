export type QRType = "URL" | "Text" | "Contact" | "WiFi"

export interface QROptions {
  text: string
  foregroundColor: string
  backgroundColor: string
  errorCorrectionLevel: "L" | "M" | "Q" | "H"
  cornerStyle: "square" | "dot" | "round"
  pixelStyle: "square" | "dot" | "round"
  logo?: string
}

export interface ContactInfo {
  name: string
  phone: string
  email: string
  organization?: string
  title?: string
}

export interface WiFiInfo {
  ssid: string
  password: string
  encryption: "WPA" | "WEP" | "nopass"
}

