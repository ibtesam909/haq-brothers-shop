"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { siteConfig } from "@/lib/data"

const preferences = [
  { id: "orders", label: "New order alerts", desc: "Email me whenever a customer places an order" },
  { id: "lowstock", label: "Low stock warnings", desc: "Notify me when a product drops below 12 units" },
  { id: "reviews", label: "Review notifications", desc: "Get notified about new customer reviews" },
  { id: "marketing", label: "Marketing summary", desc: "Weekly digest of sales and traffic performance" },
]

export function SettingsPanel() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    orders: true,
    lowstock: true,
    reviews: false,
    marketing: true,
  })

  return (
    <Tabs defaultValue="store" className="space-y-6">
      <TabsList className="rounded-xl">
        <TabsTrigger value="store">Store</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="store">
        <Card className="rounded-2xl border-border/60">
          <CardHeader>
            <CardTitle className="font-display">Store profile</CardTitle>
            <CardDescription>This information appears across your storefront</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store name</Label>
                <Input id="store-name" defaultValue={siteConfig.name} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" defaultValue={siteConfig.tagline} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                rows={4}
                className="rounded-xl"
                defaultValue="Haq Brothers is Chakwal's premier destination for sports equipment and toys, trusted by athletes and families since day one."
              />
            </div>
            <SaveRow />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contact">
        <Card className="rounded-2xl border-border/60">
          <CardHeader>
            <CardTitle className="font-display">Contact details</CardTitle>
            <CardDescription>How customers reach your shop</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue={siteConfig.phone} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={siteConfig.email} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue={siteConfig.address} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City / Region</Label>
                <Input id="city" defaultValue={siteConfig.city} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Opening hours</Label>
              <Input id="hours" defaultValue={siteConfig.hours} className="rounded-xl" />
            </div>
            <SaveRow />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card className="rounded-2xl border-border/60">
          <CardHeader>
            <CardTitle className="font-display">Notifications</CardTitle>
            <CardDescription>Choose what the owner gets notified about</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {preferences.map((pref, i) => (
              <div key={pref.id}>
                {i > 0 ? <Separator className="my-1" /> : null}
                <div className="flex items-center justify-between gap-4 py-3">
                  <div className="space-y-0.5">
                    <Label htmlFor={pref.id} className="cursor-pointer">
                      {pref.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{pref.desc}</p>
                  </div>
                  <Switch
                    id={pref.id}
                    checked={toggles[pref.id]}
                    onCheckedChange={(v) => setToggles((prev) => ({ ...prev, [pref.id]: v }))}
                  />
                </div>
              </div>
            ))}
            <SaveRow />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function SaveRow() {
  return (
    <div className="flex justify-end pt-2">
      <Button className="rounded-xl bg-primary shadow-lg shadow-primary/20">
        <Save className="size-4" />
        Save changes
      </Button>
    </div>
  )
}
