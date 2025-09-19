export default {
  __html: `var _comscore = _comscore || [];
          var objComScore = { c1: "2", c2: "26200502", options: { enableFirstPartyCookie: "true" } };
          var delete_cookie = function ( Cname, path, domain ) {
            if(__getCookie(Cname)) {
              document.cookie = Cname + "=" +
                ((path) ? ";path="+path:"")+
                ((domain)?";domain="+domain:"") +
                ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
            }
          }
          
          var __getCookie = function (Cname) {
            var match = document.cookie.match(new RegExp('(^| )' + Cname + '=([^;]+)'));
            if (match) {
              return (match[2]);
            }
            else{
              return null;
            } 
          }

          function loadComscore() {
              try {
                if(!window.location.href.includes('/amp')) {
                  let hostName = window.location.host
                  let domainName = hostName.substring(hostName.indexOf('.'))
                  delete_cookie('comScore', '/', domainName)
                }
              } catch(e) { console.log('Error: in FireComScore',e)}

            if (typeof(COMSCORE) === "undefined" && window.location.href.indexOf('/embed/') === -1) {
              var s = document.createElement("script"),
              el = document.getElementsByTagName("script")[0];
              s.async = true;
              s.defer = true;
              s.src =
                (document.location.protocol == "https:" ? "https://sb" : "http://b") +
                ".scorecardresearch.com/cs/26200502/beacon.js";
              el.parentNode.insertBefore(s, el);
            }
          };
          function fireComscore(comScoreObj={}) {
            let comScoreToPassed = {} 
            if(__getCookie('privacy-policy') && __getCookie('privacy-policy') === '1' || __getCookie('FCCDCF')) {
              comScoreToPassed = {'cs_ucfr':'1',...comScoreObj}
            }
            if (typeof(COMSCORE) !== "undefined" && typeof(COMSCORE.beacon) === "function") {
              COMSCORE.beacon({...objComScore,...comScoreToPassed});
            }
          };
          if (window.TimesGDPR && TimesGDPR.common.consentModule.gdprCallback) {
            TimesGDPR.common.consentModule.gdprCallback(function(dataObj) {
              if (dataObj.isEUuser) {
                objComScore["cs_ucfr"] = '';
              }
              _comscore.push(objComScore);
              loadComscore();
            });
          } else{
            let comScoreValue = ''
            if(__getCookie('privacy-policy') && __getCookie('privacy-policy') ==='1' || __getCookie('FCCDCF')) {
              comScoreValue = '1'
            }
            objComScore["cs_ucfr"] = comScoreValue;
            _comscore.push(objComScore);
            loadComscore();
          }
          `,
};
