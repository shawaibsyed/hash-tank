export const API = {
    // BASE_URL: 'https://hashtank-backend-urtjok3rza-wl.a.run.app',
    BASE_URL: 'http://localhost:8080',
    CREATE_PROFILE: '/profile',
    PROFILE_VERIFIED: '/profile/isVerified',
    VERIFICATION_STATUS: '/profile/verify',
    PROFILE: '/profile',
    CREATE_PRODUCT: '/product',
    CREATE_POST: '/post',
    GET_TAGS: '/tags',
    VALID_USERNAME: '/profile/validUsername',
    DOCUMENT_UPLOAD: '/storage/upload/document',
    UPLOAD_PROFILE_PIC: '/storage/upload/profilePic',
    UPLOAD_PROFILE_BG: '/storage/upload/backgroundPic',
    EDIT_PROFILE: {
        route: '/profile',
        method: 'PATCH'
    },
    GET_PUBLIC_PROFILE: {
        route: '/profile/getProfileById',
        method: 'GET'
    },
    GET_PROFILE_PIC: {
        route: '/storage/profilePic',
    },
    GET_BG_PIC: {
        route: '/storage/profileBackgroundPic',
    },
    POST_EDIT:{
        route: '/post',
        method: 'PATCH'
    },
    POST_DELETE:{
        route: '/post',
        method: 'DELETE'
    },
    GET_POST:{
        route: '/post',
        method: 'GET'
    },
    LIKE_POST:{
        route: '/post-like/',
        method: 'POST'
    },
    GET_POST_COMMENTS:{
        route: '/comment',
        method: 'GET'
    },
    CHECK_POST_LIKE:{
        route: '/post-like/isLiked',
        method: 'GET'
    },
    GET_POST_LIKES_COUNT:{
        route: '/post-like/',
        method: 'GET'
    },
    POST_COMMENT:{
        route: '/comment',
        method: 'POST'
    },
    TRENDING_TAGS:{
        route: '/tags/getTrending',
        method: 'GET'
    },
    FEED_BY_TAGS:{
        route: '/feed/tag',
        method: 'GET',
    },
    GET_THUMBNAIL:{
        route:'/post/thumbnail',
        method: 'GET'
    },
    UPDATE_PRODUCT:{
        route: '/product',
        method: 'PATCH',
    },
    THUMBNAIL:{
        route: '/storage/thumbnail',
        method: 'GET',
    },
    FFP:{
        route: '/followerFollowing/followUnfollow',
        method: 'POST',
    },
    FFG:{
        route: '/followerFollowing/isFollowing',
        method : 'GET',
    },
    FFC:{
        route: '/followerFollowing/count',
        method : 'GET',
    },
    GET_PRODUCT_DATA:{
        route: '/product/getProduct',
        method: 'POST',
    },
    TITAN_TO_PITCHER:{
        route: '/investment/invest',
        method : 'POST',
    },
    GET_IP_DATA:{
        route: '/investment/getInvetmentDetails',
        method: 'GET',
    },
    UPDATE_IP_DATA:{
        route: '/investment/update',
        method: 'PATCH',
    },
    DELETE_IP_DATA:{
        route: '/investment/deleteInvestment',
        method: 'DELETE',
    },
    GET_NOTIFICATION:{
        route: '/notifications',
        method: 'GET',
    },
    TOGGLE_NOTIFICATION:{
        route: '/notifications',
        method: 'PATCH',
    },
    DELETE_NOTIFICATION:{
        route: '/notifications',
        method: 'DELETE',
    },
    LOAD_SEARCH_BASE: {
        route: '/getSearchBase',
        method: 'GET',
    },
    GET_CONNECTIONS: {
        route: '/followerFollowing',
        method: 'GET',
    },
}