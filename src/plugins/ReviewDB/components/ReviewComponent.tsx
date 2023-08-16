import { Review } from "../entities/Review";
import { Alerts, buttonClasses, findModuleByProps, moment, Timestamp, UserStore } from "../Utils/Modules";
import { deleteReview, reportReview } from "../Utils/ReviewDBAPI";
import { canDeleteReview, openUserProfileModal, showToast, classes, getSetting } from "../Utils/Utils";
import { MessageButton } from "./MessageButton";
import ReviewBadge from "./ReviewBadge";
const React = BdApi.React as typeof import("react");
const { cozyMessage, buttons, message, buttonInner, groupStart } = findModuleByProps("cozyMessage");
const { container, isHeader } = findModuleByProps("container", "isHeader");
const { avatar, clickable, username, messageContent, wrapper, cozy } = findModuleByProps("avatar", "zalgo");

export default function ReviewsView({ review, refetch }: { review: Review; refetch: () => void }) {
    const dateFormat = new Intl.DateTimeFormat();

    function openModal() {
        openUserProfileModal(review?.sender.discordID);
    }

    function delReview() {
        Alerts.show({
            title: "Are you sure?",
            body: "Do you really want to delete this review?",
            confirmText: "Delete",
            cancelText: "Nevermind",
            onConfirm: () => {
                deleteReview(review.id).then(res => {
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

    return (
        <div
            className={classes(cozyMessage, wrapper, message, groupStart, cozy, "user-review")}
            style={{
                marginLeft: "0px",
                paddingLeft: "52px",
                paddingRight: "16px"
            }}
        >
            <div>
                <img
                    className={classes(avatar, clickable)}
                    onClick={openModal}
                    src={review.sender.profilePhoto || "/assets/1f0bfc0865d324c2587920a7d80c609b.png?size=128"}
                    style={{ left: "0px" }}
                />
                <span
                    className={classes(clickable, username)}
                    style={{ color: "var(--channels-default)", fontSize: "14px" }}
                    onClick={() => openModal()}
                >
                    {review.sender.username}
                </span>
                {review.sender.badges.map(badge => (
                    <ReviewBadge {...badge} />
                ))}

                {!getSetting("hideTimestamps", false) && (
                    <Timestamp timestamp={moment(review.timestamp * 1000)}>
                        {dateFormat.format(review.timestamp * 1000)}
                    </Timestamp>
                )}

                <p
                    className={classes(messageContent)}
                    style={{ fontSize: 15, marginTop: 4, color: "var(--text-normal)" }}
                >
                    {review.comment}
                </p>
                <div
                    className={classes(container, isHeader, buttons)}
                    style={{
                        padding: "0px"
                    }}
                >
                    <div className={classes(buttonClasses.wrapper, buttonInner)}>
                        <MessageButton type="report" callback={reportRev} />
                        {canDeleteReview(review, UserStore.getCurrentUser().id) && (
                            <MessageButton type="delete" callback={delReview} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
