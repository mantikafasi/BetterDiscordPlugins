/**
 * @name ReviewDB
 * @author mantikafasi
 * @authorId 287555395151593473
 * @description Allows you to review other users
 * @version 1.0.0
 */

"use strict";

// src/plugins/ReviewDB/Utils/Utils.tsx
var { findByProps, openModal } = BdApi;
async function openUserProfileModal(userId) {
}
function authorize(callback) {
  const { OAuth2AuthorizeModal } = findByProps("OAuth2AuthorizeModal");
  openModal(
    (props) => /* @__PURE__ */ BdApi.React.createElement(
      OAuth2AuthorizeModal,
      {
        ...props,
        scopes: ["identify"],
        responseType: "code",
        redirectUri: "https://manti.vendicated.dev/api/reviewdb/auth",
        permissions: 0n,
        clientId: "915703782174752809",
        cancelCompletesFlow: false,
        callback: async (u) => {
          try {
            const url = new URL(u);
            url.searchParams.append("clientMod", "vencord");
            const res = await fetch(url, {
              headers: new Headers({ Accept: "application/json" })
            });
            const { token, success } = await res.json();
            if (success) {
              showToast("Successfully logged in!");
              callback?.();
            } else if (res.status === 1) {
              showToast("An Error occurred while logging in.");
            }
          } catch (e) {
          }
        }
      }
    )
  );
}
function showToast(text) {
  BdApi.showToast(text);
}
function classes(...classes2) {
  return classes2.join(" ");
}

// src/plugins/ReviewDB/Utils/ReviewDBAPI.ts
var API_URL = "https://manti.vendicated.dev";
var getToken = () => "guh";
async function getReviews(id) {
  var flags = 0;
  const req = await fetch(API_URL + `/api/reviewdb/users/${id}/reviews?flags=${flags}`);
  const res = req.status === 200 ? await req.json() : { success: false, message: "An Error occured while fetching reviews. Please try again later.", reviews: [], updated: false };
  if (!res.success) {
    showToast(res.message);
    return [
      {
        id: 0,
        comment: "An Error occured while fetching reviews. Please try again later.",
        star: 0,
        timestamp: 0,
        sender: {
          id: 0,
          username: "Error",
          profilePhoto: "https://cdn.discordapp.com/attachments/1045394533384462377/1084900598035513447/646808599204593683.png?size=128",
          discordID: "0",
          badges: []
        }
      }
    ];
  }
  return res.reviews;
}
async function addReview(review) {
  review.token = getToken();
  if (!review.token) {
    showToast("Please authorize to add a review.");
    authorize();
    return null;
  }
  return fetch(API_URL + `/api/reviewdb/users/${review.userid}/reviews`, {
    method: "PUT",
    body: JSON.stringify(review),
    headers: {
      "Content-Type": "application/json"
    }
  }).then((r) => r.json()).then((res) => {
    showToast(res.message);
    return res ?? null;
  });
}

// src/plugins/ReviewDB/components/MessageButton.tsx
var { findModuleByProps } = BdApi;
var { button, dangerous } = findModuleByProps("button", "wrapper", "disabled", "separator");
function MessageButton(props) {
  return props.type === "delete" ? /* @__PURE__ */ BdApi.React.createElement("div", { className: classes(button, dangerous), "aria-label": "Delete Review", onClick: props.callback }, /* @__PURE__ */ BdApi.React.createElement("svg", { "aria-hidden": "false", width: "16", height: "16", viewBox: "0 0 20 20" }, /* @__PURE__ */ BdApi.React.createElement("path", { fill: "currentColor", d: "M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z" }), /* @__PURE__ */ BdApi.React.createElement("path", { fill: "currentColor", d: "M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z" }))) : /* @__PURE__ */ BdApi.React.createElement("div", { className: button, "aria-label": "Report Review", onClick: () => props.callback() }, /* @__PURE__ */ BdApi.React.createElement("svg", { "aria-hidden": "false", width: "16", height: "16", viewBox: "0 0 20 20" }, /* @__PURE__ */ BdApi.React.createElement("path", { fill: "currentColor", d: "M20,6.002H14V3.002C14,2.45 13.553,2.002 13,2.002H4C3.447,2.002 3,2.45 3,3.002V22.002H5V14.002H10.586L8.293,16.295C8.007,16.581 7.922,17.011 8.076,17.385C8.23,17.759 8.596,18.002 9,18.002H20C20.553,18.002 21,17.554 21,17.002V7.002C21,6.45 20.553,6.002 20,6.002Z" })));
}

