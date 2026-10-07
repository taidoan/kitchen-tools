import clsx from "clsx";
import style from "./style.module.scss";

export const SPECIALS_PALETTES = [
  { id: "navy", label: "Navy", swatch: "#1e3d59" },
  { id: "claret", label: "Claret", swatch: "#6b2233" },
  { id: "forest", label: "Forest", swatch: "#1d3c32" },
  { id: "ink", label: "Ink", swatch: "#2a2a2a" },
  { id: "espresso", label: "Espresso", swatch: "#3c2415" },
] as const;

export type SpecialsPaletteId = (typeof SPECIALS_PALETTES)[number]["id"];

type SpecialsPaletteProps = {
  value: SpecialsPaletteId;
  onChange: (value: SpecialsPaletteId) => void;
};

export const SpecialsPalette = ({ value, onChange }: SpecialsPaletteProps) => {
  return (
    <div className={style.picker} role="radiogroup" aria-label="Print colour">
      <p className={style.label}>Print colour</p>
      <div className={style.swatches}>
        {SPECIALS_PALETTES.map((palette) => {
          const selected = value === palette.id;
          return (
            <span
              key={palette.id}
              className={style.item}
              data-tooltip={palette.label}
            >
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={palette.label}
                className={clsx(
                  style.swatch,
                  selected && style["swatch--active"],
                )}
                style={{ backgroundColor: palette.swatch }}
                onClick={() => onChange(palette.id)}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
};
