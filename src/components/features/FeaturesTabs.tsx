
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureSection } from "./types";
import { TabsOverview } from "./TabsOverview";
import { TabsDetail } from "./TabsDetail";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu } from "lucide-react";

interface FeaturesTabsProps {
  featureSections: FeatureSection[];
}

export const FeaturesTabs = ({ featureSections }: FeaturesTabsProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSheetOpen(false);
  };

  // Get the active section title
  const getActiveSectionTitle = () => {
    if (activeTab === "overview") return "Vue d'ensemble";
    const section = featureSections.find(s => s.id === activeTab);
    return section ? section.title : "Vue d'ensemble";
  };

  return (
    <Tabs 
      defaultValue="overview" 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="mb-12"
    >
      <div className="flex justify-center mb-6">
        {isMobile ? (
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between"
              >
                {getActiveSectionTitle()}
                <ChevronDown className="ml-2 h-4 w-4 text-[#CC4153]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-80">
              <div className="pt-6 space-y-2">
                <Button 
                  variant={activeTab === "overview" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => handleTabChange("overview")}
                >
                  Vue d'ensemble
                </Button>
                {featureSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeTab === section.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTabChange(section.id)}
                  >
                    {section.title}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <TabsList className="grid grid-cols-1 md:grid-cols-5 max-w-4xl">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="library">Bibliothèque</TabsTrigger>
            <TabsTrigger value="search">Recherche</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
            <TabsTrigger value="tools">Outils</TabsTrigger>
          </TabsList>
        )}
      </div>

      {/* Tab content */}
      <TabsContent value="overview">
        <TabsOverview featureSections={featureSections} />
      </TabsContent>

      {/* Content for each section */}
      {featureSections.map((section) => (
        <TabsContent key={section.id} value={section.id}>
          <TabsDetail section={section} />
        </TabsContent>
      ))}
    </Tabs>
  );
};
