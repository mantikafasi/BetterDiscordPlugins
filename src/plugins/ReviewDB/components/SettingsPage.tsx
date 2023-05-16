
const { useState } = BdApi.React;
import { authorize, getSetting, setSetting } from "../Utils/Utils";
import SelectComponent from "./SelectComponent";

export const { Form, FormItem, FormDivider,Button, Switch, Text, TextInput,Select, FormTitle, Tooltip } = BdApi.findModuleByProps("FormItem")
export default function ReviewDBSettings(): JSX.Element {
    const [oauth2token, setOauth2token] = useState(getSetting("token", ""))
    return (<>

        <SelectComponent text="Notify New Reviews" setting={"notifyNewReviews"} />

        <SelectComponent text="Show Warning On Reviews" setting={"showWarning"} defaultValue = {true} />
        <FormTitle style={{ marginBottom: 4, marginLeft: 2, marginTop: 4 }}>OAUTH2 Token</FormTitle>
        <TextInput style={{ marginBottom: 8 }} value={oauth2token} placeholder="Login to get token" onChange={(val) => {
            setSetting("token", val)
            setOauth2token(val)
            return true;
        }} />

        <Button onClick={() => authorize(() => setOauth2token(getSetting("token", "")))}>Login</Button>
        <FormDivider style={{ marginTop: 12 }} />

        <FormTitle style={{ marginTop: 8, marginBottom: 4 }}>If Login Button is not working</FormTitle>
        <Button onClick={() =>
            window.open("https://discord.com/api/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2FURauth&response_type=code&scope=identify")
        }>Get OAUTH2 Token</Button>

        <div style = {{

        }}>
        <Button style = {{
            display: "inline",
            marginTop: 8,
            marginRight: 8,
        }} onClick = {
            () => window.open("https://reviewdb.mantikafasi.dev")
        }>
            ReviewDB Website
        </Button>

        <Button style = {{
            display: "inline",

        }} onClick = {
            () => window.open("https://discord.gg/eWPBSbvznt")
        }>
            ReviewDB Support Server
        </Button>

        </div>
    </>)
}
