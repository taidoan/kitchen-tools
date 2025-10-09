import style from "./style.module.scss";

type NavButtonProps = {
  onClick?: () => void;
};

export const NavButton = ({ onClick }: NavButtonProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="46"
      height="46"
      fill="none"
      onClick={onClick}
      className={style.button}
    >
      <path fill="#fff" d="M11 13h27v25H11z" />
      <path
        fill="#3066BE"
        fill-rule="evenodd"
        d="M23 46c12.703 0 23-10.297 23-23S35.703 0 23 0 0 10.297 0 23s10.297 23 23 23ZM11.5 30a1 1 0 0 1 1-1h21a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-21a1 1 0 0 1-1-1v-2Zm1-9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h21a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-21Zm-1-7a1 1 0 0 1 1-1h21a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-21a1 1 0 0 1-1-1v-2Z"
        clip-rule="evenodd"
      />
    </svg>
  );
};
