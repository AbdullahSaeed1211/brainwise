import { apiDocumentation } from "@/lib/api-docs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

// Define interface for response details
interface ResponseDetail {
  description: string;
  content?: {
    "application/json"?: {
      example?: Record<string, unknown>;
    };
  };
}

export const metadata: Metadata = {
  title: "API Documentation | Brainwise",
  description: "Documentation for Brainwise API endpoints and integrations",
  robots: {
    index: false,  // Don't index API docs
    follow: true
  }
};

export default function ApiDocsPage() {
  return (
    <div className="container py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Brainwise API Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Complete reference for the Brainwise platform API endpoints
        </p>
      </div>

      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Base URL</h2>
        <code className="bg-background p-2 rounded text-sm block">
          {apiDocumentation.baseUrl}
        </code>
        <p className="mt-2 text-sm text-muted-foreground">
          All API endpoints are relative to this base URL.
        </p>
      </div>

      <div className="space-y-8">
        {apiDocumentation.endpoints.map((endpoint, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <Badge variant={endpoint.method === "GET" ? "outline" : "default"} className="mr-2">
                      {endpoint.method}
                    </Badge>
                    <code>{endpoint.path}</code>
                  </CardTitle>
                  <CardDescription className="mt-2">{endpoint.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="request" className="w-full">
                <TabsList className="w-full rounded-none justify-start">
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>
                <TabsContent value="request" className="p-4 pt-2">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Authentication</h3>
                    <p>{endpoint.authentication}</p>
                  </div>
                  
                  {endpoint.requestBody && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Request Body</h3>
                      <div className="bg-muted p-3 rounded-md overflow-auto max-h-96">
                        <pre className="text-xs">
                          {JSON.stringify(endpoint.requestBody.content?.["application/json"]?.schema, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="response" className="p-4 pt-2">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Response Codes</h3>
                    <div className="space-y-2">
                      {Object.entries(endpoint.responses).map(([code, details]: [string, ResponseDetail]) => (
                        <div key={code} className="flex items-start">
                          <Badge 
                            variant={code.startsWith("2") ? "outline" : "destructive"} 
                            className="mr-2 min-w-16 justify-center"
                          >
                            {code}
                          </Badge>
                          <div>
                            <p className="text-sm">{details.description}</p>
                            {details.content && details.content["application/json"]?.example && (
                              <div className="mt-2 bg-muted p-3 rounded-md overflow-auto max-h-56">
                                <pre className="text-xs">
                                  {JSON.stringify(details.content["application/json"].example, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 