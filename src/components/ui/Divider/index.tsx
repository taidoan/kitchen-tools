import style from "./style.module.scss";
import clsx from "clsx";

type DividerProps = {
  height?: number;
  width?: number;
} & React.ComponentProps<"div">;

export const Divider = ({ height, width, ...props }: DividerProps) => {
  return (
    <div
      style={{
        height: height ? `${height}px` : "1px",
        width: width ? `${width}px` : "100%",
      }}
      className={clsx(style.divider, props.className)}
    />
  );
};
