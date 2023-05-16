/**
 * @name ReviewDB
 * @author mantikafasi
 * @authorId 287555395151593473
 * @description Allows you to review other users
 * @version 1.0.0
 */


"use strict";

// src/plugins/ReviewDB/Utils/Utils.tsx
var { findModuleByProps, openModal } = BdApi;
var fetchUser = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byStrings(".USER(", "getUser"), { searchExports: true });
var { SelectedChannelStore } = BdApi.findModule((m) => m.constructor?.displayName === "SelectedChannelStore");
async function openUserProfileModal(userId) {
  const { FluxDispatcher } = findModuleByProps("dispatch", "subscribe");
  await fetchUser(userId);
  await FluxDispatcher.dispatch({
    type: "USER_PROFILE_MODAL_OPEN",
    userId,
    channelId: SelectedChannelStore.getChannelId(),
    analyticsLocation: { section: "Profile Popout" }
  });
}
function authorize(callback) {
  const openModal3 = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byStrings("onCloseRequest"), { searchExports: true });
  const { OAuth2AuthorizeModal } = findModuleByProps("OAuth2AuthorizeModal");
  openModal3(
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
            url.searchParams.append("clientMod", "betterdiscord");
            const res = await fetch(url, {
              headers: new Headers({ Accept: "application/json" })
            });
            const { token, success } = await res.json();
            if (success) {
              BdApi.saveData("ReviewDB", "token", token);
              showToast("Successfully logged in!");
              callback?.();
            } else if (res.status === 1) {
              showToast("An Error occurred while logging in.");
            }
          } catch (e) {
            console.error("ReviewDB: Failed to authorize", e);
          }
        }
      }
    )
  );
}
function getSetting(name, defaultValue) {
  return BdApi.getData("ReviewDB", name) ?? defaultValue;
}
function setSetting(name, value) {
  BdApi.saveData("ReviewDB", name, value);
}
function showToast(text) {
  BdApi.showToast(text);
}
function canDeleteReview(review, userId) {
  if (review.sender.discordID === userId || getSetting("user", {})?.type === 1 /* Admin */)
    return true;
  return false;
}
function classes(...classes2) {
  return classes2.join(" ");
}

// src/plugins/ReviewDB/Utils/ReviewDBAPI.ts
var API_URL = "https://manti.vendicated.dev";
var getToken = () => getSetting("token", "");
var WarningFlag = 2;
async function getReviews(id) {
  var flags = 0;
  if (!getSetting("showWarning", true))
    flags |= WarningFlag;
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
function deleteReview(id) {
  return fetch(API_URL + `/api/reviewdb/users/${id}/reviews`, {
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json"
    }),
    body: JSON.stringify({
      token: getToken(),
      reviewid: id
    })
  }).then((r) => r.json());
}
async function reportReview(id) {
  const res = await fetch(API_URL + "/api/reviewdb/reports", {
    method: "PUT",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json"
    }),
    body: JSON.stringify({
      reviewid: id,
      token: getToken()
    })
  }).then((r) => r.json());
  showToast(await res.message);
}

// src/plugins/ReviewDB/components/MessageButton.tsx
var { findModuleByProps: findModuleByProps2 } = BdApi;
var { button, dangerous } = findModuleByProps2("button", "wrapper", "disabled", "separator");
function MessageButton(props) {
  return props.type === "delete" ? /* @__PURE__ */ BdApi.React.createElement("div", { className: classes(button, dangerous), "aria-label": "Delete Review", onClick: props.callback }, /* @__PURE__ */ BdApi.React.createElement("svg", { "aria-hidden": "false", width: "16", height: "16", viewBox: "0 0 20 20" }, /* @__PURE__ */ BdApi.React.createElement("path", { fill: "currentColor", d: "M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z" }), /* @__PURE__ */ BdApi.React.createElement("path", { fill: "currentColor", d: "M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z" }))) : /* @__PURE__ */ BdApi.React.createElement("div", { className: button, "aria-label": "Report Review", onClick: () => props.callback() }, /* @__PURE__ */ BdApi.React.createElement("svg", { "aria-hidden": "false", width: "16", height: "16", viewBox: "0 0 20 20" }, /* @__PURE__ */ BdApi.React.createElement("path", { fill: "currentColor", d: "M20,6.002H14V3.002C14,2.45 13.553,2.002 13,2.002H4C3.447,2.002 3,2.45 3,3.002V22.002H5V14.002H10.586L8.293,16.295C8.007,16.581 7.922,17.011 8.076,17.385C8.23,17.759 8.596,18.002 9,18.002H20C20.553,18.002 21,17.554 21,17.002V7.002C21,6.45 20.553,6.002 20,6.002Z" })));
}

