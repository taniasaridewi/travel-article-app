import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoutButton from "@/components/auth/LogoutButton";
import ArticleCard from "@/components/articles/ArticleCard";
import { useAuthStore } from "@/store/authStore";
import { useArticleStore } from "@/store/articleStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Loader2,
  Search,
  XCircle,
  PlusCircle,
  LayoutGrid,
  Compass,
  Filter,
  Home,
} from "lucide-react";
import type { StrapiFilters, GetArticlesParams } from "@/types/articleTypes";

const ALL_CATEGORIES_SELECT_VALUE = "__ALL_CATEGORIES__";

const ArticleListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useAuthStore((state) => state.user);
  const {
    articles,
    pagination,
    isLoading,
    error,
    fetchArticles,
    setCurrentPage,
    currentFetchParams,
    applyFiltersAndResetSort,
    setSort,
    availableCategories,
    fetchAvailableCategories,
    isLoadingCategories,
    clearError,
  } = useArticleStore();

  const [titleFilter, setTitleFilter] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [activeSort, setActiveSort] = useState("createdAt:desc");

  useEffect(() => {
    if (typeof clearError === "function") clearError();

    const paramsFromUrl = new URLSearchParams(location.search);
    const categoryFilterFromUrl = paramsFromUrl.get(
      "filters[category][name][$eqi]",
    );
    const titleFilterFromUrl = paramsFromUrl.get("filters[title][$containsi]");
    const sortFromUrl = paramsFromUrl.get("sort");
    const pageFromUrl = paramsFromUrl.get("pagination[page]");
    const pageSizeFromUrl = paramsFromUrl.get("pagination[pageSize]");

    const newFetchParams: GetArticlesParams = {
      filters: {},
      pagination: {
        page: pageFromUrl ? parseInt(pageFromUrl, 10) : 1,
        pageSize: pageSizeFromUrl
          ? parseInt(pageSizeFromUrl, 10)
          : currentFetchParams.pagination?.pageSize || 9,
      },
      sort: sortFromUrl || currentFetchParams.sort || "createdAt:desc",
      populate: currentFetchParams.populate || {
        user: "*",
        category: "*",
        comments: { populate: { user: "*" } },
      },
    };

    if (categoryFilterFromUrl !== null) {
      newFetchParams.filters!.category = {
        name: { $eqi: categoryFilterFromUrl },
      };
    }
    if (titleFilterFromUrl !== null) {
      newFetchParams.filters!.title = { $containsi: titleFilterFromUrl };
    }

    if (typeof fetchArticles === "function") {
      fetchArticles(newFetchParams);
    }

    if (
      availableCategories.length === 0 &&
      !isLoadingCategories &&
      typeof fetchAvailableCategories === "function"
    ) {
      fetchAvailableCategories({ pagination: { pageSize: 200 } });
    }
  }, [
    location.search,
    fetchArticles,
    fetchAvailableCategories,
    clearError,
    currentFetchParams.pagination?.pageSize,
    currentFetchParams.sort,
    currentFetchParams.populate,
    availableCategories.length,
    isLoadingCategories,
  ]);

  useEffect(() => {
    const activeFilters = currentFetchParams.filters || {};
    setTitleFilter(
      (activeFilters.title as { $containsi?: string })?.$containsi || "",
    );
    setSelectedCategoryName(
      (activeFilters.category as { name?: { $eqi?: string } })?.name?.$eqi ||
        "",
    );

    const currentSortValue = Array.isArray(currentFetchParams.sort)
      ? currentFetchParams.sort[0]
      : currentFetchParams.sort;
    setActiveSort(currentSortValue || "createdAt:desc");
  }, [currentFetchParams.filters, currentFetchParams.sort]);

  const handlePageChange = (newPage: number) => {
    if (
      newPage >= 1 &&
      newPage <= (pagination?.pageCount || 1) &&
      newPage !== pagination?.page
    ) {
      const queryParams = new URLSearchParams(location.search);
      queryParams.set("pagination[page]", String(newPage));
      navigate(`/articles?${queryParams.toString()}`);
    }
  };

  const handleApplyAllFiltersFromUI = () => {
    const queryParams = new URLSearchParams();
    if (titleFilter.trim() !== "") {
      queryParams.set("filters[title][$containsi]", titleFilter.trim());
    }
    if (selectedCategoryName && selectedCategoryName.trim() !== "") {
      queryParams.set(
        "filters[category][name][$eqi]",
        selectedCategoryName.trim(),
      );
    }
    queryParams.set("sort", activeSort);
    queryParams.set("pagination[page]", "1");

    navigate(`/articles?${queryParams.toString()}`, { replace: true });
  };

  const handleClearFiltersFromUI = () => {
    setTitleFilter("");
    setSelectedCategoryName("");
    setActiveSort("createdAt:desc");
    navigate("/articles", { replace: true });
  };

  const handleSortChange = (value: string) => {
    if (value) {
      setActiveSort(value);
      const queryParams = new URLSearchParams(location.search);
      queryParams.set("sort", value);
      queryParams.set("pagination[page]", "1");
      navigate(`/articles?${queryParams.toString()}`, { replace: true });
    }
  };

  const handleCategoryFilterChange = (selectedValue: string) => {
    const newSelectedCategory =
      selectedValue === ALL_CATEGORIES_SELECT_VALUE ? "" : selectedValue;
    setSelectedCategoryName(newSelectedCategory);
  };

  const categorySelectValue =
    selectedCategoryName === ""
      ? ALL_CATEGORIES_SELECT_VALUE
      : selectedCategoryName;

  return (
    <div className="bg-brand-background text-brand-text min-h-screen antialiased">
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="border-brand-muted/20 mb-8 flex flex-col items-center justify-between border-b pb-4 sm:flex-row">
          <div className="mb-4 sm:mb-0">
            <h1 className="font-heading text-brand-text text-3xl font-bold sm:text-4xl">
              Artikel Perjalanan
            </h1>
            {authUser && (
              <p className="text-brand-muted mt-1 text-lg">
                Selamat datang kembali,{" "}
                <span className="text-brand-primary font-semibold">
                  {authUser.username || authUser.email}
                </span>
                !
              </p>
            )}
          </div>
        </div>

        <section className="bg-brand-surface border-brand-muted/20 mb-10 rounded-xl border p-5 shadow-xl sm:p-6">
          <div className="mb-5 flex items-center">
            <Filter size={22} className="text-brand-primary mr-2" />
            <h2 className="font-heading text-brand-text text-xl font-semibold">
              Filter & Urutkan Artikel
            </h2>
          </div>
          <div className="grid grid-cols-1 items-end gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col">
              <label
                htmlFor="filterTitle"
                className="text-brand-text mb-1.5 block text-sm font-medium"
              >
                Judul Artikel
              </label>
              <Input
                type="text"
                id="filterTitle"
                placeholder="Cari judul..."
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleApplyAllFiltersFromUI()
                }
                className="border-brand-muted/50 focus:border-brand-primary focus:ring-brand-primary rounded-md py-2.5 text-sm shadow-sm focus:ring-1"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="filterCategory"
                className="text-brand-text mb-1.5 block text-sm font-medium"
              >
                Kategori
              </label>
              <Select
                onValueChange={handleCategoryFilterChange}
                value={categorySelectValue}
                disabled={isLoadingCategories}
              >
                <SelectTrigger className="border-brand-muted/50 focus:border-brand-primary focus:ring-brand-primary text-brand-text rounded-md py-2.5 text-sm shadow-sm focus:ring-1">
                  <SelectValue
                    placeholder={
                      isLoadingCategories
                        ? "Memuat kategori..."
                        : "Semua Kategori"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="border-brand-muted/50 z-50 bg-white shadow-lg">
                  <SelectGroup>
                    <SelectItem
                      value={ALL_CATEGORIES_SELECT_VALUE}
                      className="text-brand-text hover:bg-slate-100 focus:bg-slate-200"
                    >
                      Semua Kategori
                    </SelectItem>
                    {availableCategories
                      .filter(
                        (category) =>
                          category &&
                          typeof category.name === "string" &&
                          category.name.trim() !== "",
                      )
                      .map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.name}
                          className="text-brand-text hover:bg-slate-100 focus:bg-slate-200"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                  {isLoadingCategories && (
                    <div className="text-brand-muted p-2 text-center text-sm">
                      Memuat...
                    </div>
                  )}
                  {!isLoadingCategories && availableCategories.length === 0 && (
                    <div className="text-brand-muted p-2 text-center text-sm">
                      Kategori tidak tersedia.
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="sortOrder"
                className="text-brand-text mb-1.5 block text-sm font-medium"
              >
                Urutkan
              </label>

              <Select onValueChange={handleSortChange} value={activeSort}>
                <SelectTrigger className="border-brand-muted/50 focus:border-brand-primary focus:ring-brand-primary text-brand-text rounded-md py-2.5 text-sm shadow-sm focus:ring-1">
                  <SelectValue placeholder="Pilih urutan" />
                </SelectTrigger>
                <SelectContent className="border-brand-muted/50 z-50 bg-white shadow-lg">
                  <SelectGroup>
                    <SelectItem
                      value="createdAt:desc"
                      className="text-brand-text hover:bg-slate-100 focus:bg-slate-200"
                    >
                      Terbaru Dibuat
                    </SelectItem>
                    <SelectItem
                      value="createdAt:asc"
                      className="text-brand-text hover:bg-slate-100 focus:bg-slate-200"
                    >
                      Terlama Dibuat
                    </SelectItem>
                    <SelectItem
                      value="publishedAt:desc"
                      className="text-brand-text hover:bg-slate-100 focus:bg-slate-200"
                    >
                      Terbaru Terbit
                    </SelectItem>
                    <SelectItem
                      value="publishedAt:asc"
                      className="text-brand-text hover:bg-slate-100 focus:bg-slate-200"
                    >
                      Terlama Terbit
                    </SelectItem>
                    <SelectItem
                      value="title:asc"
                      className="text-brand-text hover:bg-slate-100 focus:bg-slate-200"
                    >
                      Judul (A-Z)
                    </SelectItem>
                    <SelectItem
                      value="title:desc"
                      className="text-brand-text hover:bg-slate-100 focus:bg-slate-200"
                    >
                      Judul (Z-A)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2 pt-4 sm:flex-row sm:space-x-2 sm:space-y-0 sm:self-end sm:pt-0">
              <Button
                onClick={handleApplyAllFiltersFromUI}
                className="bg-brand-primary w-full rounded-md py-2.5 text-sm text-white shadow-sm transition-all hover:bg-opacity-80 hover:shadow-md"
              >
                <Search size={16} className="mr-1.5" /> Terapkan
              </Button>
              <Button
                onClick={handleClearFiltersFromUI}
                variant="outline"
                className="border-brand-muted text-brand-text hover:bg-brand-secondary/50 w-full rounded-md py-2.5 text-sm shadow-sm transition-all hover:shadow-md"
              >
                <XCircle size={16} className="mr-1.5" /> Reset
              </Button>
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            {" "}
            <Loader2 className="text-brand-primary mb-4 h-16 w-16 animate-spin" />{" "}
            <p className="text-brand-text text-xl font-medium">
              Memuat artikel...
            </p>{" "}
          </div>
        )}
        {error && !isLoading && (
          <div
            className="my-10 flex flex-col items-center rounded-lg border-l-4 border-red-500 bg-red-100 p-6 text-red-800 shadow-md"
            role="alert"
          >
            {" "}
            <AlertTriangle className="mb-3 h-10 w-10 text-red-600" />{" "}
            <p className="mb-2 text-xl font-bold">Gagal Memuat Artikel</p>{" "}
            <p className="mb-4 text-center">{error}</p>{" "}
            <Button
              onClick={() => fetchArticles(currentFetchParams)}
              variant="outline"
              className="border-red-600 text-red-700 hover:bg-red-100"
            >
              {" "}
              Coba Lagi{" "}
            </Button>{" "}
          </div>
        )}
        {!isLoading && !error && articles.length === 0 && (
          <div className="py-20 text-center">
            {" "}
            <Compass
              size={64}
              className="text-brand-muted/70 mx-auto mb-6"
            />{" "}
            <p className="text-brand-muted text-2xl">
              Tidak ada artikel yang cocok.
            </p>{" "}
            <p className="text-brand-muted/80">
              Coba ubah filter Anda atau buat artikel baru!
            </p>{" "}
          </div>
        )}
        {!isLoading && !error && articles.length > 0 && (
          <>
            {" "}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
              {" "}
              {articles.map((article) => (
                <ArticleCard
                  key={article.documentId || article.id}
                  article={article}
                />
              ))}{" "}
            </div>{" "}
            {/* Pagination */}{" "}
            {pagination && pagination.pageCount > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center space-x-1 py-4 sm:space-x-2">
                {" "}
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || isLoading}
                  variant="outline"
                  size="sm"
                  className="border-brand-muted text-brand-text hover:bg-brand-secondary/70 m-1 rounded-md shadow-sm"
                >
                  {" "}
                  Sebelumnya{" "}
                </Button>{" "}
                {(() => {
                  const pageButtons = [];
                  const currentPage = pagination.page;
                  const pageCount = pagination.pageCount;
                  const maxVisibleButtons = 5;
                  if (pageCount <= maxVisibleButtons + 2) {
                    for (let i = 1; i <= pageCount; i++) pageButtons.push(i);
                  } else {
                    pageButtons.push(1);
                    let start = Math.max(
                      2,
                      currentPage - Math.floor((maxVisibleButtons - 2) / 2),
                    );
                    let end = Math.min(
                      pageCount - 1,
                      currentPage + Math.ceil((maxVisibleButtons - 2) / 2) - 1,
                    );
                    if (currentPage < Math.ceil(maxVisibleButtons / 2)) {
                      end = maxVisibleButtons - 1;
                      start = 2;
                    }
                    if (
                      currentPage >
                      pageCount - Math.floor(maxVisibleButtons / 2)
                    ) {
                      start = pageCount - maxVisibleButtons + 2;
                      end = pageCount - 1;
                    }
                    if (start > 2) pageButtons.push("...");
                    for (let i = start; i <= end; i++) pageButtons.push(i);
                    if (end < pageCount - 1) pageButtons.push("...");
                    pageButtons.push(pageCount);
                  }
                  return pageButtons.map((page, index) =>
                    typeof page === "number" ? (
                      <Button
                        key={`page-${page}`}
                        onClick={() => handlePageChange(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className={`m-1 rounded-md shadow-sm ${currentPage === page ? "bg-brand-primary text-white hover:bg-opacity-90" : "border-brand-muted text-brand-text hover:bg-brand-secondary/70"}`}
                      >
                        {" "}
                        {page}{" "}
                      </Button>
                    ) : (
                      <span
                        key={`ellipsis-${index}`}
                        className="text-brand-muted m-1 select-none px-2 py-1"
                      >
                        ...
                      </span>
                    ),
                  );
                })()}{" "}
                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={
                    pagination.page === pagination.pageCount || isLoading
                  }
                  variant="outline"
                  size="sm"
                  className="border-brand-muted text-brand-text hover:bg-brand-secondary/70 m-1 rounded-md shadow-sm"
                >
                  {" "}
                  Berikutnya{" "}
                </Button>{" "}
              </div>
            )}{" "}
          </>
        )}
      </main>
      <footer className="border-brand-muted/20 mt-16 border-t py-10 text-center">
        <p className="text-brand-muted text-sm">
          &copy; {new Date().getFullYear()} TravelArticle App. Didesain dengan{" "}
          <span className="text-red-500">❤️</span>.
        </p>
      </footer>
    </div>
  );
};

export default ArticleListPage;
