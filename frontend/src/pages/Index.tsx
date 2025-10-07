import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  BookOpen, 
  MessageSquare, 
  Shield, 
  Zap, 
  Database, 
  Brain,
  ArrowRight,
  CheckCircle2,
  Users,
  Github,
  Code2,
  Sparkles,
  FileText,
  Lock,
  Rocket,
  Menu,
  Linkedin
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth0();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/chat");
    } else {
      navigate("/auth");
    }
  };

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    // Small delay to allow sheet to close before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const techStack = [
    { category: "Frontend", items: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui"] },
    { category: "Backend", items: ["Express.js", "TypeScript", "Node.js", "PostgreSQL"] },
    { category: "AI/ML", items: ["Google Gemini", "text-embedding-004", "gemini-1.5-flash"] },
    { category: "Tools", items: ["Auth0", "TanStack Query", "pdf-parse"] }
  ];

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "AI-Powered Responses",
      description: "Leverage Google Gemini AI for intelligent, context-aware answers to onboarding questions."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Document Processing",
      description: "Upload PDFs that are automatically chunked, embedded, and indexed for semantic search."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Interactive Chat",
      description: "Natural conversation interface with citation support linking back to source documents."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure Authentication",
      description: "Built-in Auth0 integration with role-based access control for admins and users."
    },
    {
      icon: <Database className="h-8 w-8 text-primary" />,
      title: "Vector Embeddings",
      description: "PostgreSQL-backed vector storage for fast, accurate semantic retrieval."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Rate Limiting",
      description: "Intelligent request queueing and retry mechanisms to handle API rate limits."
    }
  ];

  const requirements = [
    "Node.js 18.x or higher",
    "PostgreSQL 14.x or higher with SSL",
    "Google Gemini API Key",
    "Bun package manager (frontend)",
    "Auth0 account for authentication"
  ];

  const keyHighlights = [
    {
      icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
      title: "Zero Setup Complexity",
      description: "Simple configuration with environment variables"
    },
    {
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      title: "PDF-First",
      description: "Upload any PDF document and start chatting"
    },
    {
      icon: <Lock className="h-6 w-6 text-green-500" />,
      title: "Enterprise Ready",
      description: "Auth0 integration with role-based access"
    },
    {
      icon: <Rocket className="h-6 w-6 text-purple-500" />,
      title: "Production Ready",
      description: "Built-in rate limiting and error handling"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 font-bold text-xl">
              <Brain className="h-6 w-6 text-primary" />
              <span className="hidden sm:inline-block">Intern Compass</span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#features" className="transition-colors hover:text-primary">
                Features
              </a>
              <a href="#tech-stack" className="transition-colors hover:text-primary">
                Tech Stack
              </a>
              <a href="#how-it-works" className="transition-colors hover:text-primary">
                How It Works
              </a>
              <a href="#requirements" className="transition-colors hover:text-primary">
                Requirements
              </a>
              <a href="#about" className="transition-colors hover:text-primary">
                About
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://github.com/DanielChahine0/Intern-Compass', '_blank')}
                className="hidden sm:flex"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button size="sm" onClick={handleGetStarted}>
                {isAuthenticated ? "Chat" : "Sign In"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Intern Compass
                    </SheetTitle>
                    <SheetDescription>
                      Navigate to different sections
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-8">
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavClick('features')}
                    >
                      Features
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavClick('tech-stack')}
                    >
                      Tech Stack
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavClick('how-it-works')}
                    >
                      How It Works
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavClick('requirements')}
                    >
                      Requirements
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavClick('about')}
                    >
                      About
                    </Button>
                    <Separator className="my-2" />
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        window.open('https://github.com/DanielChahine0/Intern-Compass', '_blank');
                      }}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium animate-pulse">
            <Brain className="h-4 w-4 mr-2 inline-block" />
            RAG-Powered Onboarding Platform
          </Badge>
          
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/60 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Intern Compass
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
            Your AI-powered assistant for <span className="text-primary font-semibold">seamless employee onboarding</span>. 
            Upload documents, ask questions, and get instant, accurate answers with source citations.
          </p>

          {/* Key Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full max-w-4xl">
            {keyHighlights.map((highlight, index) => (
              <div key={index} className="flex flex-col items-center p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105">
                <div className="mb-2">{highlight.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{highlight.title}</h3>
                <p className="text-xs text-muted-foreground text-center">{highlight.description}</p>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
              {isAuthenticated ? "Go to Chat" : "Get Started Now"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.open('https://github.com/DanielChahine0/Intern-Compass', '_blank')} className="text-lg px-8 py-6">
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>TypeScript Fullstack</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Production Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Google Gemini Powered</span>
            </div>
          </div>
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create an intelligent onboarding experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Tech Stack Section */}
      <section id="tech-stack" className="container mx-auto px-4 py-16 bg-muted/30 rounded-lg my-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built With Modern Technology</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A robust, scalable TypeScript fullstack architecture
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((stack, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  {stack.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {stack.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Architecture Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced RAG (Retrieval-Augmented Generation) pipeline
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Document Upload & Processing</h3>
                  <p className="text-muted-foreground">Admins upload PDF documents which are automatically parsed and processed.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Semantic Chunking</h3>
                  <p className="text-muted-foreground">Text is intelligently split into 512-token chunks with 50-token overlap for context preservation.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Vector Embedding</h3>
                  <p className="text-muted-foreground">Each chunk is embedded using Gemini's text-embedding-004 model and stored in PostgreSQL.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Semantic Search</h3>
                  <p className="text-muted-foreground">User queries are embedded and matched using cosine similarity to retrieve top-K relevant chunks.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">5</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">AI Response Generation</h3>
                  <p className="text-muted-foreground">Retrieved context is passed to Gemini AI, which generates accurate answers with source citations.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Requirements Section */}
      <section id="requirements" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">System Requirements</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What you need to get started
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
            <CardDescription>Make sure you have these installed before running the application</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <Separator className="container mx-auto" />

      {/* About Us Section */}
      <section id="about" className="container mx-auto px-4 py-16 bg-muted/30 rounded-lg my-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Intern Compass</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Revolutionizing employee onboarding with AI
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <Users className="h-20 w-20 text-primary" />
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                      AI
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 text-center">
                  <h3 className="text-2xl font-bold text-primary">Our Mission</h3>
                  <p className="text-lg leading-relaxed">
                    Intern Compass was developed to solve the challenges of employee onboarding by creating an intelligent, 
                    AI-powered knowledge base. New employees can instantly access information from company documents, policies, 
                    and technical documentation through a simple chat interface.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6 pt-6">
                    <div className="p-4 rounded-lg bg-background border border-border">
                      <h4 className="font-semibold text-lg mb-2 text-primary">🎯 Purpose</h4>
                      <p className="text-sm text-muted-foreground">
                        Streamline onboarding and reduce time-to-productivity for new hires
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-background border border-border">
                      <h4 className="font-semibold text-lg mb-2 text-primary">🔍 Innovation</h4>
                      <p className="text-sm text-muted-foreground">
                        Leverage RAG technology for accurate, traceable, and contextual answers
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-background border border-border">
                      <h4 className="font-semibold text-lg mb-2 text-primary">🌐 Open Source</h4>
                      <p className="text-sm text-muted-foreground">
                        Built with modern web technologies and available for anyone to use
                      </p>
                    </div>
                  </div>

                  <p className="text-lg leading-relaxed pt-4">
                    By leveraging cutting-edge <span className="font-semibold text-primary">RAG (Retrieval-Augmented Generation)</span> technology, 
                    we ensure that every answer is not only accurate but also traceable back to its source, building trust and transparency 
                    in the onboarding process.
                  </p>
                </div>

                <Separator />

                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold">Project Contributors</h3>
                  <p className="text-muted-foreground">
                    This project is maintained by passionate developers committed to improving employee onboarding experiences.
                  </p>
                  <div className="flex justify-center gap-4 pt-4">
                    <Button variant="outline" size="lg" onClick={() => window.open('https://github.com/DanielChahine0/Intern-Compass', '_blank')}>
                      <Github className="mr-2 h-5 w-5" />
                      Contribute on GitHub
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => window.open('https://github.com/DanielChahine0/Intern-Compass/issues', '_blank')}>
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Report Issues
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Rocket className="h-4 w-4 mr-2 inline-block" />
              Ready to Transform Your Onboarding?
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">Start Your Journey Today</h2>
            <p className="text-xl text-muted-foreground">
              {isAuthenticated 
                ? "Your AI assistant is ready to help you navigate your onboarding"
                : "Join us and experience the future of employee onboarding"
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-shadow">
              {isAuthenticated ? "Open Chat Interface" : "Sign In to Get Started"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {!isAuthenticated && (
              <Button size="lg" variant="outline" onClick={() => window.open('https://github.com/DanielChahine0/Intern-Compass#readme', '_blank')} className="text-lg px-12 py-6">
                <BookOpen className="mr-2 h-5 w-5" />
                Read Documentation
              </Button>
            )}
          </div>

          <div className="pt-8 flex justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16 bg-muted/20">
        <div className="container mx-auto px-4 py-12">
          {/* Collaborators Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Meet the Team</h3>
              <p className="text-muted-foreground">Built by passionate developers</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {/* Daniel Chahine */}
              <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Daniel Chahine</h4>
                  <p className="text-xs text-muted-foreground mb-4">Developer</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open('https://www.linkedin.com/in/danielchahine/', '_blank')}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </CardContent>
              </Card>

              {/* Anthony Lam */}
              <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Anthony Lam</h4>
                  <p className="text-xs text-muted-foreground mb-4">Developer</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open('https://www.linkedin.com/in/anthony---lam/', '_blank')}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </CardContent>
              </Card>

              {/* Sarah Chiang */}
              <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Sarah Chiang</h4>
                  <p className="text-xs text-muted-foreground mb-4">Developer</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open('https://www.linkedin.com/in/sarahchiang0529/', '_blank')}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </CardContent>
              </Card>

              {/* James Choi */}
              <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg mb-1">James Choi</h4>
                  <p className="text-xs text-muted-foreground mb-4">Developer</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open('https://www.linkedin.com/in/jameschoi01/', '_blank')}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Intern Compass
              </h3>
              <p className="text-sm text-muted-foreground">
                AI-powered onboarding platform built with modern RAG technology.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#tech-stack" className="hover:text-primary transition-colors">Tech Stack</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="#requirements" className="hover:text-primary transition-colors">Requirements</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://github.com/DanielChahine0/Intern-Compass#readme" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://github.com/DanielChahine0/Intern-Compass" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="https://github.com/DanielChahine0/Intern-Compass/issues" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    Report Issues
                  </a>
                </li>
                <li>
                  <a href="https://github.com/DanielChahine0/Intern-Compass/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    License
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://github.com/DanielChahine0" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub Profile
                  </a>
                </li>
                <li>
                  <a href="https://github.com/DanielChahine0/Intern-Compass/discussions" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Discussions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Intern Compass. Open-source project under MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