// src/plugins/ReviewDB/components/SelectComponent.tsx
var React = BdApi.React;
function SelectComponent({ text, setting, defaultValue = true }) {
  const [state, setState] = React.useState(getSetting(setting, defaultValue));
  function handleChange(value) {
    setState(value);
    setSetting(setting, value);
  }
  return /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement(FormTitle, { style: {
    marginTop: 4,
    marginBottom: 4
  } }, text), /* @__PURE__ */ BdApi.React.createElement(
    Select,
    {
      options: [
        { label: "Enabled", value: true },
        { label: "Disabled", value: false }
      ],
      placeholder: state ? "Enabled" : "Disabled",
      maxVisibleItems: 3,
      closeOnSelect: true,
      isSelected: (v) => v === state,
      serialize: (v) => String(v),
      select: handleChange
    }
  ));
}

// src/plugins/ReviewDB/components/SettingsPage.tsx
var { useState } = BdApi.React;
var { Form, FormItem, FormDivider, Button, Switch, Text, TextInput, Select, FormTitle, Tooltip } = BdApi.findModuleByProps("FormItem");
function ReviewDBSettings() {
  const [oauth2token, setOauth2token] = useState(getSetting("token", ""));
  return /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement(SelectComponent, { text: "Notify New Reviews", setting: "notifyNewReviews" }), /* @__PURE__ */ BdApi.React.createElement(SelectComponent, { text: "Show Warning On Reviews", setting: "showWarning", defaultValue: true }), /* @__PURE__ */ BdApi.React.createElement(FormTitle, { style: { marginBottom: 4, marginLeft: 2, marginTop: 4 } }, "OAUTH2 Token"), /* @__PURE__ */ BdApi.React.createElement(TextInput, { style: { marginBottom: 8 }, value: oauth2token, placeholder: "Login to get token", onChange: (val) => {
    setSetting("token", val);
    setOauth2token(val);
    return true;
  } }), /* @__PURE__ */ BdApi.React.createElement(Button, { onClick: () => authorize(() => setOauth2token(getSetting("token", ""))) }, "Login"), /* @__PURE__ */ BdApi.React.createElement(FormDivider, { style: { marginTop: 12 } }), /* @__PURE__ */ BdApi.React.createElement(FormTitle, { style: { marginTop: 8, marginBottom: 4 } }, "If Login Button is not working"), /* @__PURE__ */ BdApi.React.createElement(Button, { onClick: () => window.open("https://discord.com/api/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2FURauth&response_type=code&scope=identify") }, "Get OAUTH2 Token"), /* @__PURE__ */ BdApi.React.createElement("div", { style: {} }, /* @__PURE__ */ BdApi.React.createElement(Button, { style: {
    display: "inline",
    marginTop: 8,
    marginRight: 8
  }, onClick: () => window.open("https://reviewdb.mantikafasi.dev") }, "ReviewDB Website"), /* @__PURE__ */ BdApi.React.createElement(Button, { style: {
    display: "inline"
  }, onClick: () => window.open("https://discord.gg/eWPBSbvznt") }, "ReviewDB Support Server")));
}

// src/plugins/ReviewDB/components/ReviewBadge.tsx
function ReviewBadge(badge) {
  return /* @__PURE__ */ BdApi.React.createElement(
    Tooltip,
    {
      text: badge.name
    },
    ({ onMouseEnter, onMouseLeave }) => /* @__PURE__ */ BdApi.React.createElement(
      "img",
      {
        width: "24px",
        height: "24px",
        onMouseEnter,
        onMouseLeave,
        src: badge.icon,
        alt: badge.description,
        style: { verticalAlign: "middle", marginLeft: "4px" },
        onClick: () => window.open(
          badge.redirectURL
        )
      }
    )
  );
}

