"use client";

import { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtworkStore } from "@/stores/useArtworkStore";
import { useDepartments } from "@/hooks/useArtworks";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchBar() {
  const [mounted, setMounted] = useState(false);
  const {
    searchQuery,
    selectedDepartment,
    setSearchQuery,
    setSelectedDepartment,
    resetSearch,
  } = useArtworkStore();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 500);
  const {
    data: departmentsData,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useDepartments();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSearchQuery(debouncedQuery);
    resetSearch();
  }, [debouncedQuery, setSearchQuery, resetSearch]);

  const handleClearSearch = () => {
    setLocalQuery("");
    setSearchQuery("");
    setSelectedDepartment(null);
    resetSearch();
  };

  const handleDepartmentChange = (value: string) => {
    const departmentId = value === "all" ? null : parseInt(value);
    setSelectedDepartment(departmentId);
    resetSearch();
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search artworks, artists, or keywords..."
          value={localQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLocalQuery(e.target.value)
          }
          className="pl-10 pr-10 h-12 text-lg"
        />
        {(localQuery || selectedDepartment) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by department:</span>
        </div>

        {departmentsLoading ? (
          <Skeleton className="h-10 w-48" />
        ) : (
          <Select
            value={selectedDepartment?.toString() || "all"}
            onValueChange={handleDepartmentChange}
            disabled={departmentsLoading || !!departmentsError}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departmentsData?.departments?.map((dept) => (
                <SelectItem
                  key={dept.departmentId}
                  value={dept.departmentId.toString()}
                >
                  {dept.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {departmentsError && (
          <span className="text-sm text-destructive">
            Failed to load departments
          </span>
        )}
      </div>
    </div>
  );
}
