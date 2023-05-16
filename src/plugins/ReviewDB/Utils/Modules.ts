export const { Form, FormItem, FormDivider,Button, Switch, Text, TextInput,Select, FormTitle, Tooltip,FormText } = BdApi.findModuleByProps("FormItem")
export const { findModuleByProps, React } = BdApi;
export const Timestamp = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byStrings(".Messages.MESSAGE_EDITED_TIMESTAMP_A11Y_LABEL.format"))
export const moment = findModuleByProps("parseTwoDigitYear")
export const UserStore = BdApi.findModule(m=>m.constructor?.displayName === "UserStore");
export const buttonClasses = findModuleByProps("button", "wrapper", "disabled", "separator");
export const Alerts = findModuleByProps("show","close");
export const { SelectedChannelStore } = BdApi.findModule(m=>m.constructor?.displayName === "SelectedChannelStore");

//todo try to switch into .bulk function
