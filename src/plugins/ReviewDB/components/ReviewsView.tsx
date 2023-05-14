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

import { classes } from "../Utils/Utils";
const React = BdApi.React as typeof import("react");
const { useEffect } = React;

import { addReview, getReviews } from "../Utils/ReviewDBAPI";
import { authorize, showToast } from "../Utils/Utils";
import ReviewComponent from "./ReviewComponent";
import { Review } from "../entities/Review";
const { findModuleByProps } = BdApi;
const Classes = findModuleByProps("inputDefault", "editable");

export default function ReviewsView({ userId }: { userId: string; }) {
    //const { token } = Settings.plugins.ReviewDB;
    const token = ""
    //const [refetchCount, setRefetchCount] = React.useState(0);
    const [reviews, setReviews] = React.useState<Review[] | null>(null);
    //const username = UserStore.getUser(userId)?.username ?? "";

    useEffect(() => {
        getReviews(userId).then(res => {
            setReviews(res);
        });
    }, [userId]);


    if (!reviews) return null;

    function onKeyPress({ key, target }) {
        if (key === "Enter") {
            addReview({
                userid: userId,
                comment: (target as HTMLInputElement).value,
                star: -1
            }).then(res => {
                if (res?.success) {
                    (target as HTMLInputElement).value = ""; // clear the input
                    //dirtyRefetch();
                } else if (res?.message) {
                    showToast(res.message);
                }
            });
        }
    }

    return (
        <div className="vc-reviewdb-view">
            {
                /*
                            <Text
                tag="h2"
                variant="eyebrow"
                style={{
                    marginBottom: "8px",
                    color: "var(--header-primary)"
                }}
            >
                User Reviews
            </Text>
            */
            }

            {reviews?.map(review =>
                <ReviewComponent
                    key={review.id}
                    review={review}
                    //refetch={dirtyRefetch}
                />
            )}
            {/* reviews?.length === 0 && (
                <Forms.FormText style={{ paddingRight: "12px", paddingTop: "0px", paddingLeft: "0px", paddingBottom: "4px", fontWeight: "bold", fontStyle: "italic" }}>
                    Looks like nobody reviewed this user yet. You could be the first!
                </Forms.FormText>
             */}

            <textarea
                className={classes(Classes.inputDefault, "enter-comment")}
                onKeyDownCapture={e => {
                    if (e.key === "Enter") {
                        e.preventDefault(); // prevent newlines
                    }
                }}
                placeholder={
                    /*
                    token
                        ? (reviews?.some(r => r.sender.discordID === UserStore.getCurrentUser().id)
                            ? `Update review for @${username}`
                            : `Review @${username}`)
                        : "You need to authorize to review users!"
                    */
                   "Review him"
                }
                onKeyDown={onKeyPress}
                onClick={() => {
                    if (!token) {
                        showToast("Opening authorization window...");
                        authorize();
                    }
                }}

                style={{
                    marginTop: "6px",
                    resize: "none",
                    marginBottom: "12px",
                    overflow: "hidden",
                    background: "transparent",
                    border: "1px solid var(--profile-message-input-border-color)",
                    fontSize: "14px",
                }}
            />
        </div>
    );
}
