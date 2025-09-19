import React, { useEffect } from "react";
import VideoPlayer from "./MultiVideo";
import { getAdType, getNewImageUrl } from "src/utils/common";
import {
  CATEGORY_TYPE_VIDEO_ARTICLE,
  GLANCE_PREROLL_ADCODES,
  GLANCE_PREROLL_DEFAULT,
  IMG_DOMAIN,
  DEFAULT_IMAGE_HEIGHT,
} from "src/constant/index";
import { getSlikeApiKeys } from "../../../utils/common";
import style from "./MultiVideoPlayer.module.scss";

let arrList = [];
let List = [];

function getAdsApiKey({ hostId, isMobile }) {
  const slikeKeys = getSlikeApiKeys(hostId);
  let key = isMobile ? slikeKeys?.mweb : slikeKeys?.web;
  return key;
}

function MultiVideoPlayer({
  data = {},
  index,
  idx,
  style,
  articleLength,
  msid,
  isDock,
  aspectRatio,
  isShort,
  skipAd,
  headless,
  categoryType = CATEGORY_TYPE_VIDEO_ARTICLE,
  videoCount,
  channelTitle = "",
  nextVideo,
  isVideoStarted = () => {},
  thumbImg,
  isGlance = false,
  demoKeyFromQuery,
  queryParams = {},
  channelId: hostId = 382,
  isAutoplay = false,
  isHome,
  isShow,
  updateAt,
  FLVideos = false,
  isShortVideo = false,
  imageWidth,
  imageHeight,
  onVideoEnded = () => {},
  isLearning = false,
  type,
  learnGp,
  isMobile = true,
}) {
  const contEl = isLearning
    ? "masterVideoPlayer" + data?.media?.id + type
    : "masterVideoPlayer" + data?.media?.id;

  useEffect(() => {
    try {
      const playerID = isLearning
        ? "player" + data?.media?.id + learnGp
        : "player" + data?.media?.id;

      if (!isLearning && window[playerID]) {
        delete window[playerID];
      }

      let universalRootElem = document.getElementById("universalVideoPlayer");
      let dockedVideo = JSON.parse(localStorage.getItem("dockedVideo"));

      if (dockedVideo) {
        if (document.querySelectorAll(".__tClose ")[0]) {
          document.querySelectorAll(".__tClose ")[0].click();
        }
        if (typeof window != undefined && window["player" + dockedVideo?.id]) {
          window["player" + dockedVideo?.id]?.destroy();
          delete window["player" + dockedVideo?.id];
        }
        if (universalRootElem) {
          universalRootElem.innerHTML = "";
        }
      }

      if (idx === 0) {
        if (document.querySelectorAll(".__tClose ")[0]) {
          document.querySelectorAll(".__tClose ")[0]?.click();
        }
      }
    } catch (error) {
      console.log("Error ", error);
    }

    const datasrc = getNewImageUrl({
      msid: +msid || undefined,
      imgSize: undefined,
      imgWidth: imageWidth || +390 || undefined,
      imgHeight: imageHeight || DEFAULT_IMAGE_HEIGHT,
      is1x1Img: false,
      isArticleBanner: false,
      updatedAt: updateAt,
    });

    let shortvideoThumb = `${IMG_DOMAIN}/photo/msid-${+msid}/${+msid}.jpg`;
    if (FLVideos) {
      shortvideoThumb = `https://www.etnownews.com/assets/images/shortvideo-placeholder.png`;
    }

    let PLAYER_CONFIG_ = [];
    if (data?.media?.id) {
      PLAYER_CONFIG_[data.media.id] = {
        apiKey: getAdsApiKey({
          hostId,
          isMobile,
        }),
        contEl: contEl,
        debug: false,
        video: {
          id: data?.media?.id,
          image: thumbImg ? thumbImg : isDock ? datasrc : shortvideoThumb,
        },
        controls: {
          ui: headless ? "headless" : "sociowatch",
        },
        player: {
          autoPlay: isAutoplay,
          preferMp4: isShort ? true : false,
          fallbackMute: true,
          mute: isShort || isShow ? false : isAutoplay ? true : false,
          skipAd: skipAd,
          adSection: getAdType(),
          playlistUrl: "",
          playlist: true,
          playlistId: "",
          volume: 70,
          isAMP: isShort ? false : true,
          adInterval: 30000,
          preRollAdBreak: [0, 300],
          gestureControls: false,
          playInBackground: true,
          bodyClickPlayToggle: false,
          ...(!isLearning && {
            scrollBehaviour: {
              inViewPercent: 60,
              dock: isGlance ? false : isDock,
              autoPlay: isAutoplay,
            },
          }),
          disableDockOnClose: true,
          midOverlayState: 0,
          ...(isLearning && { autoPlay: true }),
        },
      };

      if (isGlance) {
        PLAYER_CONFIG_[data?.media?.id].video.preRollUrl =
          GLANCE_PREROLL_ADCODES[queryParams?.utm_medium]
            ? GLANCE_PREROLL_ADCODES[queryParams?.utm_medium]
            : GLANCE_PREROLL_DEFAULT;
      }
      if (demoKeyFromQuery?.demo) {
        PLAYER_CONFIG_[data?.media?.id].player = {
          ...PLAYER_CONFIG_[data?.media?.id].player,
          custom_params: {
            demo: demoKeyFromQuery?.demo,
          },
        };
      }

      /*
       */
      let val = {
        id: data?.media?.id,
        config: PLAYER_CONFIG_[data?.media?.id],
        position: idx,
        msid: data?.msid,
        categoryType: categoryType,
        title: channelTitle || data?.msid,
        isShort: isShort,
        isHome: isHome,
      };
      if (idx === 0 && isShort) {
        List.push(val);
      }
      if (!isShort) {
        List.push(val);
      }
      arrList.push(val);

      const videoPlayerListId = isLearning
        ? "videoPlayerList" + data?.media?.id + type
        : "videoPlayerList";
      localStorage.setItem(videoPlayerListId, JSON.stringify(List));

      if (isShort) {
        localStorage.setItem("shortVideoList", JSON.stringify(arrList));
      }
      if (idx === 0) {
        let rootElem = document.querySelector(".rootVideoContainer");

        if (rootElem) {
          rootElem.innerHTML = "";
        }
      }
    }

    return () => {
      List = [];
    };
  }, []);

  let videoHeight;
  let videoAspectRatio;
  if (isMobile) {
    if (isShortVideo) {
      videoHeight = aspectRatio === "9/16" ? "100%" : "100%";
      videoAspectRatio = aspectRatio === "9/16" ? "inherit" : "16/9";
    } else {
      if (isLearning) {
        videoHeight = FLVideos && aspectRatio === "9/16" ? "auto" : "inherit";
      } else {
        videoHeight = FLVideos && aspectRatio === "9/16" ? "180px" : "inherit";
      }
      videoAspectRatio = FLVideos && aspectRatio === "9/16" ? "9/16" : "16/9";
    }
  } else {
    if (isShortVideo) {
      videoHeight = aspectRatio === "9/16" ? "100%" : "inherit";
      videoAspectRatio = aspectRatio === "9/16" ? "9/16" : "16/9";
    } else {
      if (isLearning) {
        videoHeight = FLVideos && aspectRatio === "9/16" ? "auto" : "inherit";
      } else {
        videoHeight = FLVideos && aspectRatio === "9/16" ? "280px" : "inherit";
      }
      videoAspectRatio = FLVideos && aspectRatio === "9/16" ? "9/16" : "16/9";
    }
  }

  return (
    <div style={{ position: !isShort ? "relative" : "", height: "100%" }}>
      {data?.media?.id ? (
        <div
          className={isShort ? "" : style?.["videoContainer"]}
          style={{ height: isShort ? "100%" : "initial" }}
        >
          <div
            key={index}
            data-attr-slk={data?.media?.id || ""}
            title={msid}
            data-attr-msid={data?.media?.msid || msid}
            data-attr-autoplay={isAutoplay}
            style={
              isMobile
                ? {
                    height: videoHeight,
                    aspectRatio: videoAspectRatio,
                    borderRadius: "0px",
                  }
                : {
                    height: videoHeight,
                    aspectRatio: videoAspectRatio,
                    borderRadius: "0px",
                  }
            }
            id={contEl}
            className={`${style?.["playerCont"]} playerContainer${data?.media?.id}`}
          >
            {import.meta.env.ISCOMPANION_AD_ACTIVE == "true" && !isShort && (
              <div
                className={`${style?.["preroll-overlay"]} ${
                  isHome ? "rhs-player" : ""
                }`}
                id={`preroll-overlay${data.media.id}`}
              ></div>
            )}
            <>
              <VideoPlayer
                {...(isLearning && { socioId: data?.media?.id })}
                type={type}
                learnGp={learnGp}
                msid={msid}
                isLearning={isLearning}
                isShort={isShort}
                isDock={isDock}
                dataIndex={articleLength}
                videoCount={videoCount}
                nextVideo={nextVideo}
                isVideoStarted={isVideoStarted}
                onVideoEnded={onVideoEnded}
              />
            </>
          </div>
        </div>
      ) : null}
    </div>
  );
}

MultiVideoPlayer.defaultProps = {
  isDock: true,
  aspectRatio: "16/9",
  isShort: false,
  skipAd: false,
  headless: false,
  isAutoplay: false,
  nextVideo: () => {},
  isGlance: false,
};

export default MultiVideoPlayer;
