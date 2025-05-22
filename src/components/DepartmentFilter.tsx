import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/ui/icon";
import { departments } from "@/constants/departments";
import React from "react";

interface DepartmentFilterProps {
  selectedDepartment: string | null;
  onSelectDepartment: (department: string | null) => void;
}

const DepartmentFilter: React.FC<DepartmentFilterProps> = ({
  selectedDepartment,
  onSelectDepartment,
}) => {
  // Encontra o nome do departamento pelo id (se for número)
  const getDisplayName = () => {
    if (!selectedDepartment) return "Todos os departamentos";

    const departmentId = parseInt(selectedDepartment);
    if (!isNaN(departmentId)) {
      const departmentObj = departments.find((d) => d.id === departmentId);
      return departmentObj ? departmentObj.name : "Todos os departamentos";
    }

    return selectedDepartment;
  };

  return (
    <div className="mt-2 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 items-center">
            <Icon name="building" className="h-4 w-4" />
            <span className="max-w-[200px] truncate">{getDisplayName()}</span>
            <Icon name="chevronDown" className="h-4 w-4 ml-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[280px] max-h-[60vh] overflow-y-auto">
          <DropdownMenuLabel>Filtrar por departamento</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={!selectedDepartment ? "bg-accent" : ""}
            onSelect={() => onSelectDepartment(null)}
          >
            <span className="flex items-center gap-2">
              <Icon name="layout" className="h-4 w-4" />
              Todos os departamentos
            </span>
          </DropdownMenuItem>

          {departments.map((department) => (
            <DropdownMenuItem
              key={department.id}
              className={
                selectedDepartment === department.id.toString()
                  ? "bg-accent"
                  : ""
              }
              onSelect={() => onSelectDepartment(department.id.toString())}
            >
              <span className="flex items-center gap-2">
                <Icon name="building" className="h-4 w-4" />
                {department.name}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DepartmentFilter;
