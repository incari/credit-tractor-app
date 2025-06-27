"use client"

import { Github, Linkedin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function Footer() {
  return (
    <Card className="mt-8">
      <CardContent className="py-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Credit Tractor</h3>
            <p className="text-sm text-muted-foreground">Payment Tracking Made Simple</p>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://www.linkedin.com/in/racana/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="text-sm">LinkedIn</span>
            </a>

            <a
              href="https://github.com/incari"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>

          <div className="text-xs text-muted-foreground">
            © 2024 Credit Tractor. Built with ❤️ for better financial tracking.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
