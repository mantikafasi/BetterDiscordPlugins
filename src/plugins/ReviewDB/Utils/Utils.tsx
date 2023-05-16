/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const { findModuleByProps, openModal } = BdApi;
import { Review } from "../entities/Review";
import { UserType } from "../entities/User";
const fetchUser = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byStrings(".USER(", "getUser"), { searchExports: true });
const { SelectedChannelStore } = BdApi.findModule(m=>m.constructor?.displayName === "SelectedChannelStore");

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
                    url.searchParams.append("clientMod", "vencord");
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
