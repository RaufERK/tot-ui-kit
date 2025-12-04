import { EFontType, ETextSize, Text } from "@sberbusiness/triplex-next";
import { type FC } from "react";

type PageLabelProps = {
  title: string;
  subtitle: string;
};

const PageLabel: FC<PageLabelProps> = ({ title, subtitle }) => {
  return (
    <div>
      <Text size={ETextSize.B2} type={EFontType.PRIMARY}>
        {title}
      </Text>
      <Text size={ETextSize.B2} type={EFontType.SECONDARY}>
        {subtitle}
      </Text>
    </div>
  );
};

export default PageLabel;
