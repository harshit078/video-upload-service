
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-6">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
