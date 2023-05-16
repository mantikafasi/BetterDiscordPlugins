import { Review } from "../entities/Review";
import { ReviewDBUser } from "../entities/User";
import { authorize, getSetting, showToast } from "./Utils";

const API_URL = "https://manti.vendicated.dev";

const getToken = () => getSetting("token", "");

interface Response {
    success: boolean,
    message: string;
    reviews: Review[];
    updated: boolean;
}

const WarningFlag = 0b00000010;

export async function getReviews(id: string): Promise<Review[]> {
    var flags = 0;
    if (!getSetting("showWarning",true)) flags |= WarningFlag;
    const req = await fetch(API_URL + `/api/reviewdb/users/${id}/reviews?flags=${flags}`);

    const res = (req.status === 200) ? await req.json() as Response : { success: false, message: "An Error occured while fetching reviews. Please try again later.", reviews: [], updated: false };
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

export async function addReview(review: any): Promise<Response | null> {
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
            "Content-Type": "application/json",
        }
    })
        .then(r => r.json())
        .then(res => {
            showToast(res.message);
            return res ?? null;
        });
}

export function deleteReview(id: number): Promise<Response> {
    return fetch(API_URL + `/api/reviewdb/users/${id}/reviews`, {
        method: "DELETE",
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
        }),
        body: JSON.stringify({
            token: getToken(),
            reviewid: id
        })
    }).then(r => r.json());
}

export async function reportReview(id: number) {
    const res = await fetch(API_URL + "/api/reviewdb/reports", {
        method: "PUT",
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
        }),
        body: JSON.stringify({
            reviewid: id,
            token: getToken()
        })
    }).then(r => r.json()) as Response;
    showToast(await res.message);
}

export function getCurrentUserInfo(token: string): Promise<ReviewDBUser> {
    return fetch(API_URL + "/api/reviewdb/users", {
        body: JSON.stringify({ token }),
        method: "POST",
    })
        .then(r => r.json());
}