// src/plugins/ReviewDB/components/ReviewBadge.tsx
function ReviewBadge(badge) {
  return /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, "guh");
}

// src/plugins/ReviewDB/components/ReviewComponent.tsx
var React = BdApi.React;
var { findModuleByProps: findModuleByProps2 } = BdApi;
function ReviewsView({ review }) {
  const { cozyMessage, buttons, message, groupStart } = findModuleByProps2("cozyMessage");
  const { container, isHeader } = findModuleByProps2("container", "isHeader");
  const { avatar, clickable, username, messageContent, wrapper, cozy } = findModuleByProps2("avatar", "zalgo");
  const buttonClasses = findModuleByProps2("button", "wrapper", "selected");
  const dateFormat = new Intl.DateTimeFormat();
  function openModal3() {
    openUserProfileModal(review?.sender.discordID);
  }
  function delReview() {
  }
  function reportRev() {
  }
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: classes(cozyMessage, wrapper, message, groupStart, cozy, "user-review"), style: {
    marginLeft: "0px",
    paddingLeft: "52px",
    paddingRight: "16px"
  } }, /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement(
    "img",
    {
      className: classes(avatar, clickable),
      onClick: openModal3,
      src: review.sender.profilePhoto || "/assets/1f0bfc0865d324c2587920a7d80c609b.png?size=128",
      style: { left: "0px" }
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    "span",
    {
      className: classes(clickable, username),
      style: { color: "var(--channels-default)", fontSize: "14px" },
      onClick: () => openModal3()
    },
    review.sender.username
  ), review.sender.badges.map((badge) => /* @__PURE__ */ BdApi.React.createElement(ReviewBadge, { ...badge })), /* @__PURE__ */ BdApi.React.createElement(
    "p",
    {
      className: classes(messageContent),
      style: { fontSize: 15, marginTop: 4, color: "var(--text-normal)" }
    },
    review.comment
  ), /* @__PURE__ */ BdApi.React.createElement("div", { className: classes(container, isHeader, buttons), style: {
    padding: "0px"
  } }, /* @__PURE__ */ BdApi.React.createElement(
    "div",
    { className: buttonClasses.wrapper },
    /* @__PURE__ */ BdApi.React.createElement(MessageButton, { type: "report", callback: reportRev }),
    //canDeleteReview(review, UserStore.getCurrentUser().id) &&
    /* @__PURE__ */ BdApi.React.createElement(MessageButton, { type: "delete", callback: delReview })
  ))));
}

