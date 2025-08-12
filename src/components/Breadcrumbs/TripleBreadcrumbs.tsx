import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TripleBreadCrumbsTypes } from "@/types/breadcrumbs";
import { AiFillHome } from "react-icons/ai";

const TripleBreadcrumbs: React.FC<TripleBreadCrumbsTypes> = ({
  firstLink,
  firstName,
  secondName,
  secondLink,
  thirdName,
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
          <BreadcrumbLink
            href={secondLink}
            className="font-light text-muted-foreground"
          >
            {secondName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-light">{thirdName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default TripleBreadcrumbs;
