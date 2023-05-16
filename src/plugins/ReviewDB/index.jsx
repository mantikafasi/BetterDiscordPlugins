import ReviewsView from "./components/ReviewsView";
import { ChatBarComponent } from "./modal";
import styles from "~fileContent/styles.css";
import ReviewDBSettings from "./components/SettingsPage";

const { React } = BdApi;

const UserProfile = BdApi.Webpack.getModule(m=>m.Z?.toString().includes("popularApplicationCommandIds"));

function start() {
    BdApi.DOM.addStyle("send-timestamps", styles);

    BdApi.Patcher.after("reviewdb-user-profiles", UserProfile, "Z", (_this, _args, res) => {
        console.log(res);
        let children = res.props.children;
        let children2 = children[children.length - 1].props.children;

        children2[children2.length - 1].props.children.push(React.createElement(ReviewsView, { userId: _args[0].user.id })) ;
    });
}

function stop() {
    BdApi.DOM.removeStyle("send-timestamps");
    BdApi.Patcher.unpatchAll("reviewdb-user-profiles");
}

function getSettingsPanel() {
    return <ReviewDBSettings/>
}

module.exports = () => ({
    start,
    stop,
    getSettingsPanel,
});
