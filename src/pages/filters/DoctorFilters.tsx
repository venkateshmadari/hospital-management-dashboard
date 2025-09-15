import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { specialities } from "../auth/RegisterPage";
import SearchInput from "@/components/SearchInput";
import { useLocation } from "react-router-dom";

interface StatusOption {
  id: number;
  name: string;
  value: string;
}

interface DoctorFiltersProps {
  statusFilter: string | null;
  handleFilter: (filterType: string, value: string) => void;
  statusOptions: StatusOption[];
  specialityFilter: string | null;
  placeholder?: string;
}

const DoctorFilters: React.FC<DoctorFiltersProps> = ({
  statusFilter,
  handleFilter,
  statusOptions,
  specialityFilter,
  placeholder,
}) => {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-1">
        <div className="flex items-center gap-2">
          <Select
            onValueChange={(value) => handleFilter("status", value)}
            value={statusFilter || "all"}
          >
            <SelectTrigger className="w-full text-sm cursor-pointer select-none">
              <Filter />
              <SelectValue placeholder="Status" className="select-none" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem
                  value={status.value}
                  key={status.id}
                  className="cursor-pointer capitalize"
                >
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {location.pathname === "/total-apppointments" && (
            <Select
              onValueChange={(value) => handleFilter("speciality", value)}
              value={specialityFilter || "all"}
            >
              <SelectTrigger className="w-full text-sm cursor-pointer">
                <Filter />
                <SelectValue placeholder="Speciality" className="select-none" />
              </SelectTrigger>
              <SelectContent className="max-h-[450px] overflow-y-auto">
                <SelectItem value="all" className="select-none cursor-pointer">
                  All Specialities
                </SelectItem>
                {specialities.map((spec) => (
                  <SelectItem
                    key={spec.value}
                    value={spec.value}
                    className="select-none cursor-pointer"
                  >
                    {spec.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <SearchInput
          placeholder={placeholder ? placeholder : "Search doctor"}
        />
      </div>
    </div>
  );
};

export default DoctorFilters;
