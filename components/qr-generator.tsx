"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { QRType, QROptions, ContactInfo, WiFiInfo } from "@/lib/types"
import { generateQR } from "@/lib/generate-qr"
import { formatContactVCard, formatWiFiConfig } from "@/lib/format-qr-data"

export default function QRGenerator() {
  const [qrType, setQRType] = useState<QRType>("URL")
  const [qrOptions, setQROptions] = useState<QROptions>({
    text: "",
    foregroundColor: "#000000",
    backgroundColor: "#FFFFFF",
    errorCorrectionLevel: "H",
    cornerStyle: "square",
    pixelStyle: "square",
  })
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: "",
    phone: "",
    email: "",
    organization: "",
    title: "",
  })
  const [wifiInfo, setWifiInfo] = useState<WiFiInfo>({
    ssid: "",
    password: "",
    encryption: "WPA",
  })
  const [qrCode, setQRCode] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const generateQRCode = async () => {
      let text = qrOptions.text

      if (qrType === "Contact") {
        text = formatContactVCard(contactInfo)
      } else if (qrType === "WiFi") {
        text = formatWiFiConfig(wifiInfo)
      }

      if (text) {
        const url = await generateQR({
          text,
          foregroundColor: qrOptions.foregroundColor,
          backgroundColor: qrOptions.backgroundColor,
          errorCorrectionLevel: qrOptions.errorCorrectionLevel,
          logo: qrOptions.logo,
        })
        setQRCode(url)
      }
    }
    generateQRCode()
  }, [qrOptions, qrType, contactInfo, wifiInfo])

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setQROptions({ ...qrOptions, logo: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadQR = (format: "svg" | "png") => {
    if (!qrCode) return

    const link = document.createElement("a")
    link.download = `qr-code.${format}`
    link.href = qrCode
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Custom QR Code Generator</h1>
      <p className="text-muted-foreground mb-6">Create your unique QR code with various customization options.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Tabs defaultValue="URL" onValueChange={(value) => setQRType(value as QRType)}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="URL">URL</TabsTrigger>
              <TabsTrigger value="Text">Text</TabsTrigger>
              <TabsTrigger value="Contact">Contact</TabsTrigger>
              <TabsTrigger value="WiFi">WiFi</TabsTrigger>
            </TabsList>

            <TabsContent value="URL" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={qrOptions.text}
                  onChange={(e) => setQROptions({ ...qrOptions, text: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="Text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Text Content</Label>
                <Textarea
                  id="text"
                  placeholder="Enter your text here..."
                  value={qrOptions.text}
                  onChange={(e) => setQROptions({ ...qrOptions, text: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="Contact" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1234567890"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization (Optional)</Label>
                <Input
                  id="organization"
                  placeholder="Company Name"
                  value={contactInfo.organization}
                  onChange={(e) => setContactInfo({ ...contactInfo, organization: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="Job Title"
                  value={contactInfo.title}
                  onChange={(e) => setContactInfo({ ...contactInfo, title: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="WiFi" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ssid">Network Name (SSID)</Label>
                <Input
                  id="ssid"
                  placeholder="WiFi Network Name"
                  value={wifiInfo.ssid}
                  onChange={(e) => setWifiInfo({ ...wifiInfo, ssid: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="WiFi Password"
                  value={wifiInfo.password}
                  onChange={(e) => setWifiInfo({ ...wifiInfo, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="encryption">Encryption</Label>
                <Select
                  value={wifiInfo.encryption}
                  onValueChange={(value) => setWifiInfo({ ...wifiInfo, encryption: value as "WPA" | "WEP" | "nopass" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">No Encryption</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
            <div>
              <Label>Logo</Label>
              <div className="mt-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-20 flex flex-col items-center justify-center"
                >
                  <Plus className="h-6 w-6 mb-2" />
                  <span>Upload Logo</span>
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </div>
              {qrOptions.logo && (
                <div className="mt-2 flex items-center">
                  <img
                    src={qrOptions.logo || "/placeholder.svg"}
                    alt="Uploaded logo"
                    className="w-10 h-10 rounded-full object-cover mr-2"
                  />
                  <span className="text-sm text-muted-foreground">Logo uploaded</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="foreground">Foreground Color</Label>
              <Input
                id="foreground"
                type="color"
                value={qrOptions.foregroundColor}
                onChange={(e) => setQROptions({ ...qrOptions, foregroundColor: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="background">Background Color</Label>
              <Input
                id="background"
                type="color"
                value={qrOptions.backgroundColor}
                onChange={(e) => setQROptions({ ...qrOptions, backgroundColor: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correction">Error Correction Level</Label>
              <Select
                value={qrOptions.errorCorrectionLevel}
                onValueChange={(value) =>
                  setQROptions({
                    ...qrOptions,
                    errorCorrectionLevel: value as "L" | "M" | "Q" | "H",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low</SelectItem>
                  <SelectItem value="M">Medium</SelectItem>
                  <SelectItem value="Q">Quartile</SelectItem>
                  <SelectItem value="H">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="corner">Corner Style</Label>
              <Select
                value={qrOptions.cornerStyle}
                onValueChange={(value) =>
                  setQROptions({
                    ...qrOptions,
                    cornerStyle: value as "square" | "dot" | "round",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="dot">Dot</SelectItem>
                  <SelectItem value="round">Round</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pixel">Pixel Style</Label>
              <Select
                value={qrOptions.pixelStyle}
                onValueChange={(value) =>
                  setQROptions({
                    ...qrOptions,
                    pixelStyle: value as "square" | "dot" | "round",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="dot">Dot</SelectItem>
                  <SelectItem value="round">Round</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {qrCode && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="aspect-square w-full flex items-center justify-center bg-white">
                <img
                  src={qrCode || "/placeholder.svg"}
                  alt="Generated QR Code"
                  className="max-w-full h-auto"
                  width={1024}
                  height={1024}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => downloadQR("svg")} className="flex-1">
                  Download SVG
                </Button>
                <Button onClick={() => downloadQR("png")} className="flex-1">
                  Download PNG
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