// src/plugins/ReviewDB/components/ReviewsView.tsx
var React2 = BdApi.React;
var { useEffect } = React2;
var { findModuleByProps: findModuleByProps3 } = BdApi;
var Classes = findModuleByProps3("inputDefault", "editable");
function ReviewsView2({ userId }) {
  const token = "";
  const [reviews, setReviews] = React2.useState(null);
  useEffect(() => {
    getReviews(userId).then((res) => {
      setReviews(res);
    });
  }, [userId]);
  if (!reviews)
    return null;
  function onKeyPress({ key, target }) {
    if (key === "Enter") {
      addReview({
        userid: userId,
        comment: target.value,
        star: -1
      }).then((res) => {
        if (res?.success) {
          target.value = "";
        } else if (res?.message) {
          showToast(res.message);
        }
      });
    }
  }
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "vc-reviewdb-view" }, reviews?.map(
    (review) => /* @__PURE__ */ BdApi.React.createElement(
      ReviewsView,
      {
        key: review.id,
        review
      }
    )
  ), /* @__PURE__ */ BdApi.React.createElement(
    "textarea",
    {
      className: classes(Classes.inputDefault, "enter-comment"),
      onKeyDownCapture: (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      },
      placeholder: (
        /*
        token
            ? (reviews?.some(r => r.sender.discordID === UserStore.getCurrentUser().id)
                ? `Update review for @${username}`
                : `Review @${username}`)
            : "You need to authorize to review users!"
        */
        "Review him"
      ),
      onKeyDown: onKeyPress,
      onClick: () => {
        if (!token) {
          showToast("Opening authorization window...");
          authorize();
        }
      },
      style: {
        marginTop: "6px",
        resize: "none",
        marginBottom: "12px",
        overflow: "hidden",
        background: "transparent",
        border: "1px solid var(--profile-message-input-border-color)",
        fontSize: "14px"
      }
    }
  ));
}

// src/plugins/ReviewDB/modal.tsx
var { useState, useMemo } = BdApi.React;
var {
  Button,
  ModalRoot,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  FormTitle,
  FormText,
  Tooltip,
  Select,
  openModal: openModal2
} = BdApi.Webpack.getModule((m) => m.ModalContent);
var Parser = BdApi.Webpack.getModule((m) => m.parseTopic);
var PreloadedUserSettings = BdApi.Webpack.getModule((m) => m.ProtoClass?.typeName.endsWith("PreloadedUserSettings"), {
  searchExports: true
});
var ButtonWrapperClasses = BdApi.Webpack.getModule((m) => m.buttonWrapper && m.buttonContent);
var ComponentDispatch = BdApi.Webpack.getModule((m) => m.emitter?._events?.INSERT_TEXT, { searchExports: true });

// include-file:~fileContent/styles.css
var styles_default = `.vbd-st-modal-content input {
    background-color: var(--input-background);
    color: var(--text-normal);
    width: 95%;
    padding: 8px 8px 8px 12px;
    margin: 1em 0;
    outline: none;
    border: 1px solid var(--input-background);
    border-radius: 4px;
    font-weight: 500;
    font-style: inherit;
    font-size: 100%;
}

.vbd-st-format-label,
.vbd-st-format-label span {
    background-color: transparent;
}

.vbd-st-modal-content [class|="select"] {
    margin-bottom: 1em;
}

.vbd-st-modal-content [class|="select"] span {
    background-color: var(--input-background);
}

.vbd-st-modal-header {
    justify-content: space-between;
    align-content: center;
}

.vbd-st-modal-header h1 {
    margin: 0;
}

.vbd-st-modal-header button {
    padding: 0;
}

.vbd-st-preview-text {
    margin-bottom: 1em;
}

.vbd-st-button {
    padding: 0 6px;
}

.vbd-st-button svg {
    transform: scale(1.1) translateY(1px);
}
`;

// src/plugins/ReviewDB/index.jsx
var { React: React3 } = BdApi;
var UserProfile = BdApi.Webpack.getModule((m) => m.Z?.toString().includes("popularApplicationCommandIds"));
function start() {
  BdApi.DOM.addStyle("send-timestamps", styles_default);
  const unpatchOuter = BdApi.Patcher.after("reviewdb-user-profiles", UserProfile, "Z", (_this, _args, res) => {
    res.props.children.splice(res.props.children.length, 0, React3.createElement(ReviewsView2, { userId: _args[0].user.id }));
  });
}
function stop() {
  BdApi.DOM.removeStyle("send-timestamps");
  BdApi.Patcher.unpatchAll("reviewdb-user-profiles");
}
module.exports = () => ({
  start,
  stop
});
