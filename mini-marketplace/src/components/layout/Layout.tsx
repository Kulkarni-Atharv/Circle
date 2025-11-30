/**
 * Layout component
 * 
 * Main layout wrapper with header and content area.
 */

import { Header } from './Header'
import { Github, Linkedin } from 'lucide-react'

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <footer className="border-t py-6 mt-auto bg-muted/30">
                <div className="container flex flex-col items-center justify-center gap-4 text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                        Created by <span className="text-foreground">Atharv Kulkarni</span>
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/Kulkarni-Atharv"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/kulkarni-atharv/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">LinkedIn</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
