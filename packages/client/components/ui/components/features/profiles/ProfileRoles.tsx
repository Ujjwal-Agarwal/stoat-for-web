import { For, Show, createSignal, onCleanup, onMount } from "solid-js";

import { ServerMember } from "stoat.js";
import { styled } from "styled-system/jsx";

import { useModals } from "@revolt/modal";

import { Ripple, typography } from "../../design";
import { dismissFloatingElements, Tooltip } from "../../floating";

import { ProfileCard } from "./ProfileCard";

const CELL_APPROX_WIDTH = 80; // px, approximate width of each role cell including margin
const ROW_HEIGHT = 30; // px, approximate height of a role cell including margin
const MAX_ROWS = 2;

export function ProfileRoles(props: { member?: ServerMember }) {
  const { openModal } = useModals();
  let containerRef: HTMLSpanElement | undefined;
  let measureRef: HTMLDivElement | undefined;
  const [visibleCount, setVisibleCount] = createSignal<number>(0);
  const [measured, setMeasured] = createSignal(false);
  const [showAllRoles, setShowAllRoles] = createSignal<boolean>(false);

  function openRoles() {
    openModal({ type: "user_profile_roles", member: props.member! });
    dismissFloatingElements();
  }

  function recalculate() {
    if (!containerRef || !measureRef) return;

    const containerWidth = containerRef.offsetWidth;
    const cells = Array.from(measureRef.children) as HTMLElement[];
    if (cells.length === 0) return;

    let row = 1;
    let rowWidth = 0;
    let count = 0;

    for (const cell of cells) {
      const cellWidth = cell.offsetWidth + 2 * 4;
      if (rowWidth + cellWidth > containerWidth) {
        row++;
        rowWidth = 0;
      }
      if (row > MAX_ROWS) break;
      rowWidth += cellWidth;
      count++;
    }

    setVisibleCount(count);
    setMeasured(true);
  }

  onMount(() => {
    const observer = new ResizeObserver(recalculate);
    if (containerRef) observer.observe(containerRef);
    onCleanup(() => observer.disconnect());
  });

  const roles = () => props.member!.orderedRoles.toReversed();
  const visible = () => roles().slice(0, visibleCount());
  const overflow = () => Math.max(0, roles().length - visibleCount());

  return (
    <Show when={props.member?.roles.length}>
      <ProfileCard constraint={"fitContent"}>
        <Ripple />

        {/* Hidden full render used for measurement only */}
        <MeasureDiv ref={measureRef}>
          <For each={roles()}>
            {(role) => (
              <RoleCell>
                <RoleIcon />
                <Role>{role.name}</Role>
              </RoleCell>
            )}
          </For>
        </MeasureDiv>

        <RolesDiv
          ref={containerRef}
          style={{ visibility: measured() ? "visible" : "hidden" }}
        >
          <For each={showAllRoles() ? roles() : visible()}>
            {(role) => (
              <RoleCell>
                <RoleIcon
                  style={{
                    background:
                      role.colour ?? "var(--md-sys-color-outline-variant)",
                  }}
                />
                <Role>{role.name}</Role>
              </RoleCell>
            )}
          </For>
          <Show when={overflow() > 0}>
            <OverflowButton
              onClick={(e) => {
                e.stopPropagation();
                setShowAllRoles(!showAllRoles());
              }}
            >
              {" "}
              {showAllRoles() ? (
                <Tooltip placement={"top"} content={"Collapse Roles"}>
                  &lt
                </Tooltip>
              ) : (
                <Tooltip placement={"top"} content={"View All Roles"}>
                  +{overflow()}
                </Tooltip>
              )}
              {/*+{overflow()}*/}
            </OverflowButton>
          </Show>
        </RolesDiv>
      </ProfileCard>
    </Show>
  );
}

const MeasureDiv = styled("span", {
  base: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    visibility: "hidden",
    position: "absolute",
    pointerEvents: "none",
    // Match the width of the real container so wrapping behaves identically
    width: "100%",
  },
});

const RolesDiv = styled("span", {
  base: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
    width: "100%",
  },
});

const RoleCell = styled("span", {
  base: {
    borderRadius: "25px",
    outline: "1px solid var(--md-sys-color-outline-variant)",
    paddingX: "5px",
    paddingY: "2px",
    alignItems: "center",
    display: "inline-flex",
    gap: "var(--gap-sm)",
    margin: "var(--gap-sm)",
  },
});

const Role = styled("span", {
  base: {
    flexGrow: 1,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    ...typography.raw({ class: "label" }),
  },
});

const RoleIcon = styled("div", {
  base: {
    width: "12px",
    height: "12px",
    aspectRatio: "1/1",
    borderRadius: "100%",
  },
});

const OverflowButton = styled("button", {
  base: {
    borderRadius: "25px",
    outline: "1px solid var(--md-sys-color-outline-variant)",
    paddingX: "8px",
    paddingY: "2px",
    alignItems: "center",
    display: "inline-flex",
    margin: "var(--gap-sm)",
    cursor: "pointer",
    background: "transparent",
    ...typography.raw({ class: "label" }),
    _hover: {
      background: "var(--md-sys-color-outline-variant)",
    },
  },
});
