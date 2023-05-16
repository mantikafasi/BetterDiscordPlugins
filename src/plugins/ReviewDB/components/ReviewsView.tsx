import { classes } from "../Utils/Utils";
const React = BdApi.React as typeof import("react");
const { useEffect } = React;

import { addReview, getReviews } from "../Utils/ReviewDBAPI";
import { authorize, showToast } from "../Utils/Utils";
import ReviewComponent from "./ReviewComponent";
import { Review } from "../entities/Review";
const { findModuleByProps } = BdApi;
const Classes = findModuleByProps("inputDefault", "editable");
import { Text, UserStore } from "../Utils/Modules";

export default function ReviewsView({ userId, username }: { userId: string; username: string; }) {
    //const { token } = Settings.plugins.ReviewDB;
    const token = ""
    //const [refetchCount, setRefetchCount] = React.useState(0);
    const [reviews, setReviews] = React.useState<Review[] | null>(null);
    //const username = UserStore.getUser(userId)?.username ?? "";

    function fetchReviews() {
        getReviews(userId).then(res => {
            setReviews(res);
        });
    }

    useEffect(() => {
        fetchReviews();
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

            }

            {reviews?.map(review =>
                <ReviewComponent
                    refetch={fetchReviews}
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
                    token
                        ? (reviews?.some(r => r.sender.discordID === UserStore.getCurrentUser().id)
                            ? `Update review for @${username}`
                            : `Review @${username}`)
                        : "You need to authorize to review users!"

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
