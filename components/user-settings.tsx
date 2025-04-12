"use client";

import { useState } from "react";
import { 
  Trash2, 
  Bell, 
  Download, 
  Shield, 
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface UserSettingsProps {
  userId: string;
}

export function UserSettings({ userId }: UserSettingsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState({
    export: false,
    delete: false,
    clearMetrics: false,
    clearGames: false,
    clearTools: false,
    clearAll: false
  });
  
  // Settings states
  const [notificationSettings, setNotificationSettings] = useState({
    emailUpdates: true,
    activityReminders: true,
    assessmentResults: true,
    newFeatures: false,
    marketingEmails: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    shareDataForResearch: true,
    storeActivityHistory: true,
    useCookies: true,
    collectAnalytics: true
  });
  
  // New state for data deletion options
  const [dataToDelete, setDataToDelete] = useState({
    selectedOption: "" as "metrics" | "games" | "tools" | "all" | "",
    showConfirmation: false
  });
  
  // Handlers
  const handleExportData = async () => {
    try {
      setIsLoading(prev => ({ ...prev, export: true }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        variant: "default",
        title: "Data exported",
        description: `Your requested data for account ${userId} has been exported.`,
      });
    } catch (error: Error | unknown) {
      console.error("Export error:", error instanceof Error ? error.message : 'Unknown error');
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Could not export your data. Please try again.",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, export: false }));
    }
  };
  
  const updateNotificationSetting = (setting: keyof typeof notificationSettings, checked: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: checked }));
    toast({
      variant: "default",
      title: "Preferences updated",
      description: `Your notification preferences for account ${userId} have been updated.`,
    });
  };
  
  const updatePrivacySetting = (setting: keyof typeof privacySettings, checked: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: checked }));
    toast({
      variant: "default",
      title: "Privacy settings updated",
      description: `Your privacy settings for account ${userId} have been updated.`,
    });
  };
  
  const handleClearData = async (dataType: "metrics" | "games" | "tools" | "all") => {
    try {
      const loadingKey = dataType === "metrics" 
        ? "clearMetrics" 
        : dataType === "games" 
          ? "clearGames" 
          : dataType === "tools" 
            ? "clearTools" 
            : "clearAll";
      
      setIsLoading(prev => ({ ...prev, [loadingKey]: true }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let successMessage = "";
      switch(dataType) {
        case "metrics":
          successMessage = "Health metrics data has been deleted";
          break;
        case "games":
          successMessage = "Game history and scores have been deleted";
          break;
        case "tools":
          successMessage = "Tools usage history has been deleted";
          break;
        case "all":
          successMessage = "All your activity data has been deleted";
          break;
      }
      
      toast({
        variant: "default",
        title: "Data deleted successfully",
        description: successMessage,
      });
      
      // Close confirmation dialog
      setDataToDelete({
        selectedOption: "",
        showConfirmation: false
      });
      
    } catch (error: Error | unknown) {
      console.error("Delete error:", error instanceof Error ? error.message : 'Unknown error');
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "Could not delete your data. Please try again.",
      });
    } finally {
      const loadingKey = dataType === "metrics" 
        ? "clearMetrics" 
        : dataType === "games" 
          ? "clearGames" 
          : dataType === "tools" 
            ? "clearTools" 
            : "clearAll";
      
      setIsLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };
  
  const openDeleteConfirmation = (dataType: "metrics" | "games" | "tools" | "all") => {
    setDataToDelete({
      selectedOption: dataType,
      showConfirmation: true
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="notifications">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span>Notification Preferences</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-updates">Email Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates about your account
                    </p>
                  </div>
                  <Switch
                    id="email-updates"
                    checked={notificationSettings.emailUpdates}
                    onCheckedChange={(checked: boolean) => 
                      updateNotificationSetting('emailUpdates', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="activity-reminders">Activity Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders to complete brain exercises
                    </p>
                  </div>
                  <Switch
                    id="activity-reminders"
                    checked={notificationSettings.activityReminders}
                    onCheckedChange={(checked: boolean) => 
                      updateNotificationSetting('activityReminders', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="assessment-results">Assessment Results</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications when assessment results are ready
                    </p>
                  </div>
                  <Switch
                    id="assessment-results"
                    checked={notificationSettings.assessmentResults}
                    onCheckedChange={(checked: boolean) => 
                      updateNotificationSetting('assessmentResults', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-features">New Features</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new features and improvements
                    </p>
                  </div>
                  <Switch
                    id="new-features"
                    checked={notificationSettings.newFeatures}
                    onCheckedChange={(checked: boolean) => 
                      updateNotificationSetting('newFeatures', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional emails and offers
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked: boolean) => 
                      updateNotificationSetting('marketingEmails', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="privacy">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Privacy & Data</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-data">Share Data for Research</Label>
                    <p className="text-sm text-muted-foreground">
                      Anonymously contribute your data to improve brain health research
                    </p>
                  </div>
                  <Switch
                    id="share-data"
                    checked={privacySettings.shareDataForResearch}
                    onCheckedChange={(checked: boolean) => 
                      updatePrivacySetting('shareDataForResearch', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="store-history">Store Activity History</Label>
                    <p className="text-sm text-muted-foreground">
                      Keep a record of your activities and progress
                    </p>
                  </div>
                  <Switch
                    id="store-history"
                    checked={privacySettings.storeActivityHistory}
                    onCheckedChange={(checked: boolean) => 
                      updatePrivacySetting('storeActivityHistory', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="use-cookies">Use Cookies</Label>
                    <p className="text-sm text-muted-foreground">
                      Store cookies to improve your experience
                    </p>
                  </div>
                  <Switch
                    id="use-cookies"
                    checked={privacySettings.useCookies}
                    onCheckedChange={(checked: boolean) => 
                      updatePrivacySetting('useCookies', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="collect-analytics">Usage Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow collection of anonymized usage data
                    </p>
                  </div>
                  <Switch
                    id="collect-analytics"
                    checked={privacySettings.collectAnalytics}
                    onCheckedChange={(checked: boolean) => 
                      updatePrivacySetting('collectAnalytics', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="data-management">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <span>Data Management</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Delete My Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You can delete specific parts of your data or all of your activity history.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Health Metrics</h4>
                        <p className="text-sm text-muted-foreground">
                          Delete all your health metrics history
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDeleteConfirmation("metrics")}
                        disabled={isLoading.clearMetrics}
                      >
                        {isLoading.clearMetrics ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                            Deleting...
                          </>
                        ) : (
                          "Delete Data"
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Game History</h4>
                        <p className="text-sm text-muted-foreground">
                          Delete all game scores and history
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDeleteConfirmation("games")}
                        disabled={isLoading.clearGames}
                      >
                        {isLoading.clearGames ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                            Deleting...
                          </>
                        ) : (
                          "Delete Data"
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Tools Usage History</h4>
                        <p className="text-sm text-muted-foreground">
                          Delete all tools usage and results data
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDeleteConfirmation("tools")}
                        disabled={isLoading.clearTools}
                      >
                        {isLoading.clearTools ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                            Deleting...
                          </>
                        ) : (
                          "Delete Data"
                        )}
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">All Activity Data</h4>
                          <p className="text-sm text-muted-foreground">
                            Delete all your activity history and data
                          </p>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => openDeleteConfirmation("all")}
                          disabled={isLoading.clearAll}
                        >
                          {isLoading.clearAll ? (
                            <>
                              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                              Deleting...
                            </>
                          ) : (
                            "Delete All Data"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <h3 className="text-lg font-medium mb-2">Export Your Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download a copy of all your data in JSON format.
                  </p>
                  
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    disabled={isLoading.export}
                    className="w-full"
                  >
                    {isLoading.export ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                        Preparing...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Export My Data
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Data Deletion Confirmation Dialog */}
      <Dialog 
        open={dataToDelete.showConfirmation} 
        onOpenChange={(open) => 
          setDataToDelete(prev => ({ ...prev, showConfirmation: open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Data Deletion</DialogTitle>
            <DialogDescription>
              {dataToDelete.selectedOption === "metrics" && (
                "You are about to delete all your health metrics data. This action cannot be undone."
              )}
              {dataToDelete.selectedOption === "games" && (
                "You are about to delete all your game history and scores. This action cannot be undone."
              )}
              {dataToDelete.selectedOption === "tools" && (
                "You are about to delete all your tools usage history. This action cannot be undone."
              )}
              {dataToDelete.selectedOption === "all" && (
                "You are about to delete ALL your activity data including metrics, game history, and tools usage. This action cannot be undone."
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">Data deletion is permanent and cannot be recovered.</p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => 
                setDataToDelete({ selectedOption: "", showConfirmation: false })
              }
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => dataToDelete.selectedOption && handleClearData(dataToDelete.selectedOption)}
              disabled={!dataToDelete.selectedOption || isLoading[
                dataToDelete.selectedOption === "metrics" 
                  ? "clearMetrics" 
                  : dataToDelete.selectedOption === "games" 
                    ? "clearGames" 
                    : dataToDelete.selectedOption === "tools" 
                      ? "clearTools" 
                      : "clearAll"
              ]}
            >
              {isLoading[
                dataToDelete.selectedOption === "metrics" 
                  ? "clearMetrics" 
                  : dataToDelete.selectedOption === "games" 
                    ? "clearGames" 
                    : dataToDelete.selectedOption === "tools" 
                      ? "clearTools" 
                      : "clearAll"
              ] ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                  Deleting...
                </>
              ) : (
                "Delete Data"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 