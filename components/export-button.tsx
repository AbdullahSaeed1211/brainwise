"use client";

import { useState } from "react";
import { FileDown, FileText, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ExportData {
  [key: string]: string | number | boolean | null | undefined;
}

interface ExportButtonProps {
  data: ExportData[];
  filename: string;
  label?: string;
  onExport?: (format: "csv" | "pdf") => void;
}

export function ExportButton({
  data,
  filename,
  label = "Export",
  onExport,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format: "csv" | "pdf") => {
    if (onExport) {
      onExport(format);
    }
    
    setIsExporting(true);
    
    try {
      if (format === "csv") {
        exportAsCSV();
      } else {
        exportAsPDF();
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "There was a problem exporting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsCSV = () => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data available to export. Add measurements or complete assessments first.",
        variant: "destructive",
      });
      return;
    }

    // Get headers from the first item
    const headers = Object.keys(data[0]);
    
    // Convert data to CSV format
    const csvContent = [
      headers.join(","), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle strings with commas by wrapping in quotes
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value !== null && value !== undefined ? String(value) : "";
        }).join(",")
      )
    ].join("\n");
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "CSV Export Complete",
      description: "Your data has been exported as a CSV file.",
      variant: "default",
    });
  };

  const exportAsPDF = () => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data available to export. Add measurements or complete assessments first.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a stylized HTML table from the data
    const headers = Object.keys(data[0]);
    const htmlContent = `
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #4f46e5; color: white; font-weight: bold; }
            th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>${filename}</h1>
          <table>
            <thead>
              <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${headers.map(header => `<td>${row[header] !== null && row[header] !== undefined ? row[header] : ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} by Brainwise</p>
          </div>
        </body>
      </html>
    `;
    
    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open the HTML in a new window/tab
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      // Add script to trigger print when content is loaded
      printWindow.onload = function() {
        printWindow.document.title = `${filename}.pdf`;
        printWindow.print();
        
        // Close the window after print dialog is closed (works in most browsers)
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      };
    }
    
    toast({
      title: "PDF Export Ready",
      description: "The print dialog will open for saving your data as PDF.",
      variant: "default",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2" disabled={isExporting}>
          {isExporting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Exporting...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4" />
              {label}
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <Download className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 