import React, { useState, useEffect } from "react";
import { removeHtmlTags } from "@utils/common";
import { POLL_API_GET, POLL_API_POST } from "@constant/index";
import PollBlogStyles from "./PollBlog.module.scss";
const PollBlog = ({ data, isBg }) => {
  const [poll, setPoll] = useState({
    msid: data.msid,
    voteoptionno: "",
    ssoid:  "8oqa1ryjknrprzgsc9nudqn5l",
  });
  const [state, setState] = useState({
    submitButton: true,
  });
  const { msid } = poll;
  const onInputChange = (e) => {
    setPoll({ ...poll, [e.target.name]: e.target.value });
  };
  const [pollResult, setPollResult] = useState();
  const [initialPollResult, setInitialPollResult] = useState([]);

  useEffect(() => {
    if (window && typeof window !== "undefined") {
      let pResult = JSON.parse(localStorage.getItem(msid));
      if (pResult) {
        try {
          setPollResult(pResult);
        } catch (err) {
          console.error("ERR : ", err);
        }

        setState((state) => ({ submitButton: false })); // Disable submit button check
        setPoll((state) => ({
          voteoptionno: localStorage.getItem(`poll_selected_${msid}`),
        })); // checked option
      }
    }
    fetchInitialPoll();
  }, [msid]);
  const fetchInitialPoll = async () => {
    await fetch(POLL_API_GET + data.msid)
      .then((response) => {
        let pollMap = new Map(
          response.data.response.polloptions.map((option) => {
            return [option.description, option.votecount];
          })
        );
        setInitialPollResult(pollMap);
      })
      .catch((e) => console.log(`There is some issue happened ${e}`));
  };

  const modifiPollResult = (latestResult = [], selectedPoll) => {
    let totalVote = latestResult.reduce((acc, poll) => poll.votecount + acc, 0);

    totalVote = totalVote + 1;
    let updatedVote = latestResult.map((poll) => {
      if (poll.optionno === +selectedPoll.voteoptionno) {
        poll.votecount = poll.votecount + 1;
      }
      return poll;
    });
    updatedVote = updatedVote.map((vo) => {
      (vo.votepercent_int = parseInt((vo.votecount / totalVote) * 100)),
        (vo.votepercent = +Number((vo.votecount / totalVote) * 100).toFixed(2));
      return vo;
    });

    return updatedVote;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (poll.voteoptionno) {
      fetch(POLL_API_POST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poll),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`POST failed: ${res.status}`);
          return res.json();
        })
        .then(() => {
          setState((state) => ({ submitButton: false }));

          return fetch(POLL_API_GET + data.msid);
        })
        .then((res) => {
          if (!res.ok) throw new Error(`GET failed: ${res.status}`);
          return res.json();
        })
        .then((responseData) => {
          let polloptions = responseData?.response?.polloptions || [];

          polloptions = polloptions.map((p) => {
            if (!("votecount" in p)) {
              p.votecount = poll.voteoptionno == p.optionno ? 1 : 0;
            }
            return p;
          });

          try {
            const finalPollResult = modifiPollResult(
              initialPollResult,
              polloptions,
              poll
            );

            setPollResult(finalPollResult);

            if (data?.msid) {
              localStorage.setItem(data.msid, JSON.stringify(finalPollResult));
              localStorage.setItem(
                "poll_selected_" + data.msid,
                poll.voteoptionno
              );
            }
          } catch (e) {
            console.error("Error in calculating poll", e);
          }
        })
        .catch((error) => console.error("status", error));
    }
  };

  function findHigestVote(data) {
    return (
      data &&
      data.reduce(function (prev, current) {
        return prev.votepercent > current.votepercent
          ? prev.votepercent
          : current;
      })
    );
  }

  return (
    <>
      {state.submitButton ? (
        <>
          <div
            className={` ${PollBlogStyles["_z_poll_wrap"]} ${
              isBg ? PollBlogStyles["pollBg-grey"] : ""
            }`}
          >
            <div
              className={`${PollBlogStyles["_z_poll_label"]} ${PollBlogStyles["f-s-12"]} ${PollBlogStyles["mb-5"]}`}
            >
              Today's Poll
            </div>
            <h4
              className={`${PollBlogStyles["_z_poll_title"]} ${PollBlogStyles["mb-10"]} ${PollBlogStyles["f-s-16"]}`}
            >
              {removeHtmlTags(data.title)}
            </h4>

            <form onSubmit={(e) => onSubmit(e)}>
              {data &&
                data?.polloptions?.map((val, index) => {
                  return (
                    <label
                      key={index}
                      className={`${PollBlogStyles["_z_radio"]} ${PollBlogStyles["f-s-14"]} ${PollBlogStyles["mb-10"]}`}
                    >
                      {val.description}
                      <input
                        type="radio"
                        name="voteoptionno"
                        value={val.optionno}
                        onChange={(e) => onInputChange(e)}
                      />{" "}
                      <span className={PollBlogStyles["_z_checkmark"]}></span>
                    </label>
                  );
                })}
              {state.submitButton ? (
                <div className={PollBlogStyles["_z_poll_submit"]}>
                  {!poll.voteoptionno ? (
                    <button
                      className={`${PollBlogStyles["_z_poll_submit_button"]} ${PollBlogStyles["bg_disable"]} ${PollBlogStyles["f-s-18"]}`}
                      type="submit"
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      className={`${PollBlogStyles["_z_poll_submit_button"]} ${PollBlogStyles["active"]} ${PollBlogStyles["f-s-18"]}`}
                      type="submit"
                    >
                      Submit
                    </button>
                  )}
                </div>
              ) : null}
            </form>
          </div>
        </>
      ) : (
        <div
          className={`${PollBlogStyles["_z_subblogs"]} ${PollBlogStyles["mb-15"]}`}
        >
          <div className={PollBlogStyles["_z_subblog_data"]}>
            <span className={PollBlogStyles["_z_subblog_dot"]}></span>
            <div
              className={`${PollBlogStyles["_z_poll_wrap"]} ${
                isBg ? PollBlogStyles["pollBg-grey"] : ""
              }`}
            >
              <div
                className={`${PollBlogStyles["_z_poll_label"]} ${PollBlogStyles["f-s-12"]} ${PollBlogStyles["mb-5"]}`}
              >
                Poll
              </div>
              <h4
                className={`${PollBlogStyles["_z_poll_title"]} ${PollBlogStyles["f-s-16"]} ${PollBlogStyles["mb-10"]}`}
              >
                {removeHtmlTags(data.title)}
              </h4>
              <form onSubmit={(e) => onSubmit(e)}>
                {pollResult &&
                  pollResult.map((val, index) => {
                    return (
                      <div className={PollBlogStyles["demo-css"]} key={index}>
                        <div className={PollBlogStyles["progress"]}>
                          <div
                            className={`${PollBlogStyles["progress-wrapper"]}  ${PollBlogStyles["d-flex"]}`}
                          >
                            <div
                              className={`${PollBlogStyles["_z_radio_poll"]} ${PollBlogStyles[""]} ${PollBlogStyles["f-s-14"]} ${PollBlogStyles["mb-10"]}  `}
                              style={{
                                padding: 0,
                              }}
                            >
                              <div
                                style={{
                                  width: `${val.votepercent}%`,
                                }}
                                className={`${
                                  PollBlogStyles["progress-inner"]
                                } ${
                                  findHigestVote(pollResult) === val.votepercent
                                    ? PollBlogStyles["high"]
                                    : PollBlogStyles["low"]
                                } `}
                              ></div>
                              <label
                                className={PollBlogStyles["_z_blog_lable"]}
                              >
                                <input
                                  type="radio"
                                  name="voteoptionno"
                                  checked={
                                    poll.voteoptionno == val.optionno
                                      ? "checked"
                                      : ""
                                  }
                                  disabled
                                />
                                <p className={PollBlogStyles["poll_option"]}>
                                  {val.description}
                                </p>
                                <span
                                  className={PollBlogStyles["_z_checkmark"]}
                                >
                                  {" "}
                                </span>
                              </label>
                            </div>
                            <div className={PollBlogStyles["progress-info"]}>
                              {val.votepercent}%
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {pollResult && pollResult && (
                  <strong className={PollBlogStyles["f-s-16"]}>
                    Thanks for your vote
                  </strong>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PollBlog;
