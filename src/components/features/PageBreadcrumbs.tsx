import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

interface BreadcrumbsItem {
  name: string;
  path: string;
}
interface BreadcrumbsProps {
  items: BreadcrumbsItem[];
}

export const PageBreadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
  }

  return (
    <div onClick={handleClick}>
      <Breadcrumbs key="breadcrumb" aria-label="breadcrumb">
        {props.items.map((item) => {
          return (
            <Link key={item.name} underline="hover" color="inherit">
              {item.name}
            </Link>
          );
        })}
      </Breadcrumbs>
      <br />
    </div>
  );
};
