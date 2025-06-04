"use client";

import React, { useState } from "react";
import { 
  ScrollText, 
  Calendar, 
  Filter, 
  Brain,
  Heart,
  ArrowUpRight,
  Search,
  BookOpen,
  FileText,
  Video,
  Download
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ResearchPaper {
  paperId: string;
  title: string;
  abstract?: string;
  venue?: string;
  year?: number;
  authors?: {
    authorId: string;
    name: string;
  }[];
  tldr?: {
    text: string;
  };
  openAccessPdf?: {
    url: string;
  };
}

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [additionalPapers, setAdditionalPapers] = useState<ResearchPaper[]>([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const searchPapers = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setShowNoResults(false);
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        limit: "5",
        fields: "title,abstract,venue,year,authors,tldr,openAccessPdf",
        fieldsOfStudy: "Neuroscience,Medicine,Psychology"
      });

      const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Semantic Scholar API error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setAdditionalPapers(data.data);
      } else {
        setShowNoResults(true);
      }
    } catch (error) {
      console.error("Error searching papers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePapers = async () => {
    setIsLoading(true);
    try {
      // Default query for brain health research if no user query
      const query = "brain health cognitive training stroke prevention";
      const params = new URLSearchParams({
        query,
        limit: "5",
        fields: "title,abstract,venue,year,authors,tldr,openAccessPdf",
        fieldsOfStudy: "Neuroscience,Medicine,Psychology"
      });

      const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Semantic Scholar API error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setAdditionalPapers(data.data);
      }
    } catch (error) {
      console.error("Error loading more papers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortToggle = () => {
    setSortOrder(prevOrder => prevOrder === "newest" ? "oldest" : "newest");
  };

  const sortedPapers = [...additionalPapers].sort((a, b) => {
    const yearA = a.year || 0;
    const yearB = b.year || 0;
    return sortOrder === "newest" ? yearB - yearA : yearA - yearB;
  });

  return (
    <div className="container py-8 px-4 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Research & Studies
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl">
            Explore the latest peer-reviewed research on brain health, stroke prevention, and cognitive enhancement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for research papers..."
              className="pl-9 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchPapers()}
            />
          </div>
          <Button onClick={searchPapers} disabled={isLoading} className="text-base">
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="flex items-center gap-1 text-sm">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            
            <Badge variant="outline" className="hover:bg-secondary transition-colors cursor-pointer text-sm">Brain Health</Badge>
            <Badge variant="outline" className="hover:bg-secondary transition-colors cursor-pointer text-sm">Stroke</Badge>
            <Badge variant="outline" className="hover:bg-secondary transition-colors cursor-pointer text-sm">Cognition</Badge>
            <Badge variant="outline" className="hover:bg-secondary transition-colors cursor-pointer text-sm">Aging</Badge>
            <Badge variant="outline" className="hover:bg-secondary transition-colors cursor-pointer text-sm">Prevention</Badge>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-sm"
            onClick={handleSortToggle}
          >
            <Calendar className="h-4 w-4" />
            <span>Sort by {sortOrder === "newest" ? "Newest" : "Oldest"}</span>
          </Button>
        </div>

        <Tabs defaultValue="latest" className="w-full">
          <TabsList className="w-full overflow-x-auto pb-2 scrollbar-hide">
            <TabsTrigger value="latest" className="flex items-center gap-1 text-sm flex-shrink-0">
              <ScrollText className="h-4 w-4" />
              <span>Latest Studies</span>
            </TabsTrigger>
            <TabsTrigger value="brain" className="flex items-center gap-1 text-sm flex-shrink-0">
              <Brain className="h-4 w-4" />
              <span>Brain Health</span>
            </TabsTrigger>
            <TabsTrigger value="stroke" className="flex items-center gap-1 text-sm flex-shrink-0">
              <Heart className="h-4 w-4" />
              <span>Stroke Research</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-1 text-sm flex-shrink-0">
              <BookOpen className="h-4 w-4" />
              <span>Resources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="latest" className="space-y-6 mt-6">
            {searchQuery && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Search Results for &quot;{searchQuery}&quot;</h3>
                {showNoResults && (
                  <div className="text-center py-10 bg-muted/30 rounded-lg">
                    <p>No research papers found matching your search. Try different keywords.</p>
                  </div>
                )}
              </div>
            )}

            {!searchQuery && additionalPapers.length === 0 ? (
              <div className="text-center py-10 bg-muted/30 rounded-lg">
                <p className="text-lg font-medium mb-2">Loading Research Papers</p>
                <p className="text-muted-foreground">Please wait while we fetch the latest research or use the search function above.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={loadMorePapers}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load Research Papers"}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {searchQuery ? (
                  sortedPapers.length > 0 ? (
                    sortedPapers.map((paper) => (
                      <Card key={paper.paperId}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-xl">{paper.title}</CardTitle>
                              <CardDescription>
                                {paper.venue ? `Published in ${paper.venue}` : ""}
                                {paper.year ? `, ${paper.year}` : ""}
                              </CardDescription>
                            </div>
                            <Badge>Research</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            {paper.abstract ? paper.abstract.substring(0, 300) + (paper.abstract.length > 300 ? "..." : "") : 
                             paper.tldr?.text ? paper.tldr.text : "No abstract available."}
                          </p>
                          <div className="mt-4 space-y-2">
                            {paper.authors && paper.authors.length > 0 && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">Authors:</span>
                                <span className="text-muted-foreground">
                                  {paper.authors.map(a => a.name).join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {paper.openAccessPdf && (
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                <span>PDF</span>
                              </Button>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <ArrowUpRight className="h-4 w-4" />
                            <span>Read More</span>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : null
                ) : (
                  sortedPapers.map((paper) => (
                    <Card key={paper.paperId}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{paper.title}</CardTitle>
                            <CardDescription>
                              {paper.venue ? `Published in ${paper.venue}` : ""}
                              {paper.year ? `, ${paper.year}` : ""}
                            </CardDescription>
                          </div>
                          <Badge>Research</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          {paper.abstract ? paper.abstract.substring(0, 300) + (paper.abstract.length > 300 ? "..." : "") : 
                           paper.tldr?.text ? paper.tldr.text : "No abstract available."}
                        </p>
                        <div className="mt-4 space-y-2">
                          {paper.authors && paper.authors.length > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">Authors:</span>
                              <span className="text-muted-foreground">
                                {paper.authors.map(a => a.name).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {paper.openAccessPdf && (
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              <span>PDF</span>
                            </Button>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <ArrowUpRight className="h-4 w-4" />
                          <span>Read More</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            )}

            {!searchQuery && sortedPapers.length > 0 && (
              <div className="text-center pt-6">
                <Button
                  onClick={loadMorePapers}
                  disabled={isLoading}
                  variant="outline"
                  className="px-6"
                >
                  {isLoading ? "Loading..." : "Load More Research"}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="brain" className="space-y-6 mt-6">
            <div className="text-center py-10 bg-muted/30 rounded-lg">
              <p className="text-lg font-medium mb-2">Loading Brain Health Research</p>
              <p className="text-muted-foreground">Please wait while we fetch the latest brain health research.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchQuery("brain health cognitive function")}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load Brain Health Research"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="stroke" className="space-y-6 mt-6">
            <div className="text-center py-10 bg-muted/30 rounded-lg">
              <p className="text-lg font-medium mb-2">Loading Stroke Research</p>
              <p className="text-muted-foreground">Please wait while we fetch the latest stroke research.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchQuery("stroke prevention treatment")}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load Stroke Research"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Patient Guides
                  </CardTitle>
                  <CardDescription>Downloadable PDF guides from trusted sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Download className="h-4 w-4" />
                      Stroke Prevention Guide
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Download className="h-4 w-4" />
                      Brain Health Handbook
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Download className="h-4 w-4" />
                      Cognitive Enhancement Guide
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Resources
                  </CardTitle>
                  <CardDescription>Expert-led video content on brain health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Video className="h-4 w-4" />
                      Understanding Stroke Risk
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Video className="h-4 w-4" />
                      Brain Health Tips
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Video className="h-4 w-4" />
                      Cognitive Training Methods
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 