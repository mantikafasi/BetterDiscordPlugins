const { findModuleByProps, openModal } = BdApi;
import { Review } from "../entities/Review";
import { UserType } from "../entities/User";
import { SelectedChannelStore } from "./Modules";
const fetchUser = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byStrings(".USER(", "getUser"), { searchExports: true });

export async function openUserProfileModal(userId: string) {
    const { FluxDispatcher } = findModuleByProps("dispatch","subscribe");

    await fetchUser(userId);

    await FluxDispatcher.dispatch({
        type: "USER_PROFILE_MODAL_OPEN",
        userId,
        channelId: SelectedChannelStore.getChannelId(),
        analyticsLocation: { section: "Profile Popout" }
    });

}

export function authorize(callback?: any) {
    const openModal = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byStrings("onCloseRequest"), { searchExports: true });

    const { OAuth2AuthorizeModal } = findModuleByProps("OAuth2AuthorizeModal");

    openModal((props: any) =>
        <OAuth2AuthorizeModal
            {...props}
            scopes={["identify"]}
            responseType="code"
            redirectUri="https://manti.vendicated.dev/api/reviewdb/auth"
            permissions={0n}
            clientId="915703782174752809"
            cancelCompletesFlow={false}
            callback={async (u: string) => {
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
            }}
        />
    );
}

export function getSetting(name: string, defaultValue: any) {
    return BdApi.getData("ReviewDB", name) ?? defaultValue;
}

export function setSetting(name: string, value: any) {
    BdApi.saveData("ReviewDB", name, value);
}

export function showToast(text: string) {
    BdApi.showToast(text)
}

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export function canDeleteReview(review: Review, userId: string) {
    if (review.sender.discordID === userId || getSetting("user",{})?.type === UserType.Admin) return true;
    return false;
}

export function classes(...classes: string[]) {
    return classes.join(" ");
}
