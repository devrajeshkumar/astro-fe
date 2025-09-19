var INITIAL_RENDERING = !0,
  pubmaticOn = !0,
  BID_TIMEOUT = 2e3,
  apstagSlots = (pubSlots = []),
  APS_CONFIG = {
    pubID: '2202a6a5-32cd-4e86-a8b6-48b0a3829463',
    adServer: 'googletag',
    bidTimeout: BID_TIMEOUT,
  };
var cookieStrKey = 'privacy-policy';
var getCookie = function () {
  var cookies = document.cookie.split(';');
  var cookieObj;
  for (var i = 0; i < cookies.length; i++) {
    if (cookies[i].indexOf(cookieStrKey) >= 0) {
      cookieObj = cookies[i];
      break;
    }
  }
  //cookie values are copied into cookieObj and return in JSON format.
  if (cookieObj) {
    cookieObj = cookieObj.substring(
      cookieObj.indexOf('=') + 1,
      cookieObj.length,
    );
    return JSON.parse(cookieObj);
  }
  return null;
};
var consentValue = getCookie() == 1 ? true : false;

if (typeof getCohortData === 'undefined') {
  function getCohortData() {
    if (typeof document !== 'undefined') {
      const cohortData = localStorage.getItem('cdp_audience');
      if (cohortData) {
        return cohortData.split(',');
      }
    }
    return [];
  };
}

window && window.apstag && window.apstag?.init(APS_CONFIG),
  (tndbgmsg = (e, t = '') => {
    // console.log(
    //   '%cTNN',
    //   'font-weight:bold;color: white; background-color: #2a3e9d;padding: 4px;border-radius:4px;',
    //   e,
    //   t,
    // );
  }),
  (RENDER_ADS = (e) => {
    try {
      if (!e.length) return;
      googletag = window.googletag;
      let t = [],
        a = [],
        g = [];
      e.forEach((e) => {
        try {
          let t = e?.getAttribute('id'),
            o = JSON.parse(e?.getAttribute('data-dimensions')),
            d = e?.getAttribute('data-adunit'),
            i = { slotID: t, sizes: o, slotName: d };
          a.push(i), g.push(t);
        } catch (s) {
          tndbgmsg('ERROR : ', s);
        }
      });
      // let o = pubmaticOn && window.OWT.registerExternalBidders(g);
      const tg_ppid = window.getCookieValue("tg_ppid");

      googletag.cmd.push(() => {
        e.forEach((e, a) => {
          let g = e?.getAttribute('id'),
            o = JSON.parse(e?.getAttribute('data-dimensions')),
            d = e?.getAttribute('data-adunit');
          sec = e?.getAttribute('data-section');
          subsec = e?.getAttribute('data-subsec');
          ptype = e?.getAttribute('data-pagetype');
          medium = e?.getAttribute('data-med');
          source = e?.getAttribute('data-src');
          metaInfoAttr = e?.getAttribute('data-metaInfoAttr');
          id = e?.getAttribute('data-msid');
          sequence = e?.getAttribute('data-idx');
          query = e?.getAttribute('data-QueryId');
          if (e?.getElementsByTagName('iframe').length > 0) return;
          t[a] = d?.includes('_ROS_Interstitial')
            ? googletag
              ?.defineOutOfPageSlot(
                d,
                googletag?.enums?.OutOfPageFormat?.INTERSTITIAL,
              )
              ?.addService(googletag.pubads())
            : googletag?.defineSlot(d, o, g)?.addService(googletag.pubads());
        }),
          tndbgmsg('TNH sec : ', sec);
        tndbgmsg('TNH sec : ', sequence);
        let isPubDone = false,
          isApsDone = false;
        googletag.pubads().clearTargeting();
        // googletag.pubads().setTargeting('lang', 'en'),
        sec && googletag.pubads().setTargeting('section', [sec]);
        subsec && googletag.pubads().setTargeting('subsec', [subsec]);
        ptype && googletag.pubads().setTargeting('page', [ptype]);
        metaInfoAttr &&
          googletag.pubads().setTargeting('keyword', [metaInfoAttr]);
        id && googletag.pubads().setTargeting('articleid', [id]);
        sequence &&
          googletag.pubads().setTargeting('article_sequence', [sequence]);
        query && googletag.pubads().setTargeting('demo', [query]);
        tg_ppid && googletag.pubads().setPublisherProvidedId(tg_ppid);


        googletag.pubads().setCentering(!0),
          googletag.pubads().enableSingleRequest(),
          googletag.pubads().enableAsyncRendering(),
          cohortList = getCohortData();
          cohortList && googletag.pubads().setTargeting('cdp_audience', [cohortList]);

          let currentCustomParams;
          if (typeof window !== 'undefined' && window.cdpCustomParams) {
          currentCustomParams = window.cdpCustomParams;
          }

           if (currentCustomParams && typeof currentCustomParams === 'object') {
            Object.keys(currentCustomParams).forEach((key) => {
              googletag.pubads().setTargeting(key, currentCustomParams[key]);
            });
          } else {
            console.error(
              'Invalid currentCustomParams format:',
              currentCustomParams,
            );
          } 

        googletag.pubads().setPrivacySettings({
          restrictDataProcessing: consentValue,
        });
        googletag.pubads().disableInitialLoad(),
          googletag.enableServices(),
          e.forEach((e) => {
            let t = e?.getAttribute('id');
            t && googletag.display(t);
          }),
          tndbgmsg('HHH a >', a),
          tndbgmsg('HHH t >', t);
        a &&
          t &&
          pubmaticOn &&
          window.apstag.fetchBids({ slots: a || [], timeout: BID_TIMEOUT }, () => {
            isApsDone = true;
          });
        if (
          window?.PWT?.requestBids &&
          typeof window?.PWT?.requestBids === 'function'
        ) {
          PWT.initAdserverSet = false;
          PWT.requestBids(PWT.generateConfForGPT(t), function (adUnitsArray) {
            PWT.addKeyValuePairsToGPTSlots(adUnitsArray);
            isPubDone = true;
          });
        } else {
          isPubDone = true;
        }
        googletag
          .pubads()
          .addEventListener('slotRenderEnded', function (event) {
            let e = event?.slot?.getSlotElementId();
            let p = event?.slot?.getAdUnitPath();
            if (e && p?.includes('_ShortVideos_')) {
              document.getElementById(event.slot.getSlotElementId()).className =
                document
                  .getElementById(event.slot.getSlotElementId())
                  .className.replace('dfp ', 'dfploaded ');
            }
          });
        let refresh = () => {
          if (isPubDone && isApsDone) {
            googletag.cmd.push(function () {
              window.apstag.setDisplayBids(), googletag.pubads().refresh(t);
            });
          } else {
            setTimeout(refresh, 100);
          }
        };

        refresh();
      });
    } catch (d) {
      tndbgmsg('ADS ERROR : ', d);
    }
  });
var googletag = googletag || {};
(googletag.cmd = googletag.cmd || []),
  (() => {
    const adToRender = (adSelector) => {
      var e = document.querySelectorAll(adSelector);
      if ('undefined' != typeof window && e?.length > 0) {
        RENDER_ADS(e || []);
        INITIAL_RENDERING = !1;
      }
    };
    var a = document.createElement('script');
    (a.id = 'dfpgpt'),
      (a.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js');
    a.defer = true;
    a.async = true;
    var t = document.getElementsByTagName('script')[0];
    document.head.appendChild(a);
    a.onload = function () {
      adToRender('.dfp');
      window?.addEventListener('load', function () {
        setTimeout(function () {
          adToRender('.dfp-delay');
        }, 7000);
      });
    };
  })();
