import { useState, useEffect } from "react";
import { Upload, FileText, Tag, Settings, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { adminDocumentApi, AdminDocument, AdminApiResponse } from "@/lib/api";

// Use AdminDocument from lib/api.ts instead of local interface

const Admin = () => {
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const availableTags = [
    { id: 1, name: "tech-stack" },
    { id: 2, name: "onboarding" },
    { id: 3, name: "architecture" },
    { id: 4, name: "policy" },
    { id: 5, name: "process" }
  ];

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminDocumentApi.getDocuments();
        
        if (data.success) {
          setDocuments(Array.isArray(data.data) ? data.data : [data.data]);
        } else {
          setError(data.error || 'Failed to fetch documents');
          toast.error(data.error || 'Failed to fetch documents');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        toast.error('Failed to fetch documents');
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleTagSelect = (tagName: string) => {
    setSelectedTag(selectedTag === tagName ? "" : tagName);
  };

  const refreshDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminDocumentApi.getDocuments();
      
      if (data.success) {
        setDocuments(Array.isArray(data.data) ? data.data : [data.data]);
      } else {
        setError(data.error || 'Failed to fetch documents');
        toast.error(data.error || 'Failed to fetch documents');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to refresh documents');
      console.error('Error refreshing documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Map selected tag name to its ID
      const selectedTagId = selectedTag ? availableTags.find(t => t.name === selectedTag)?.id : undefined;

      const data = await adminDocumentApi.uploadDocument({
        documenttitle: title.trim(),
        documentcontent: content.trim(),
        tagid: selectedTagId || null
      });
      
      if (data.success) {
        toast.success("Document uploaded successfully!");
        console.log("Uploaded document:", data.data);
        // Clear form
        setTitle("");
        setContent("");
        setSelectedTag("");
        setSelectedFile(null);
        // Refresh documents list
        await refreshDocuments();
      } else {
        toast.error(data.error || "Failed to upload document");
      }
    } catch (err) {
      toast.error("Failed to upload document");
      console.error('Error uploading document:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const data = await adminDocumentApi.deleteDocument(id);
      
      if (data.success) {
        toast.success("Document deleted successfully!");
        // Refresh documents list
        await refreshDocuments();
      } else {
        toast.error(data.error || "Failed to delete document");
      }
    } catch (err) {
      toast.error("Failed to delete document");
      console.error('Error deleting document:', err);
    }
  };

  return (
    <Layout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage documents and onboarding content</p>
          </div>

          {/* Upload Section */}
          <Card className="p-6 shadow-large">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Upload Documents</h2>
                  <p className="text-sm text-muted-foreground">Add new onboarding materials</p>
                </div>
              </div>

              {/* Document Input */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Title</label>
                  <Input
                    placeholder="e.g., Tech Stack Overview"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Enter a brief description of the document..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>

              {/* Upload PDF */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload PDF
                </label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTag === tag.name ? "default" : "outline"}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleTagSelect(tag.name)}
                    >
                      {tag.id}. {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full shadow-medium" 
                onClick={handleUpload}
                disabled={!title.trim() || !content.trim()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </Card>

          {/* Documents List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shadow-medium">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Uploaded Documents</h2>
                <p className="text-sm text-muted-foreground">{documents.length} documents indexed</p>
              </div>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading documents...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={refreshDocuments} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No documents found</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <Card
                    key={doc.documentid}
                    className="p-5 shadow-soft hover:shadow-medium transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                          <h3 className="font-medium truncate">{doc.documenttitle}</h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {doc.tagtype && (
                            <Badge variant="secondary" className="text-xs">
                              {doc.tagtype}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Uploaded {new Date(doc.uploadedat).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Processed
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(doc.documentid)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
