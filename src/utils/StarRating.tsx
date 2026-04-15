"use client";
import React, { useId } from "react";

type StarProps = {
  fillPercent: number;
  size?: number;
};

const STAR_PATH =
  "M10.2538 1.5C9.96855 1.5 9.70794 1.66171 9.58126 1.91731L7.44385 6.18114C7.33369 6.40089 7.12284 6.55271 6.87951 6.58749L2.14854 7.26378C1.86141 7.30402 1.62428 7.50352 1.53613 7.77757C1.44797 8.05163 1.52433 8.35196 1.73266 8.55063L5.1414 11.8173C5.3218 11.9901 5.40426 12.2415 5.36132 12.4877L4.55198 17.1266C4.50157 17.4105 4.61604 17.6962 4.84677 17.8654C5.0775 18.0346 5.38435 18.0579 5.63799 17.9255L9.90964 15.7191C10.1256 15.6075 10.3822 15.6076 10.5981 15.7191L14.8669 17.9251C15.1233 18.0589 15.4301 18.0356 15.6609 17.8664C15.8916 17.6972 16.0061 17.4115 15.9561 17.1298L15.1463 12.4876C15.1034 12.2415 15.1859 11.9901 15.3662 11.8173L18.7737 8.5519C18.9833 8.35196 19.0597 8.05163 18.9715 7.77757C18.8834 7.50352 18.6462 7.30402 18.3611 7.26406L13.6281 6.58749C13.3848 6.55271 13.174 6.40089 13.0638 6.18114L10.9264 1.91731C10.7997 1.66171 10.5391 1.5 10.2538 1.5Z";

const Star = ({ fillPercent, size = 20 }: StarProps) => {
  const id = useId();
  const clipId = `clip-${id}`;

  return (
    <svg width={size} height={size} viewBox="0 0 21 20">
      <defs>
        <clipPath id={clipId}>
          <rect width={`${fillPercent}%`} height="100%" />
        </clipPath>
      </defs>

      {/* background */}
      <path
        d={STAR_PATH}
        fill="#FFFFFF"
        stroke="#D6D6D6"
        strokeWidth="1.2"
      />

      {/* yellow fill */}
      <path
        d={STAR_PATH}
        fill="#FFE923"
        clipPath={`url(#${clipId})`}
      />

      {/* yellow border */}
      <path
        d={STAR_PATH}
        fill="none"
        stroke="#FFE923"
        strokeWidth="1.2"
      />
    </svg>
  );
};

type RatingProps = {
  value: number;
  max?: number;
};

const Rating = ({ value, max = 5 }: RatingProps) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = value - i;
        const fill =
          starValue >= 1 ? 100 : starValue > 0 ? starValue * 100 : 0;

        return <Star key={i} fillPercent={fill} />;
      })}
    </div>
  );
};

export default Rating;