// src/plugins/ReviewDB/components/ReviewComponent.tsx
var React2 = BdApi.React;
var { findModuleByProps: findModuleByProps3 } = BdApi;
var { cozyMessage, buttons, message, groupStart } = findModuleByProps3("cozyMessage");
var { container, isHeader } = findModuleByProps3("container", "isHeader");
var { avatar, clickable, username, messageContent, wrapper, cozy } = findModuleByProps3("avatar", "zalgo");
var buttonClasses = findModuleByProps3("button", "wrapper", "selected");
var Alerts = BdApi.findModuleByProps("show", "close");
var Timestamp = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byStrings(".Messages.MESSAGE_EDITED_TIMESTAMP_A11Y_LABEL.format"));
var moment = BdApi.findModuleByProps("parseTwoDigitYear");
var UserStore = BdApi.findModule((m) => m.constructor?.displayName === "UserStore");
function ReviewsView({ review, refetch }) {
  const dateFormat = new Intl.DateTimeFormat();
  function openModal3() {
    openUserProfileModal(review?.sender.discordID);
  }
  function delReview() {
    Alerts.show({
      title: "Are you sure?",
      body: "Do you really want to delete this review?",
      confirmText: "Delete",
      cancelText: "Nevermind",
      onConfirm: () => {
        deleteReview(review.id).then((res) => {
          if (res.success) {
            refetch();
          }
          showToast(res.message);
        });
      }
    });
  }
  function reportRev() {
    Alerts.show({
      title: "Are you sure?",
      body: "Do you really you want to report this review?",
      confirmText: "Report",
      cancelText: "Nevermind",
      onConfirm: () => reportReview(review.id)
    });
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
  ), review.sender.badges.map((badge) => /* @__PURE__ */ BdApi.React.createElement(ReviewBadge, { ...badge })), !getSetting("hideTimestamps", false) && /* @__PURE__ */ BdApi.React.createElement(Timestamp, { timestamp: moment(review.timestamp * 1e3) }, dateFormat.format(review.timestamp * 1e3)), /* @__PURE__ */ BdApi.React.createElement(
    "p",
    {
      className: classes(messageContent),
      style: { fontSize: 15, marginTop: 4, color: "var(--text-normal)" }
    },
    review.comment
  ), /* @__PURE__ */ BdApi.React.createElement("div", { className: classes(container, isHeader, buttons), style: {
    padding: "0px"
  } }, /* @__PURE__ */ BdApi.React.createElement("div", { className: buttonClasses.wrapper }, /* @__PURE__ */ BdApi.React.createElement(MessageButton, { type: "report", callback: reportRev }), canDeleteReview(review, UserStore.getCurrentUser().id) && /* @__PURE__ */ BdApi.React.createElement(MessageButton, { type: "delete", callback: delReview })))));
}

// src/plugins/ReviewDB/components/ReviewsView.tsx
var React3 = BdApi.React;
var { useEffect } = React3;
var { findModuleByProps: findModuleByProps4 } = BdApi;
var Classes = findModuleByProps4("inputDefault", "editable");
function ReviewsView2({ userId }) {
  const token = "";
  const [reviews, setReviews] = React3.useState(null);
  function fetchReviews() {
    getReviews(userId).then((res) => {
      setReviews(res);
    });
  }
  useEffect(() => {
    fetchReviews();
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
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "vc-reviewdb-view" }, /* @__PURE__ */ BdApi.React.createElement(
    Text,
    {
      tag: "h2",
      variant: "eyebrow",
      style: {
        marginBottom: "8px",
        color: "var(--header-primary)"
      }
    },
    "User Reviews"
  ), reviews?.map(
    (review) => /* @__PURE__ */ BdApi.React.createElement(
      ReviewsView,
      {
        refetch: fetchReviews,
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
var { useState: useState2, useMemo } = BdApi.React;
var {
  Button: Button2,
  ModalRoot,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  FormTitle: FormTitle2,
  FormText,
  Tooltip: Tooltip2,
  Select: Select2,
  openModal: openModal2
} = BdApi.Webpack.getModule((m) => m.ModalContent);
var Parser = BdApi.Webpack.getModule((m) => m.parseTopic);
var PreloadedUserSettings = BdApi.Webpack.getModule((m) => m.ProtoClass?.typeName.endsWith("PreloadedUserSettings"), {
  searchExports: true
});
var ButtonWrapperClasses = BdApi.Webpack.getModule((m) => m.buttonWrapper && m.buttonContent);
var ComponentDispatch = BdApi.Webpack.getModule((m) => m.emitter?._events?.INSERT_TEXT, { searchExports: true });

// src/plugins/ReviewDB/index.jsx
var { React: React4 } = BdApi;
var UserProfile = BdApi.Webpack.getModule((m) => m.Z?.toString().includes("popularApplicationCommandIds"));
function start() {
  BdApi.Patcher.after("reviewdb-user-profiles", UserProfile, "Z", (_this, _args, res) => {
    console.log(res);
    let children = res.props.children;
    let children2 = children[children.length - 1].props.children;
    children2[children2.length - 1].props.children.push(React4.createElement(ReviewsView2, { userId: _args[0].user.id }));
  });
}
function stop() {
  BdApi.Patcher.unpatchAll("reviewdb-user-profiles");
}
function getSettingsPanel() {
  return /* @__PURE__ */ BdApi.React.createElement(ReviewDBSettings, null);
}
module.exports = () => ({
  start,
  stop,
  getSettingsPanel
});
