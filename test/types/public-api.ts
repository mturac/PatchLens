import { parseUnifiedDiff, reviewDiff, compareReviews, type PatchLensReview } from "../../src/index.js";
const review: PatchLensReview = reviewDiff("", {}); compareReviews(review, review); parseUnifiedDiff("");
