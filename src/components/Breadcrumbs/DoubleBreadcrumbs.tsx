import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AiFillHome } from "react-icons/ai";
import { Skeleton } from "../ui/skeleton";
import { DoubleBreadCrumbsTypes } from "@/types/breadcrumbs";

const DoubleBreadcrumbs: React.FC<DoubleBreadCrumbsTypes> = ({
  firstLink,
  firstName,
  secondName,
  isLoading,
}) => {
  return (
    <Breadcrumb className="mb-5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <AiFillHome />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href={firstLink}
            className="font-light text-muted-foreground"
          >
            {firstName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {isLoading ? (
            <Skeleton className="w-16 h-4 dark:bg-black bg-white" />
          ) : (
            <BreadcrumbPage className="font-light">{secondName}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DoubleBreadcrumbs;
