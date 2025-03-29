
import { useEffect } from 'react';
import { useBookSearch } from '@/hooks/use-book-search';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import NavBar from '@/components/NavBar';
import { HeaderSection } from '@/components/search/HeaderSection';
import Footer from '@/components/Footer';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { SearchContainer } from '@/components/search/SearchContainer';
import { SearchResults } from '@/components/search/SearchResults';

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

  const { user, showLoginDialog, setShowLoginDialog } = useSupabaseAuth();

  useEffect(() => {
    if (user) {
      checkSearchLimits();
    }
  }, [user, checkSearchLimits]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container px-4 py-6 sm:py-8 sm:px-6 lg:px-8 mx-auto flex-grow">
        <div className="max-w-4xl mx-auto">
          <HeaderSection onBookAdded={handleRefresh} />

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
            searchType={searchParams.type}
            language={searchParams.language}
          />
        </div>
      </div>
      <Footer />
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
};

export default Index;
