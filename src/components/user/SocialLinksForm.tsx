
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Facebook, Instagram, Globe, Twitter } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  [key: string]: string | undefined;
}

export function SocialLinksForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: "",
    twitter: "",
    instagram: "",
    website: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSocialLinks();
    }
  }, [user]);

  const fetchSocialLinks = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('social_links, website')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching social links:', error);
        return;
      }

      if (data) {
        const links: SocialLinks = {
          facebook: "",
          twitter: "",
          instagram: "",
          website: data.website || ""
        };

        if (data.social_links) {
          const socialData = data.social_links as any;
          links.facebook = socialData.facebook || "";
          links.twitter = socialData.twitter || "";
          links.instagram = socialData.instagram || "";
        }

        setSocialLinks(links);
      }
    } catch (error) {
      console.error('Error in fetchSocialLinks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { website, ...socialData } = socialLinks;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          social_links: socialData,
          website: website
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating social links:', error);
        setErrorMessage("Une erreur est survenue lors de la mise à jour des réseaux sociaux.");
        return;
      }

      toast({
        description: "Réseaux sociaux mis à jour avec succès!"
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setErrorMessage("Une erreur est survenue lors de la mise à jour des réseaux sociaux.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Réseaux sociaux</CardTitle>
        <CardDescription>
          Ajoutez vos liens vers les réseaux sociaux pour permettre aux autres utilisateurs de vous retrouver.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebook" className="flex items-center">
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Label>
            <Input
              id="facebook"
              value={socialLinks.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
              placeholder="URL de votre profil Facebook"
              disabled={isLoading || isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter" className="flex items-center">
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Label>
            <Input
              id="twitter"
              value={socialLinks.twitter}
              onChange={(e) => handleChange('twitter', e.target.value)}
              placeholder="URL de votre profil Twitter"
              disabled={isLoading || isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center">
              <Instagram className="h-4 w-4 mr-2" />
              Instagram
            </Label>
            <Input
              id="instagram"
              value={socialLinks.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="URL de votre profil Instagram"
              disabled={isLoading || isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Site Web
            </Label>
            <Input
              id="website"
              value={socialLinks.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="URL de votre site web personnel"
              disabled={isLoading || isSubmitting}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Mettre à jour les réseaux sociaux"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
