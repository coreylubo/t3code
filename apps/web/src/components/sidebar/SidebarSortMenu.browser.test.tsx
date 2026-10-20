import "../../index.css";

import type { ComponentProps } from "react";
import { expect, it, vi } from "vite-plus/test";
import { page, userEvent } from "vite-plus/test/browser";

import { render } from "../../../test/render";
import { SidebarProvider } from "../ui/sidebar";
import { SidebarSortMenu } from "./SidebarSortMenu";

function sortMenu(props: Partial<ComponentProps<typeof SidebarSortMenu>> = {}) {
  const onModeChange = vi.fn();
  const onDirectionChange = vi.fn();
  const element = (
    <SidebarProvider>
      <SidebarSortMenu
        mode="manual"
        direction="oldest"
        allowManual
        onModeChange={onModeChange}
        onDirectionChange={onDirectionChange}
        {...props}
      />
    </SidebarProvider>
  );
  return { element, onModeChange, onDirectionChange };
}

it("writes the picked mode", async () => {
  const { element, onModeChange } = sortMenu();
  await using screen = await render(element);
  await userEvent.click(screen.getByRole("button", { name: "Sort threads" }));
  await userEvent.click(page.getByRole("menuitemradio", { name: "By status" }));
  expect(onModeChange).toHaveBeenCalledWith("status");
});

it("disables direction in manual mode", async () => {
  const { element } = sortMenu();
  await using screen = await render(element);
  await userEvent.click(screen.getByRole("button", { name: "Sort threads" }));
  await expect
    .element(page.getByRole("menuitemradio", { name: "Newest first" }))
    .toHaveAttribute("aria-disabled", "true");
});

it("hides manual when not allowed and writes the picked direction", async () => {
  const { element, onDirectionChange } = sortMenu({ mode: "status", allowManual: false });
  await using screen = await render(element);
  await userEvent.click(screen.getByRole("button", { name: "Sort threads" }));
  await expect.element(page.getByRole("menuitemradio", { name: "By status" })).toBeVisible();
  await expect.element(page.getByRole("menuitemradio", { name: "Manual" })).not.toBeInTheDocument();
  await userEvent.click(page.getByRole("menuitemradio", { name: "Newest first" }));
  expect(onDirectionChange).toHaveBeenCalledWith("newest");
});
