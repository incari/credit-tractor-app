"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Check, AlertCircle, Database, Key, Globe } from "lucide-react";

export function EnvSetup() {
  const [credentials, setCredentials] = useState({
    supabaseUrl: "",
    supabaseAnonKey: "",
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [showEnvFile, setShowEnvFile] = useState(false);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateEnvFile = () => {
    return `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${credentials.supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${credentials.supabaseAnonKey}

# Optional: For development
NEXT_PUBLIC_APP_URL=http://localhost:3000`;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return url.includes("supabase.co");
    } catch {
      return false;
    }
  };

  const isValidKey = (key: string) => {
    return key.length > 100 && key.startsWith("eyJ");
  };

  const allValid =
    isValidUrl(credentials.supabaseUrl) &&
    isValidKey(credentials.supabaseAnonKey);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Credit Tractor Setup
              </h1>
              <p className="text-lg font-medium text-green-600">
                Configure Supabase Connection
              </p>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            To get started with Credit Tractor, you need to configure your
            Supabase credentials. Follow the steps below to connect your
            database.
          </p>
        </div>

        {/* Setup Steps */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Step 1: Get Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                Step 1: Get Your Supabase Credentials
              </CardTitle>
              <CardDescription>
                Find your project URL and anon key in your Supabase dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supabaseUrl">Supabase Project URL</Label>
                <Input
                  id="supabaseUrl"
                  placeholder="https://your-project-id.supabase.co"
                  value={credentials.supabaseUrl}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      supabaseUrl: e.target.value,
                    }))
                  }
                />
                {credentials.supabaseUrl &&
                  !isValidUrl(credentials.supabaseUrl) && (
                    <p className="text-sm text-red-500">
                      Please enter a valid Supabase URL
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="supabaseKey">Supabase Anon Key</Label>
                <Input
                  id="supabaseKey"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={credentials.supabaseAnonKey}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      supabaseAnonKey: e.target.value,
                    }))
                  }
                  type="password"
                />
                {credentials.supabaseAnonKey &&
                  !isValidKey(credentials.supabaseAnonKey) && (
                    <p className="text-sm text-red-500">
                      Please enter a valid Supabase anon key
                    </p>
                  )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Where to find these:</strong>
                  <br />
                  1. Go to your Supabase project dashboard
                  <br />
                  2. Navigate to Settings → API
                  <br />
                  3. Copy the "Project URL" and "anon public" key
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Step 2: Environment File */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-green-500" />
                Step 2: Create Environment File
              </CardTitle>
              <CardDescription>
                Create a .env.local file in your project root
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setShowEnvFile(true)}
                disabled={!allValid}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Generate .env.local File
              </Button>

              {showEnvFile && allValid && (
                <div className="space-y-2">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm relative">
                    <pre className="whitespace-pre-wrap">
                      {generateEnvFile()}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-transparent"
                      onClick={() => handleCopy(generateEnvFile(), "env")}
                    >
                      {copied === "env" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Copy this content and save it as{" "}
                    <code className="bg-gray-100 px-1 rounded">.env.local</code>{" "}
                    in your project root
                  </p>
                </div>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Never commit your .env.local file
                  to version control. Add it to your .gitignore file.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Database Schema Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              Step 3: Verify Database Schema
            </CardTitle>
            <CardDescription>
              Make sure your Supabase database has the correct tables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Your database should have these tables with the{" "}
                <code className="bg-gray-100 px-1 rounded">creditTractor_</code>{" "}
                prefix:
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800">
                    creditTractor_payments
                  </h4>
                  <p className="text-sm text-green-600">
                    Payment plans and installments
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800">
                    creditTractor_credit_cards
                  </h4>
                  <p className="text-sm text-green-600">
                    Credit card information
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800">
                    creditTractor_user_settings
                  </h4>
                  <p className="text-sm text-green-600">User preferences</p>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  If you haven't run the database schema yet, go to your
                  Supabase SQL Editor and run the
                  <code className="bg-gray-100 px-1 rounded ml-1">
                    supabase-schema.sql
                  </code>{" "}
                  file provided.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        {allValid && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">🎉 Ready to Go!</CardTitle>
              <CardDescription className="text-green-600">
                Your credentials look good. Follow these final steps:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
                <li>Save the .env.local file in your project root</li>
                <li>
                  Restart your development server:{" "}
                  <code className="bg-green-100 px-1 rounded">npm run dev</code>
                </li>
                <li>The app should now connect to your Supabase database</li>
                <li>Try signing up or signing in to test the connection</li>
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
