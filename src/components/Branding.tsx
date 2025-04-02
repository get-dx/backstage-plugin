import React from "react";
import Box from "@material-ui/core/Box";

import { COLORS } from "../styles";

export function BrandedCardTitle({ title }: { title: string }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>{title}</Box>
      <PoweredByDX />
    </Box>
  );
}

export function PoweredByDX() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gridGap: 4,
        fontSize: 12,
        fontWeight: 400,
        color: COLORS.GRAY_400,
        lineHeight: "normal",
      }}
    >
      <span>Powered by</span>
      <DXLogo />
    </Box>
  );
}

function DXLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="12"
      viewBox="0 0 21 12"
      fill="none"
    >
      <g clipPath="url(#clip0_8_901)">
        <path
          d="M17.4279 7.65054L20.457 12H17.5056C17.1857 11.6425 16.8749 11.2121 16.5998 10.8147C16.1776 10.205 16.1787 9.36824 16.6148 8.76849L17.4279 7.65054Z"
          fill="#9CA3AF"
        />
        <path
          d="M12.9229 4.34957L9.8938 6.12932e-05L12.8452 6.10352e-05C13.1651 0.357572 13.4759 0.788019 13.751 1.18538C14.1732 1.79507 14.1721 2.63189 13.7359 3.23164L12.9229 4.34957Z"
          fill="#9CA3AF"
        />
        <path
          d="M17.2338 0.737865C17.5444 0.233009 17.894 0.038835 18.4376 0.038835L20.8454 0L13.0127 11.5605C12.8428 11.8112 12.5608 11.9612 12.2593 11.9612H9.63184C12.1441 8.2116 14.8038 4.53952 17.2338 0.737865Z"
          fill="#9CA3AF"
        />
        <path
          d="M0 11.9613H4.25839C8.0659 11.9613 10.3872 9.63585 10.3872 5.99825C10.3872 2.36068 8.0659 0.0352783 4.25839 0.0352783H0L2.64078 2.37729H1.5534C0.69548 2.37729 0 3.07277 0 3.93069V9.61925V11.9613ZM2.72203 9.61925V2.37729H4.2417C6.41265 2.37729 7.6317 3.80575 7.6317 5.99825C7.6317 8.1908 6.41265 9.61925 4.25839 9.61925H2.72203Z"
          fill="#9CA3AF"
        />
      </g>
      <defs>
        <clipPath id="clip0_8_901">
          <rect width="21" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
