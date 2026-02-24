import { JSX } from "solid-js";

import { useQuery } from "@tanstack/solid-query";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { useModals } from "@revolt/modal";

import { Profile } from "../features";

/**
 * Base element for the card
 */
const base = cva({
  base: {
    padding: "0",

    color: "var(--md-sys-color-on-surface)",
    background: "var(--md-sys-color-surface-container-high)",
    boxShadow: "0 0 3px var(--md-sys-color-shadow)",

    width: "300px",
    height: "600px",

    borderRadius: "var(--borderRadius-sm)",
  },
});

/**
 * User Card
 */
export function UserCard(
  props: JSX.Directives["floating"]["userCard"] &
    object & { onClose: () => void },
) {
  const { openModal } = useModals();
  const query = useQuery(() => ({
    queryKey: ["profile", props.user.id],
    queryFn: () => props.user.fetchProfile(),
  }));

  function openFull() {
    openModal({ type: "user_profile", user: props.user });
    props.onClose();
  }

  return (
    <div
      use:invisibleScrollable={{ class: base() }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
      }}
    >
      <Profile.Banner
        width={2}
        user={props.user}
        member={props.member}
        bannerUrl={query.data?.animatedBannerURL}
        onClick={openFull}
      />
      <StatusField class={"flex-auto"}>
        <Profile.Status user={props.user} />
        <Profile.Actions user={props.user} member={props.member} width={2} />
      </StatusField>

      <Marquee>
        {/*Marquee these items*/}
        <Profile.Roles member={props.member} />
        <Profile.Badges user={props.user} />
      </Marquee>
      <Grid>
        <Profile.Joined user={props.user} member={props.member} />
        <Profile.Bio content={query.data?.content} onClick={openFull} />
      </Grid>
    </div>
  );
}

const Marquee = styled("div",{
  base:{
    display: "inline-flex",
    flexDirection: "column",
    padding: "var(--gap-sm)",
    background: "var(--md-sys-color-surface-container-low)",
  },
});

const StatusField = styled("div",{
  base:{
    display: "flex",
    padding: "var(--gap-sm)",
    background: "var(--md-sys-color-surface-container-low)",
  },
});

const Grid = styled("div", {
  base: {
    display: "grid",
    gap: "var(--gap-md)",
    padding: "var(--gap-md)",
    gridTemplateColumns: "90%",
  },
});
