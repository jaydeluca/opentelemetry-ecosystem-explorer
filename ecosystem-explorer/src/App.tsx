import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HomePage } from "@/features/home/home-page";
import { JavaAgentPage } from "@/features/java-agent/java-agent-page";
import { CollectorPage } from "@/features/collector/collector-page";
import { NotFoundPage } from "@/features/not-found/not-found-page";
import { InstrumentationListPage } from "@/features/java-agent/instrumentation-list-page";
import { initDataLoader } from "@/lib/api/javaagent-data";

export default function App() {
  useEffect(() => {
    initDataLoader();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/java-agent" element={<JavaAgentPage />} />
            <Route path="/java-agent/instrumentation" element={<InstrumentationListPage />} />
            <Route path="/collector" element={<CollectorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
