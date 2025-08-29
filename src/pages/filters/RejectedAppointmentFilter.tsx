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

interface DoctorFiltersProps {
  handleFilter: (filterType: string, value: string) => void;
  specialityFilter: string | null;
  placeholder?: string;
}

const RejectedAppointmentFilter: React.FC<DoctorFiltersProps> = ({
  handleFilter,
  specialityFilter,
  placeholder,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-1">
        <div className="flex items-center gap-2">
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
        </div>
        <SearchInput
          placeholder={placeholder ? placeholder : "Search doctor"}
        />
      </div>
    </div>
  );
};

export default RejectedAppointmentFilter;
