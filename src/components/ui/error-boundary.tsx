import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="text-center space-y-4 max-w-md">
                        <div className="flex justify-center">
                            <div className="bg-destructive/10 p-4 rounded-full">
                                <AlertTriangle className="h-12 w-12 text-destructive" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
                        <p className="text-muted-foreground">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>
                        {this.state.error && (
                            <div className="bg-muted p-2 rounded text-xs text-left overflow-auto max-h-32 mb-4 font-mono">
                                {this.state.error.message}
                            </div>
                        )}
                        <div className="flex justify-center gap-2">
                            <Button onClick={() => window.location.reload()}>
                                Refresh Page
                            </Button>
                            <Button variant="outline" onClick={() => this.setState({ hasError: false, error: null })}>
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
