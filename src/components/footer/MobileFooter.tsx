
import FooterLogo from "./FooterLogo";
import FooterNavLinks from "./FooterNavLinks";
import FooterInfoLinks from "./FooterInfoLinks";
import FooterCopyright from "./FooterCopyright";
import FooterSocialLinks from "./FooterSocialLinks";

const MobileFooter = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Logo en premier */}
      <div className="mb-6 text-center">
        <FooterLogo isMobile={true} />
        <div className="text-center">
          <h3 className="text-lg font-medium">BiblioPulse</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Votre compagnon de lecture personnel pour organiser, suivre et découvrir vos livres.
          </p>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="grid grid-cols-2 gap-8 w-full mb-8">
        <FooterNavLinks />
        <FooterInfoLinks />
      </div>
      
      {/* Séparateur */}
      <div className="border-t border-muted/40 my-4 w-full"></div>
      
      {/* Copyright et liens sociaux */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground pt-2 w-full">
        <FooterCopyright className="mb-3 sm:mb-0" />
        <FooterSocialLinks />
      </div>
    </div>
  );
};

export default MobileFooter;
