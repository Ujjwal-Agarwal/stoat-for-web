import { For, Show } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { ServerMember } from "stoat.js";
import { styled } from "styled-system/jsx";

import { useModals } from "@revolt/modal";

import { Ripple, Text, typography } from "../../design";
import { dismissFloatingElements } from "../../floating";
import { Row } from "../../layout";

import { ProfileCard } from "./ProfileCard";

export function ProfileRoles(props: { member?: ServerMember }) {
  const { openModal } = useModals();

  function openRoles() {
    openModal({ type: "user_profile_roles", member: props.member! });
    dismissFloatingElements();
  }

  return (
    <Show when={props.member?.roles.length}>
      <ProfileCard isLink onClick={openRoles} constraint={"half"}>
        <Ripple />

        {/*<Text class="title" size="large">*/}
        {/*  <Trans>Roles</Trans>*/}
        {/*</Text>*/}
        <RolesDiv>
          <For each={props.member!.orderedRoles.toReversed()}>
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
              // <Row align></Row>
            )}
          </For>
        </RolesDiv>
      </ProfileCard>
    </Show>
  );
}

const RolesDiv = styled("span",{
  base:{
    display: "inline-flex",
    flexDirection: "row",
    overflow: "scroll",
  },
});

const RoleCell = styled("span", {
  base: {
    // background: "var(--md-sys-color-outline-variant)",
    borderRadius: "25px",
    outline: "1px solid var(--md-sys-color-outline-variant)",
    paddingX: "5px",
    paddingY: "2px",
    alignItems: "center",
    display: "inline-flex",
    // flexDirection: "row",
    // flexGrow: "initial",
    // flexWrap: "initial",
    gap: "var(--gap-sm)",
    justifyContent: "initial",
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