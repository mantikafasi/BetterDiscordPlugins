import ReviewsView from "./components/ReviewsView";
import { ChatBarComponent } from "./modal";
import styles from "~fileContent/styles.css";

const { React } = BdApi;

const UserProfile = BdApi.Webpack.getModule(m=>m.Z?.toString().includes("popularApplicationCommandIds"));

function start() {
    BdApi.DOM.addStyle("send-timestamps", styles);

    const unpatchOuter = BdApi.Patcher.after("reviewdb-user-profiles", UserProfile, "Z", (_this, _args, res) => {
        res.props.children.splice(res.props.children.length, 0, React.createElement(ReviewsView, { userId: _args[0].user.id })) ;
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
