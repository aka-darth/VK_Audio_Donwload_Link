(function () {
    const DEBUG = false;
    const AudioUtils = {
        AUDIO_ITEM_INDEX_ID: 0,
        AUDIO_ITEM_INDEX_OWNER_ID: 1,
        AUDIO_ITEM_INDEX_URL: 2,
        AUDIO_ITEM_INDEX_TITLE: 3,
        AUDIO_ITEM_INDEX_PERFORMER: 4,
        AUDIO_ITEM_INDEX_DURATION: 5,
        AUDIO_ITEM_INDEX_ALBUM_ID: 6,
        AUDIO_ITEM_INDEX_AUTHOR_LINK: 8,
        AUDIO_ITEM_INDEX_LYRICS: 9,
        AUDIO_ITEM_INDEX_FLAGS: 10,
        AUDIO_ITEM_INDEX_CONTEXT: 11,
        AUDIO_ITEM_INDEX_EXTRA: 12,
        AUDIO_ITEM_INDEX_HASHES: 13,
        AUDIO_ITEM_INDEX_COVER_URL: 14,
        AUDIO_ITEM_INDEX_TRACK_GENRE: 15,
        AUDIO_ITEM_CAN_ADD_BIT: 2,
        AUDIO_ITEM_CLAIMED_BIT: 4,
        AUDIO_ITEM_LONG_PERFORMER_BIT: 32,
        AUDIO_ITEM_UMA_BIT: 128,
        AUDIO_ITEM_REPLACEABLE: 512,
        AUDIO_ENOUGH_LOCAL_SEARCH_RESULTS: 500,
        AUDIO_RECOMS_TYPE_LISTENED: "recoms6",
        AUDIO_PLAYING_CLS: "audio_row__playing",
        AUDIO_CURRENT_CLS: "audio_row__current",
        AUDIO_LAYER_HEIGHT: 550,
        AUDIO_LAYER_MIN_WIDTH: 400,
        AUDIO_LAYER_MAX_WIDTH: 1e3,
        AUDIO_HQ_LABEL_CLS: "audio_hq_label_show",
        AUDIO_MAX_AUDIOS_IN_SNIPPET: 5,
        AUDIO_ROW_COVER_SIZE: 40,
        AUDIO_ROW_PLAY_SIZE: 24,
        AUDIO_ROW_ACTION_ROW_ITEM: '<div class="audio_row__more_action audio_row__more_action_%0% _audio_row__more_action_%0% %3%">%2%</div>',
        asObject: function(t) {
            if ("string" == typeof t)
                return {
                    id: t
                };
            var e = (t[AudioUtils.AUDIO_ITEM_INDEX_HASHES] || "").split("/")
                , i = (t[AudioUtils.AUDIO_ITEM_INDEX_COVER_URL] || "").split(",");
            return {
                id: +t[AudioUtils.AUDIO_ITEM_INDEX_ID],
                owner_id: +t[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID],
                ownerId: t[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID],
                fullId: t[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + t[AudioUtils.AUDIO_ITEM_INDEX_ID],
                title: t[AudioUtils.AUDIO_ITEM_INDEX_TITLE],
                performer: t[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER],
                duration: t[AudioUtils.AUDIO_ITEM_INDEX_DURATION],
                lyrics: +t[AudioUtils.AUDIO_ITEM_INDEX_LYRICS],
                url: t[AudioUtils.AUDIO_ITEM_INDEX_URL],
                flags: t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS],
                context: t[AudioUtils.AUDIO_ITEM_INDEX_CONTEXT],
                extra: t[AudioUtils.AUDIO_ITEM_INDEX_EXTRA],
                addHash: e[0] || "",
                editHash: e[1] || "",
                actionHash: e[2] || "",
                deleteHash: e[3] || "",
                replaceHash: e[4] || "",
                canEdit: !!e[1],
                canDelete: !!e[3],
                isLongPerformer: t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS] & AudioUtils.AUDIO_ITEM_LONG_PERFORMER_BIT,
                canAdd: !!(t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS] & AudioUtils.AUDIO_ITEM_CAN_ADD_BIT),
                coverUrl_s: i[0],
                coverUrl_p: i[1],
                isClaimed: !!(t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS] & AudioUtils.AUDIO_ITEM_CLAIMED_BIT),
                isUMA: !!(t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS] & AudioUtils.AUDIO_ITEM_UMA_BIT),
                isReplacable: !!(t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS] & AudioUtils.AUDIO_ITEM_REPLACEABLE),
                trackGenre: t[AudioUtils.AUDIO_ITEM_INDEX_TRACK_GENRE]
            }
        },
        getAudioFromEl: function(t, e) {
            return JSON.parse(t.dataset.audio);
        },
    }
    function a(t) {
        if (!t || t.length % 4 == 1) return !1;
        for (var e, i, o = 0, a = 0, s = ""; i = t.charAt(a++);) i = r.indexOf(i), ~i && (e = o % 4 ? 64 * e + i : i, o++ % 4) && (s += String.fromCharCode(255 & e >> (-2 * o & 6)));
        return s
    }
    function s(t, e) {
        var i = t.length,
            o = [];
        if (i) {
            var a = i;
            for (e = Math.abs(e); a--;) o[a] = (e += e * (a + i) / e) % i | 0
        }
        return o
    }
    var r = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0PQRSTUVWXYZO123456789+/=",
        l = {
            v: function(t) {
                return t.split("").reverse().join("")
            },
            r: function(t, e) {
                t = t.split("");
                for (var i, o = r + r, a = t.length; a--;) i = o.indexOf(t[a]), ~i && (t[a] = o.substr(i - e, 1));
                return t.join("")
            },
            s: function(t, e) {
                var i = t.length;
                if (i) {
                    var o = s(t, e),
                        a = 0;
                    for (t = t.split(""); ++a < i;) t[a] = t.splice(o[i - 1 - a], 1, t[a])[0];
                    t = t.join("")
                }
                return t
            },
            x: function(t, e) {
                var i = [];
                return e = e.charCodeAt(0), each(t.split(""), function(t, o) {
                    i.push(String.fromCharCode(o.charCodeAt(0) ^ e))
                }), i.join("")
            }
        };
    function unmask(t) {
        if (~t.indexOf("audio_api_unavailable")) {
            var e = t.split("?extra=")[1].split("#"),
                o = "" === e[1] ? "" : a(e[1]);
            if (e = a(e[0]), "string" != typeof o || !e) return t;
            o = o ? o.split(String.fromCharCode(9)) : [];
            for (var s, r, n = o.length; n--;) {
                if (r = o[n].split(String.fromCharCode(11)), s = r.splice(0, 1, e)[0], !l[s]) return t;
                e = l[s].apply(null, r)
            }
            if (e && "http" === e.substr(0, 4)) return e
        }
        return t
    }



    const downloadB = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDI2IDI2IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNiAyNiIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+CiAgPGc+CiAgICA8cGF0aCBkPSJtMjUsMTdoLTJjLTAuNiwwLTEsMC40LTEsMXYyLjVjMCwwLjMtMC4yLDAuNS0wLjUsMC41aC0xN2MtMC4zLDAtMC41LTAuMi0wLjUtMC41di0yLjVjMC0wLjYtMC40LTEtMS0xaC0yYy0wLjYsMC0xLDAuNC0xLDF2NmMwLDAuNiAwLjQsMSAxLDFoMjRjMC42LDAgMS0wLjQgMS0xdi02YzAtMC42LTAuNC0xLTEtMXoiIGZpbGw9IiNmZjg4MDAiLz4KICAgIDxwYXRoIGQ9Im0xMi4zLDE2LjdjMC4yLDAuMiAwLjUsMC4zIDAuNywwLjNzMC41LTAuMSAwLjctMC4zbDYtNmMwLjItMC4yIDAuMy0wLjQgMC4zLTAuN3MtMC4xLTAuNS0wLjMtMC43bC0xLjQtMS40Yy0wLjItMC4yLTAuNC0wLjMtMC43LTAuMy0wLjMsMC0wLjUsMC4xLTAuNywwLjNsLTEsMWMtMC4zLDAuMy0wLjksMC4xLTAuOS0wLjR2LTYuNWMwLTAuNi0wLjQtMS0xLTFoLTJjLTAuNiwwLTEsMC40LTEsMXY2LjZjMCwwLjQtMC41LDAuNy0wLjksMC40bC0xLTFjLTAuMi0wLjItMC40LTAuMy0wLjctMC4zLTAuMywwLTAuNSwwLjEtMC43LDAuM2wtMS40LDEuNGMtMC4yLDAuMi0wLjMsMC40LTAuMywwLjdzMC4xLDAuNSAwLjMsMC43bDYsNS45eiIgZmlsbD0iI2ZmODgwMCIvPgogIDwvZz4KPC9zdmc+Cg==';
    const sendB = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPGNpcmNsZSBzdHlsZT0iZmlsbDojNDdCMEQzOyIgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiMzMjk4QkE7IiBkPSJNMzQuMTMzLDI1NmMwLTEzNS42NDgsMTA1LjUwOC0yNDYuNjM2LDIzOC45MzMtMjU1LjQyMUMyNjcuNDI0LDAuMjA4LDI2MS43MzcsMCwyNTYsMCAgQzExNC42MTUsMCwwLDExNC42MTUsMCwyNTZzMTE0LjYxNSwyNTYsMjU2LDI1NmM1LjczNywwLDExLjQyNC0wLjIwOCwxNy4wNjctMC41NzlDMTM5LjY0Miw1MDIuNjM2LDM0LjEzMywzOTEuNjQ4LDM0LjEzMywyNTZ6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNFNUU1RTU7IiBkPSJNMzgwLjI2MywxMDkuMDU0Yy0yLjQ4Ni0xLjY5LTUuNjc2LTEuOTQ2LTguMzk5LTAuNjc5TDk2Ljc3NywyMzYuNDMzICBjLTQuODMzLDIuMjUxLTcuODg3LDcuMTcyLTcuNzY2LDEyLjUwMWMwLjExNyw1LjIyNiwzLjI4LDkuOTIsOC4wNjUsMTIuMDE1bDI1My42MTMsMTEwLjQ1N2M4LjQ2OCwzLjg0OSwxOC40MzktMi4yMSwxOC45ODMtMTEuNDUzICBsMTQuMzE0LTI0My4zNDFDMzg0LjE2MSwxMTMuNjE0LDM4Mi43NDgsMTEwLjc0MiwzODAuMjYzLDEwOS4wNTR6Ii8+Cjxwb2x5Z29uIHN0eWxlPSJmaWxsOiNDQ0NDQ0M7IiBwb2ludHM9IjE3MS42MzEsMjkzLjQyMSAxODguNzcyLDQwOCAzNzkuMTY4LDEwOC40MzIgIi8+CjxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMzcxLjg2NiwxMDguMzc1TDk2Ljc3NywyMzYuNDMzYy00LjczNywyLjIwNS03LjgyNiw3LjEyMS03Ljc2OSwxMi4zNDUgIGMwLjA1OCw1LjIzMywzLjI3NiwxMC4wNzQsOC4wNjcsMTIuMTcxbDc0LjU1NywzMi40NzFsMjA3LjUzNi0xODQuOTg4QzM3Ni44ODIsMTA3LjMzLDM3NC4yMDMsMTA3LjI4NywzNzEuODY2LDEwOC4zNzV6Ii8+Cjxwb2x5Z29uIHN0eWxlPSJmaWxsOiNFNUU1RTU7IiBwb2ludHM9IjIxMS40MTgsMzEwLjc0OSAxODguNzcyLDQwOCAzNzkuMTY4LDEwOC40MzIgIi8+CjxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMzgwLjI2MywxMDkuMDU0Yy0wLjM1MS0wLjIzOS0wLjcyLTAuNDQyLTEuMDk1LTAuNjIybC0xNjcuNzUsMjAyLjMxN2wxMzkuMjcsNjAuNjU3ICBjOC40NjgsMy44NDksMTguNDM5LTIuMjEsMTguOTgzLTExLjQ1M2wxNC4zMTQtMjQzLjM0MUMzODQuMTYxLDExMy42MTQsMzgyLjc0OCwxMTAuNzQyLDM4MC4yNjMsMTA5LjA1NHoiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==';
    const styles = {
        width: "18px",
        height: "18px",
        float: "right",
        display: "inline-block",
        margin: "7px",
        backgroundSize: "cover"
    }


    const me = {
        audios: 0,
        loading: false,
        queue: [],
        realUrls: {},
        selector: '._audio_row',
        search: '#audio_search',
        loadUrl(audio){
            if(me.realUrls[audio.fullId]){
                if(me.queue.length) me.loadUrl(me.queue.shift());
                return;
            }
            if(audio.isClaimed){
                if(DEBUG) console.log('shit', audio);
                if(me.queue.length) me.loadUrl(me.queue.shift());
                return;
            }
            if(me.loading){
                me.queue.push(audio);
                return;
            }else{
                me.loading = true;
            }

            const http = new XMLHttpRequest();
            const params = {act: "reload_audio", al: 1, ids: audio.fullId};
            http.open("POST", "al_audio.php", true);
            http.withCredentials = true;
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.onreadystatechange = () => {
                if(http.readyState === 4 && http.status === 200) {
                    try{
                        let audio = JSON.parse(http.responseText.match(/\[.*\]/)[0])[0];
                        audio = AudioUtils.asObject(audio);
                        me.link(audio);
                        me.button(audio);
                    }catch(e){
                        if(DEBUG) console.log(audio, http.responseText);
                        if(DEBUG) console.error(e);
                    }
                    me.loading = false;
                    if(me.queue.length) setTimeout(()=> me.loadUrl(me.queue.shift()), 444);
                }
            }
            http.send(Object.keys(params).map(param => `${param}=${params[param]}`).join('&'));
        },
        getAudioEl(audio){
            return  document.querySelector(`${me.selector}_${audio.owner_id}_${audio.id}`)
        },
        link(audio){
            me.realUrls[audio.fullId] = unmask(audio.url);
        },
        worker(audio_rows) {
            // console.log('[Vk Audio Download]Worker running..');
            const nourl = [];
            for (const row of audio_rows) {
                const audio = AudioUtils.asObject(AudioUtils.getAudioFromEl(row));
                if(me.realUrls[audio.fullId]){
                }else if(audio.url){
                    if(DEBUG) console.log(2);
                    me.button(audio, row);
                }else{
                    if(DEBUG) console.log(3);
                    nourl.push(audio);
                }
            }
            nourl.forEach(a => me.loadUrl(a));
            if(DEBUG) console.log(nourl.length, audio_rows.length);
            return true;
        },
        button(audio){
            if(document.getElementById("download_link-" + audio.fullId)) return;
            const el = me.getAudioEl(audio);
            if(!el){
                if(DEBUG) console.log(`${me.selector}_${audio.owner_id}_${audio.id}`);
                if(DEBUG) throw 'no el';
                return;
            }
            const realUrl = unmask(audio.url);
            // const tmpl = `<button class="uppa" aria-label="Послать страждущему" class="audio_row__action">S</button><button class="duppa" aria-label="Послать страждущему" class="audio_row__action">D</button>`;

            const a = document.createElement('a');
            for (var style in styles)a.style[style] = styles[style];
            // a.appendChild(document.createTextNode(' Скачать '));
            a.style.backgroundImage = "url("+downloadB+")";
            a.href = realUrl;
            a.id = "download_link-" + audio.fullId;
            const trackname = a.trackname = audio.performer + " - " + audio.title;
            a.title = trackname+'.mp3';
            a.download = trackname+'.mp3';
            el.querySelector('.audio_row__title').appendChild(a);
            a.onclick = e => {
                e.stopPropagation();
            };
            a.oncontextmenu = () => {
                prompt("Ctrl+C", trackname);
                return true;
            }


            const a2 = document.createElement('a');
            for (var style in styles) a2.style[style] = styles[style];
            a2.style.backgroundImage = "url("+sendB+")";
            el.querySelector('.audio_row__title').appendChild(a2);
            a2.onclick = e => me.telegram(audio);
        },
        telegram(audio){
            var http = new XMLHttpRequest();
            http.open("GET", 'https://api.telegram.org/bot389888017:AAHiJ_A76myOqVaCrmFs6CLqpjI0lzGvsQc/sendAudio?chat_id=388062872&audio=' + encodeURI(me.realUrls[audio.fullId]));
            http.onreadystatechange = function() {
                if(http.readyState == 4 && http.status == 200) {
                    if(DEBUG) console.log(http.responseText);
                }
            }
            http.send();
        }
//	 	query:document.getElementById("s_search")?document.getElementById("s_search").value:''
    };

    me.interval = window.setInterval(() => {
        // console.info('[VK audio download]loop..');
        path = /\/([\D]*)[\d]*/.exec(window.location.pathname)[1];
        switch (path) {
            case "audios":
                //Check search string changes..
                // var newquery=document.getElementById("s_search")?document.getElementById("s_search").value:'';
                // if(me.query!=newquery){
                // 	console.log('Changed',me.query,'=>',newquery);
                // 	me.audios=0;
                // 	me.query=newquery;
                // }
                // selectors.info=" .info.fl_l";
                // styles.zIndex=500;
                // styles.marginTop="10px";
                // styles.right="60px";
                // const audio_rows = document.querySelectorAll(me.selector);
                // if (audio_rows.length != me.audios) {
                    // console.log('Changed', me.audios, '=>', audio_rows.length);
                    // me.worker(audio_rows);
                    // me.audios = audio_rows.length;
                // } else {
                //     // console.log('Not changed.');
                // }
                me.worker(document.querySelectorAll(me.selector));
                break;
            default:
                console.log('unknown path', path);
        }
    }, 1987);
    console.info('[VK audio download]Ready.');
    return me;
})();