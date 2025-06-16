import { ReactNode, useState } from "react";
import { MdSearch, MdFilterList, MdClear } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface FilterOption {
    value: string;
    label: string;
}

interface FilterSection {
    key: string;
    label: string;
    options?: FilterOption[];
    placeholder: string;
    note?: string;
    type?: "select" | "date" | "number";
    min?: number;
    max?: number;
}

interface ActiveFilter {
    type: string;
    value: string;
    label: string;
    displayLabel: string;
}

interface SearchFilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    
    // Filter props
    showFilters?: boolean;
    onShowFiltersChange?: (show: boolean) => void;
    filterSections?: FilterSection[];
    filterTitle?: string;
    onFilterAdd?: (filterType: string, value: string) => void;
    onFilterRemove?: (filterType: string, value: string) => void;
    onFilterClear?: () => void;
    activeFiltersCount?: number;
    activeFilters?: ActiveFilter[];
    
    // Create button props
    createButtonText?: string;
    onCreateClick?: () => void;
    createButtonIcon?: ReactNode;
    
    // Additional actions
    additionalActions?: ReactNode;
}

export const SearchFilterBar = ({
    searchTerm,
    onSearchChange,
    searchPlaceholder,
    showFilters = false,
    onShowFiltersChange,
    filterSections = [],
    filterTitle,
    onFilterAdd,
    onFilterRemove,
    onFilterClear,
    activeFiltersCount = 0,
    activeFilters = [],
    createButtonText,
    onCreateClick,
    createButtonIcon,
    additionalActions,
}: SearchFilterBarProps): ReactNode => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    // State for date pickers
    const [dateStates, setDateStates] = useState<Record<string, Date | undefined>>({});

    const handleDateSelect = (sectionKey: string, date: Date | undefined) => {
        setDateStates(prev => ({ ...prev, [sectionKey]: date }));
        if (date && onFilterAdd) {
            onFilterAdd(sectionKey, format(date, "yyyy-MM-dd"));
        }
    };

    return (
        <div className="space-y-3 mb-4">
            {/* Search and Controls Row */}
            <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-grow">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl" />
                    <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 h-10"
                    />
                </div>

            {/* Filters */}
            {filterSections.length > 0 && onShowFiltersChange && (
                <Popover open={showFilters} onOpenChange={onShowFiltersChange}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 text-sm border-slate-200 h-10"
                        >
                            <MdFilterList />
                            Filters
                            {activeFiltersCount > 0 && (
                                <Badge className="ml-1 h-4 w-4 p-0 text-xs bg-relif-orange-200 text-white hover:bg-relif-orange-300 flex items-center justify-center rounded-full">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0" align="end" sideOffset={5}>
                        <div className="flex flex-col h-[400px]">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
                                <h4 className="font-medium text-base text-slate-900">
                                    {filterTitle || 'Filters'}
                                </h4>
                                {activeFiltersCount > 0 && onFilterClear && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onFilterClear}
                                        className="text-xs hover:text-red-600 h-6 px-2"
                                    >
                                        <MdClear className="mr-1 h-3 w-3" />
                                        Clear all
                                    </Button>
                                )}
                            </div>

                            <div className="p-4 space-y-4 overflow-y-auto min-h-0">
                                {filterSections.map((section) => (
                                    <div key={section.key} className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700 block">
                                            {section.label}
                                        </label>
                                        {section.note && (
                                            <div className="text-xs text-slate-500 -mt-1">
                                                {section.note}
                                            </div>
                                        )}
                                        
                                        {section.type === "date" ? (
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    placeholder="DD/MM/YYYY or click calendar"
                                                    value={dateStates[section.key] ? format(dateStates[section.key]!, "dd/MM/yyyy") : ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value) {
                                                            // Handle DD/MM/YYYY format
                                                            const parts = value.split('/');
                                                            if (parts.length === 3) {
                                                                const day = parseInt(parts[0]);
                                                                const month = parseInt(parts[1]) - 1; // Month is 0-indexed
                                                                const year = parseInt(parts[2]);
                                                                if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                                                                    const date = new Date(year, month, day);
                                                                    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
                                                                        handleDateSelect(section.key, date);
                                                                    }
                                                                }
                                                            }
                                                        } else {
                                                            handleDateSelect(section.key, undefined);
                                                        }
                                                    }}
                                                    className="w-full h-8 text-xs border-relif-orange-200 focus:border-relif-orange-300 pr-8"
                                                />
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-gray-100"
                                                        >
                                                            <CalendarDays className="h-3 w-3 text-gray-400" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={dateStates[section.key]}
                                                            onSelect={(date) => handleDateSelect(section.key, date)}
                                                            disabled={(date) => date > new Date()}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        ) : section.type === "number" ? (
                                            <Input
                                                type="number"
                                                placeholder={section.placeholder}
                                                min={section.min}
                                                max={section.max}
                                                className="w-full h-8 text-xs border-relif-orange-200 focus:border-relif-orange-300"
                                                onChange={(e) => {
                                                    if (e.target.value && onFilterAdd) {
                                                        onFilterAdd(section.key, e.target.value);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <Select
                                                onValueChange={(value) => {
                                                    if (value && onFilterAdd) {
                                                        onFilterAdd(section.key, value);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="w-full h-8 text-xs border-relif-orange-200 focus:border-relif-orange-300">
                                                    <SelectValue placeholder={section.placeholder} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {section.options?.map((option) => (
                                                        <SelectItem key={option.value} value={option.value} className="text-xs">
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            )}

            {/* Create Button */}
            {createButtonText && onCreateClick && (
                <Button
                    onClick={onCreateClick}
                    className="bg-relif-orange-200 hover:bg-relif-orange-300 text-white h-10 flex items-center gap-2"
                >
                    {createButtonIcon}
                    {createButtonText}
                </Button>
            )}

                {/* Additional Actions (Download) */}
                {additionalActions}
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-slate-600 font-medium">Active filters:</span>
                    {activeFilters.map((filter, index) => (
                        <Badge
                            key={`${filter.type}-${filter.value}-${index}`}
                            variant="secondary"
                            className="bg-slate-800 text-white hover:bg-slate-700 text-xs px-3 py-1 flex items-center gap-2"
                        >
                            {filter.displayLabel}
                            {onFilterRemove && (
                                <button
                                    onClick={() => onFilterRemove(filter.type, filter.value)}
                                    className="ml-1 hover:text-red-300 transition-colors"
                                >
                                    ×
                                </button>
                            )}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}; 