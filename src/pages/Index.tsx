
import { useEffect } from 'react';
import { useBookSearch } from '@/hooks/use-book-search';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import NavBar from '@/components/NavBar';
import { HeaderSection } from '@/components/search/HeaderSection';
import Footer from '@/components/Footer';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { SearchContainer } from '@/components/search/SearchContainer';
import { SearchResults } from '@/components/search/SearchResults';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { 
    searchParams,
    visibleBooks,
    books,
    isLoading,
    showAllResults,
    displayedBooks,
    remainingSearches,
    searchLimitReached,
    searchError,
    handleSearch,
    handleLoadMore,
    handleShowAllBooks,
    handleRefresh,
    checkSearchLimits,
    searchQuery,
    totalBooks
  } = useBookSearch();

  const { user, showLoginDialog, setShowLoginDialog, signIn } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkSearchLimits();
    }
  }, [user]);

  const handleJoinAdventure = () => {
    navigate('/library');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container px-4 py-6 sm:py-8 sm:px-6 lg:px-8 mx-auto flex-grow">
        <div className="max-w-4xl mx-auto">
          <HeaderSection onBookAdded={handleRefresh} />

          {!user && (
            <div className="mb-6 flex justify-center">
              <Button 
                onClick={handleJoinAdventure}
                className="relative z-10 font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg pulse-effect flex items-center gap-2 bg-[#CC4153] text-white hover:bg-[#b33646]"
                variant="pulse"
              >
                <BookOpen className="h-5 w-5" /> Rejoindre l'aventure
              </Button>
            </div>
          )}

          <SearchContainer
            onSearch={handleSearch}
            showAllResults={handleShowAllBooks}
            hasMoreResults={books.length > displayedBooks && !showAllResults}
            totalBooks={totalBooks}
            remainingSearches={remainingSearches}
            searchLimitReached={searchLimitReached}
            user={user}
          />

          <SearchResults
            books={visibleBooks}
            displayedBooks={displayedBooks}
            totalBooks={totalBooks}
            onBookClick={handleRefresh}
            onLoadMore={handleLoadMore}
            onShowAll={handleShowAllBooks}
            isLoading={isLoading}
            searchQuery={searchQuery}
            isShowingAll={showAllResults}
            searchError={searchError}
            onUpdate={handleRefresh}
          />
        </div>
      </div>
      <Footer />
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
};

export default Index;
