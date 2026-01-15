import clsx from "clsx";
import style from "./style.module.scss";
import { IconArticle, IconVocabulary } from "@tabler/icons-react";

type PrintToggleProps = {
  oneLabel: React.ReactNode;
  twoLabel: React.ReactNode;
  oneOnClick: () => void;
  twoOnClick: () => void;
  status?: boolean;
};

export const PrintToggle = ({
  oneLabel,
  twoLabel,
  oneOnClick,
  twoOnClick,
  status,
}: PrintToggleProps) => {
  return (
    <div className={clsx(style.container)}>
      <button
        className={clsx(style.button, { [style["button--active"]]: !status })}
        onClick={oneOnClick}
      >
        <IconArticle /> {oneLabel}
      </button>
      <button
        className={clsx(style.button, { [style["button--active"]]: status })}
        onClick={twoOnClick}
      >
        <IconVocabulary /> {twoLabel}
      </button>
    </div>
  );
};
