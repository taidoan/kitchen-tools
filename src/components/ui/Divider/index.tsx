import style from "./style.module.scss";

type DividerProps = {
  height?: number;
};

export const Divider = ({ height }: DividerProps) => {
  return (
    <div
      style={{ height: height ? `${height}px` : "1px" }}
      className={style.divider}
    />
  );
};
