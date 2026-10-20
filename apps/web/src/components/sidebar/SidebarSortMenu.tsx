import { SidebarActiveSortMode, SidebarSortDirection } from "@t3tools/contracts/settings";
import * as Schema from "effect/Schema";
import { ArrowUpDownIcon } from "lucide-react";

import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "../ui/menu";
import { SidebarHeaderIconButton } from "./SidebarThreadHeader";

const MODE_LABELS: Record<SidebarActiveSortMode, string> = {
  manual: "Manual",
  time: "By time",
  status: "By status",
};
const DIRECTION_LABELS: Record<SidebarSortDirection, string> = {
  oldest: "Oldest first",
  newest: "Newest first",
};
const isMode = Schema.is(SidebarActiveSortMode);
const isDirection = Schema.is(SidebarSortDirection);

export function SidebarSortMenu({
  mode,
  direction,
  allowManual,
  onModeChange,
  onDirectionChange,
}: {
  readonly mode: SidebarActiveSortMode;
  readonly direction: SidebarSortDirection;
  readonly allowManual: boolean;
  readonly onModeChange: (mode: SidebarActiveSortMode) => void;
  readonly onDirectionChange: (direction: SidebarSortDirection) => void;
}) {
  return (
    <Menu>
      <MenuTrigger
        render={
          <SidebarHeaderIconButton label="Sort threads">
            <ArrowUpDownIcon />
          </SidebarHeaderIconButton>
        }
      />
      <MenuPopup align="end" side="bottom">
        <MenuGroup>
          <MenuGroupLabel>Sort</MenuGroupLabel>
          <MenuRadioGroup
            value={mode}
            onValueChange={(value) => {
              if (isMode(value)) onModeChange(value);
            }}
          >
            {SidebarActiveSortMode.literals
              .filter((value) => allowManual || value !== "manual")
              .map((value) => (
                <MenuRadioItem key={value} value={value}>
                  {MODE_LABELS[value]}
                </MenuRadioItem>
              ))}
          </MenuRadioGroup>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Direction</MenuGroupLabel>
          <MenuRadioGroup
            value={direction}
            onValueChange={(value) => {
              if (isDirection(value)) onDirectionChange(value);
            }}
          >
            {SidebarSortDirection.literals.map((value) => (
              <MenuRadioItem key={value} value={value} disabled={mode === "manual"}>
                {DIRECTION_LABELS[value]}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  );
}
