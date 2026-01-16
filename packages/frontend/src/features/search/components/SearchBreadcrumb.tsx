import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/features/shared/ui/Breadcrumb";
import React from "react";

const SearchBreadcrumb = () => {
  return (
    <div className="flex justify-center">
      <Breadcrumb className="w-full text-start">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-text-primary">
            Search Results
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default SearchBreadcrumb;
