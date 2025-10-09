import style from "./style.module.scss";

type DividerProps = {
  height?: number;
  width?: number;
};

export const Divider = ({ height, width }: DividerProps) => {
  return (
    <div
      style={{
        height: height ? `${height}px` : "1px",
        width: width ? `${width}px` : "100%",
      }}
      className={style.divider}
    />
  );
};
