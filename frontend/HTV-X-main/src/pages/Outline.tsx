import { FileText, Download, BookOpen, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { useState } from "react";

interface DocumentSummary {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  createdAt: string;
}

// Hardcoded data for visual demonstration
const hardcodedDocuments: DocumentSummary[] = [
  {
    id: "1",
    title: "Employee Handbook 2024",
    summary: "This comprehensive employee handbook covers company policies, workplace conduct, benefits overview, and employee rights. Key sections include remote work guidelines, vacation policies, health insurance options, and professional development opportunities. The handbook emphasizes our commitment to diversity, inclusion, and a positive workplace culture.",
    tags: ["HR", "Policies", "Benefits"],
    createdAt: "March 15, 2024"
  },
  {
    id: "2",
    title: "IT Security Guidelines",
    summary: "Essential security protocols for all employees including password management, data protection, and secure communication practices. Covers VPN usage, multi-factor authentication setup, phishing awareness, and incident reporting procedures. All employees must complete the security training within the first week.",
    tags: ["IT", "Security", "Training"],
    createdAt: "March 14, 2024"
  },
  {
    id: "3",
    title: "Company Values & Mission",
    summary: "An introduction to our company's core values, mission statement, and long-term vision. Learn about our commitment to innovation, customer success, and sustainable business practices. This document outlines how each team member contributes to our shared goals and company culture.",
    tags: ["Culture", "Mission", "Values"],
    createdAt: "March 13, 2024"
  }
];

const Outline = () => {
  const documents = hardcodedDocuments;
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const createPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Title Page
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Onboarding Summary", pageWidth / 2, 60, { align: "center" });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Complete Guide to Company Resources", pageWidth / 2, 80, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 100, { align: "center" });

    // Table of Contents
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Table of Contents", margin, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    documents.forEach((document, index) => {
      const pageNum = index + 3; // Starting from page 3 (after cover and TOC)
      doc.text(`${index + 1}. ${document.title}`, margin + 5, yPosition);
      doc.text(`${pageNum}`, pageWidth - margin - 10, yPosition);
      yPosition += 8;
    });

    // Document Summaries
    documents.forEach((document, index) => {
      doc.addPage();
      yPosition = margin;

      // Chapter number
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`Chapter ${index + 1}`, margin, yPosition);
      yPosition += 12;

      // Document title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text(document.title, margin, yPosition);
      yPosition += 10;

      // Tags
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`Tags: ${document.tags.join(", ")}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Added: ${document.createdAt}`, margin, yPosition);
      yPosition += 12;

      // Summary
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0);
      const summaryLines = doc.splitTextToSize(document.summary, maxWidth);
      summaryLines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += 7;
      });
    });

    // Footer on all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }

    return doc;
  };

  const handlePreview = () => {
    const doc = createPDF();
    const pdfDataUrl = doc.output('dataurlstring');
    setPdfPreviewUrl(pdfDataUrl);
    toast.success("Preview loaded!");
  };

  const handleDownload = () => {
    const doc = createPDF();
    doc.save("Onboarding-Summary.pdf");
    toast.success("PDF downloaded successfully!");
  };

  return (
    <Layout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Onboarding Summary</h1>
            <p className="text-muted-foreground">Generate a comprehensive PDF guide of all onboarding materials</p>
          </div>

          {/* Generate PDF Section */}
          <Card className="p-6 shadow-large text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Complete Onboarding Guide</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Download a professionally formatted PDF containing summaries of all {documents.length} onboarding documents, 
                organized like a handbook for easy reference.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center pt-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{doc.title}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center mt-6">
              <Button 
                onClick={handlePreview} 
                size="lg"
                variant="outline"
                className="gap-2 shadow-medium"
              >
                <Eye className="h-5 w-5" />
                Preview PDF
              </Button>
              <Button 
                onClick={handleDownload} 
                size="lg"
                className="gap-2 shadow-medium"
              >
                <Download className="h-5 w-5" />
                Download PDF
              </Button>
            </div>
          </Card>

          {/* PDF Preview Section */}
          {pdfPreviewUrl && (
            <Card className="p-6 shadow-large">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">PDF Preview</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setPdfPreviewUrl(null)}
                  >
                    Close Preview
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <iframe 
                    src={pdfPreviewUrl} 
                    className="w-full h-[600px]"
                    title="PDF Preview"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Preview Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">What's Included</h3>
            <div className="grid gap-4">
              {documents.map((doc, index) => (
                <Card key={doc.id} className="p-5 shadow-soft hover:shadow-medium transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-lg">{doc.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{doc.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        {doc.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Outline;
