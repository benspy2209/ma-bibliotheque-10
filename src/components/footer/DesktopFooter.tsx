
import FooterLogo from "./FooterLogo";
import FooterNavLinks from "./FooterNavLinks";
import FooterInfoLinks from "./FooterInfoLinks";
import FooterCopyright from "./FooterCopyright";
import FooterSocialLinks from "./FooterSocialLinks";
import FooterPartner from "./FooterPartner";

const DesktopFooter = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start justify-between mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <FooterLogo isMobile={false} />
          <div className="text-left">
            <h3 className="text-lg font-medium">BiblioPulse</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Votre compagnon de lecture personnel pour organiser, suivre et découvrir vos livres.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
          <FooterNavLinks />
          <FooterInfoLinks />
          <FooterPartner />
        </div>
      </div>
      
      {/* Séparateur */}
      <div className="border-t border-muted/40 my-4"></div>
      
      {/* Copyright et liens sociaux */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground pt-2">
        <FooterCopyright className="mb-3 sm:mb-0" />
        <FooterSocialLinks />
      </div>
    </>
  );
};

export default DesktopFooter;
