import { useEffect, useRef, useState } from "react";
import PersonCard from "./PersonCard";
import Tag from "./Tag";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchProfile } from "@/slice/ProfileSlice";
import { fetchtags } from "@/slice/TagsSlice";
import { API } from "@/constants/api.constants";
import { Card, Grid, Modal, Paper } from "@mui/material";
import Image from "next/image";
import HomePagePost from "./HomePagePost";
import { fetchNotification } from "@/slice/NotificationSlice";
// import VideoCard from "./VideoCrad";
import { fetchData } from "@/slice/SearchSlice";
import { useRouter } from "next/router";
import { fetchConnection } from "@/slice/ConnectionsSlice";
import VideoCard from "./VideoCard";

function HomePage() {
  const profileRef = useRef(false);
  const { profile } = useSelector((state: RootState) => state.profile);
  const { notification } = useSelector((state: RootState) => state.notification);
  const [trending, setTrending] = useState<any>();
  const [selectedTag, setSelectedTag] = useState<string>("Following");
  const [postOfSelectedTag, setPostOfSelectedTag] = useState<any>();
  const [postData, setPostData] = useState<any[]>([]);
  const { searchbase } = useSelector((state: RootState) => state.searchbase);

  const router = useRouter();
  const { tag } = router?.query;

  useEffect(() => setSelectedTag(tag as string || 'Following'),[router]);
  const { connection } = useSelector((state: RootState) => state.connection);



  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    if (profileRef.current === false && profile.length === 0){
      dispatch(fetchProfile());
      dispatch(fetchtags());

      if(searchbase && searchbase.length == 0) {
        dispatch(fetchData());
      }
    }
    if(notification && notification.length == 0){
      dispatch(fetchNotification());
    }
    if(connection.length == 0){
      dispatch(fetchConnection());
    }
    profileRef.current = true;
  }, [dispatch, profile]);

  useEffect(() => {
    const fetchTrendingTags = async () => {
      try {
        const response = await fetch(API.BASE_URL + API.TRENDING_TAGS.route, {
          method: API.TRENDING_TAGS.method,
          headers: {
            authorization: localStorage.getItem("idToken") || "",
          },
        });
        const responseData = await response.json();
        setTrending(responseData.tag);
      } catch (error) {
      }
    };

    fetchTrendingTags();
  }, []);

  function handleTagClick(tag: string): void {
    // const tagToBeCalled = selectedTag.replace(/\s/g, "").toLowerCase();
    setSelectedTag(selectedTag);
  }

  let tags = ["Explore", "Following", ];
  if (trending && trending.length > 0) tags = [...tags, ...trending];

  useEffect(() => {
    // const tagToBeCalled = selectedTag.replace(/\s/g, "").toLowerCase();
    const fetchPostByTags = async () => {
      try {
        const response = await fetch(
          API.BASE_URL + API.FEED_BY_TAGS.route + `/${selectedTag}`,
          {
            method: API.FEED_BY_TAGS.method,
            headers: {
              authorization: localStorage.getItem("idToken") || "",
            },
          }
        );
        const responseData = await response.json();
        setPostOfSelectedTag(responseData.posts);
      } catch (error) {
      }
    };

    fetchPostByTags();
  }, [selectedTag]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = postOfSelectedTag.map(async (post: any) => {
          const postResponse = await fetch(
            API.BASE_URL + API.GET_POST.route + `/${post}`,
            {
              method: API.GET_POST.method,
              headers: {
                authorization: localStorage.getItem("idToken") || "",
              },
            }
          );
          const postData = await postResponse.json();

          const commentsResponse = await fetch(
            API.BASE_URL + API.GET_POST_COMMENTS.route + `/${post}`,
            {
              method: API.GET_POST_COMMENTS.method,
              headers: {
                authorization: localStorage.getItem("idToken") || "",
              },
            }
          );
          const commentsData = await commentsResponse.json();

          // Combine all the data into a single object
          return {
            id: post,
            post: postData,
            comments: commentsData,
            page: 1,
          };
        });

        const results = await Promise.all(promises);
        setPostData(results);
      } catch (error) {
        console.log("Error fetching posts:", error);
      }
    };
    console.log("postData");
    console.log(postData);
    fetchData();
  }, [postOfSelectedTag]);

  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
  };

  return (
    <div style={{ overflowY: "auto"}}>  
      <div style={{ display: "flex", margin: "12px", overflowX: "auto", width:'88%' }}>
        {tags.map((tag, index) => (
          <Tag
            key={index}
            label={tag}
            onClick={() => handleTagClick(tag)}
            isSelected={selectedTag === tag}
          />
        ))}
         <style jsx>{`
          ::-webkit-scrollbar {
            display: none; /* Hide the scrollbar */
          }
        `}</style>
      </div>
      <div style={{ overflowY: "scroll", height: "85vh",  }}>
      <style jsx>{`
          ::-webkit-scrollbar {
            display: none; /* Hide the scrollbar */
          }
        `}</style>
        <Grid
          container
          spacing={2}
          style={{ height: "800px", width: "92.5%", marginTop:'1rem' }}
        >          
          {postData && postData.length > 0 ? (
            postData.map((post: any) => (
              <VideoCard
                key={post.id}
                post={post}
                onClick={handlePostClick}
              />
            ))
          ) : (
            <Grid item xs={12}>
              <h1
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  outline: "none",
                  textAlign: "center", // Added textAlign property to center the text
                }}
              >
                No posts yet!
              </h1>
            </Grid>
          )}
          </Grid>
         
      </div>
    </div>

  );
}

export default HomePage;
